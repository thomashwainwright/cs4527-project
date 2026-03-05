// import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";

import api from "../api/axios";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated (e.g., by checking cookies)
    console.log("Checking authentication status...");
    api
      .get("/api/check-auth")
      .then((response) => {
        console.log("Authentication status:", response.data.isAuthenticated);
        setIsAuthenticated(response.data.isAuthenticated);
        setUserEmail(response.data.email);
      })
      .catch((error) => {
        console.error("Error checking authentication status:", error);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password_hash: string) => {
    try {
      const res = await api.post("/api/login", {
        email: email,
        password: password_hash,
      });
      navigate("/");
      setIsAuthenticated(true);
      setUserEmail(res.data.email);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await api.get("/api/logout", {});
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, login, logout, userEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};
