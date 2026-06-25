import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../middlewares/errorHandler";
import { bookQuerySchema, createBookSchema, updateBookSchema } from "./book.validation";
import {
  getAllBooks, getBookBySlug, getPopularBooks,
  getNewBooks, getBooksByPublisher, createBook,
  updateBook, deleteBook,
  getBooksByAuthor,
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

export const getBooksByAuthorHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const books = await getBooksByAuthor((req.params.id as unknown) as string);
    sendResponse(res, 200, "সফল", books);
  } catch (err) { next(err); }
};

export const createBookHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createBookSchema.safeParse({
      ...req.body,
      price: req.body.price ? Number(req.body.price) : undefined,
      stock: req.body.stock ? Number(req.body.stock) : undefined,
      bookPage: req.body.bookPage ? Number(req.body.bookPage) : undefined,
      edition: req.body.edition ? Number(req.body.edition) : undefined,
      weight: req.body.weight ? Number(req.body.weight) : undefined,
    });
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const coverImage = (req.files as any)?.coverImage?.[0]?.path;
    const previewPdf = (req.files as any)?.previewPdf?.[0]?.path;

    const book = await createBook(parsed.data, coverImage, previewPdf);
    sendResponse(res, 201, "বই সফলভাবে যোগ করা হয়েছে", book);
  } catch (err) { next(err); }
};

export const updateBookHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateBookSchema.safeParse({
      ...req.body,
      ...(req.body.price !== undefined && { price: Number(req.body.price) }),
      ...(req.body.stock !== undefined && { stock: Number(req.body.stock) }),
      ...(req.body.bookPage !== undefined && { bookPage: Number(req.body.bookPage) }),
      ...(req.body.edition !== undefined && { edition: Number(req.body.edition) }),
      ...(req.body.weight !== undefined && { weight: Number(req.body.weight) }),
    });
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const coverImage = (req.files as any)?.coverImage?.[0]?.path;
    const previewPdf = (req.files as any)?.previewPdf?.[0]?.path;
    const book = await updateBook((req.params.id as unknown) as string, parsed.data, coverImage, previewPdf);
    sendResponse(res, 200, "বই আপডেট হয়েছে", book);
  } catch (err) { next(err); }
};

export const deleteBookHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteBook((req.params.id as unknown) as string);
    sendResponse(res, 200, "বই মুছে ফেলা হয়েছে");
  } catch (err) { next(err); }
};
