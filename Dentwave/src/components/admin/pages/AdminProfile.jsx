import React, { useState,useEffect } from "react";
import axios from "axios";
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
  const [admin, setAdmin] = useState(null);
    const [formData, setFormData] = useState({});

      const adminId = 1;
  
 //  Fetch admin data
  const fetchAdmin = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/admin/${adminId}`);
      setAdmin(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error("Error fetching admin:", err);
    }
  };

   useEffect(() => {
    fetchAdmin();
  }, []);

  // 🟠 Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://127.0.0.1:8000/api/admin/${adminId}`, formData);
      alert(res.data.message);
      fetchAdmin();
    } catch (err) {
      console.error("Error updating admin:", err);
    }
  };
  if (!admin) return <p>Loading profile...</p>;
  
  

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
