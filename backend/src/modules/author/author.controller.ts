import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../middlewares/errorHandler";
import { authorSchema, authorQuerySchema, updateAuthorSchema } from "./author.validation";
import { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor, getAuthorBySlug } from "./author.service";

export const getAllAuthorsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = authorQuerySchema.parse(req.query);
    const result = await getAllAuthors(query);
    sendResponse(res, 200, "সফল", result.authors, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (err) { next(err); }
};

export const getAuthorByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const author = await getAuthorById((req.params.id as unknown) as string);
    sendResponse(res, 200, "সফল", author);
  } catch (err) { next(err); }
};

export const getAuthorBySlugHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const author = await getAuthorBySlug((req.params.slug as unknown) as string);
    sendResponse(res, 200, "সফল", author);
  } catch (err) { next(err); }
};

export const createAuthorHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = authorSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    const image = (req.file as any)?.path;
    const author = await createAuthor(parsed.data, image);
    sendResponse(res, 201, "লেখক যোগ করা হয়েছে", author);
  } catch (err) { next(err); }
};

export const updateAuthorHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateAuthorSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    const image = (req.file as any)?.path;
    const author = await updateAuthor((req.params.id as unknown) as string, parsed.data, image);
    sendResponse(res, 200, "লেখক আপডেট হয়েছে", author);
  } catch (err) { next(err); }
};

export const deleteAuthorHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteAuthor((req.params.id as unknown) as string);
    sendResponse(res, 200, "লেখক মুছে ফেলা হয়েছে");
  } catch (err) { next(err); }
};
