import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../middlewares/errorHandler";
import { bookQuerySchema, createBookSchema, updateBookSchema } from "./book.validation";
import {
  getAllBooks, getBookBySlug, getPopularBooks,
  getNewBooks, getBooksByPublisher, createBook,
  updateBook, deleteBook,
} from "./book.service";

export const getAllBooksHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = bookQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    const result = await getAllBooks(parsed.data);
    sendResponse(res, 200, "সফল", result.books, {
      page: result.page, limit: result.limit,
      total: result.total, totalPages: result.totalPages,
    });
  } catch (err) { next(err); }
};

export const getBookBySlugHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const book = await getBookBySlug((req.params.slug as unknown) as string);
    sendResponse(res, 200, "সফল", book);
  } catch (err) { next(err); }
};

export const getPopularBooksHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const books = await getPopularBooks();
    sendResponse(res, 200, "সফল", books);
  } catch (err) { next(err); }
};

export const getNewBooksHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const books = await getNewBooks();
    sendResponse(res, 200, "সফল", books);
  } catch (err) { next(err); }
};

export const getBooksByPublisherHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const books = await getBooksByPublisher((req.params.id as unknown) as string);
    sendResponse(res, 200, "সফল", books);
  } catch (err) { next(err); }
};

export const createBookHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createBookSchema.safeParse({
      ...req.body,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
    });
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const coverImage = (req.files as any)?.coverImage?.[0]?.path;
    const previewPages = ((req.files as any)?.previewPages || []).map((f: any) => f.path);

    const book = await createBook(parsed.data, coverImage, previewPages);
    sendResponse(res, 201, "বই সফলভাবে যোগ করা হয়েছে", book);
  } catch (err) { next(err); }
};

export const updateBookHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateBookSchema.safeParse({
      ...req.body,
      ...(req.body.price && { price: Number(req.body.price) }),
      ...(req.body.stock && { stock: Number(req.body.stock) }),
    });
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const coverImage = (req.files as any)?.coverImage?.[0]?.path;
    const book = await updateBook((req.params.id as unknown) as string, parsed.data, coverImage);
    sendResponse(res, 200, "বই আপডেট হয়েছে", book);
  } catch (err) { next(err); }
};

export const deleteBookHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteBook((req.params.id as unknown) as string);
    sendResponse(res, 200, "বই মুছে ফেলা হয়েছে");
  } catch (err) { next(err); }
};
