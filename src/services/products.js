import express from "express";
import { Category, Product, Review, User } from "../db/index.js";
import multerUploadCloudinary from "../middleware/pictureUpload.js";
import sequelize from "sequelize";

const { Op } = sequelize;

const uploadImg = multerUploadCloudinary();

const router = express.Router();

router.get("/:productId", async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: { id: req.params.productId },
      include: [{ model: Category }, { model: Review }],
      attributes: { exclude: ["categoryId", "reviewId"] },
    });
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    if (req.query.hasOwnProperty("name")) {
      const { rows, count } = await Product.findAndCountAll({
        where: { name: { [Op.iLike]: "%" + req.query.name + "%" } },
        order: req.query.order,
        limit: req.query.limit,
        offset: req.query.offset,
        include: [{ model: Category }, { model: Review }],
        attributes: { exclude: ["categoryId", "reviewId"] },
      });
      return res.status(200).send({ count, data: rows });
    } else {
      const { rows, count } = await Product.findAndCountAll({
        order: req.query.order,
        limit: req.query.limit,
        offset: req.query.offset,
        include: [{ model: Category }, { model: Review }],
        attributes: { exclude: ["categoryId", "reviewId"] },
      });
      return res.status(200).send({ count, data: rows });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/:categoryId", uploadImg, async (req, res, next) => {
  try {
    const newProduct = await Product.create({
      ...req.body,
      imageUrl: req.file.path,
      categoryId: req.params.categoryId,
    });
    res.status(201).send(newProduct);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.put("/:productId", async (req, res, next) => {
  try {
    const product = await Product.update(req.body, {
      where: { id: req.params.productId },
      returning: true,
    });
    const returning = await Product.findAll({
      where: { id: product[1][0].id },
      include: [{ model: Category }, { model: Review }],
      attributes: { exclude: ["categoryId", "reviewId"] },
    });
    res.send(returning);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/:productId", async (req, res, next) => {
  try {
    await Product.destroy({ where: { id: req.params.productId } });
    res.status(204).send("Deleted");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:productId/reviews", async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.productId },
      include: [
        { model: User },
        {
          model: Product,
          include: Category,
          attributes: { exclude: ["categoryId"] },
        },
      ],
      attributes: { exclude: ["userId", "productId"] },
    });
    res.send(reviews);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Updating the image of a product
router.post("/:productId/upload", uploadImg, async (req, res, next) => {
  try {
    const updated = await Product.update(
      { imageUrl: req.file.path },
      {
        where: { id: req.params.productId },
        returning: true,
      }
    );
    const product = await Product.findAll({
      where: { id: updated[1][0].id },
      include: [{ model: Category }, { model: Review }],
      attributes: { exclude: ["categoryId", "reviewId"] },
    });
    res.send(product[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
