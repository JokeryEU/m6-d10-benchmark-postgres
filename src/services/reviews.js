import express from "express";
import { Review, Product, User, Category } from "../db/index.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const reviews = await Review.findAll();
    res.send(reviews);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:reviewId", async (req, res, next) => {
  try {
    const review = await Review.findAll({
      where: { id: req.params.reviewId },
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
    res.send(review);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/:productId/:userId", async (req, res, next) => {
  try {
    const newReview = await Review.create({
      ...req.body,
      productId: req.params.productId,
      userId: req.params.userId,
    });

    res.status(201).send(product);
    res.send(newReview);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.put("/:reviewId", async (req, res, next) => {
  try {
    const review = await Review.update(req.body, {
      where: { id: req.params.reviewId },
      returning: true,
      include: [{ model: User }],
    });
    const returning = await Review.findAll({
      where: { id: review[1][0].id },
      include: [{ model: User }, { model: Product }],
      attributes: { exclude: ["userId", "productId"] },
    });
    res.send(returning);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/:reviewId", async (req, res, next) => {
  try {
    await Review.destroy({ where: { id: req.params.reviewId } });
    res.status(204).send("Deleted");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
