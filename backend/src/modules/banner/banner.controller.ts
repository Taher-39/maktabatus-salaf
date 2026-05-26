import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../middlewares/errorHandler";
import { createBannerSchema, updateBannerSchema, bannerQuerySchema } from "./banner.validation";
import {
  getAllBanners, getBannerById, getActiveBanners,
  createBanner, updateBanner, deleteBanner,
} from "./banner.service";

export const getAllBannersHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = bannerQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    const result = await getAllBanners(parsed.data);
    sendResponse(res, 200, "সফল", result.banners, {
      page: result.page, limit: result.limit,
      total: result.total, totalPages: result.totalPages,
    });
  } catch (err) { next(err); }
};

export const getActiveBannersHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { position } = req.query;
    const banners = await getActiveBanners(position as string | undefined);
    sendResponse(res, 200, "সফল", banners);
  } catch (err) { next(err); }
};

export const getBannerByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const banner = await getBannerById(req.params.id);
    sendResponse(res, 200, "সফল", banner);
  } catch (err) { next(err); }
};

export const createBannerHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createBannerSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    
    const image = (req as any).file?.path;
    if (!image) throw new AppError("ব্যানার ছবি আপলোড করুন", 400);
    
    const banner = await createBanner({ ...parsed.data, image });
    sendResponse(res, 201, "ব্যানার তৈরি হয়েছে", banner);
  } catch (err) { next(err); }
};

export const updateBannerHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateBannerSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    
    const image = (req as any).file?.path;
    const banner = await updateBanner(req.params.id, { ...parsed.data, ...(image && { image }) });
    sendResponse(res, 200, "আপডেট হয়েছে", banner);
  } catch (err) { next(err); }
};

export const deleteBannerHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteBanner(req.params.id);
    sendResponse(res, 200, "ডিলিট হয়েছে");
  } catch (err) { next(err); }
};
