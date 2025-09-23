"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Button, Card, CardBody, Col, Container, Row, Table } from "react-bootstrap";
import { TbDownload, TbPencil, TbPrinter, TbSend } from "react-icons/tb";
import logoDark from "@/assets/images/logo-black.png";
import logoLight from "@/assets/images/logo.png";
import Image from "next/image";
import Link from "next/link";
import { currency } from "@/helpers";

const Page = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://snowwhite-admin.onrender.com/api/invoices/${invoiceId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (res.ok) setInvoice(data);
        else console.error("❌ Fetch error:", data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  if (loading) return <p>Loading invoice...</p>;
  if (!invoice) return <p>Invoice not found</p>;

  return (
    <Container fluid>
      <PageBreadcrumb title="Invoice Details" subtitle="Invoices" />

      <Row className="justify-content-center">
        <Col xxl={12}>
          <Row>
            <Col xl={9}>
              <Card>
                <CardBody className="px-4">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                    <div className="auth-brand mb-0">
                      <Link href="/" className="logo-dark">
                        <Image src={logoDark} alt="dark logo" height={24} width={103} />
                      </Link>
                      <Link href="/" className="logo-light">
                        <Image src={logoLight} alt="logo" height={24} width={103} />
                      </Link>
                    </div>
                    <div className="text-end">
                      <h4 className="fw-bold text-dark m-0">
                        Invoice #{invoice._id.slice(-6)}
                      </h4>
                    </div>
                  </div>

                  <Row>
                    <Col cols={4}>
                      <h6 className="text-uppercase text-muted mb-2">From</h6>
                      <p className="mb-1 fw-semibold">Snow White Laundry</p>
                      <p className="text-muted mb-1">
                        80/156, Kumbha Marg, Pratap Nagar, Jaipur
                      </p>
                      <p className="text-muted mb-0">Phone: 9782311214</p>
                      <div className="mt-4">
                        <h6 className="text-uppercase text-muted">Pickup Date</h6>
                        <p className="mb-0 fw-medium">{invoice.orderDate}</p>
                      </div>
                    </Col>

                    <Col cols={4}>
                      <h6 className="text-uppercase text-muted mb-2">To</h6>
                      <p className="mb-1 fw-semibold">{invoice.customerName}</p>
                      <p className="text-muted mb-1">{invoice.customerAddress}</p>
                      <p className="text-muted mb-0">
                        Phone: {invoice.customerPhone}
                      </p>
                      <div className="mt-4">
                        <h6 className="text-uppercase text-muted">Deliver Date</h6>
                        <p className="mb-0 fw-medium">{invoice.deliveryDate}</p>
                      </div>
                    </Col>
                  </Row>

                  <Table responsive bordered className="table-nowrap text-center align-middle mt-4">
                    <thead className="bg-light align-middle bg-opacity-25 thead-sm">
                      <tr className="text-uppercase fs-xxs">
                        <th>S.no.</th>
                        <th className="text-start">Product</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td className="text-start">{item.description} ({item.laundryType})</td>
                          <td>{item.qty}</td>
                          <td>{currency}{item.price}</td>
                          <td>{currency}{item.qty * item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div className="d-flex justify-content-end">
                    <table className="table w-auto table-borderless text-end">
                      <tbody>
                        <tr>
                          <td className="fw-medium">Subtotal</td>
                          <td>{currency}{invoice.subtotal}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">Discount</td>
                          <td>- {currency}{invoice.discount}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">Tax</td>
                          <td>{currency}{invoice.tax}</td>
                        </tr>
                        <tr className="border-top pt-2 fs-5 fw-bold">
                          <td>Total</td>
                          <td>{currency}{invoice.total}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={3}>
              <Card className="card-top-sticky">
                <CardBody>
                  <div className="d-flex flex-column gap-2">
                    <Button variant="light"><TbPencil /> Edit</Button>
                    <Button variant="primary"><TbPrinter /> Print</Button>
                    <Button variant="info"><TbDownload /> Download</Button>
                    <Button variant="danger" size="lg"><TbSend /> Send</Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
