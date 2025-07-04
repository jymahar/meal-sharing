"use client";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MealReservationForm from "./MealReservationForm";

const MealDetailPage = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/meals/${id}`);
        const data = await res.json();
        setMeal(data.meals);
      } catch (err) {
        console.error("Failed to fetch meal:", err);
      }
    };

    fetchMeal();
  }, [id]);

  if (!meal) return <p>Loading...</p>;

  if (meal.available_reservations <= 0) {
    return <p>No reservations available.</p>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Reserve a Seat for: {meal.title}</h2>

      {/* ✅ Ensure meal.id is defined */}
      <MealReservationForm mealId={meal.id} />
    </div>
  );
};

export default MealDetailPage;
