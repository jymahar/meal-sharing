import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connection from "./database_client.js";
import nestedRouter from "./routers/nested.js";
import { StatusCodes } from "http-status-codes";
import mealsRouter from "./routers/meals.js";
import reservationsRouter from "./routers/reservations.js";
import reviewRouter from "./routers/reviews.js";

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

app.use("/api", apiRouter);
app.use("/api/meals", mealsRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/reviews", reviewRouter);

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});

//  Route for future-meals
apiRouter.get("/future-meals", async (req, res) => {
  try {
    const [meals] = await connection.raw(
      "SELECT * FROM meal WHERE DATE(when_time) > CURDATE();"
    );
    console.log(meals);
    if (meals.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No meals found.",
      });
    } else {
      return res.status(StatusCodes.OK).json({
        "future-meals": meals,
      });
    }
  } catch (error) {
    console.error("Error fetching future-meals:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while fetching future-meals.",
    });
  }
});

//  Route for past-meals
apiRouter.get("/past-meals", async (req, res) => {
  try {
    const [meals] = await connection.raw(
      "SELECT * FROM meal WHERE DATE(when_time) < CURDATE();"
    );
    console.log(meals);
    if (meals.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No meals found.",
      });
    } else {
      res.status(StatusCodes.OK).json({
        "past-meals": meals,
      });
    }
  } catch (error) {
    console.error("Error fetching past-meals:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while fetching past-meals.",
    });
  }
});

//  Route for all-meals sorted by ID
apiRouter.get("/all-meals", async (req, res) => {
  try {
    const [meals] = await connection.raw("SELECT * FROM meal ORDER BY id ASC;");
    console.log(meals);
    if (meals.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No meals found.",
      });
    } else {
      res.json({
        "all-meals": meals,
      });
    }
  } catch (error) {
    console.error("Error fetching all-meals:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while fetching all-meals.",
    });
  }
});

//  Route for first-meal (min ID)
apiRouter.get("/first-meal", async (req, res) => {
  try {
    const [meals] = await connection.raw(
      "SELECT * FROM meal ORDER BY id ASC LIMIT 1;"
    );
    console.log(meals);
    if (meals.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "No meals found.",
      });
    } else {
      res.status(StatusCodes.OK).json({
        "first-meal": meals,
      });
    }
  } catch (error) {
    console.error("Error fetching first-meal:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while fetching first-meal.",
    });
  }
});

//  Route for last-meal (max ID)
apiRouter.get("/last-meal", async (req, res) => {
  try {
    const [meals] = await connection.raw(
      "SELECT * FROM meal ORDER BY id DESC LIMIT 1"
    );
    console.log(meals);
    if (meals.length == 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "No meals found.",
      });
    } else {
      res.status(StatusCodes.OK).json({
        "last-meal": meals,
      });
    }
  } catch (error) {
    console.error("Error fetching last meal:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Server error while fetching last meal.",
    });
  }
});
