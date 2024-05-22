import React from "react";
import { Link } from "react-router-dom";

import styles from "./Footer.module.css";

import { ROUTES } from "../../utils/routes";

import LOGO from "../../images/footer-logo.png";

const Footer = () => (
  <section className={styles.footer}>
    <div className={styles.rights}>
      Разработано{" "}
      <a href="https://discord.gg/f27ae6et" target="_blank" rel="noreferrer">
        TRASH GANG
      </a>
    </div>

    <div className={styles.logo}>
      <Link to={ROUTES.HOME}>
        <img src={LOGO} alt="LogoFooter" />
      </Link>
    </div>

    <div className={styles.socials}>
      <a href="https://www.instagram.com/artsiom_255/" target="_blank" rel="noreferrer">
        <svg className={styles.icon}>
          <use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#instagram`} />
        </svg>
      </a>

      <a href="https://www.youtube.com/@mramor_off/videos" target="_blank" rel="noreferrer">
        <svg className={styles.icon}>
          <use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#youtube`} />
        </svg>
      </a>
    </div>
  </section>
);

export default Footer;
