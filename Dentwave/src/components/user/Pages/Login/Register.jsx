import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: ["Passwords do not match"] });
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      phone: formData.phone,
      gender: formData.gender,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
        setTimeout(() => { window.location.href = "/login"; }, 1000);
      } else {
        setErrors(data.errors || {});
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@600&display=swap');

        .register-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #e8f0fe 0%, #f0f7ff 40%, #ddeeff 100%);
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 3rem 1rem;
        }

        .register-root::before {
          content: '';
          position: absolute;
          width: 520px; height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,150,255,0.13) 0%, transparent 70%);
          top: -120px; left: -160px;
          pointer-events: none;
        }

        .register-root::after {
          content: '';
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(100,180,255,0.11) 0%, transparent 70%);
          bottom: -100px; right: -80px;
          pointer-events: none;
        }

        .register-card {
          width: 100%;
          max-width: 500px;
          border-radius: 20px !important;
          border: none !important;
          background: #ffffff !important;
          padding: 2.8rem 3rem !important;
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
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .brand-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          color: #0a6ce4;
          letter-spacing: -0.3px;
        }

        .brand-dot {
          display: inline-block;
          width: 7px; height: 7px;
          background: #0a6ce4;
          border-radius: 50%;
          margin-right: 6px;
          vertical-align: middle;
          position: relative;
          top: -2px;
        }

        .register-card h5 {
          font-size: 1.25rem;
          color: #111827;
          font-weight: 600;
          letter-spacing: -0.2px;
        }

        .subtitle {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e5eeff, transparent);
          margin: 1.2rem 0 1.8rem;
        }

        .form-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          margin-bottom: 7px;
        }

        /* Each field gets generous bottom margin */
        .field-wrap {
          margin-bottom: 1.35rem;
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
          font-size: 0.88rem;
        }

        .form-control {
          border: none !important;
          background: #f8faff !important;
          color: #1a1a2e;
          font-size: 0.92rem;
          padding: 0.7rem 0.85rem;
          box-shadow: none !important;
          font-family: 'DM Sans', sans-serif;
        }

        .form-control::placeholder { color: #aab4c8; }
        .form-control:focus { background: #f0f6ff !important; }

        .form-select {
          border: none !important;
          background: #f8faff !important;
          color: #1a1a2e;
          font-size: 0.92rem;
          padding: 0.7rem 0.85rem;
          border-radius: 10px !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px #e5eaf3 !important;
          font-family: 'DM Sans', sans-serif;
          transition: box-shadow 0.2s ease;
          cursor: pointer;
        }

        .form-select:focus {
          background: #f0f6ff !important;
          box-shadow:
            0 2px 8px rgba(0, 86, 210, 0.12),
            0 0 0 2px rgba(0, 86, 210, 0.22) !important;
        }

        /* Only Phone + Gender sit side by side */
        .row-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 1rem;
        }

        .field-error {
          font-size: 0.775rem;
          color: #b91c1c;
          margin-top: 5px;
          display: block;
        }

        .btn-register {
          background: linear-gradient(135deg, #0a6ce4 0%, #0047b3 100%) !important;
          border: none !important;
          border-radius: 10px !important;
          padding: 0.72rem !important;
          font-size: 0.95rem !important;
          font-weight: 600 !important;
          letter-spacing: 0.3px;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 14px rgba(0, 86, 210, 0.35), 0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
          margin-top: 0.4rem;
        }

        .btn-register:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 86, 210, 0.4), 0 2px 6px rgba(0,0,0,0.12);
          filter: brightness(1.05);
        }

        .btn-register:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 3px 10px rgba(0, 86, 210, 0.3);
        }

        .login-link {
          color: #0a6ce4;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.15s;
        }
        .login-link:hover { color: #0047b3; text-decoration: underline; }

        .success-msg {
          text-align: center;
          color: #15803d;
          font-size: 0.875rem;
          font-weight: 500;
          margin-top: 0.9rem;
          padding: 0.55rem 1rem;
          background: #f0fdf4;
          border-radius: 8px;
          border: 1px solid #bbf7d0;
        }
      `}</style>

      <div className="register-root">
        <Container className="d-flex justify-content-center align-items-center">
          <Card className="register-card">

            {/* Brand */}
            <div className="text-center mb-1">
              <div className="brand-title">
                <span className="brand-dot"></span>Dentwave
              </div>
            </div>

            <div className="divider" />

            <div className="text-center mb-4">
              <h5>Create an Account</h5>
              <p className="subtitle mt-1 mb-0">
                Sign up to manage your appointments and access personalized dental care.
              </p>
            </div>

            <Form onSubmit={handleSubmit}>

              {/* Full Name */}
              <div className="field-wrap">
                <Form.Label>Full Name</Form.Label>
                <div className="input-group">
                  <span className="input-group-text"><FaUser /></span>
                  <Form.Control
                    type="text"
                    placeholder="John Doe"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.name && <span className="field-error">{errors.name[0]}</span>}
              </div>

              {/* Email */}
              <div className="field-wrap">
                <Form.Label>Email</Form.Label>
                <div className="input-group">
                  <span className="input-group-text"><FaEnvelope /></span>
                  <Form.Control
                    type="email"
                    placeholder="john@example.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.email && <span className="field-error">{errors.email[0]}</span>}
              </div>

              {/* Phone + Gender side by side */}
              <div className="row-two">
                <div className="field-wrap">
                  <Form.Label>Phone</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text"><FaPhone /></span>
                    <Form.Control
                      type="tel"
                      placeholder="+977 98XXXXXXXX"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {errors.phone && <span className="field-error">{errors.phone[0]}</span>}
                </div>

                <div className="field-wrap">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                  {errors.gender && <span className="field-error">{errors.gender[0]}</span>}
                </div>
              </div>

              {/* Password */}
              <div className="field-wrap">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text"><FaLock /></span>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.password && <span className="field-error">{errors.password[0]}</span>}
              </div>

              {/* Confirm Password */}
              <div className="field-wrap">
                <Form.Label>Confirm Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text"><FaLock /></span>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <span className="field-error">{errors.confirmPassword[0]}</span>
                )}
              </div>

              <Button type="submit" className="w-100 btn-register">
                Create Account
              </Button>

              {message && <div className="success-msg">{message}</div>}

              <div className="text-center mt-4">
                <p className="subtitle mb-0">
                  Already have an account?{" "}
                  <a href="/login" className="login-link">Login</a>
                </p>
              </div>

            </Form>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default Register;