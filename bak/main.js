// Main.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import App from "./App";
import LoginPage from "./login";
import MyOrders from "./MyOrders";
import Profile from "./Profile";

export default function Main() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/home" element={<App />} />

        <Route path="/orders" element={<MyOrders />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}