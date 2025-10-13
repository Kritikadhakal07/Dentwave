import React, { useState } from "react";
import {
  Button, Modal, Table, Form, Row, Col, Badge, ButtonGroup
} from "react-bootstrap";

const AppointmentsPage = () => {
  // sample data
  const appointments = [
    {
      id: 1,
      code: "APP-20231105-001",
      name: "John Doe",
      contact: "+1 (555) 123-4567",
      email: "john.doe@example.com",
      service: "Dental Cleaning",
      date: "2024-07-20",
      time: "10:00 AM",
      status: "Pending",
      notes:
        "Patient reported mild fever and sore throat. Advised rest and fluids."
    },
    {
      id: 2,
      code: "APP-20231105-002",
      name: "Sarah Connor",
      contact: "+1 (555) 222-9999",
      email: "sarah.connor@example.com",
      service: "General Check-up",
      date: "2024-07-21",
      time: "2:00 PM",
      status: "Pending",
      notes:
        "Patient requested to discuss blood test results. Needs follow-up with lab on Friday."
    }
  ];

  // modal state
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("view"); // "view" | "update"

  // open modal with appointment data
  const handleView = (appt) => {
    setSelected(appt);
    setMode("view");
    setShow(true);
  };

  // close modal
  const handleClose = () => {
    setShow(false);
    setSelected(null);
    setMode("view");
  };

  // --- update-mode helpers ---
  const [editStatus, setEditStatus] = useState("Pending");
  const [editNotes, setEditNotes] = useState("");

  const enterUpdateMode = () => {
    if (!selected) return;
    setEditStatus(selected.status || "Pending");
    setEditNotes(selected.notes || "");
    setMode("update");
  };

  const saveNotes = () => {
    // here you would call your API to save {editNotes, editStatus}
    console.log("Saving:", {
      id: selected?.id,
      status: editStatus,
      notes: editNotes
    });
    handleClose();
  };

  return (
    <div className="p-4">
      <h4 className="mb-3">Assigned Patients and Appointments</h4>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td>{appt.name}</td>
              <td>{appt.service}</td>
              <td>{appt.date}</td>
              <td>{appt.time}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleView(appt)}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered size="lg">
        {/* ------- VIEW MODE ------- */}
        {mode === "view" && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Appointment Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selected && (
                <>
                  <p><strong>Patient Name:</strong> {selected.name}</p>
                  <p><strong>Contact:</strong> {selected.contact}</p>
                  <p><strong>Email:</strong> {selected.email}</p>
                  <hr />
                  <p><strong>Service Booked:</strong> {selected.service}</p>
                  <p><strong>Date:</strong> {selected.date}</p>
                  <p><strong>Time:</strong> {selected.time}</p>
                  <hr />
                  <p className="mb-1"><strong>Notes:</strong></p>
                  <textarea
                    className="form-control"
                    rows="3"
                    defaultValue={selected.notes || "Enter or edit notes here..."}
                  />
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="success" onClick={enterUpdateMode}>
                Update
              </Button>
              <Button variant="primary" onClick={handleClose}>
                Save
              </Button>
            </Modal.Footer>
          </>
        )}

        {/* ------- UPDATE MODE (your screenshot layout) ------- */}
        {mode === "update" && selected && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Update Appointment Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="text-muted small mb-3">
                Make changes to the appointment status or notes. Click save when you’re done.
              </p>

              {/* Appointment ID */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Appointment ID:</Form.Label>
                <Form.Control value={selected.code} disabled />
              </Form.Group>

              {/* Patient */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Patient:</Form.Label>
                <Form.Control value={selected.name} disabled />
              </Form.Group>

              {/* Date & Time */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Label className="fw-semibold">Date:</Form.Label>
                  <Form.Control value={selected.date} disabled />
                </Col>
                <Col md={6}>
                  <Form.Label className="fw-semibold">Time:</Form.Label>
                  <Form.Control value={selected.time} disabled />
                </Col>
              </Row>

              {/* Current Status with actions */}
              <div className="mb-2 fw-semibold">Current Appointment Status:</div>
              <div className="mb-3 d-flex align-items-center gap-2">
                <Badge bg="light" text="dark">{editStatus}</Badge>
              </div>
              <ButtonGroup className="mb-3">
                <Button
                  variant={editStatus === "Confirmed" ? "primary" : "light"}
                  onClick={() => setEditStatus("Confirmed")}
                >
                  Confirm
                </Button>
                <Button
                  variant={editStatus === "Completed" ? "primary" : "light"}
                  onClick={() => setEditStatus("Completed")}
                >
                  Complete
                </Button>
                <Button
                  variant={editStatus === "Canceled" ? "danger" : "light"}
                  onClick={() => setEditStatus("Canceled")}
                >
                  Cancel
                </Button>
              </ButtonGroup>

              {/* Notes */}
              <Form.Group className="mb-2">
                <Form.Label className="fw-semibold">Appointment Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Type notes here…"
                />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" onClick={saveNotes}>
                  Save Notes
                </Button>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="light" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentsPage;
