import React from "react";

import styles from "./Poster.module.css";

import BG from "../../images/poster.png";
import { Link } from "react-router-dom";
import CustomButton from "../Custom/CustomButton/CustomButton";

const Poster = () => (
  <section className={styles.home}>
    <div className={styles.title}>Распродажа 15%</div>
    <div className={styles.product}>
      <div className={styles.text}>
        <div className={styles.subtitle}>БЕСТСЕЛЛЕР 2024 ГОДА</div>
        <h1 className={styles.head}>На все виды колье!</h1>
        <Link to='/category/Колье'>
          <CustomButton
          width = "35%"
          height="40px"
          fontSize = "18px"
          label="Подробнее"
        />
        </Link>
      </div>
      <div className={styles.image}>
        <img src={BG} alt="" />
      </div>
    </div>
  </section>
);

export default Poster;
