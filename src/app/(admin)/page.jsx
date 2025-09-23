// app/(admin)/page.jsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminHome() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/tickets-list"); // redirect on mount
  }, [router]);

  return null; // no UI, just redirect
}
