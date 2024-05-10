import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

import { login, useAuth } from "../../../firebase.js";
import { Link } from "react-router-dom";

import LOGO from "../../../images/login.png";
import styles from "./Login.module.css";
import CustomInput from "../../Custom/CustomInput/CustomInput.jsx";


const Login = () => {
  const [loading, setLoading] = useState(false);
  const currentUser = useAuth();

  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();

  async function handleLogin() {
    setLoading(true);
    try {
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch {
      alert("Authorisation Error!");
    }
    setLoading(false);
  }

  return (
    <form className={styles.form}>
      <div className={styles.header}>
        <p className={styles.title}>Аторизация</p>
        <img src={LOGO} alt="LOGO" className={styles.icon}/>
      </div>
      <div className={styles.bodyLogin}>
        <div className={styles.divCenter}>
          <input
            ref={emailRef}
            type="email"
            className={`${styles.loginInput} form-control`}
            id="exampleInputEmail1"
            placeholder="Email"
            required
          />
        </div>
        <div className={styles.divCenter}>
          <input
            ref={passwordRef}
            className={`${styles.loginInput} form-control`}
            id="exampleInputPassword1"
            type="password"
            placeholder="password"
          />
        </div>
        <div className={styles.divCenter}>
          <button disabled={loading || currentUser} onClick={handleLogin} className={`${styles.loginbtn} btn btn-primary`}>
            Log In
          </button>
        </div>
        <div className={styles.divCenter}>
          <p align="center">
            У вас нет аккаунта? <Link to="/signUp" className={styles.text}>Sing Up</Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default Login;
