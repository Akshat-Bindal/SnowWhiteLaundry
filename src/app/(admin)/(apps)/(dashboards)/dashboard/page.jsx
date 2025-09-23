"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "react-bootstrap";
import Page from "@/app/(admin)/(apps)/(support-center)/tickets-list/page";

const DashboardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // 🚀 Redirect to sign in if no token
      router.replace("/auth-1/signin");
    } else {
      setLoading(false); // show dashboard if token exists
    }
  }, [router]);

  if (loading) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  return (
    <Container fluid>
      <Page />
    </Container>
  );
};

export default DashboardPage;
