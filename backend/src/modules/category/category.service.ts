import { AppError } from "../../middlewares/errorHandler";
import { Category } from "./category.model";
import { z } from "zod";
import { categorySchema } from "./category.validation";

const makeSlug = (name: string) =>
  name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim();

export const getAllCategories = () => Category.find().sort({ name: 1 });

export const createCategory = async (data: z.infer<typeof categorySchema>) => {
  const slug = makeSlug(data.name);
  const existing = await Category.findOne({ slug });
  if (existing) throw new AppError("এই নামে ক্যাটাগরি আগেই আছে", 409);
  return Category.create({ ...data, slug });
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
