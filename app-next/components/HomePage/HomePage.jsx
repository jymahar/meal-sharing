"use client";
import Image from "next/image";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Meal from "../MealList/Meal";
import styles from "../MealList/MealList.module.css";
import "./HomePage.css";

function HomePage() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/meals")
      .then((res) => res.json())
      .then((data) => {
        setMeals(data.meals.slice(0, 3)); // Show only first 3 meals
      })
      .catch((error) => {
        console.error("Failed to fetch meals:", error);
      });
  }, []);

  return (
    <div>
      <header className="homepage-header">
        <img src="/images/logo.jpg" alt="Logo" className="logo" />
        <h1>Meal Sharing</h1>
        <h3>Discover meals from around the world</h3>
      </header>

      <main className={styles.container}>
        <h2 className={styles.heading}>Featured Meals</h2>
        <div className={styles.grid}>
          {meals.map((meal) => (
            <Meal
              title={meal.title}
              description={meal.description}
              price={meal.price}
              id={meal.id}
            />
          ))}
        </div>

        <div className="see-more-container">
          <Link to="/meals">
            <button className="see-more-btn">See All Meals</button>
          </Link>
        </div>
      </main>

      <footer className="homepage-footer">
        <p>&copy; 2025 Meal Sharing. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
