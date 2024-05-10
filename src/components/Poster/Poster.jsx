import React from "react";

import styles from "./Poster.module.css";

import BG from "../../images/poster.png";
import { Link } from "react-router-dom";
import CustomButton from "../Custom/CustomButton/CustomButton";

const Poster = () => (
  <section className={styles.home}>
    <div className={styles.title}>BIG SALE 15%</div>
    <div className={styles.product}>
      <div className={styles.text}>
        <div className={styles.subtitle}>the bestseller of 2024</div>
        <h1 className={styles.head}>All silver jewelry!</h1>
        <Link to='/category/Колье'>
          <CustomButton
          width = "30%"
          height="40px"
          fontSize = "18px"
          label="Shop Now"
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
