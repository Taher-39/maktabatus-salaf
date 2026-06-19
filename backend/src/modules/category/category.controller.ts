import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../middlewares/errorHandler";
import { categorySchema, categoryQuerySchema, updateCategorySchema } from "./category.validation";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "./category.service";

export const getAllCategoriesHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = categoryQuerySchema.parse(req.query);
    const { categories, page, limit, total, totalPages } = await getAllCategories(query);
    sendResponse(res, 200, "সফল", categories, { page, limit, total, totalPages });
  } catch (err) { next(err); }
};

export const createCategoryHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = categorySchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    sendResponse(res, 201, "ক্যাটাগরি যোগ করা হয়েছে", await createCategory(parsed.data));
  } catch (err) { next(err); }
};

export const updateCategoryHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateCategorySchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    sendResponse(res, 200, "ক্যাটাগরি আপডেট হয়েছে", await updateCategory((req.params.id as unknown) as string, parsed.data));
  } catch (err) { next(err); }
};

export const deleteCategoryHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try { await deleteCategory((req.params.id as unknown) as string); sendResponse(res, 200, "ক্যাটাগরি মুছে ফেলা হয়েছে"); }
  catch (err) { next(err); }
};
