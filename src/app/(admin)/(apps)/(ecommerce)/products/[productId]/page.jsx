"use client";

import { Card, CardBody, Col, Container, Row } from "react-bootstrap";
import ProductDisplay from "@/app/(admin)/(apps)/(ecommerce)/products/[productId]/components/ProductDisplay";
import PageBreadcrumb from "@/components/PageBreadcrumb";

// ✅ Force static — prevent Next from trying to SSR
export const dynamic = "force-static";

const Page = () => {
  return (
    <Container fluid>
      <PageBreadcrumb title="Product Details" subtitle="Ecommerce" />

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <Row>
                {/* 👇 Your product UI (should fetch client-side inside ProductDisplay) */}
                <ProductDisplay />

                <Col xl={8}>
                  <div className="p-4">
                    {/* If you want details, import ProductDetails here as a client component */}
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
