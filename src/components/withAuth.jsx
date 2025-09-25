"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function withAuth(Component) {
  return function ProtectedComponent(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token || token === "undefined") {
        router.replace("/auth-1/sign-in"); // ✅ always the correct path
      } else {
        setLoading(false);
      }
    }, [router]);

    if (loading) {
      return <p className="text-center mt-5">Checking authentication...</p>;
    }

    return <Component {...props} />;
  };
}
