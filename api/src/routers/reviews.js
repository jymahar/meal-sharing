import express from "express";
import connection from "../database_client.js";
import { StatusCodes } from "http-status-codes";

// This router can be deleted once you add your own router
const reviewRouter = express.Router();

reviewRouter.get("/", async (req, res) => {
  try {
    const result = await connection.select("*").from("review");
    if (result.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No review found.",
      });
    }
    res.status(StatusCodes.OK).json({
      review: result,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Error fetching all reviews: " + err,
    });
  }
});

reviewRouter.post("/", async (req, res) => {
  try {
    const result = await connection.insert(req.body).from("review");
    res.status(StatusCodes.CREATED).send("Sucessully created review!");
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Error creating new review: " + err,
    });
  }
});

reviewRouter.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await connection("review").where({ id: id }).first();
    if (result) {
      return res.status(StatusCodes.OK).json({
        review: result,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No review found.",
      });
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Error fetching review ID: " + err,
    });
  }
});

reviewRouter.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const inputFields = req.body;
    const updateReview = await connection("review")
      .where({ id: id })
      .update(inputFields);
    res.status(StatusCodes.OK).send("Review Updated Successfully!");
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Error updating Review: " + err,
    });
  }
});

reviewRouter.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await connection("review").where({ id: id }).del();
    if (deleted) {
      res.status(StatusCodes.CREATED).send("Review Deleted Successfully!");
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send("Review Deletion Failed!");
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Error deleting Review: " + err,
    });
  }
});

export default reviewRouter;
