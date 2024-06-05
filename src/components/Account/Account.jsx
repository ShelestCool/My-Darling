import React, { useState, useEffect } from 'react';
import { auth, sendPasswordResetEmail } from '../../firebase';
import { Button } from 'react-bootstrap';
import { db } from '../../firebase';
import { deleteDoc, doc, getDocs, collection, updateDoc } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './account.module.css';
import CustomButton from '../Custom/CustomButton/CustomButton';

const Account = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editOrderId, setEditOrderId] = useState(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserInfo({
          email: user.email,
          createdAt: new Date(user.metadata.creationTime).toLocaleString(),
        });
        fetchOrderHistory(user.uid);
      } else {
        setUserInfo(null);
      }
    });

    return unsubscribe;
  }, []);

  const fetchOrderHistory = async (userId) => {
    const orderHistoryRef = collection(db, 'orders');
    const querySnapshot = await getDocs(orderHistoryRef);
    const orders = querySnapshot.docs.map(doc => {
      const data = doc.data();
      if (!data.deliveryDate) {
        let newDeliveryDate = new Date();
        newDeliveryDate.setDate(newDeliveryDate.getDate() + 3);
        data.deliveryDate = newDeliveryDate;
      } else {
        data.deliveryDate = (data.deliveryDate.toDate ? data.deliveryDate.toDate() : new Date(data.deliveryDate));
      }
      return { id: doc.id, ...data };
    });
    setOrderHistory(orders);
  };

  const handleCalendarClick = (orderId, currentAddress) => {
    setEditOrderId(orderId);
    setAddress(currentAddress);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const saveChanges = async () => {
    if (editOrderId) {
      const orderRef = doc(db, 'orders', editOrderId);
      await updateDoc(orderRef, { deliveryDate: selectedDate, address });
      setOrderHistory(orderHistory.map(order => order.id === editOrderId ? { ...order, deliveryDate: selectedDate, address } : order));
      setEditOrderId(null);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrderHistory(orderHistory.filter(order => order.id !== orderId));
      alert('Заказ успешно отменен.');
    } catch (error) {
      alert('Ошибка при отмене заказа:', error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!userInfo) {
      alert('Информация о пользователе не загружена');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, userInfo.email);
      alert('Инструкция по смене пароля отправлена на вашу почту.');
    } catch (error) {
      alert(error.message);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = `0${d.getDate()}`.slice(-2);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <section className={styles.account}>
      <p className={styles.title1}>Личный Кабинет</p>
      {userInfo ? (
        <div className={styles.accountInfo}>
          <p><b>Почта:</b> {userInfo.email}</p>
          <p><b>Дата создания:</b> {userInfo.createdAt}</p>
        </div>
      ) : (
        <p>Загрузка информации о пользователе...</p>
      )}
      <div className={styles.accountBtn}>
        <Button onClick={handlePasswordReset} className={styles.resetBtn} disabled={!userInfo}>
          Сбросить пароль
        </Button>
      </div>

      <div>
        <p className={styles.title2}>История заказов:</p>
        <div className={styles.history}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>Дата заказа</th>
                <th>Товары</th>
                <th>Время доставки</th>
                <th>Адрес доставки</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map(order => (
                <tr key={order.id} className={styles.orderBlock}>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>
                    <ul>
                      {order.items.map(item => (
                        <li key={item.id}>
                          {item.title} - {item.quantity} шт.
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    {editOrderId === order.id ? (
                      <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd.MM.yyyy"
                      />
                    ) : (
                      formatDate(order.deliveryDate)
                    )}
                  </td>
                  <td>
                    {editOrderId === order.id ? (
                      <input
                        type="text"
                        value={address}
                        onChange={handleAddressChange}
                        placeholder="Введите адрес доставки"
                      />
                    ) : (
                      order.address || 'Адрес не указан'
                    )}
                  </td>
                  <td>
                  {editOrderId === order.id ? (
                      <CustomButton 
                        width = "100%"
                        height="40px"
                        fontSize = "14px"
                        label="Сохранить"
                     handleClick={saveChanges}/>
                    ) : (
                      <>
                        <CustomButton 
                          width = "100%"
                          height="40px"
                          fontSize = "14px"
                          label="Изменить дату и адрес"
                          handleClick={() => handleCalendarClick(order.id, order.address || '')}/>
                        <CustomButton 
                          width = "100%"
                          height="40px"
                          fontSize = "14px"
                          label="Отменить заказ"
                          handleClick={() => cancelOrder(order.id)}/>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Account;
