import React from "react";

import styles from "./Banner.module.css";

import bannerImg from "../../images/summer-banner.jpg";
import { Link } from "react-router-dom";
import CustomButton from "../Custom/CustomButton/CustomButton";

const Banner = () => (
  <section className={styles.banner}>
    <div className={styles.left}>
      <p className={styles.content}>
        SUMMER
        <span>SALE</span>
      </p>
      <Link to='/category/Кольца'>
        <CustomButton
          width = "100%"
          height="40px"
          fontSize = "18px"
          label="See more"
        />
      </Link>
    </div>

    <div
      className={styles.right}
      style={{ backgroundImage: `url(${bannerImg})` }}
    >
      <p className={styles.discount}>
        save up to <span>15%</span> off
      </p>
    </div>
  </section>
);

export default Banner;
