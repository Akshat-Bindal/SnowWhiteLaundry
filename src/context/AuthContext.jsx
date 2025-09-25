"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // ✅ Always check localStorage first
    let savedToken = localStorage.getItem("token");

    if (savedToken && savedToken !== "undefined") {
      setToken(savedToken);
    } else {
      setToken(null);
    }

    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return <p className="text-center mt-5">Checking authentication...</p>;
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
