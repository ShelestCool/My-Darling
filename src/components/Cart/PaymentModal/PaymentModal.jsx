import React, { useState } from "react";
import styles from "./PaymentModal.module.css";

const PaymentModal = ({ onClose, onSubmit, cartItems }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cvv, setCvv] = useState("");

  const handleCardNumberChange = (e) => {
    const formattedCardNumber = e.target.value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formattedCardNumber);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const isFormValid = () => {
    return (
      cardNumber.replace(/\s/g, "").length === 16 &&
      cardHolder.trim().length > 0 &&
      cvv.length === 3
    );
  };

  const handlePayment = () => {
    if (isFormValid()) {
      onSubmit();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Оплата товаров</h2>
        <div className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="cardNumber">Номер карты</label>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength="19"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="cardHolder">Имя и фамилия владельца</label>
            <input
              type="text"
              id="cardHolder"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="cvv">CVV</label>
            <input
              type="password"
              id="cvv"
              value={cvv}
              onChange={handleCvvChange}
              maxLength="3"
            />
          </div>
          <div className={styles.buttons}>
            <button onClick={onClose}>Отмена</button>
            <button onClick={handlePayment} disabled={!isFormValid()}>
              Оплатить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
