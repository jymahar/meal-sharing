"use client";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/components/HomePage/HomePage";
import MealsPage from "@/components/MealList/MealsPage";
import MealDetailPage from "@/components/MealList/MealDetailPage";
import NavBar from "@/components/NavBar/NavBar";
import MealReservationForm from "@/components/MealList/MealReservationForm";

const App = () => (
  <Router>
    <NavBar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/meals" element={<MealsPage />} />
      <Route path="/meals/:id" element={<MealDetailPage />} />
      <Route path="/meals/:id/reserve" element={<MealReservationForm />} />
    </Routes>
  </Router>
);

export default App;
