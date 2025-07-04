import React from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";

const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navlinks}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/meals">Meals</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
