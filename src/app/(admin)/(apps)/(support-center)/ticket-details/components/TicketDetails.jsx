"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Badge,
  Spinner,
} from "react-bootstrap";

const TicketDetailsPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");// get invoice id from URL
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔵 Fetch invoice details by ID
  useEffect(() => {
    if (!id) return;

    fetch(`https://snowwhite-admin.onrender.com/api/invoices/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInvoice(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching invoice:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" /> Loading invoice details...
      </div>
    );
  }

  if (!invoice) {
    return <p className="text-center text-danger mt-5">Invoice not found.</p>;
  }

  return (
    <Col xxl={10} className="mx-auto">
      <Card className="mb-4">
        <CardHeader>
          <h4 className="mb-0">
            Invoice #{invoice._id.slice(-6).toUpperCase()}{" "}
            <Badge bg="warning" className="ms-2">
              {invoice.status}
            </Badge>
          </h4>
        </CardHeader>

        <CardBody>
          {/* Customer Info */}
          <Row className="mb-4">
            <Col md={4}>
              <h6 className="text-uppercase text-muted">Customer</h6>
              <p className="mb-0 fw-semibold">{invoice.customerName}</p>
            </Col>
            <Col md={4}>
              <h6 className="text-uppercase text-muted">Phone</h6>
              <p className="mb-0">{invoice.customerPhone}</p>
            </Col>
            <Col md={4}>
              <h6 className="text-uppercase text-muted">Address</h6>
              <p className="mb-0">{invoice.customerAddress || "N/A"}</p>
            </Col>
          </Row>

          {/* Dates */}
          <Row className="mb-4">
            <Col md={6}>
              <h6 className="text-uppercase text-muted">Order Date</h6>
              <p className="mb-0">
                {new Date(invoice.orderDate).toLocaleDateString()}
              </p>
            </Col>
            <Col md={6}>
              <h6 className="text-uppercase text-muted">Delivery Date</h6>
              <p className="mb-0">
                {new Date(invoice.deliveryDate).toLocaleDateString()}
              </p>
            </Col>
          </Row>

          {/* Items Table */}
          {invoice.items && invoice.items.length > 0 && (
            <>
              <h6 className="text-uppercase text-muted mb-2">Items</h6>
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>Laundry Type</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>
                      <td>{item.description}</td>
                      <td>{item.laundryType}</td>
                      <td>{item.qty}</td>
                      <td>₹{item.price}</td>
                      <td>₹{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          {/* Totals */}
          <Row className="justify-content-end">
            <Col md={4}>
              <Table borderless>
                <tbody>
                  <tr>
                    <td className="text-end">Subtotal:</td>
                    <td>₹{invoice.subtotal || 0}</td>
                  </tr>
                  <tr>
                    <td className="text-end">Tax:</td>
                    <td>₹{invoice.tax || 0}</td>
                  </tr>
                  <tr>
                    <td className="text-end">Discount:</td>
                    <td>₹{invoice.discount || 0}</td>
                  </tr>
                  <tr className="fw-bold">
                    <td className="text-end">Total:</td>
                    <td>₹{invoice.total || 0}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default TicketDetailsPage;
