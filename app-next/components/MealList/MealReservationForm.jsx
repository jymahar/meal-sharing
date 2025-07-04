// MealReservationForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MealReservationForm.module.css";

const MealReservationForm = ({ mealId, onSuccess }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3001/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number_of_guests: 1,
          meal_id: parseInt(mealId),
          contact_phonenumber: form.phone,
          contact_name: form.name,
          contact_email: form.email,
        }),
      });

      if (!response.ok) throw new Error("Reservation failed");

      alert("Reservation successful!");
      setForm({ name: "", email: "", phone: "" });
      if (onSuccess) onSuccess();
    } catch (error) {
      alert("Reservation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/meals");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formWrapper}>
      <h3>Book a Seat</h3>

      <div className={styles.formGroup}>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone">Phone:</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Reservation"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className={styles.cancelBtn}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MealReservationForm;
