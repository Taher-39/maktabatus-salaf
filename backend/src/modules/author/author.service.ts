import { AppError } from "../../middlewares/errorHandler";
import { Author } from "./author.model";
import { z } from "zod";
import { authorSchema } from "./author.validation";

const makeSlug = (name: string) =>
  name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim();

export const getAllAuthors = () => Author.find().sort({ name: 1 });

export const getAuthorById = async (id: string) => {
  const author = await Author.findById(id);
  if (!author) throw new AppError("লেখক পাওয়া যায়নি", 404);
  return author;
};

export const createAuthor = async (data: z.infer<typeof authorSchema>, image?: string) => {
  const slug = makeSlug(data.name);
  const existing = await Author.findOne({ slug });
  if (existing) throw new AppError("এই নামে লেখক আগেই আছে", 409);
  return Author.create({ ...data, slug, image: image || "" });
};

export const updateAuthor = async (id: string, data: Partial<z.infer<typeof authorSchema>>, image?: string) => {
  const author = await Author.findById(id);
  if (!author) throw new AppError("লেখক পাওয়া যায়নি", 404);
  if (image) (data as any).image = image;
  return Author.findByIdAndUpdate(id, data, { new: true });
};

export const deleteAuthor = async (id: string) => {
  const author = await Author.findById(id);
  if (!author) throw new AppError("লেখক পাওয়া যায়নি", 404);
  await Author.findByIdAndDelete(id);
};
