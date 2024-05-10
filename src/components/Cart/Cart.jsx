import React, { useState } from "react";
import { useAuth } from "../../firebase";
import { Navigate } from "react-router-dom";

import styles from "./Cart.module.css";
import CustomButton from "../Custom/CustomButton/CustomButton";

const Cart = () => {
  const currentUser = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const storedItems = localStorage.getItem("cartItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const incrementQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const decrementQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === itemId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  return currentUser !== null ? (
    <section className={styles.cart}>
      <h2 className={styles.title}>Корзина</h2>
      {cartItems.length === 0 ? (
        <div className={styles.empty}>Вы ещё не добавили товар :(</div>
      ) : (
        <>
          <div className={styles.list}>
            {cartItems.map((item) => (
              <div className={styles.item} key={item.id}>
                <div
                  className={styles.image}
                  style={{ backgroundImage: `url(${item.image})` }}
                />

                <div className={styles.info}>
                  <div className={styles.name}>{item.title}</div>
                  <div className={styles.category}>{item.category}</div>
                </div>

                <div className={styles.price}>{item.price} $</div>

                <div className={styles.quantity}>
                    <div
                      className={styles.minus}
                      onClick={() => decrementQuantity(item.id)}
                    >
                      <svg className="icon">
                        <use
                          xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#minus`}
                        />
                      </svg>
                    </div>

                    <span>{item.quantity}</span>

                    <div
                      className={styles.plus}
                      onClick={() => incrementQuantity(item.id)}
                    >
                      <svg className="icon">
                        <use
                          xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#plus`}
                        />
                      </svg>
                    </div>
                  </div>

                <div className={styles.price}>{item.price * item.quantity} $</div>

                <div
                  className={styles.close}
                  onClick={() => removeFromCart(item.id)}
                >
                  <svg className="icon">
                    <use
                      xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#close`}
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.actions}>
            <div className={styles.total}>Итого: {calculateTotal()} $</div>

            <div className={styles.checkout}>
              <CustomButton
                label="Оплатить товары"
                fontSize="15px"
                width="100%"
                height="40px"
                disabled={cartItems.length === 0}
                // Добавьте обработчик события для оплаты
                // handleClick={handleCheckout}
              />
            </div>
          </div>
        </>
      )}
    </section>
  ) : (
    <Navigate to="/login" />
  );
};

export default Cart;
