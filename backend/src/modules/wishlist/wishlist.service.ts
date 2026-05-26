import { AppError } from "../../middlewares/errorHandler";
import { Wishlist } from "./wishlist.model";
import { z } from "zod";
import { wishlistQuerySchema, updateWishlistSchema } from "./wishlist.validation";

type WishlistQuery = z.infer<typeof wishlistQuerySchema>;
type UpdateWishlistData = z.infer<typeof updateWishlistSchema>;

const sortMap: Record<string, Record<string, 1 | -1>> = {
  newest:      { createdAt: -1 },
  oldest:      { createdAt: 1 },
  price_asc:   { "books.price": 1 },
  price_desc:  { "books.price": -1 },
};

export const getUserWishlist = async (userId: string, query: WishlistQuery) => {
  const { sortBy, page, limit } = query;

  let wishlist = await Wishlist.findOne({ user: userId })
    .populate({
      path: "books",
      select: "title slug price coverImage",
    });

  if (!wishlist) {
    wishlist = new Wishlist({ user: userId });
    await wishlist.save();
  }

  const books = wishlist.books as any[];
  const total = books.length;
  const skip = (page - 1) * limit;
  
  const sortedBooks = books.sort((a, b) => {
    const sortKey = sortBy === "price_asc" ? 1 : sortBy === "price_desc" ? -1 : -1;
    if (sortBy?.includes("price")) {
      return (a.price - b.price) * sortKey;
    }
    return 0;
  });

  const paginatedBooks = sortedBooks.slice(skip, skip + limit);

  return {
    wishlist: {
      ...wishlist.toObject(),
      books: paginatedBooks,
    },
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const addToWishlist = async (userId: string, bookId: string) => {
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = new Wishlist({ user: userId, books: [bookId] });
  } else if (!wishlist.books.includes(bookId as any)) {
    wishlist.books.push(bookId as any);
  } else {
    throw new AppError("এই বই ইতিমধ্যে উইশলিস্টে আছে", 400);
  }

  await wishlist.save();
  return wishlist.populate("books");
};

export const removeFromWishlist = async (userId: string, bookId: string) => {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) throw new AppError("উইশলিস্ট খুঁজে পাওয়া যায়নি", 404);

  wishlist.books = wishlist.books.filter((id) => id.toString() !== bookId);
  await wishlist.save();
  return wishlist.populate("books");
};

export const clearWishlist = async (userId: string) => {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) throw new AppError("উইশলিস্ট খুঁজে পাওয়া যায়নি", 404);

  wishlist.books = [];
  await wishlist.save();
};

export const checkIfInWishlist = async (userId: string, bookId: string) => {
  const wishlist = await Wishlist.findOne({
    user: userId,
    books: bookId,
  });

  return !!wishlist;
};

export const updateWishlist = async (userId: string, data: UpdateWishlistData) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { user: userId },
    data,
    { new: true, upsert: true }
  ).populate("books");

  if (!wishlist) throw new AppError("উইশলিস্ট আপডেট করা যায়নি", 400);
  return wishlist;
};
