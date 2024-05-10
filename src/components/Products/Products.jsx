import React, { useEffect, useState } from "react";
import { db } from "../../firebase";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import styles from "./Products.module.css";
import { Link } from "react-router-dom";

const Products = ({ title }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const PostsCollection = collection(db, "products");
      const querySnapshot = await getDocs(PostsCollection);
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    };
    fetchPosts();
  }, []);

  const limitedPosts = posts.slice(0, 5);

  const shuffledPosts = limitedPosts.sort(() => Math.random() - 0.5);

  return (
    <section className={styles.products}>
      <h2 className={styles.title1}>{title}</h2>
      <div className={styles.list}>
      {shuffledPosts.map((post) => (
        <Link to={`/products/${post.id}`} key={post.id} className={styles.product}>
          <div
            className={styles.image}
            style={{ backgroundImage: `url(${post.image})` }}
          />
            <div className={styles.wrapper}>
              <h3 className={styles.title}>{post.title}</h3>
              <div className={styles.info}>
              <div className={styles.prices}>
                <div className={styles.price}>{post.price}$</div>
              </div>

              <div className={styles.purchases}>
                {Math.floor(Math.random() * 20 + 1)} purchased
              </div>
            </div>
          </div>
        </Link>
      ))}
      </div>
    </section>
  );
};

export default Products;
