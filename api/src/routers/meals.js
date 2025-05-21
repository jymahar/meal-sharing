import express from "express";
import { StatusCodes } from "http-status-codes";
import connection from "../database_client.js";
const mealsRouter = express.Router();

mealsRouter.get("/", async (req, res) => {
  try {
    const meals = await connection.select("*").from("meal");
    if (meals.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No meals found.",
      });
    }
    res.status(StatusCodes.OK).json({
      meals: meals,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Error fetching all meals" + err,
    });
  }
});

mealsRouter.post("/", async (req, res) => {
  try {
    const meal = await connection.insert(req.body).into("meal");
    res.status(StatusCodes.CREATED).send("Sucessully created meal!");
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Error creating a meal: " + err,
    });
  }
});

mealsRouter.get("/:id", async (req, res) => {
  try {
    const mealId = parseInt(req.params.id);
    const meal = await connection("meal").where({ id: mealId }).first();
    if (meal) {
      return res.status(StatusCodes.OK).json({
        meals: meal,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No meal found.",
      });
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Error fetching meal ID: " + err,
    });
  }
});

mealsRouter.put("/:id", async (req, res) => {
  try {
    const mealId = parseInt(req.params.id);
    const inputFields = req.body;
    const updateMeal = await connection("meal")
      .where({ id: mealId })
      .update(inputFields);
    res.status(StatusCodes.OK).send("Meal Updated Successfully!");
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Error updating meal: " + err,
    });
  }
});

mealsRouter.delete("/:id", async (req, res) => {
  try {
    const mealId = parseInt(req.params.id);
    const deletedMeal = await connection("meal").where({ id: mealId }).del();
    if (deletedMeal) {
      res.status(StatusCodes.CREATED).send("Meal Deleted Successfully!");
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send("Meal Deletion Failed!");
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Error deleting a meal: " + err,
    });
  }
});

export default mealsRouter;
