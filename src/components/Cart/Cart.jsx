import React, { useState, useEffect } from "react";
import { useAuth } from "../../firebase";
import { Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "./Cart.module.css";
import CustomButton from "../Custom/CustomButton/CustomButton";
import PaymentModal from "./PaymentModal/PaymentModal";
import { addDoc } from "firebase/firestore";

const Cart = () => {
  const currentUser = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (currentUser) {
        const userCartRef = collection(db, "carts", currentUser.uid, "items");
        const querySnapshot = await getDocs(userCartRef);
        const items = querySnapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() }));
        setCartItems(items);
      }
    };
    fetchCartItems();
  }, [currentUser]);

  const removeFromCart = async (itemDocId) => {
    const itemRef = doc(db, "carts", currentUser.uid, "items", itemDocId);
    await deleteDoc(itemRef);
    setCartItems(cartItems.filter((item) => item.docId !== itemDocId));
  };

  const incrementQuantity = async (itemDocId) => {
    const item = cartItems.find((item) => item.docId === itemDocId);
    if (item) {
      const itemRef = doc(db, "carts", currentUser.uid, "items", itemDocId);
      await updateDoc(itemRef, { quantity: item.quantity + 1 });
      setCartItems(cartItems.map((item) => (item.docId === itemDocId ? { ...item, quantity: item.quantity + 1 } : item)));
    }
  };

  const decrementQuantity = async (itemDocId) => {
    const item = cartItems.find((item) => item.docId === itemDocId);
    if (item && item.quantity > 1) {
      const itemRef = doc(db, "carts", currentUser.uid, "items", itemDocId);
      await updateDoc(itemRef, { quantity: item.quantity - 1 });
      setCartItems(cartItems.map((item) => (item.docId === itemDocId ? { ...item, quantity: item.quantity - 1 } : item)));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    setIsModalOpen(true);
  };

  const handlePaymentSubmit = async () => {
    setIsModalOpen(false);
    const currentDate = new Date();
    const orderData = {
      userId: currentUser.uid,
      orderDate: currentDate.toISOString(),
      items: cartItems,
      deliveryDate: currentDate.toISOString(), // Устанавливаем текущую дату
    };
    try {
      await addDoc(collection(db, 'orders'), orderData);
      await Promise.all(cartItems.map((item) => deleteDoc(doc(db, "carts", currentUser.uid, "items", item.docId))));
      setCartItems([]);
      const itemNames = cartItems.map(item => item.title).join(", ");
      alert(`Спасибо за покупку! Вы приобрели: ${itemNames}`);
      setPurchaseCompleted(true);
      navigate('/account');
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error.message);
    }
  };

  if (purchaseCompleted) {
    return <Navigate to="/" replace />;
  }

  return currentUser !== null ? (
    <section className={styles.cart}>
      <h2 className={styles.title}>Корзина</h2>
      {cartItems.length === 0 ? (
        <div className={styles.empty}>Вы ещё не добавили товар :(</div>
      ) : (
        <>
          <div className={styles.list}>
            {cartItems.map((item) => (
              <div className={styles.item} key={item.docId}>
                <div className={styles.image} style={{ backgroundImage: `url(${item.image})` }} />
                <div className={styles.info}>
                  <div className={styles.name}>{item.title}</div>
                  <div className={styles.category}>{item.category}</div>
                </div>
                <div className={styles.price}>{item.price} $</div>
                <div className={styles.quantity}>
                  <div className={styles.minus} onClick={() => decrementQuantity(item.docId)}>
                    <svg className="icon">
                      <use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#minus`} />
                    </svg>
                  </div>
                  <span>{item.quantity}</span>
                  <div className={styles.plus} onClick={() => incrementQuantity(item.docId)}>
                    <svg className="icon">
                      <use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#plus`} />
                    </svg>
                  </div>
                </div>
                <div className={styles.price}>{(item.price * item.quantity).toFixed(2)} $</div>
                <div className={styles.close} onClick={() => removeFromCart(item.docId)}>
                  <svg className="icon">
                    <use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#close`} />
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
                handleClick={handleCheckout}
              />
            </div>
          </div>
        </>
        )}
        {isModalOpen && <PaymentModal onClose={() => setIsModalOpen(false)} onSubmit={handlePaymentSubmit} cartItems={cartItems} />}
      </section>
    ) : (
      <Navigate to="/login" />
    );
  };
  
export default Cart;
