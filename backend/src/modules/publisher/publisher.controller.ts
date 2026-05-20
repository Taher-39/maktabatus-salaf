import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../middlewares/errorHandler";
import { publisherSchema, updatePublisherSchema } from "./publisher.validation";
import { getAllPublishers, createPublisher, updatePublisher, deletePublisher } from "./publisher.service";

export const getAllPublishersHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try { sendResponse(res, 200, "সফল", await getAllPublishers()); }
  catch (err) { next(err); }
};

export const createPublisherHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = publisherSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    sendResponse(res, 201, "প্রকাশনী যোগ করা হয়েছে", await createPublisher(parsed.data));
  } catch (err) { next(err); }
};

export const updatePublisherHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updatePublisherSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    sendResponse(res, 200, "প্রকাশনী আপডেট হয়েছে", await updatePublisher((req.params.id as unknown) as string, parsed.data));
  } catch (err) { next(err); }
};

export const deletePublisherHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try { await deletePublisher((req.params.id as unknown) as string); sendResponse(res, 200, "প্রকাশনী মুছে ফেলা হয়েছে"); }
  catch (err) { next(err); } };
