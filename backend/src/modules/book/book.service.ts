import { AppError } from "../../middlewares/errorHandler";
import { Book } from "./book.model";
import { z } from "zod";
import { bookQuerySchema, createBookSchema, updateBookSchema } from "./book.validation";

type BookQuery = z.infer<typeof bookQuerySchema>;

const sortMap: Record<string, Record<string, 1 | -1>> = {
  price_asc:    { price: 1 },
  price_desc:   { price: -1 },
  name_asc:     { title: 1 },
  name_desc:    { title: -1 },
  newest:       { createdAt: -1 },
  oldest:       { createdAt: 1 },
  popular_asc:  { soldCount: 1 },
  popular_desc: { soldCount: -1 },
};

export const getAllBooks = async (query: BookQuery) => {
  const { search, category, author, publisher, minPrice, maxPrice, sortBy, page, limit } = query;

  const filter: Record<string, any> = { isActive: true };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
    ];
  }
  if (category)  filter.category  = category;
  if (author)    filter.author    = author;
  if (publisher) filter.publisher = publisher;
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  const sort = sortMap[sortBy] || { createdAt: -1 };
  const skip = (page - 1) * limit;

  const [books, total] = await Promise.all([
    Book.find(filter)
      .populate("author", "name")
      .populate("category", "name")
      .populate("publisher", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Book.countDocuments(filter),
  ]);

  return { books, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getBookBySlug = async (slug: string) => {
  const book = await Book.findOneAndUpdate(
    { slug, isActive: true },
    { $inc: { viewCount: 1 } },
    { new: true }
  )
    .populate("author", "name")
    .populate("category", "name")
    .populate("publisher", "name");

  if (!book) throw new AppError("বই পাওয়া যায়নি", 404);
  return book;
};

export const getPopularBooks = async (limit = 8) => {
  return Book.find({ isActive: true })
    .populate("author", "name")
    .populate("category", "name")
    .sort({ soldCount: -1 })
    .limit(limit);
};

export const getNewBooks = async (limit = 8) => {
  return Book.find({ isActive: true })
    .populate("author", "name")
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const getBooksByPublisher = async (publisherId: string, limit = 8) => {
  return Book.find({ publisher: publisherId, isActive: true })
    .populate("author", "name")
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const createBook = async (data: z.infer<typeof createBookSchema>, coverImage?: string, previewPages?: string[]) => {

  const existing = await Book.findOne({ slug: data.slug });
  if (existing) throw new AppError("এই নামে বই আগেই আছে", 409);

  return Book.create({ ...data, coverImage: coverImage || "", previewPages: previewPages || [] });
};

export const updateBook = async (id: string, data: z.infer<typeof updateBookSchema>, coverImage?: string) => {
  const book = await Book.findById(id);
  if (!book) throw new AppError("বই পাওয়া যায়নি", 404);

  if (coverImage) data = { ...data, coverImage } as any;
  return Book.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteBook = async (id: string) => {
  const book = await Book.findById(id);
  if (!book) throw new AppError("বই পাওয়া যায়নি", 404);
  book.isActive = false;
  await book.save();
};
