import React from "react";
import { Link } from "react-router-dom";

import styles from "./Categories.module.css";

const Categories = ({title}) => {
  const Categories = [
    { id: 1, name: "Кольца", image: "https://gc.ourgold.ru/images/public/goods/38/879/38879/fz2lYtJI5aNHNE4aUqXPgPXOqxJJvU4Z1Zz5p67T.jpg" },
    { id: 2, name: "Серьги", image: "https://lavivion.ru/upload/image/E34237R-Sergi-iz-belogo-zolota-s-brilliantami.webp"},
    { id: 3, name: "Цепочки", image: "https://www.e-rotas.lv/images/a1730e5c5dcedf56ddcb484a1250a062.JPG"},
    { id: 4, name: "Часы", image: "https://www.smartaids.ru/upload/iblock/e04/e048af81d0fa280d3009fedc8ed69234.jpg"},
    { id: 5, name: "Браслеты", image: "https://panclubrussia.ru/media/catalog/product/cache/bc1c9f2c9d16e3e8656a10f54d2a6e3e/r/s/rsn-__1_21.png"},
  ];


  return (
    <section className={styles.section}>
      <h2>{title}</h2>

      <div className={styles.list}>
        {Categories.map(({ id, name, image }) => (
          <Link to={`/category/${name}`} key={id} className={styles.item}>
            <div
              className={styles.image}
              style={{ backgroundImage: `url(${image})` }}
            />
            <h3 className={styles.title}>{name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
