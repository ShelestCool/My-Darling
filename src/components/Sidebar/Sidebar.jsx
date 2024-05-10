import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const Categories = [
    { id: 1, name: "Кольца" },
    { id: 2, name: "Серьги" },
    { id: 3, name: "Цепочки" },
    { id: 4, name: "Часы" },
    { id: 5, name: "Браслеты" },
    { id: 6, name: "Подвески" },
    { id: 7, name: "Колье" },
    { id: 8, name: "Броши" },
  ];

  return (
    <section className={styles.sidebar}>
      <div className={styles.title}>CATEGORIES</div>
      <nav>
        <ul className={styles.menu}>
          {Categories.map(({ id, name }) => (
            <li key={id}>
              <NavLink
                className={styles.link}
                activeclassname={styles.active}
                to={`/category/${name}`}
              >
                {name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};

export default Sidebar;