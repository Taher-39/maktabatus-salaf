import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler";
import { env } from "./config/env";
import dns from "node:dns/promises";

// Module Routes
import authRoutes from "./modules/auth/auth.routes";
import bookRoutes from "./modules/book/book.routes";
import authorRoutes from "./modules/author/author.routes";
import categoryRoutes from "./modules/category/category.routes";
import publisherRoutes from "./modules/publisher/publisher.routes";
import OrderRoutes from "./modules/order/order.routes";
import reviewRoutes from "./modules/review/review.routes";
import userRoutes from "./modules/user/user.routes";
import videoRoutes from "./modules/video/video.routes";
import blogRoutes from "./modules/blog/blog.routes";
import contactRoutes from "./modules/contact/contact.routes";
// import invoiceRoutes   from "./modules/invoice/invoice.routes";

dns.setServers(["1.1.1.1", "1.0.0.1"]);

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: [env.CLIENT_URL, "http://127.0.0.1:3000", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  console.log("Root endpoint hit");
  res.json({ success: true, message: "📚 Maktabatus Salaf API valoi চলছে!" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/authors", authorRoutes);
app.use("/api/v1/publishers", publisherRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/orders", OrderRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/contact", contactRoutes);
// app.use('/api/v1/invoices', invoiceRoutes);


app.use(errorHandler);
export default app;







