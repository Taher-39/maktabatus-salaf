import { AppError } from "../../middlewares/errorHandler";
import { Banner } from "./banner.model";
import { z } from "zod";
import { bannerQuerySchema, createBannerSchema, updateBannerSchema } from "./banner.validation";

type BannerQuery = z.infer<typeof bannerQuerySchema>;
type CreateBannerData = z.infer<typeof createBannerSchema> & { image: string };
type UpdateBannerData = Partial<CreateBannerData>;

const sortMap: Record<string, Record<string, 1 | -1>> = {
  newest:            { createdAt: -1 },
  oldest:            { createdAt: 1 },
  startDate_asc:     { startDate: 1 },
  startDate_desc:    { startDate: -1 },
};

export const getAllBanners = async (query: BannerQuery) => {
  const { position, status, sortBy, page, limit } = query;

  const filter: Record<string, any> = {};

  if (position) filter.position = position;
  if (status === "active") {
    filter.isActive = true;
    filter.endDate = { $gte: new Date() };
  } else if (status === "inactive") {
    filter.$or = [{ isActive: false }, { endDate: { $lt: new Date() } }];
  }

  const sort = sortMap[sortBy] || { startDate: -1 };
  const skip = (page - 1) * limit;

  const [banners, total] = await Promise.all([
    Banner.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Banner.countDocuments(filter),
  ]);

  return {
    banners,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const getActiveBanners = async (position?: string) => {
  const filter: Record<string, any> = {
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
  };

  if (position) filter.position = position;

  return Banner.find(filter).sort({ startDate: -1 });
};

export const getBannerById = async (id: string) => {
  const banner = await Banner.findById(id);
  if (!banner) throw new AppError("ব্যানার খুঁজে পাওয়া যায়নি", 404);
  return banner;
};

export const createBanner = async (data: CreateBannerData) => {
  const banner = new Banner(data);
  await banner.save();
  return banner;
};

export const updateBanner = async (id: string, data: UpdateBannerData) => {
  const banner = await Banner.findByIdAndUpdate(id, data, { new: true });
  if (!banner) throw new AppError("ব্যানার খুঁজে পাওয়া যায়নি", 404);
  return banner;
};

export const deleteBanner = async (id: string) => {
  const banner = await Banner.findByIdAndDelete(id);
  if (!banner) throw new AppError("ব্যানার খুঁজে পাওয়া যায়নি", 404);
};
