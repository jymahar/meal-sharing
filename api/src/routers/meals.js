import express from "express";
import { StatusCodes } from "http-status-codes";
import connection from "../database_client.js";
const mealsRouter = express.Router();

const allowedFields = ["price", "when_time", "max_reservations"];
const allowedDirections = ["asc", "desc"];

mealsRouter.get("/", async (req, res) => {
  try {
    let query = connection.select("*").from("meal");
    // Query by maxPrice
    if (req.query.maxPrice) {
      const maxPrice = Number(req.query.maxPrice);
      if (isNaN(maxPrice)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid input : maxPrice must be a number" });
      }
      query = query.where("price", "<=", maxPrice);
    }
    //Returns all meals that still have available spots left
    //  Query by availableReservations:
    if (req.query.availableReservations) {
      const availableReservations = req.query.availableReservations;

      if (availableReservations === "true") {
        const availableMeals = await connection("meal")
          .leftJoin("reservation", "meal.id", "reservation.meal_id")
          .select("meal.id", "meal.title", "meal.max_reservations")
          .count("reservation.id as no_of_bookings")
          .groupBy("meal.id", "meal.title", "meal.max_reservations")
          .havingRaw("COUNT(reservation.id) < meal.max_reservations");

        return res.status(StatusCodes.OK).json({
          meals: availableMeals,
        });
      } else if (availableReservations === "false") {
        //Return meals that have no available spots left
        const notAvailableMeals = await connection("meal")
          .join("reservation", "meal.id", "reservation.meal_id")
          .groupBy("meal.id", "meal.title", "meal.max_reservations")
          .select("meal.id", "meal.title", "meal.max_reservations")
          .count("reservation.id as no_of_bookings")
          .havingRaw("COUNT(reservation.id) >= meal.max_reservations");
        if (notAvailableMeals.length === 0) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: "No meals found",
          });
        } else {
          return res.status(StatusCodes.OK).json({
            meals: notAvailableMeals,
          });
        }
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error:
            "Invalid input: availableReservations should be true or false ",
        });
      }
    }
    // query by title:
    //Returns all meals that partially match the given title
    if (req.query.title) {
      const title = req.query.title;
      query = query.where("title", "like", `%${title}%`);
    }

    // query by when after date:
    //Returns all meals where the date for when is after the given date.
    if (req.query.dateAfter) {
      const date = req.query.dateAfter;
      query = query.where("when_time", ">", date);
    }

    // query by when before date:
    //Returns all meals where the date for when is before the given date.
    if (req.query.dateBefore) {
      const date = req.query.dateBefore;
      query = query.where("when_time", "<", date);
    }
    // Query by limit:
    //Returns the given number of meals.
    if (req.query.limit) {
      const limit = req.query.limit;
      query = query.limit(limit);
    }

    //Sort by key and direction:
    if (req.query.sortKey) {
      const { sortKey, sortDir } = req.query;

      if (sortKey && allowedFields.includes(sortKey)) {
        const direction =
          sortDir && allowedDirections.includes(sortDir.toLowerCase())
            ? sortDir.toLowerCase()
            : "asc"; // default to ASC

        query = query.orderBy(sortKey, direction);
      } else {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid sort parameter." });
      }
    }
    console.log("SQL", query.toSQL().sql);
    const meals = await query;

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
      res.status(StatusCodes.OK).send("Meal Deleted Successfully!");
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

//Endpoint for /api/meals/:meal_id/reviews
// Returns all reviews for a specific meal
mealsRouter.get("/:meal_id/reviews", async (req, res) => {
  try {
    const mealId = parseInt(req.params.meal_id);
    const result = await connection("review")
      .where({ meal_id: mealId })
      .first();
    if (result.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No review found for meal ID.",
      });
    }
    res.status(StatusCodes.OK).json({
      meal: result,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Error fetching review for meal id " + err,
    });
  }
});

export default mealsRouter;
