import { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { signup, useAuth } from "../../../firebase.js";
import { Link } from 'react-router-dom';

import LOGO from "../../../images/registration.png";
import styles from "./SignUp.module.css";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const currentUser = useAuth();

  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();

  async function handleSignup(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен быть минимум 6 знаков");
      setLoading(false);
      return;
    }

    try {
      await signup(email, password);
      navigate("/");
    } catch {
      setError("Ошибка регистрации! Проверьте правильность данных.");
    }

    setLoading(false);
  }

  return (
    <form className={styles.form} onSubmit={handleSignup}>
      <div className={styles.header}>
        <p className={styles.title}>Регистрация</p>
        <img src={LOGO} alt="LOGO" className={styles.icon} />
      </div>
      <div className={styles.bodyReg}>
        <div className={styles.divCenter}>
          <input
            ref={emailRef}
            type="email"
            className={`${styles.regInput} form-control`}
            id="exampleInputEmail1"
            placeholder="Почта"
            required
          />
        </div>
        <div className={styles.divCenter}>
          <input
            ref={passwordRef}
            className={`${styles.regInput} form-control`}
            id="exampleInputPassword1"
            type="password"
            placeholder="Пароль"
          />
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <div className={styles.divCenter}>
          <button
            disabled={loading || currentUser}
            type="submit"
            className={`${styles.regbtn} btn btn-primary`}
          >
            Регистрация
          </button>
        </div>
        <div className={styles.divCenter}>
          <p align="center">
            У вас есть аккаунт? <Link to="/Login" className={styles.text}>Вход</Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default SignUp;
