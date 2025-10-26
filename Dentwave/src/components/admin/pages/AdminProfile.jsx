import React, { useState } from "react";
import {
  Card,
  Button,
  Image,
  ListGroup,
  Modal,
  Form,
} from "react-bootstrap";
import { CameraFill } from "react-bootstrap-icons";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({
    name: "Dr. Priya Sharma",
    position: "Admin - Dental Management System",
    email: "priya.sharma@dentwave.com",
    phone: "+977 9812345678",
    image: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
  });

  const [showModal, setShowModal] = useState(false);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAdmin({ ...admin, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
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
        style={{ maxWidth: "450px", width: "100%", backgroundColor: "white" }}
      >
        <Card.Body>
          {/* Profile Image with Edit Option */}
          <div className="mb-3 position-relative d-inline-block">
            <Image
              src={admin.image}
              alt={admin.name}
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

          {/* Admin Info */}
          <h4 className="fw-bold text-primary mb-1">{admin.name}</h4>
          <p className="text-muted mb-3">{admin.position}</p>

          <ListGroup variant="flush" className="text-start px-4 mb-3">
            <ListGroup.Item>
              <strong>Email:</strong> {admin.email}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Phone:</strong> {admin.phone}
            </ListGroup.Item>
          </ListGroup>

          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Edit Profile
            </Button>
            
          </div>
        </Card.Body>
      </Card>

      {/* Edit Profile Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Admin Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={admin.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="text"
                name="position"
                value={admin.position}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={admin.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={admin.phone}
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

export default AdminProfile;
