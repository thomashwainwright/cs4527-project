import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true; // Required for cookies

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated (e.g., by checking cookies)
    console.log("Checking authentication status...");
    axios
      .get("/api/check-auth")
      .then((response) => {
        console.log("Authentication status:", response.data.isAuthenticated);
        setIsAuthenticated(response.data.isAuthenticated);
      })
      .catch((error) => {
        console.error("Error checking authentication status:", error);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await axios.post("/api/login", {
        email: email,
        password: password,
      });
      navigate("/");
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/logout", {});
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
