import { AppError } from "../../middlewares/errorHandler";
import { Category } from "./category.model";
import { z } from "zod";
import { categoryQuerySchema, categorySchema } from "./category.validation";

type CategoryQuery = z.infer<typeof categoryQuerySchema>;

export const getAllCategories = async (query: CategoryQuery) => {
  const { search, page, limit } = query;
  const filter: Record<string, any> = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const [categories, total] = await Promise.all([
    Category.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
    Category.countDocuments(filter),
  ]);

  return { categories, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const createCategory = async (data: z.infer<typeof categorySchema>) => {
  const existing = await Category.findOne({ slug: data.slug });
  if (existing) throw new AppError("এই নামে ক্যাটাগরি আগেই আছে", 409);
  return Category.create({ ...data });
};

export const updateCategory = async (id: string, data: Partial<z.infer<typeof categorySchema>>) => {
  const cat = await Category.findById(id);
  if (!cat) throw new AppError("ক্যাটাগরি পাওয়া যায়নি", 404);
  return Category.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCategory = async (id: string) => {
  const cat = await Category.findById(id);
  if (!cat) throw new AppError("ক্যাটাগরি পাওয়া যায়নি", 404);
  await Category.findByIdAndDelete(id);
};
