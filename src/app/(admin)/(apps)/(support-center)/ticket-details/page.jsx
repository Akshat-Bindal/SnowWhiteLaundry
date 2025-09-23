"use client";

import PageBreadcrumb from '@/components/PageBreadcrumb';
import React, { Suspense } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import TicketDetails from './components/TicketDetails';

const Page = () => {
  return (
    <Container fluid>
      <PageBreadcrumb title="Order Details" subtitle="Support" />
      <Row>
        <Suspense fallback={<p>Loading ticket details...</p>}>
          <TicketDetails />
        </Suspense>
      </Row>
    </Container>
  );
};

export default Page;
