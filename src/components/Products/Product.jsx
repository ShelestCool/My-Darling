// В компоненте Product.js

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../firebase";
import { ROUTES } from "../../utils/routes";
import { doc, getDoc } from "firebase/firestore";

import CustomButton from "../Custom/CustomButton/CustomButton";

import styles from "./Product.module.css";
import Products from "./Products";

const SIZES = ["One Size", "S", "M", "L", "XL"];

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentSize, setCurrentSize] = useState();
  const [cartItems, setCartItems] = useState(() => {
    const storedItems = localStorage.getItem("cartItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const productRef = doc(db, "products", id);
      const docSnap = await getDoc(productRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("Product not found");
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = (e) => {
    e.preventDefault();
    if (!currentSize) {
      alert("Выберите размер товара!");
      return;
    }
    const newItem = { 
      id: product.id, 
      title: product.title, 
      price: product.price, 
      category: product.category, 
      image: product.image, 
      size: currentSize,
      quantity: 1,
    };
    setCartItems([...cartItems, newItem]);
    localStorage.setItem("cartItems", JSON.stringify([...cartItems, newItem]));
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className={styles.product}>
        <div className={styles.images}>
          <div className={styles.current} style={{ backgroundImage: `url(${product.image})` }} />
        </div>
        <div className={styles.info}>
          <h1 className={styles.title}>{product.title}</h1>
          <div className={styles.list}>
            {SIZES.map((size) => (
              <div
                onClick={() => setCurrentSize(size)}
                className={`${styles.size} ${
                  currentSize === size ? styles.active : ""
                }`}
                key={size}
              >
                {size}
              </div>
            ))}
          </div>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
          <div className={styles.price}>{product.price} $</div>
          <div className={styles.cartButtons}>
            <div className={styles.bottom}>
              <Link to={ROUTES.HOME}>Вернуться в магазин</Link>
            </div>
            <div>
              <CustomButton
                label="Добавить в корзину"
                fontSize="15px"
                width="100%"
                height="40px"
                handleClick={addToCart}
              />
            </div>
          </div>
        </div>
      </section>

      <Products title="Похожие товары" />
    </>
  );
};

export default Product;