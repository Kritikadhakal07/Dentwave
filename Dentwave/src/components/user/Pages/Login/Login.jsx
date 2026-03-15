import React, { useState } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      if (!res.ok) throw new Error(data.message || "Login failed");
      login(data.user, data.token);
      if (data.user.role === "admin") navigate("/admindashboard");
      else if (data.user.role === "doctor") navigate("/doctordashboard");
      else navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600&display=swap');

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #e8f0fe 0%, #f0f7ff 40%, #ddeeff 100%);
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Soft blurred decorative blobs */
        .login-root::before {
          content: '';
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,150,255,0.13) 0%, transparent 70%);
          top: -120px;
          left: -160px;
          pointer-events: none;
        }

        .login-root::after {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(100,180,255,0.11) 0%, transparent 70%);
          bottom: -100px;
          right: -80px;
          pointer-events: none;
        }

        .login-card {
          width: 100%;
          max-width: 520px;
          border-radius: 20px !important;
          border: none !important;
          background: #ffffff !important;
          padding: 2.5rem 2.8rem !important;
          box-shadow:
            0 4px 6px rgba(0, 86, 210, 0.04),
            0 12px 28px rgba(0, 86, 210, 0.10),
            0 40px 80px rgba(0, 86, 210, 0.12),
            0 0 0 1px rgba(0, 120, 255, 0.06) !important;
          position: relative;
          z-index: 1;
          animation: cardRise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes cardRise {
          from { opacity: 0; transform: translateY(28px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        .brand-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          color: #0a6ce4;
          letter-spacing: -0.3px;
        }

        .brand-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          background: #0a6ce4;
          border-radius: 50%;
          margin-right: 6px;
          vertical-align: middle;
          position: relative;
          top: -2px;
        }

        .login-card h5 {
          font-size: 1.3rem;
          color: #111827;
          font-weight: 600;
          letter-spacing: -0.2px;
        }

        .login-card .text-muted.small {
          color: #6b7280 !important;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e5eeff, transparent);
          margin: 1.2rem 0 1.5rem;
        }

        .form-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .input-group {
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px #e5eaf3;
          transition: box-shadow 0.2s ease;
        }

        .input-group:focus-within {
          box-shadow:
            0 2px 8px rgba(0, 86, 210, 0.12),
            0 0 0 2px rgba(0, 86, 210, 0.22);
        }

        .input-group-text {
          background: #f8faff !important;
          border: none !important;
          color: #0a6ce4;
          padding: 0 14px;
          font-size: 0.9rem;
        }

        .form-control {
          border: none !important;
          background: #f8faff !important;
          color: #1a1a2e;
          font-size: 0.93rem;
          padding: 0.65rem 0.85rem;
          box-shadow: none !important;
          font-family: 'DM Sans', sans-serif;
        }

        .form-control::placeholder { color: #aab4c8; }
        .form-control:focus { background: #f0f6ff !important; }

        .forgot-link {
          font-size: 0.8rem;
          color: #0a6ce4;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s;
        }
        .forgot-link:hover { color: #0047b3; text-decoration: underline; }

        .btn-login {
          background: linear-gradient(135deg, #0a6ce4 0%, #0047b3 100%) !important;
          border: none !important;
          border-radius: 10px !important;
          padding: 0.7rem !important;
          font-size: 0.95rem !important;
          font-weight: 600 !important;
          letter-spacing: 0.3px;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 14px rgba(0, 86, 210, 0.35), 0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
        }

        .btn-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 86, 210, 0.4), 0 2px 6px rgba(0,0,0,0.12);
          filter: brightness(1.05);
        }

        .btn-login:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 3px 10px rgba(0, 86, 210, 0.3);
        }

        .btn-login:disabled {
          opacity: 0.72;
          cursor: not-allowed;
        }

        .register-link {
          color: #0a6ce4;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.15s;
        }
        .register-link:hover { color: #0047b3; text-decoration: underline; }

        .alert-danger {
          border-radius: 10px;
          font-size: 0.875rem;
          border: none;
          background: #fff1f2;
          color: #b91c1c;
          padding: 0.65rem 1rem;
        }
      `}</style>

      <div className="login-root">
        <Container className="d-flex justify-content-center align-items-center">
          <Card className="login-card">

          

            <div className="divider" />

            <div className="text-center mb-4">
              <h5>Welcome Back!</h5>
              <p className="text-muted small mt-1">
                Log in to manage your appointments and access personalized dental care.
              </p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaEnvelope />
                  </span>
                  <Form.Control
                    type="email"
                    placeholder="you@example.com"
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
                  <span className="input-group-text">
                    <FaLock />
                  </span>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Form.Group>

              <div className="text-end mb-4">
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              <Button
                type="submit"
                className="w-100 btn-login"
                disabled={loading}
              >
                {loading ? "Logging in…" : "Login"}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <p className="text-muted small mb-0">
                Don't have an account?{" "}
                <a href="/register" className="register-link">Register here</a>
              </p>
            </div>

          </Card>
        </Container>
      </div>
    </>
  );
};

export default Login;