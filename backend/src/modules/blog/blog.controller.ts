import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../middlewares/errorHandler";
import { uploadBufferToCloudinary } from "../../utils/cloudinaryUpload";
import { createBlogSchema, updateBlogSchema, blogQuerySchema } from "./blog.validation";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  incrementViews,
  likeBlog,
  updateBlog,
} from "./blog.service";

const getParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value || "";

const getUploadedImageUrl = (req: Request) => {
  const file = req.file as Express.Multer.File & { path?: string };
  return file?.path;
};

export const getAllBlogsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsed = blogQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const result = await getAllBlogs(parsed.data);
    sendResponse(res, 200, "Success", result.blogs, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
};

export const getBlogBySlugHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const blog = await getBlogBySlug(getParam(req.params.slug));
    sendResponse(res, 200, "Success", blog);
  } catch (err) {
    next(err);
  }
};

export const getBlogByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const blog = await getBlogById(getParam(req.params.id));
    sendResponse(res, 200, "Success", blog);
  } catch (err) {
    next(err);
  }
};

export const createBlogHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const image = getUploadedImageUrl(req);
    const body = image ? { ...req.body, image } : req.body;
    const parsed = createBlogSchema.safeParse(body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const blog = await createBlog(parsed.data, req.user?.userId);
    sendResponse(res, 201, "Blog created", blog);
  } catch (err) {
    next(err);
  }
};

export const updateBlogHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const image = getUploadedImageUrl(req);
    const body = image ? { ...req.body, image } : req.body;
    const parsed = updateBlogSchema.safeParse(body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const blog = await updateBlog(getParam(req.params.id), parsed.data);
    sendResponse(res, 200, "Blog updated", blog);
  } catch (err) {
    next(err);
  }
};

export const deleteBlogHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await deleteBlog(getParam(req.params.id));
    sendResponse(res, 200, "Blog deleted", null);
  } catch (err) {
    next(err);
  }
};

export const likeBlogHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const blog = await likeBlog(getParam(req.params.id));
    sendResponse(res, 200, "Blog liked", blog);
  } catch (err) {
    next(err);
  }
};

export const incrementViewsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const blog = await incrementViews(getParam(req.params.id));
    sendResponse(res, 200, "Blog view increased", blog);
  } catch (err) {
    next(err);
  }
};
