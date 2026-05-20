import { AppError } from "../../middlewares/errorHandler";
import { Publisher } from "./publisher.model";
import { z } from "zod";
import { publisherSchema } from "./publisher.validation";

const makeSlug = (name: string) =>
  name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim();

export const getAllPublishers = () => Publisher.find().sort({ name: 1 });

export const createPublisher = async (data: z.infer<typeof publisherSchema>) => {
  const slug = makeSlug(data.name);
  const existing = await Publisher.findOne({ slug });
  if (existing) throw new AppError("এই নামে প্রকাশনী আগেই আছে", 409);
  return Publisher.create({ ...data, slug });
};

export const updatePublisher = async (id: string, data: Partial<z.infer<typeof publisherSchema>>) => {
  const pub = await Publisher.findById(id);
  if (!pub) throw new AppError("প্রকাশনী পাওয়া যায়নি", 404);
  return Publisher.findByIdAndUpdate(id, data, { new: true });
};

export const deletePublisher = async (id: string) => {
  const pub = await Publisher.findById(id);
  if (!pub) throw new AppError("প্রকাশনী পাওয়া যায়নি", 404);
  await Publisher.findByIdAndDelete(id);
};
