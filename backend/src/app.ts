import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler";
import { env } from "./config/env";

// Module Routes
import authRoutes      from "./modules/auth/auth.routes";
import bookRoutes      from "./modules/book/book.routes";
import authorRoutes    from "./modules/author/author.routes";
import categoryRoutes  from "./modules/category/category.routes";
import publisherRoutes from "./modules/publisher/publisher.routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ success: true, message: "📚 Maktabatus Salaf API চলছে!" });
});

app.use("/api/v1/auth",       authRoutes);
app.use("/api/v1/books",      bookRoutes);
app.use("/api/v1/authors",    authorRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/publishers", publisherRoutes);

app.use(errorHandler);
export default app;
