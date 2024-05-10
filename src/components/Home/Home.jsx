import React from "react";

import Banner from "../Banner/Banner";
import Categories from "../Categories/Categories";
import Poster from "../Poster/Poster";
import Products from "../Products/Products";

const Home = () => {
  return (
    <>
      <Poster />
      <Products title="Популярно" />
      <Categories title="Стоит увидеть" />
      <Banner />
      <Products />
    </>
  );
};

export default Home;
