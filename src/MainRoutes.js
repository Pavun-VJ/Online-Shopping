import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ShopIndiaBootstrap from "./App.js";
import CartPage from "./CartPage";
import PaymentPage from "./pages/PaymentModal.js";
import LoginPage from "./login.js";

function e(type, props, ...children) {
  return React.createElement(type, props, ...children);
}

export default function MainRoutes() {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  return e(
    Routes,
    null,

    e(Route, {
      path: "/",
      element: isLoggedIn
        ? e(Navigate, { to: "/home", replace: true })
        : e(Navigate, { to: "/login", replace: true }),
    }),

    e(Route, {
      path: "/login",
      element: isLoggedIn
        ? e(Navigate, { to: "/home", replace: true })
        : e(LoginPage),
    }),

    e(Route, {
      path: "/home",
      element: isLoggedIn
        ? e(ShopIndiaBootstrap)
        : e(Navigate, { to: "/login", replace: true }),
    }),

    e(Route, {
      path: "/cart",
      element: isLoggedIn
        ? e(CartPage)
        : e(Navigate, { to: "/login", replace: true }),
    }),

    e(Route, {
      path: "/payment",
      element: isLoggedIn
        ? e(PaymentPage)
        : e(Navigate, { to: "/login", replace: true }),
    })
  );
}
