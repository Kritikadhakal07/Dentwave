import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // If Laravel returns a 500 or 422, throw an error to catch block
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Login failed");
      }

      const data = await res.json();

      // Store token in localStorage (or cookies) for later API calls
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_role", data.user.role);

      // Redirect based on role
      switch (data.user.role) {
        case "admin":
          window.location.href = "../../../admin/pages/Adminboard";
          break;
        case "doctor":
          window.location.href = "../../../doctor/pages/doctorboard";
          break;
        case "user":
          window.location.href = "/";
          break;
        default:
          window.location.href = "/";
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
    <div
      style={{
        background: "linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)",
        height: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container className="d-flex justify-content-center">
        <Card
          className="shadow-sm p-4"
          style={{
            width: "600px",
            
            borderRadius: "10px",
            border: "none",
          }}
        >
          <div className="text-center mb-4">
            <h4 className="fw-bold" style={{ color: "#0096ff" }}>
              ✦ Dentwave
            </h4>
            <h5 className="fw-bold mt-2">Welcome Back!</h5>
            <p className="text-muted small">
              Log in to manage your appointments and access personalized dental
              care.
            </p>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaEnvelope />
                </span>
                <Form.Control
                  type="email"
                  placeholder="ram@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-2">
              <Form.Label>Password</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaLock />
                </span>
                <Form.Control
                  type="password"
                  placeholder="••••••"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </Form.Group>

            <div className="text-end mb-3">
              <a href="#" className="text-decoration-none small text-primary">
                Forgot password?
              </a>
            </div>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              style={{ backgroundColor: "#0056d2", border: "none" }}
            >
              Login
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
    </>
  );
};

export default Login;
