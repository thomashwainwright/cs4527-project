// context to provides authentication state across the application.

import { createContext } from "react";

// defines type of authentication context data
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  userEmail: string | null;
  role: string | null;
}

// create authentication context with default values
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  userEmail: null,
  role: null,
});
