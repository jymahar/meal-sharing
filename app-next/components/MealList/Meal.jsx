import React from "react";
import styles from "./MealList.module.css";

import { Card, CardContent, Typography, CardActions, Box } from "@mui/material";

const Meal = ({ title, description, price, id }) => {
  const image_file = "/images/" + id + ".jpg";
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        backgroundColor: "beige",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-5px)",
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <img src={image_file} alt={image_file} className={styles.meal_image} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" color="success.main">
            {price} DKK
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Meal;
