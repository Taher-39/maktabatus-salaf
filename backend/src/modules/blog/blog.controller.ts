import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../middlewares/errorHandler";
import { createBlogSchema, updateBlogSchema, blogQuerySchema } from "./blog.validation";
import {
  getAllBlogs, getBlogBySlug, getBlogById,
  createBlog, updateBlog, deleteBlog, likeBlog, incrementViews,
} from "./blog.service";

export const getAllBlogsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = blogQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    const result = await getAllBlogs(parsed.data);
    sendResponse(res, 200, "সফল", result.blogs, {
      page: result.page, limit: result.limit,
      total: result.total, totalPages: result.totalPages,
    });
  } catch (err) { next(err); }
};

export const getBlogBySlugHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const blog = await getBlogBySlug(req.params.slug);
    sendResponse(res, 200, "সফল", blog);
  } catch (err) { next(err); }
};

export const getBlogByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const blog = await getBlogById(req.params.id);
    sendResponse(res, 200, "সফল", blog);
  } catch (err) { next(err); }
};

export const createBlogHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createBlogSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    const blog = await createBlog(parsed.data, (req as any).user._id);
    sendResponse(res, 201, "ব্লগ তৈরি হয়েছে", blog);
  } catch (err) { next(err); }
};

export const updateBlogHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateBlogSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    const blog = await updateBlog(req.params.id, parsed.data, (req as any).user._id);
    sendResponse(res, 200, "আপডেট হয়েছে", blog);
  } catch (err) { next(err); }
};

export const deleteBlogHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteBlog(req.params.id, (req as any).user._id);
    sendResponse(res, 200, "ডিলিট হয়েছে");
  } catch (err) { next(err); }
};

export const likeBlogHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await likeBlog(req.params.id);
    sendResponse(res, 200, "পছন্দ করা হয়েছে");
  } catch (err) { next(err); }
};

export const incrementViewsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await incrementViews(req.params.id);
    sendResponse(res, 200, "ভিউ বেড়েছে");
  } catch (err) { next(err); }
};
