import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

import { login, useAuth } from "../../../firebase.js";
import { Link } from "react-router-dom";

import LOGO from "../../../images/login.png";
import styles from "./Login.module.css";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const currentUser = useAuth();

  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();

  async function handleLogin(event) {
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

    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Ошибка авторизации! Проверьте правильность данных.");
    }

    setLoading(false);
  }

  return (
    <form className={styles.form} onSubmit={handleLogin}>
      <div className={styles.header}>
        <p className={styles.title}>Авторизация</p>
        <img src={LOGO} alt="LOGO" className={styles.icon} />
      </div>
      <div className={styles.bodyLogin}>
        <div className={styles.divCenter}>
          <input
            ref={emailRef}
            type="email"
            className={`${styles.loginInput} form-control`}
            id="exampleInputEmail1"
            placeholder="Почта"
            required
          />
        </div>
        <div className={styles.divCenter}>
          <input
            ref={passwordRef}
            className={`${styles.loginInput} form-control`}
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
            className={`${styles.loginbtn} btn btn-primary`}
          >
            Вход
          </button>
        </div>
        <div className={styles.divCenter}>
          <p align="center">
            У вас нет аккаунта? <Link to="/signUp" className={styles.text}>Регистрация</Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default Login;
