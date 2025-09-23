"use client";

import Cookies from "js-cookie"; // ✅ we'll use this
import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLogo from "@/components/AppLogo";
import { currentYear } from "@/helpers";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  FormLabel,
  Row,
} from "react-bootstrap";

const SignInPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        "https://snowwhite-admin.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }), // adjust if backend expects email
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Save token & admin info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));

      // ✅ Also save token in a cookie (important for middleware)
      Cookies.set("token", data.token, { expires: 7, secure: true }); // 7 days, HTTPS only

      // ✅ Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="auth-box overflow-hidden align-items-center d-flex"
      style={{ minHeight: "100vh" }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xxl={4} md={6} sm={8}>
            <Card className="p-4">
              {/* Logo + Subtitle */}
              <div className="auth-brand text-center mb-4">
                <AppLogo />
                <p className="text-muted w-lg-75 mt-3 mx-auto">
                  Let’s get you signed in. Enter your username and password to
                  continue.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-danger text-center fw-semibold">{error}</p>
              )}

              {/* Form */}
              <Form onSubmit={handleSubmit}>
                <div className="mb-3 form-group">
                  <FormLabel>
                    Username <span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Enter your username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="mb-3 form-group">
                  <FormLabel>
                    Password <span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input form-check-input-light fs-14"
                      type="checkbox"
                      id="rememberMe"
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Keep me signed in
                    </label>
                  </div>
                </div>

                <div className="d-grid">
                  <Button
                    type="submit"
                    className="btn-primary fw-semibold py-2"
                  >
                    Sign In
                  </Button>
                </div>
              </Form>
            </Card>

            <p className="text-center text-muted mt-4 mb-0">
              © {currentYear} Snow White — by{" "}
              <span className="fw-semibold">AfforDwell</span>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignInPage;
