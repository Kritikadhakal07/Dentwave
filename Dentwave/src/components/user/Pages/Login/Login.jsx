import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", formData);
    // You can handle authentication here
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
