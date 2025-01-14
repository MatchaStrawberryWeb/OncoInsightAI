import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Protected = ({ component: Component, requireAdmin }) => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const username = localStorage.getItem("username"); // Assuming the username is stored in localStorage

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login"); // Redirect to login if not logged in
    } else if (requireAdmin && username !== "admin") {
      navigate("/dashboard"); // Redirect to user dashboard if username is not admin
    } else if (!requireAdmin && username === "admin") {
      navigate("/admin-dashboard"); // Redirect to admin dashboard if admin tries to access user dashboard
    }
  }, [isLoggedIn, username, requireAdmin, navigate]);

  // If the user is allowed, render the protected component
  return isLoggedIn && (username === "admin" || !requireAdmin) ? <Component /> : null;
};

export default Protected;
