// ProductsPage.js
"use client";

import { useState, useRef } from "react";
import { Button, Col, Pagination, Row } from "react-bootstrap";
import {
  LuChevronLeft,
  LuChevronRight,
  LuLayoutGrid,
  LuList,
  LuMenu,
  LuPlus,
} from "react-icons/lu";

import Products from "./Products";

const ProductsPage = () => {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  // 🔵 Ref to trigger "Add Product"
  const productsRef = useRef(null);

  const handleAddProduct = () => {
    if (productsRef.current) {
      productsRef.current.addNewProduct(); // call child function
    }
  };

  return (
    <>
      <Row className="mb-2">
        <Col lg={12}>
          <div className="bg-light-subtle rounded border p-3">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              {/* Mobile menu toggle */}
              <div className="d-lg-none">
                <Button
                  variant="light"
                  className="btn-icon"
                  onClick={() => setIsOffcanvasOpen(true)}
                >
                  <LuMenu className="fs-lg" />
                </Button>
              </div>

              {/* Page title */}
              <h3 className="mb-0 fs-xl flex-grow-1">
                Washing Tons Dry Clean Product
              </h3>

              {/* Action buttons */}
              <div className="d-flex gap-1">
                <Button variant="primary" className="btn-primary btn-icon">
                  <LuLayoutGrid className="fs-lg" />
                </Button>
                <Button
                  href="/products"
                  variant="primary"
                  className="btn-soft-primary btn-icon"
                >
                  <LuList className="fs-lg" />
                </Button>
                <Button
                  variant="danger"
                  className="ms-1"
                  onClick={handleAddProduct} // ✅ trigger add
                >
                  <LuPlus className="fs-sm me-2" /> Add Product
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Products grid */}
      <Row className="g-2">
        <Products ref={productsRef} /> {/* ✅ attach ref */}

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
          <Pagination className="pagination-boxed justify-content-center mb-0">
            <Pagination.Prev disabled>
              <LuChevronLeft />
            </Pagination.Prev>
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Item>{4}</Pagination.Item>
            <Pagination.Item>{5}</Pagination.Item>
            <Pagination.Ellipsis />
            <Pagination.Item>{20}</Pagination.Item>
            <Pagination.Next>
              <LuChevronRight />
            </Pagination.Next>
          </Pagination>
        </div>
      </Row>
    </>
  );
};

export default ProductsPage;
