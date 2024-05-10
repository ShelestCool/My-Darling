import { useRef, useState} from 'react';
import { useNavigate } from "react-router-dom";

import { signup, useAuth} from "../../../firebase.js";
import { Link } from 'react-router-dom';

import LOGO from "../../../images/registration.png";
import styles from "./SignUp.module.css";

const SignUp = () => {
  const [ loading, setLoading] = useState(false);
  const currentUser = useAuth();

  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();

  async function handleSignup() {
    setLoading(true);
    try{
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch {
      alert("Registration Error!")
    }
    setLoading(false);
  }

  return (
    <form className={styles.form}>
      <div className={styles.header}>
        <p className={styles.title}>Регистрация</p>
        <img src={LOGO} alt="LOGO" className={styles.icon}/>
      </div>
      <div className={styles.bodyReg}>
        <div className={styles.divCenter}>
          <input
            ref={emailRef}
            type="email"
            className={`${styles.regInput} form-control`}
            id="exampleInputEmail1"
            placeholder="Email"
            required
          />
        </div>
        <div className={styles.divCenter}>
          <input
            ref={passwordRef}
            className={`${styles.regInput} form-control`}
            id="exampleInputPassword1"
            type="password"
            placeholder="password"
          />
        </div>
        <div className={styles.divCenter}>
          <button disabled={loading || currentUser} onClick={handleSignup} className={`${styles.regbtn} btn btn-primary`}>
            Sing Up
          </button>
        </div>
        <div className={styles.divCenter}>
          <p align="center">
            У вас нет аккаунта? <Link to="/Login" className={styles.text}>Log In</Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default SignUp;
