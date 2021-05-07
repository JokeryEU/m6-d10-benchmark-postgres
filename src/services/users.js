import express from "express";
import { User } from "../db/index.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).send(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Author.destroy({ where: { id: req.params.id } });
    res.status(200).send("Deleted");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.put("/:userId", async (req, res, next) => {
  try {
    const user = await User.update(req.body, {
      where: { id: req.params.userId },
      returning: true,
    });
    res.send(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
