"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function withAuth(Component) {
  return function ProtectedComponent(props) {
    const router = useRouter();
    const { token } = useAuth();

    useEffect(() => {
      if (token === null) {
        router.replace("/auth-1/sign-in");
      }
    }, [token, router]);

    if (token === null) {
      return <p className="text-center mt-5">Checking authentication...</p>;
    }

    return <Component {...props} />;
  };
}
