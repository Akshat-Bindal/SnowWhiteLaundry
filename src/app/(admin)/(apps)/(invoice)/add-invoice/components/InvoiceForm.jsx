"use client";
import { useState, useEffect, useRef } from "react";
import {
  Button,
  CardBody,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import {
  TbPlus,
  TbUpload,
  TbDownload,
  TbBrandWhatsapp,
} from "react-icons/tb";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logoDark from "@/assets/images/logo-black.png";
import FlatpickrClient from "@/components/client-wrapper/FlatpickrClient";
import Select from "react-select"; // 👈 for searchable dropdown

const InvoiceForm = () => {
  const invoiceRef = useRef(null);

  // ----------------- States -----------------
  const [services, setServices] = useState([]);
  const [items, setItems] = useState([
    { id: 1, description: "", laundryType: "", qty: 1, price: 0 },
  ]);

  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  const [orderDate, setOrderDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // ----------------- Fetch services -----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("⚠️ No token found in localStorage");
      return;
    }

    fetch("https://snowwhite-admin.onrender.com/api/services", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Bearer token
      },
    })
      .then(async (res) => {
        const raw = await res.text();
        let data;
        try {
          data = JSON.parse(raw);
        } catch (err) {
          console.error("❌ JSON parse failed:", err);
          return;
        }

        if (res.ok) {
          if (Array.isArray(data)) {
            setServices(data);
          } else if (Array.isArray(data.services)) {
            setServices(data.services);
          } else {
            console.error("⚠️ Unexpected data format:", data);
          }
        } else {
          console.error("❌ Server returned error:", data);
        }
      })
      .catch((err) => console.error("❌ Fetch error:", err));
  }, []);

  // ----------------- Handle Item Change -----------------
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];

    if (field === "description") {
      const selectedService = services.find((s) => s._id === value);
      if (selectedService) {
        newItems[index].description = selectedService.title;
        newItems[index].laundryType = selectedService.laundryType;
        newItems[index].price = selectedService.originalPrice;
      } else {
        newItems[index].description = "";
        newItems[index].laundryType = "";
        newItems[index].price = 0;
      }
    } else {
      newItems[index][field] = value;
    }

    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: items.length + 1, description: "", laundryType: "", qty: 1, price: 0 },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // ----------------- Totals -----------------
  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + (newSubtotal * tax) / 100 - discount);
  }, [items, tax, discount]);

  // ----------------- Save Invoice -----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      customerName,
      customerPhone,
      customerAddress,
      orderDate,
      deliveryDate,
      items: items.map((item) => ({
        description: item.description,
        laundryType: item.laundryType,
        qty: item.qty,
        price: item.price,
        amount: item.qty * item.price,
      })),
      subtotal,
      tax,
      discount,
      total,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://snowwhite-admin.onrender.com/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save invoice");

      alert("✅ Invoice saved successfully!");
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  // ----------------- Download PDF -----------------
  const handleDownload = async () => {
    if (!invoiceRef.current) return;
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
  };

  // ----------------- WhatsApp -----------------
  const handleSendWhatsApp = () => {
    const phoneNumber = customerPhone || "919782311214";
    const message = `Hello ${customerName}, here is your bill. Total Amount: ₹${total}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // ----------------- Render -----------------
  return (
    <Form ref={invoiceRef} onSubmit={handleSubmit}>
      <CardBody className="p-4">
        {/* Header */}
        <Row className="align-items-start mb-4">
          <Col md={6}>
            <div className="d-flex align-items-center mb-2">
              <img src={logoDark.src} alt="Company Logo" height="50" />
            </div>
            <p className="mb-1 fw-bold">Snow White Laundry Service</p>
            <p className="mb-1">
              80/156, Kumbha Marg, Sanganer, Sector 8, Pratap Nagar, Jaipur, Rajasthan 302033
            </p>
            <p className="mb-0">📞 +91 97823 11214</p>
          </Col>
          <Col md={6} className="text-end">
            <Row className="g-2 justify-content-end">
              <Col md={6}>
                <FormGroup>
                  <FormLabel>Order Date</FormLabel>
                  <FlatpickrClient
                    className="form-control"
                    value={orderDate}
                    onChange={(date) => setOrderDate(date[0])}
                    placeholder="Select Date"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <FormLabel>Delivery Date</FormLabel>
                  <FlatpickrClient
                    className="form-control"
                    value={deliveryDate}
                    onChange={(date) => setDeliveryDate(date[0])}
                    placeholder="Select Date"
                  />
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Customer Details */}
        <Row className="align-items-center mb-2">
          <Col md={4}>
            <FormLabel>Customer Name</FormLabel>
            <FormControl
              type="text"
              placeholder="Enter Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <FormLabel>Customer Address</FormLabel>
            <FormControl
              type="text"
              placeholder="Enter Address"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <FormLabel>Phone Number</FormLabel>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="Enter Phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* Items Table */}
        <Table responsive bordered className="table-nowrap text-center align-middle mt-2">
          <thead className="bg-light align-middle bg-opacity-25 thead-sm">
            <tr className="text-uppercase fs-xxs">
              <th>#</th>
              <th className="text-start">Item Description</th>
              <th>Laundry Type</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                {/* 👇 Searchable Dropdown */}
                <td>
  <Select
    options={services.map((s) => ({
      value: s._id,
      label: `${s.title} (${s.laundryType}) - ₹${s.originalPrice}`,
    }))}
    value={
      services.find((s) => s.title === item.description)
        ? {
            value: services.find((s) => s.title === item.description)._id,
            label: `${item.description} (${item.laundryType}) - ₹${item.price}`,
          }
        : null
    }
    onChange={(selected) =>
      handleItemChange(index, "description", selected ? selected.value : "")
    }
    placeholder="Select or search item..."
    isClearable
    styles={{
      menu: (provided) => ({
        ...provided,
        zIndex: 9999, // 👈 ensures it appears above everything
        position: "absolute",
      }),
      menuPortal: (provided) => ({
        ...provided,
        zIndex: 9999,
      }),
    }}
    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
  />
</td>

                <td>
                  <FormControl type="text" value={item.laundryType} readOnly />
                </td>
                <td>
                  <FormControl
                    type="number"
                    value={item.qty}
                    onChange={(e) => handleItemChange(index, "qty", Number(e.target.value))}
                  />
                </td>
                <td>
                  <FormControl type="number" value={item.price} readOnly />
                </td>
                <td>
                  <FormControl type="number" value={item.qty * item.price} readOnly />
                </td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => removeItem(index)}>×</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="primary" className="mt-1 mb-2" onClick={addItem}>
          <TbPlus /> Add Item
        </Button>

        {/* Totals */}
        <Row className="justify-content-end mt-2">
          <Col md={4}>
            <Table borderless>
              <tbody>
                <tr>
                  <td className="text-end">Subtotal</td>
                  <td><FormControl type="number" value={subtotal} readOnly /></td>
                </tr>
                <tr>
                  <td className="text-end">Tax (%)</td>
                  <td>
                    <FormControl
                      type="number"
                      value={tax}
                      onChange={(e) => setTax(Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-end">Discount</td>
                  <td>
                    <FormControl
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                  </td>
                </tr>
                <tr className="fw-bold">
                  <td className="text-end">Total</td>
                  <td><FormControl type="number" value={total} readOnly /></td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* Action Buttons */}
        <div className="mt-3 d-flex gap-2">
          <Button type="submit" variant="primary"><TbUpload /> Save</Button>
          <Button variant="success" onClick={handleDownload}><TbDownload /> Download PDF</Button>
          <Button variant="success" onClick={handleSendWhatsApp}><TbBrandWhatsapp /> WhatsApp</Button>
        </div>
      </CardBody>
    </Form>
  );
};

export default InvoiceForm;
