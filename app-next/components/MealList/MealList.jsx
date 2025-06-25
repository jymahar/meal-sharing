"use client";
import React, { useState, useEffect } from "react";
import styles from "./MealList.module.css";

const API = "http://localhost:3001/api/meals";

const MealList = () => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(API);
        const data = await response.json();
        setMeals(data.meals);
      } catch (error) {
        console.error("Failed to fetch meals:", error);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Available Meals</h2>
      <div className={styles.grid}>
        {meals.map((meal) => (
          <div key={meal.id} className={styles.card}>
            <p className={styles.title}>{meal.title}</p>
            <p className={styles.description}>{meal.description}</p>
            <p className={styles.price}>Price: {meal.price} DKK</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealList;
