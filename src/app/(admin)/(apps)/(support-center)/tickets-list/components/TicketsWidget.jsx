"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "react-bootstrap";
import CountUp from "react-countup";
import {
  TbCheck,
  TbHourglass,
  TbMoneybag,
  TbMoodBoy,
  TbTicket,
  TbWashHand,
  TbWashPress,
  TbWashDry3,
} from "react-icons/tb";

const TicketsWidget = () => {
  const [summary, setSummary] = useState(null); // ✅ no <any>
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("https://snowwhite-admin.onrender.com/api/analytics");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!summary) return <p>No data available</p>;

  const ticketsData = [
    {
      id: 1,
      title: "Total Orders",
      value: summary.totalOrders,
      icon: <TbTicket />,
      bgColor: "bg-primary-subtle",
      textColor: "text-primary",
    },
    {
      id: 2,
      title: "Delivered Orders",
      value: summary.deliveredOrders,
      icon: <TbCheck />,
      bgColor: "bg-success-subtle",
      textColor: "text-success",
    },
    {
      id: 3,
      title: "Pending Orders",
      value: summary.pendingOrders,
      icon: <TbHourglass />,
      bgColor: "bg-info-subtle",
      textColor: "text-info",
    },
    {
      id: 4,
      title: "Total Revenue",
      value: summary.totalRevenue,
      icon: <TbMoneybag />,
      bgColor: "bg-danger-subtle",
      textColor: "text-danger",
    },
    {
      id: 5,
      title: "Total Customers",
      value: summary.totalCustomers,
      icon: <TbMoodBoy />,
      bgColor: "bg-warning-subtle",
      textColor: "text-warning",
    },
    {
      id: 6,
      title: "Total Wash & Fold",
      value: summary.washAndFoldOrders,
      icon: <TbWashHand />,
      bgColor: "bg-danger-subtle",
      textColor: "text-success",
    },
    {
      id: 7,
      title: "Total Wash & Iron",
      value: summary.washAndIronOrders,
      icon: <TbWashPress />,
      bgColor: "bg-danger-subtle",
      textColor: "text-info",
    },
    {
      id: 8,
      title: "Total Dry Clean",
      value: summary.dryCleanOrders,
      icon: <TbWashDry3 />,
      bgColor: "bg-danger-subtle",
      textColor: "text-danger",
    },
  ];

  return (
    <Row className="row-cols-xxl-4 row-cols-md-2 row-cols-1">
      {ticketsData.map((ticket) => (
        <Col key={ticket.id}>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div className="avatar fs-60 avatar-img-size flex-shrink-0">
                  <span
                    className={`avatar-title ${ticket.bgColor} ${ticket.textColor} rounded-circle fs-24`}
                  >
                    {ticket.icon}
                  </span>
                </div>
                <div className="text-end">
                  <h3 className="mb-2 fw-normal">
                    <CountUp end={ticket.value} duration={2} />
                  </h3>
                  <p className="mb-0 text-muted">
                    <span>{ticket.title}</span>
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TicketsWidget;
