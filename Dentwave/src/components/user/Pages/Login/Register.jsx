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
    setErrors({ ...errors, [e.target.name]: null }); // clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: ["Passwords do not match"] });
      return;
    }

    // Prepare payload for backend
    const payload = {
  name: formData.name,
  email: formData.email,
  password: formData.password,
  password_confirmation: formData.confirmPassword, // ✅ REQUIRED
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
        // Redirect after 1 second (optional)
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        // Show validation errors from backend
        setErrors(data.errors || {});
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Something went wrong. Please try again.");
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
              <h5 className="fw-bold mt-2">Create an Account</h5>
              <p className="text-muted small">
                Sign up to manage your appointments and access personalized dental care.
              </p>
            </div>

            <Form onSubmit={handleSubmit}>
              {/* Name */}
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaUser />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="John Doe"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.name && <small className="text-danger">{errors.name[0]}</small>}
              </Form.Group>

              {/* Email */}
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaEnvelope />
                  </span>
                  <Form.Control
                    type="email"
                    placeholder="john@example.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.email && <small className="text-danger">{errors.email[0]}</small>}
              </Form.Group>

              {/* Phone */}
              <Form.Group controlId="formPhone" className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaPhone />
                  </span>
                  <Form.Control
                    type="tel"
                    placeholder="+977 98XXXXXXXX"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.phone && <small className="text-danger">{errors.phone[0]}</small>}
              </Form.Group>

              {/* Gender */}
              <Form.Group controlId="formGender" className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Select>
                {errors.gender && <small className="text-danger">{errors.gender[0]}</small>}
              </Form.Group>

              {/* Password */}
              <Form.Group controlId="formPassword" className="mb-3">
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
                {errors.password && <small className="text-danger">{errors.password[0]}</small>}
              </Form.Group>

              {/* Confirm Password */}
              <Form.Group controlId="formConfirmPassword" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaLock />
                  </span>
                  <Form.Control
                    type="password"
                    placeholder="••••••"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <small className="text-danger">{errors.confirmPassword[0]}</small>
                )}
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                style={{ backgroundColor: "#0056d2", border: "none" }}
              >
                Register
              </Button>

              {message && <p className="text-center mt-2 text-success">{message}</p>}

              <div className="text-center mt-3">
                <small>
                  Already have an account?{" "}
                  <a href="/login" className="text-decoration-none text-primary">
                    Login
                  </a>
                </small>
              </div>
            </Form>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default Register;
