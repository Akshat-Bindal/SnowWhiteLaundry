"use client";

import { Col, Container, Row, Card } from "react-bootstrap";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import dynamic from "next/dynamic";

// 👇 Load InvoiceForm only on client
const InvoiceForm = dynamic(() => import("./components/InvoiceForm"), {
  ssr: false,
});

const Page = () => {
  return (
    <Container fluid>
      <PageBreadcrumb title="Create Invoice" subtitle="Invoices" />
      <Row className="justify-content-center">
        <Col xxl={12}>
          <Row>
            <Col xl={9}>
              <Card>
                <InvoiceForm />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
