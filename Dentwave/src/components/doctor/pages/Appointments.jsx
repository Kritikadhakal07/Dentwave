import React, { useState, useEffect } from "react";
import {
  Button, Modal, Table, Form, Row, Col, Badge, ButtonGroup, Spinner, Alert
} from "react-bootstrap";

const API_BASE = "http://localhost:8000/api";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  // modal state
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("view");

  // update-mode fields
  const [editStatus, setEditStatus] = useState("Pending");
  const [editNotes, setEditNotes] = useState("");

  // ── fetch appointments for this doctor ──────────────────────────────────
  const doctorId = localStorage.getItem("doctor_id");

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/appointments?doctor_id=${doctorId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        // filter to only this doctor's appointments
        const mine = (data.appointments || []).filter(
          (a) => String(a.doctor_id) === String(doctorId)
        );
        setAppointments(mine);
      } else {
        setError("Failed to load appointments.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ── open view modal ──────────────────────────────────────────────────────
  const handleView = (appt) => {
    setSelected(appt);
    setMode("view");
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelected(null);
    setMode("view");
    setSuccessMsg(null);
  };

  const enterUpdateMode = () => {
    if (!selected) return;
    setEditStatus(selected.status || "Pending");
    setEditNotes(selected.notes || "");
    setMode("update");
  };

  // ── save updated status + notes ─────────────────────────────────────────
  const saveUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/appointments/${selected.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: editStatus, notes: editNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Appointment updated successfully.");
        fetchAppointments();
        setTimeout(() => handleClose(), 1200);
      } else {
        setError(data.message || "Update failed.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── status badge color ───────────────────────────────────────────────────
  const statusVariant = (s) => {
    switch (s) {
      case "Confirmed":  return "success";
      case "Completed":  return "primary";
      case "Cancelled":  return "danger";
      default:           return "warning";
    }
  };

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-4">
      <h4 className="mb-3">Assigned Patients and Appointments</h4>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : appointments.length === 0 ? (
        <Alert variant="info">No appointments assigned to you yet.</Alert>
      ) : (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Patient Name</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td><small className="text-muted">{appt.appointment_code || `APP-${appt.id}`}</small></td>
                <td>{appt.patient_name}</td>
                <td>
                  {appt.services?.length
                    ? appt.services.map((s) => s.name).join(", ")
                    : "—"}
                </td>
                <td>{appt.appointment_date}</td>
                <td>{appt.appointment_time}</td>
                <td>
                  <Badge bg={statusVariant(appt.status)}>{appt.status}</Badge>
                </td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleView(appt)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* ── Modal ── */}
      <Modal show={show} onHide={handleClose} centered size="lg">

        {/* VIEW MODE */}
        {mode === "view" && selected && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Appointment Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><strong>Patient Name:</strong> {selected.patient_name}</p>
              <p><strong>Contact:</strong> {selected.patient_phone || "—"}</p>
              <p><strong>Email:</strong> {selected.patient_email || "—"}</p>
              <hr />
              <p>
                <strong>Service(s):</strong>{" "}
                {selected.services?.length
                  ? selected.services.map((s) => s.name).join(", ")
                  : "—"}
              </p>
              <p><strong>Date:</strong> {selected.appointment_date}</p>
              <p><strong>Time:</strong> {selected.appointment_time}</p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge bg={statusVariant(selected.status)}>{selected.status}</Badge>
              </p>
              <hr />
              <p className="mb-1"><strong>Notes:</strong></p>
              <textarea
                className="form-control"
                rows="3"
                readOnly
                value={selected.notes || "No notes yet."}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Close</Button>
              <Button variant="success" onClick={enterUpdateMode}>Update</Button>
            </Modal.Footer>
          </>
        )}

        {/* UPDATE MODE */}
        {mode === "update" && selected && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Update Appointment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {successMsg && <Alert variant="success">{successMsg}</Alert>}
              {error     && <Alert variant="danger">{error}</Alert>}

              <p className="text-muted small mb-3">
                Change the appointment status or add notes, then click Save.
              </p>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Appointment ID</Form.Label>
                <Form.Control value={appt.appointment_code || `APP-${selected.id}`} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Patient</Form.Label>
                <Form.Control value={selected.patient_name} disabled />
              </Form.Group>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Label className="fw-semibold">Date</Form.Label>
                  <Form.Control value={selected.appointment_date} disabled />
                </Col>
                <Col md={6}>
                  <Form.Label className="fw-semibold">Time</Form.Label>
                  <Form.Control value={selected.appointment_time} disabled />
                </Col>
              </Row>

              <div className="mb-2 fw-semibold">Current Status:</div>
              <div className="mb-3">
                <Badge bg={statusVariant(editStatus)}>{editStatus}</Badge>
              </div>

              <ButtonGroup className="mb-3">
                <Button
                  variant={editStatus === "Confirmed" ? "success"  : "outline-success"}
                  onClick={() => setEditStatus("Confirmed")}
                >Confirm</Button>
                <Button
                  variant={editStatus === "Completed" ? "primary"  : "outline-primary"}
                  onClick={() => setEditStatus("Completed")}
                >Complete</Button>
                <Button
                  variant={editStatus === "Cancelled" ? "danger"   : "outline-danger"}
                  onClick={() => setEditStatus("Cancelled")}
                >Cancel</Button>
              </ButtonGroup>

              <Form.Group className="mb-3">
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
                <Button variant="primary" onClick={saveUpdate} disabled={saving}>
                  {saving ? <><Spinner size="sm" animation="border" /> Saving…</> : "Save Changes"}
                </Button>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="light" onClick={handleClose}>Close</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentsPage;