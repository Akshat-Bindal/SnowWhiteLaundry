"use client";

import { Container } from "react-bootstrap";
import Page from "@/app/(admin)/(apps)/(support-center)/tickets-list/page";
import withAuth from "@/components/withAuth";

const DashboardPage = () => {
  return (
    <Container fluid>
      <Page />
    </Container>
  );
};

export default withAuth(DashboardPage);
