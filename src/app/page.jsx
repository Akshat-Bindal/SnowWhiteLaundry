"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined") {
      router.replace("/auth-1/sign-in");
      return;
    }

    // ✅ Validate token
    fetch("https://snowwhite-admin.onrender.com/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then(() => router.replace("/dashboard"))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        router.replace("/auth-1/sign-in");
      })
      .finally(() => setChecking(false));
  }, [router]);

  if (checking) return <p className="text-center mt-5">Checking session...</p>;
  return null;
}
