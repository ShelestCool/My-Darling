import React from "react";
import { Route, Routes } from "react-router-dom";

import { ROUTES } from "../utils/routes";

import Home from "../components/Home/Home";
import SignUp from "../components/Auth/SignUp/SignUp";
import Login from "../components/Auth/Login/Login";
import Cart from "../components/Cart/Cart";
import Product from "../components/Products/Product";
import Category from "../components/Categories/Category";

const AppRoutes = () => (
  <Routes>
    <Route index element={<Home />} />
    <Route path={ROUTES.PRODUCT} element={<Product />} />
    <Route path={ROUTES.CATEGORY} element={<Category />} />
    <Route path={ROUTES.SIGNUP} element={<SignUp />} />
    <Route path={ROUTES.LOGIN} element={<Login />} />
    <Route path={ROUTES.CART} element={<Cart />} />
  </Routes>
);

export default AppRoutes;
