import React, { useState } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store user data and token using AuthContext
      login(data.user, data.token);

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admindashboard");
      } else if (data.user.role === "doctor") {
        navigate("/doctordashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
              Log in to manage your appointments and access personalized dental care.
            </p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

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
              disabled={loading}
              style={{ backgroundColor: "#0056d2", border: "none" }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <p className="text-muted small">
              Don't have an account?{" "}
              <a href="/register" className="text-primary text-decoration-none">
                Register here
              </a>
            </p>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Login;