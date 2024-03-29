import express from "express";
import cors from "cors";
import productRoutes from "./services/products.js";
import userRoutes from "./services/users.js";
import categoriesRouter from "./services/categories.js";
import reviewsRoutes from "./services/reviews.js";
import { database } from "./db/index.js";

const server = express();

server.use(cors());
server.use(express.json());

server.use("/users", userRoutes);
server.use("/products", productRoutes);
server.use("/reviews", reviewsRoutes);
server.use("/categories", categoriesRouter);

database.sync().then(() => {
  server.listen(process.env.PORT || 3005, () => {
    console.log("Server is running on port ", process.env.PORT || 3005);
  });
});
