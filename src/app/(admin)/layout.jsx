"use client";

import MainLayout from "@/layouts/MainLayout";
import { AuthProvider } from "@/context/AuthContext";

const Layout = ({ children }) => {
  return (
    <AuthProvider>
      <MainLayout>{children}</MainLayout>
    </AuthProvider>
  );
};

export default Layout;
