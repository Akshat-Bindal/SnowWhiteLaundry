"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // ❌ No token → go to sign-in
      router.replace("/auth-1/sign-in");
    } else {
      // ✅ If you want to validate token with backend:
      fetch("https://snowwhite-admin.onrender.com/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token");
          return res.json();
        })
        .then(() => {
          // ✅ Token valid → redirect to dashboard
          router.replace("/dashboard");
        })
        .catch(() => {
          // ❌ Token invalid → clear and redirect to sign-in
          localStorage.removeItem("token");
          localStorage.removeItem("admin");
          router.replace("/auth-1/sign-in");
        });
    }
  }, [router]);

  return <p className="text-center mt-5">Redirecting...</p>;
}
