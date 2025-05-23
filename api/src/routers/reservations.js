import express from "express";
import connection from "../database_client.js";
import { StatusCodes } from "http-status-codes";

// This router can be deleted once you add your own router
const reservationsRouter = express.Router();

reservationsRouter.get("/", async (req, res) => {
  try {
    const reservations = await connection.select("*").from("reservation");
    if (reservations.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No reservations found.",
      });
    }
    res.status(StatusCodes.OK).json({
      reservations: reservations,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Error fetching all reservations: " + err,
    });
  }
});

reservationsRouter.post("/", async (req, res) => {
  try {
    const reservation = await connection.insert(req.body).from("reservation");
    res.status(StatusCodes.CREATED).send("Sucessully created reservation!");
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Error creating new reservation: " + err,
    });
  }
});

reservationsRouter.get("/:id", async (req, res) => {
  try {
    const reservationID = parseInt(req.params.id);
    const reservation = await connection("reservation")
      .where({ id: reservationID })
      .first();
    if (reservation) {
      return res.status(StatusCodes.OK).json({
        reservation: reservation,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No reservation found.",
      });
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Error fetching reservation ID: " + err,
    });
  }
});

reservationsRouter.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const inputFields = req.body;
    const updateReservation = await connection("reservation")
      .where({ id: id })
      .update(inputFields);
    res.status(StatusCodes.OK).send("Reservation Updated Successfully!");
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Error updating Reservation: " + err,
    });
  }
});

reservationsRouter.delete("/:id", async (req, res) => {
  try {
    const reservationId = parseInt(req.params.id);
    const deleted = await connection("reservation")
      .where({ id: reservationId })
      .del();
    if (deleted) {
      res.status(StatusCodes.CREATED).send("Reservation Deleted Successfully!");
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send("Reservation Deletion Failed!");
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Error deleting reservation: " + err,
    });
  }
});

export default reservationsRouter;
