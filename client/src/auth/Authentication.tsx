// import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";

import api from "../api/axios";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Define states accessible by using context.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [role, setRole] = useState(null);

  const navigate = useNavigate(); // for changing page url route.

  useEffect(() => {
    // Check if user is already authenticated (i.e, by checking cookies)
    console.log("Checking authentication status...");
    api
      .get("/api/check-auth")
      .then((response) => {
        // successful check (not necessarily authenticated)
        console.log("Authentication status:", response.data.isAuthenticated);
        setIsAuthenticated(response.data.isAuthenticated);
        setUserEmail(response.data.email);
        console.log(response.data.role);
        setRole(response.data.role);
      })
      .catch((error) => {
        console.error("Error checking authentication status:", error);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // used when clicking login button on login page, authenticate details with server.
  const login = async (email: string, password_hash: string) => {
    try {
      const res = await api.post("/api/login", {
        email: email,
        password: password_hash,
      });
      if (role == "user") {
        navigate("/"); // if login success, navigate to app dashboard.
      } else if (role == "teaching") {
        navigate(`/staff/${userEmail}`);
      }
      setIsAuthenticated(true);
      setUserEmail(res.data.email);
      setRole(res.data.role);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // when navbar's logout button is pressed, do this
  const logout = async () => {
    try {
      await api.get("/api/logout", {}); // deletes session token data.
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // make values accessible to other components.
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, login, logout, userEmail, role }}
    >
      {children}
    </AuthContext.Provider>
  );
};
