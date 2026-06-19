import { AppError } from "../../middlewares/errorHandler";
import { Publisher } from "./publisher.model";
import { z } from "zod";
import { publisherQuerySchema, publisherSchema } from "./publisher.validation";

type PublisherQuery = z.infer<typeof publisherQuerySchema>;

export const getAllPublishers = async (query: PublisherQuery) => {
  const { search, page, limit } = query;
  const filter: Record<string, any> = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const [publishers, total] = await Promise.all([
    Publisher.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
    Publisher.countDocuments(filter),
  ]);

  return { publishers, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const createPublisher = async (data: z.infer<typeof publisherSchema>) => {
  const existing = await Publisher.findOne({ slug: data.slug });
  if (existing) throw new AppError("এই নামে প্রকাশনী আগেই আছে", 409);
  return Publisher.create({ ...data });
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
