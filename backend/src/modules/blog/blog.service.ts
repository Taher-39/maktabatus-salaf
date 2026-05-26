import { AppError } from "../../middlewares/errorHandler";
import { Blog } from "./blog.model";
import { z } from "zod";
import { blogQuerySchema, createBlogSchema, updateBlogSchema } from "./blog.validation";

type BlogQuery = z.infer<typeof blogQuerySchema>;
type CreateBlogData = z.infer<typeof createBlogSchema>;
type UpdateBlogData = z.infer<typeof updateBlogSchema>;

const sortMap: Record<string, Record<string, 1 | -1>> = {
  newest:       { createdAt: -1 },
  oldest:       { createdAt: 1 },
  views_asc:    { views: 1 },
  views_desc:   { views: -1 },
  likes_asc:    { likes: 1 },
  likes_desc:   { likes: -1 },
};

export const getAllBlogs = async (query: BlogQuery) => {
  const { search, category, author, status, sortBy, page, limit } = query;

  const filter: Record<string, any> = {};
  if (status === "published") filter.isPublished = true;
  else if (status === "draft") filter.isPublished = false;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }
  if (category) filter.category = { $regex: category, $options: "i" };
  if (author) filter.author = author;

  const sort = sortMap[sortBy] || { createdAt: -1 };
  const skip = (page - 1) * limit;

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate("author", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Blog.countDocuments(filter),
  ]);

  return {
    blogs,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const getBlogBySlug = async (slug: string) => {
  const blog = await Blog.findOne({ slug, isPublished: true })
    .populate("author", "name email");

  if (!blog) throw new AppError("ব্লগ খুঁজে পাওয়া যায়নি", 404);
  return blog;
};

export const getBlogById = async (id: string) => {
  const blog = await Blog.findById(id)
    .populate("author", "name email");

  if (!blog) throw new AppError("ব্লগ খুঁজে পাওয়া যায়নি", 404);
  return blog;
};

export const createBlog = async (data: CreateBlogData, userId: string) => {
  const blog = new Blog({ ...data, author: userId });
  await blog.save();
  return blog.populate("author");
};

export const updateBlog = async (id: string, data: UpdateBlogData, userId: string) => {
  const blog = await Blog.findById(id);
  if (!blog) throw new AppError("ব্লগ খুঁজে পাওয়া যায়নি", 404);

  if (blog.author.toString() !== userId) {
    throw new AppError("আপনি এই ব্লগ আপডেট করতে পারেন না", 403);
  }

  Object.assign(blog, data);
  await blog.save();
  return blog.populate("author");
};

export const deleteBlog = async (id: string, userId: string) => {
  const blog = await Blog.findById(id);
  if (!blog) throw new AppError("ব্লগ খুঁজে পাওয়া যায়নি", 404);

  if (blog.author.toString() !== userId) {
    throw new AppError("আপনি এই ব্লগ ডিলিট করতে পারেন না", 403);
  }

  await Blog.findByIdAndDelete(id);
};

export const likeBlog = async (id: string) => {
  const blog = await Blog.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: true }
  );
  if (!blog) throw new AppError("ব্লগ খুঁজে পাওয়া যায়নি", 404);
  return blog;
};

export const incrementViews = async (id: string) => {
  const blog = await Blog.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!blog) throw new AppError("ব্লগ খুঁজে পাওয়া যায়নি", 404);
  return blog;
};
