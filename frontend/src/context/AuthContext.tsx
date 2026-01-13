import { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  token: string | null;
  isAdmin: boolean;
  setAuth: (token: string, isAdmin?: boolean) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("isAdmin");

    if (savedToken) setToken(savedToken);
    if (savedRole === "true") setIsAdmin(true);

    setLoading(false);
  }, []);

  const setAuth = (newToken: string, admin: boolean = false) => {
    setToken(newToken);
    setIsAdmin(admin);

    localStorage.setItem("token", newToken);
    localStorage.setItem("isAdmin", String(admin));
  };

  const logout = () => {
    setToken(null);
    setIsAdmin(false);

    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider
      value={{ token, isAdmin, setAuth, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}