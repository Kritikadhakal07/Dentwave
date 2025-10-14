import React, { useState } from "react";
import {
  Card,
  Button,
  Image,
  ListGroup,
  Modal,
  Form,
} from "react-bootstrap";
import { StarFill, CameraFill } from "react-bootstrap-icons";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState({
    name: "Dr. Sarah Johnson",
    specialization: "Dentist",
    experience: "8 Years",
    email: "sarah.johnson@hospital.com",
    phone: "+1 234 567 890",
    image: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
    rating: 4.8,
    reviews: 120,
    clinic: "Smile Care Dental Clinic, 123 Main St, Sunnyvale, CA",
    timings: "Mon - Sat | 10:00 AM - 6:00 PM",
  });

  const [showModal, setShowModal] = useState(false);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setDoctor({ ...doctor, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
      }}
    >
      <Card
        className="shadow-lg border-0 rounded-4 text-center"
        style={{
          maxWidth: "480px",
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <Card.Body>
          {/* Profile Image with Edit Option */}
          <div className="mb-3 position-relative d-inline-block">
            <Image
              src={doctor.image}
              alt={doctor.name}
              roundedCircle
              width="120"
              height="120"
              className="border border-3 border-primary"
            />
            <label
              htmlFor="fileUpload"
              className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1"
              style={{ cursor: "pointer" }}
            >
              <CameraFill size={18} />
            </label>
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

          <h4 className="fw-bold text-primary mb-1">{doctor.name}</h4>
          <p className="text-muted mb-1">{doctor.specialization}</p>

          <div className="d-flex justify-content-center align-items-center mb-3">
            <StarFill className="text-warning me-1" />
            <span>
              {doctor.rating} ({doctor.reviews} reviews)
            </span>
          </div>

          <ListGroup variant="flush" className="text-start px-4 mb-3">
            <ListGroup.Item>
              <strong>Experience:</strong> {doctor.experience}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Email:</strong> {doctor.email}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Phone:</strong> {doctor.phone}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Clinic:</strong> {doctor.clinic}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Timings:</strong> {doctor.timings}
            </ListGroup.Item>
          </ListGroup>

          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Edit Profile
            </Button>
            <Button variant="outline-success">Appointments</Button>
          </div>
        </Card.Body>
      </Card>

      {/* Edit Profile Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Doctor Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={doctor.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Specialization</Form.Label>
              <Form.Control
                type="text"
                name="specialization"
                value={doctor.specialization}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Experience</Form.Label>
              <Form.Control
                type="text"
                name="experience"
                value={doctor.experience}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={doctor.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={doctor.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Clinic</Form.Label>
              <Form.Control
                type="text"
                name="clinic"
                value={doctor.clinic}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Timings</Form.Label>
              <Form.Control
                type="text"
                name="timings"
                value={doctor.timings}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DoctorProfile;
