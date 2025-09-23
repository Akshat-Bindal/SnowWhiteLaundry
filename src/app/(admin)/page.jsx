import { redirect } from "next/navigation";

export default function AdminHome() {
  redirect("/tickets-list");  // Orders List page
}