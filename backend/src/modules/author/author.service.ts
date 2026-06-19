import { AppError } from "../../middlewares/errorHandler";
import { Author } from "./author.model";
import { z } from "zod";
import { authorQuerySchema, authorSchema } from "./author.validation";

type AuthorQuery = z.infer<typeof authorQuerySchema>;

const makeSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

export const getAllAuthors = async (query: AuthorQuery) => {
  const { search, page, limit } = query;
  const filter: Record<string, any> = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const [authors, total] = await Promise.all([
    Author.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
    Author.countDocuments(filter),
  ]);

  return { authors, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getAuthorById = async (id: string) => {
  const author = await Author.findById(id);
  if (!author) throw new AppError("à¦²à§‡à¦–à¦• à¦ªà¦¾à¦“à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¯à¦¼à¦¨à¦¿", 404);
  return author;
};

export const createAuthor = async (data: z.infer<typeof authorSchema>, image?: string) => {
  const slug = data.slug?.trim() || makeSlug(data.name);
  const existing = await Author.findOne({ slug });
  if (existing) throw new AppError("à¦à¦‡ à¦¨à¦¾à¦®à§‡ à¦²à§‡à¦–à¦• à¦†à¦—à§‡à¦‡ à¦†à¦›à§‡", 409);
  return Author.create({ ...data, slug, image: image || "" });
};

export const updateAuthor = async (
  id: string,
  data: Partial<z.infer<typeof authorSchema>>,
  image?: string
) => {
  const author = await Author.findById(id);
  if (!author) throw new AppError("à¦²à§‡à¦–à¦• à¦ªà¦¾à¦“à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¯à¦¼à¦¨à¦¿", 404);

  const updateData: any = { ...data };
  if (image) updateData.image = image;

  if (updateData.slug !== undefined) {
    updateData.slug = updateData.slug?.trim();
  }

  if (!updateData.slug && updateData.name) {
    updateData.slug = makeSlug(updateData.name);
  }

  if (updateData.slug) {
    const existing = await Author.findOne({ slug: updateData.slug, _id: { $ne: id } });
    if (existing) throw new AppError("à¦à¦‡ à¦¨à¦¾à¦®à§‡ à¦²à§‡à¦–à¦• à¦†à¦—à§‡à¦‡ à¦†à¦›à§‡", 409);
  }

  return Author.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

export const deleteAuthor = async (id: string) => {
  const author = await Author.findById(id);
  if (!author) throw new AppError("à¦²à§‡à¦–à¦• à¦ªà¦¾à¦“à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¯à¦¼à¦¨à¦¿", 404);
  await Author.findByIdAndDelete(id);
};

