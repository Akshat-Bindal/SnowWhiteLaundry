"use client";

import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect
} from "react";
import { Button, Form, Table, Spinner } from "react-bootstrap";
import { TbTrash, TbPlus, TbDeviceFloppy } from "react-icons/tb";

const Products = forwardRef((props, ref) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 🔵 Fetch all products
  useEffect(() => {
    if (!token) return;
    fetch("https://snowwhite-admin.onrender.com/api/services", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.services)) {
          setProducts(data.services);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  // 🔵 Add new blank product row
  const addNewProduct = () => {
    const newProduct = {
      _id: Date.now().toString(), // temporary ID
      title: "New Product",
      originalPrice: "",
      laundryType: "",
      isNew: true
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  // 🔵 Save product to API (POST for new, PUT for existing)
  const handleSave = async (product) => {
    try {
      const url = product.isNew
        ? "https://snowwhite-admin.onrender.com/api/services"
        : `https://snowwhite-admin.onrender.com/api/services/${product._id}`;

      const method = product.isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: product.title,
          laundryType: product.laundryType,
          originalPrice: Number(product.originalPrice)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed");

      alert("✅ Product saved successfully");

      // refresh products
      fetch("https://snowwhite-admin.onrender.com/api/services", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => setProducts(Array.isArray(data) ? data : []));
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Error saving product");
    }
  };

  // 🔵 Delete product from API
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(
        `https://snowwhite-admin.onrender.com/api/services/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      alert("✅ Product deleted");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Error deleting product");
    }
  };

  // ✅ Expose add function to parent (ProductsPage)
  useImperativeHandle(ref, () => ({
    addNewProduct
  }));

  if (loading) return <Spinner animation="border" />;

  return (
    <Table striped bordered hover responsive className="align-middle">
      <thead className="table-light">
        <tr>
          <th>#</th>
          <th>Product Title</th>
          <th>Rate</th>
          <th>Laundry Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={product._id}>
            <td>{index + 1}</td>

            {/* Title */}
            <td>
              <Form.Control
                type="text"
                value={product.title}
                onChange={(e) =>
                  setProducts((prev) =>
                    prev.map((p) =>
                      p._id === product._id
                        ? { ...p, title: e.target.value }
                        : p
                    )
                  )
                }
              />
            </td>

            {/* Price */}
            <td>
              <Form.Control
                type="number"
                value={product.originalPrice}
                onChange={(e) =>
                  setProducts((prev) =>
                    prev.map((p) =>
                      p._id === product._id
                        ? { ...p, originalPrice: e.target.value }
                        : p
                    )
                  )
                }
              />
            </td>

            {/* Laundry Type */}
            <td>
              <Form.Select
                value={product.laundryType}
                onChange={(e) =>
                  setProducts((prev) =>
                    prev.map((p) =>
                      p._id === product._id
                        ? { ...p, laundryType: e.target.value }
                        : p
                    )
                  )
                }
              >
                <option value="">Select</option>
                <option value="Wash">Wash</option>
                <option value="Iron">Iron</option>
                <option value="Dry">Dry</option>
                <option value="Wash & Iron">Wash & Iron</option>
              </Form.Select>
            </td>

            {/* Actions */}
            <td className="d-flex gap-2">
              <Button
                size="sm"
                variant="success"
                onClick={() => handleSave(product)}
              >
                <TbDeviceFloppy /> Save
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(product._id)}
              >
                <TbTrash /> Delete
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={addNewProduct}
              >
                <TbPlus /> Add
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
});

export default Products;
