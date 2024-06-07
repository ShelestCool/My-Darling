import React, { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore"; 

import styles from "./Header.module.css";

import LOGO from "../../images/header-logo.png";
import LOGOUT from "../../images/logout.png";
import { useNavigate } from 'react-router-dom';
import { useAuth, logout } from "../../firebase";
import { ROUTES } from "../../utils/routes";

const Header = () => {
  const currentUser = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
      navigate('/');
    } catch {
      alert("Ошибка!");
    }
    setLoading(false);
  }

  const handleSearchInput = async (e) => {
    const queryValue = e.target.value;
    setSearchQuery(queryValue);
    if (!queryValue) {
      setSearchResults([]);
      return;
    }
    try {
      const productsCollection = collection(db, "products");
      const q = query(
        productsCollection,
        where("title", ">=", queryValue),
        where("title", "<=", queryValue + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={LOGO} alt="LogoHeader" />
        </Link>
      </div>

      <div className={styles.info}>
        <form className={styles.form}>
          <input
            type="search"
            name="search"
            className={styles.inputSearch}
            placeholder="Поиск ..."
            autoComplete="off"
            value={searchQuery}
            onChange={handleSearchInput}
          />

          {searchResults.length > 0 && searchQuery && (
            <div className={styles.box}>
              {searchResults.map((result) => {
                    return (
                      <Link
                        key={result.id}
                        onClick={() => setSearchQuery("")}
                        className={styles.item}
                        to={`/products/${result.id}`}
                      >
                        <div>
                        <div
                          className={styles.image}
                          style={{ backgroundImage: `url(${result.image})` }}
                        />
                        </div>
                        <div className={styles.title}>{result.title}</div>
                      </Link>
                    );
                  })}
            </div>
          )}
        </form>
      </div>

      <div className={styles.account}>
        <Link to={ROUTES.CART}>
          <svg className={styles.icon}>
            <use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#bag`} />
          </svg>
        </Link>
      </div>

      {currentUser ? (
        <div className={styles.logBlock}>
          <Link as={Link} to="/account" className={styles.linkblack}>
            <span className={styles.logName}>{currentUser?.email} </span>
          </Link>
          <img
            src={LOGOUT}
            alt="LogOut"
            className={styles.icon}
            disabled={loading || !currentUser}
            onClick={handleLogout}
          />
        </div>
      ) : (
        <div className={styles.authNavButtons}>
          <Link as={Link} to="/login" className={styles.authNavButton}>
            <button type="button" className="btn btn-outline-secondary">
              Вход
            </button>
          </Link>
          <Link as={Link} to="/signUp" className={styles.authNavButton}>
            <button type="button" className="btn btn-outline-secondary">
              Регистрация
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;

