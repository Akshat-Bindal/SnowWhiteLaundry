// app/(admin)/page.jsx
import { redirect } from "next/navigation";

export default function AdminHome() {
  redirect("/dashboard"); // ✅ server-side redirect
}

