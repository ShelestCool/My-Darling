import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../firebase";
import { ROUTES } from "../../utils/routes";
import { doc, getDoc, collection, addDoc, updateDoc, getDocs } from "firebase/firestore";
import { useAuth } from "../../firebase";

import CustomButton from "../Custom/CustomButton/CustomButton";
import styles from "./Product.module.css";
import Products from "./Products";

const SIZES = ["One Size", "S", "M", "L", "XL"];

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentSize, setCurrentSize] = useState();
  const currentUser = useAuth();

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

  const formatPrice = (price) => parseFloat(price).toFixed(2);

  const addToCart = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Пожалуйста, войдите в систему, чтобы добавить товар в корзину.");
      return;
    }
    if (!currentSize) {
      alert("Выберите размер товара!");
      return;
    }

    const userCartRef = collection(db, "carts", currentUser.uid, "items");
    const querySnapshot = await getDocs(userCartRef);
    const existingItem = querySnapshot.docs.find((doc) => doc.data().id === product.id && doc.data().size === currentSize);

    if (existingItem) {
      const existingItemRef = doc(db, "carts", currentUser.uid, "items", existingItem.id);
      await updateDoc(existingItemRef, { quantity: existingItem.data().quantity + 1 });
    } else {
      await addDoc(userCartRef, {
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        image: product.image,
        size: currentSize,
        quantity: 1,
      });
    }
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
                className={`${styles.size} ${currentSize === size ? styles.active : ""}`}
                key={size}
              >
                {size}
              </div>
            ))}
          </div>
          <div className={styles.description} dangerouslySetInnerHTML={{ __html: product.description }} />
          <div className={styles.price}>{formatPrice(product.price)} $</div>
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
      <Products title="Популярные товары" />
    </>
  );
};

export default Product;
