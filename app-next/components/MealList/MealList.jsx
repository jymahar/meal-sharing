"use client";
import React, { useState, useEffect } from "react";
import styles from "./MealList.module.css";
import Meal from "./Meal";
import { Link } from "react-router-dom";

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
          <Link to={`/meals/${meal.id}`} key={meal.id}>
            <Meal
              key={meal.id}
              title={meal.title}
              description={meal.description}
              price={meal.price}
              id={meal.id}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MealList;
