// src/app/edit-order/page.jsx
"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader, Col, Row, Form, Button } from "react-bootstrap";

const EditOrder = () => {
  const [formData, setFormData] = useState({
    customerName: "Vikram Saini",
    priority: "High",
    pickupDate: "2025-08-05T13:20",
    deliveryDate: "2025-08-09",
    address: "Q.no. 334 Rajasthan Police Academy Shastri Nagar, Jaipur"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Order:", formData);
    alert("Order updated successfully!");
  };

  return (
    <Col xxl={8}>
      <Card>
        <CardHeader>
          <h5 className="mb-0">Edit Order</h5>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option>Same Day Delivery </option>
                    <option>Next Day Delivery </option>
                    <option>Regular</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Pickup Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Delivery Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
              <Button href="/tickets-list" variant="secondary">
                Cancel
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Col>
  );
};

export default EditOrder;
