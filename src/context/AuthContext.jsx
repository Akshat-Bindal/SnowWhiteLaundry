"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true); // 👈 new state
  const router = useRouter();

  useEffect(() => {
    let savedToken = Cookies.get("token");
    if (!savedToken) {
      savedToken = localStorage.getItem("token");
    }

    if (savedToken) {
      setToken(savedToken);
      setCheckingAuth(false);
    } else {
      router.push("/auth-1/sign-in");
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    // 🚧 Block render until we know auth state
    return <p className="text-center mt-5">Checking authentication...</p>;
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
