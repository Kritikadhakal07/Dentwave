import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  Plus, Eye, Edit, Trash2
} from 'lucide-react';

export default function PatientManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    status: 'Active',
    medicalHistory: ''
  });

  // Sample patient data
  const patients = [
    { 
      id: 1, 
      name: 'Alice Johnson', 
      contact: 'alice@example.com', 
      address: '123 Oak Ave, City, Country',
      appointments: 5,
      status: 'Active',
      medicalHistory: 'Seasonal allergies, last check-up 2023.',
      avatar: 'AJ' 
    },
    { 
      id: 2, 
      name: 'Bob Williams', 
      contact: 'bob@example.com', 
      address: '456 Pine St, City, Country',
      appointments: 3,
      status: 'Inactive',
      medicalHistory: 'Hypertension, regular monitoring required.',
      avatar: 'BW' 
    },
    { 
      id: 3, 
      name: 'Charlie Brown', 
      contact: 'charlie@example.com', 
      address: '789 Maple Dr, City, Country',
      appointments: 8,
      status: 'Active',
      medicalHistory: 'Diabetes Type 2, monthly follow-ups.',
      avatar: 'CB' 
    },
    { 
      id: 4, 
      name: 'Diana Miller', 
      contact: 'diana@example.com', 
      address: '321 Elm Rd, City, Country',
      appointments: 2,
      status: 'Active',
      medicalHistory: 'No significant medical history.',
      avatar: 'DM' 
    },
    { 
      id: 5, 
      name: 'Eve Davis', 
      contact: 'eve@example.com', 
      address: '654 Birch Ln, City, Country',
      appointments: 6,
      status: 'Inactive',
      medicalHistory: 'Asthma, uses inhaler as needed.',
      avatar: 'ED' 
    },
    { 
      id: 6, 
      name: 'Frank White', 
      contact: 'frank@example.com', 
      address: '987 Cedar Blvd, City, Country',
      appointments: 4,
      status: 'Active',
      medicalHistory: 'Previous surgery in 2022, recovering well.',
      avatar: 'FW' 
    },
    { 
      id: 7, 
      name: 'Grace Taylor', 
      contact: 'grace@example.com', 
      address: '147 Spruce Way, City, Country',
      appointments: 7,
      status: 'Active',
      medicalHistory: 'Regular health check-ups, no issues.',
      avatar: 'GT' 
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    setShowAddModal(false);
    setFormData({
      name: '',
      contact: '',
      address: '',
      status: 'Active',
      medicalHistory: ''
    });
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowDetailsModal(true);
  };

  const getStatusBadgeClass = (status) => {
    return status === 'Active' ? 'bg-success' : 'bg-secondary';
  };

  return (
    <div className="p-4" style={{ marginLeft: '240px', marginTop: '60px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Patient List</h2>
        <button 
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} className="me-2" />
          Add New Patient
        </button>
      </div>

      {/* Patient List Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 py-3 ps-4">NAME</th>
                  <th className="border-0 py-3">CONTACT</th>
                  <th className="border-0 py-3">ADDRESS</th>
                  <th className="border-0 py-3">STATUS</th>
                  <th className="border-0 py-3 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="py-3 ps-4">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            fontWeight: '600',
                            fontSize: '14px'
                          }}
                        >
                          {patient.avatar}
                        </div>
                        <span style={{ fontWeight: '500' }}>{patient.name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-muted">{patient.contact}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-muted">{patient.address}</span>
                    </td>
                    <td className="py-3">
                      <span 
                        className={`badge ${getStatusBadgeClass(patient.status)}`}
                        style={{ fontSize: '12px', padding: '4px 12px' }}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="d-flex justify-content-center gap-2">
                        <button 
                          className="btn btn-sm btn-link text-secondary p-1" 
                          title="View"
                          onClick={() => handleViewDetails(patient)}
                        >
                          <Eye size={18} />
                        </button>
                        <button className="btn btn-sm btn-link text-secondary p-1" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button className="btn btn-sm btn-link text-danger p-1" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New Patient Modal */}
      {showAddModal && (
        <>
          <div 
            className="modal-backdrop fade show" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => setShowAddModal(false)}
          ></div>

          <div 
            className="modal fade show d-block" 
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header border-bottom">
                  <div>
                    <h5 className="modal-title mb-1">Add New Patient</h5>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      Fill in the patient details below.
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter patient name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Contact
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="Enter contact email or phone"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter address"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Status
                    </label>
                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Medical History
                    </label>
                    <textarea
                      className="form-control"
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleInputChange}
                      placeholder="Enter medical history"
                      rows="3"
                      style={{ resize: 'none' }}
                    ></textarea>
                  </div>

                  <div className="d-flex gap-2 justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      Add Patient
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Patient Modal */}
{showEditModal && selectedPatient && (
  <>
    <div 
      className="modal-backdrop fade show" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={() => setShowEditModal(false)}
    ></div>

    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-bottom">
            <div>
              <h5 className="modal-title mb-1">Edit Patient: {selectedPatient.name}</h5>
              <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                Update patient details below.
              </p>
            </div>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setShowEditModal(false)}
            ></button>
          </div>

          <div className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                Name
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
                placeholder="Enter patient name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                Contact
              </label>
              <input
                type="text"
                className="form-control"
                name="contact"
                value={editFormData.contact}
                onChange={handleEditChange}
                placeholder="Enter contact email or phone"
              />
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                Address
              </label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={editFormData.address}
                onChange={handleEditChange}
                placeholder="Enter address"
              />
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                Status
              </label>
              <select
                className="form-select"
                name="status"
                value={editFormData.status}
                onChange={handleEditChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

           

            <div className="d-flex gap-2 justify-content-end">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleEditSubmit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
)}

      

      {/* ── DETAILS MODAL ─────────────────────────────────────────── */}
      {showDetailsModal && selectedPatient && (
        <>
          <div 
            className="modal-backdrop fade show" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => setShowDetailsModal(false)}
          ></div>

          <div 
            className="modal fade show d-block" 
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header border-bottom">
                  <div>
                    <h5 className="modal-title mb-1">Patient Details: {selectedPatient.name}</h5>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      Comprehensive overview of {selectedPatient.name}'s record.
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowDetailsModal(false)}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="mb-3">
                    <div className="row">
                      <div className="col-4">
                        <span className="text-muted" style={{ fontSize: '14px', fontWeight: '500' }}>Name</span>
                      </div>
                      <div className="col-8">
                        <span style={{ fontSize: '14px' }}>{selectedPatient.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="row">
                      <div className="col-4">
                        <span className="text-muted" style={{ fontSize: '14px', fontWeight: '500' }}>Contact</span>
                      </div>
                      <div className="col-8">
                        <span style={{ fontSize: '14px' }}>{selectedPatient.contact}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="row">
                      <div className="col-4">
                        <span className="text-muted" style={{ fontSize: '14px', fontWeight: '500' }}>Appointments</span>
                      </div>
                      <div className="col-8">
                        <span style={{ fontSize: '14px' }}>{selectedPatient.appointments}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="row">
                      <div className="col-4">
                        <span className="text-muted" style={{ fontSize: '14px', fontWeight: '500' }}>Status</span>
                      </div>
                      <div className="col-8">
                        <span style={{ fontSize: '14px' }}>{selectedPatient.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="row">
                      <div className="col-4">
                        <span className="text-muted" style={{ fontSize: '14px', fontWeight: '500' }}>Address</span>
                      </div>
                      <div className="col-8">
                        <span style={{ fontSize: '14px' }}>{selectedPatient.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="mb-2">
                      <span className="text-muted" style={{ fontSize: '14px', fontWeight: '500' }}>Medical History</span>
                    </div>
                    <div 
                      className="p-3 rounded" 
                      style={{ backgroundColor: '#f8f9fa', fontSize: '14px', color: '#495057' }}
                    >
                      {selectedPatient.medicalHistory}
                    </div>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={() => setShowDetailsModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 14 }}>
              Are you sure you want to delete <strong>{selectedPatient.name}</strong>?
              This action cannot be undone.
            </p>
            <p className="text-muted" style={{ fontSize: 12 }}>
              Note: Patients with existing appointments cannot be deleted.
            </p>
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <button className="btn btn-outline-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={actionLoading}>
              {actionLoading ? <><span className="spinner-border spinner-border-sm me-2"/>Deleting…</> : 'Delete'}
            </button>
          </div>
        </Modal>
      )}

      <style>{`
        .table tbody tr {
          transition: background-color 0.2s;
        }

        .table tbody tr:hover {
          background-color: #f8f9fa;
        }

        .btn-link {
          text-decoration: none;
        }

        .btn-link:hover {
          background-color: #f8f9fa;
          border-radius: 4px;
        }

        .modal {
          display: block;
        }

        .form-control, .form-select, textarea {
          border: 1px solid #e0e0e0;
          padding: 10px 12px;
          font-size: 14px;
        }

        .form-control:focus, .form-select:focus, textarea:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.1);
        }

        .form-label {
          color: #495057;
          margin-bottom: 8px;
        }

        .card {
          border-radius: 8px;
        }

        .btn {
          font-size: 14px;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1040;
          width: 100vw;
          height: 100vh;
        }

        .modal.show {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1050;
          width: 100%;
          height: 100%;
          overflow: hidden;
          outline: 0;
        }

        .modal-dialog {
          max-width: 600px;
        }
      `}</style>
    </div>
  );
}

// ── Reusable Modal wrapper ────────────────────────────────────────────
function Modal({ title, subtitle, onClose, children, size = 'md' }) {
  return (
    <>
      <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}/>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className={`modal-dialog modal-dialog-centered modal-${size}`}>
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-bottom">
              <div>
                <h5 className="modal-title mb-0">{title}</h5>
                {subtitle && <p className="text-muted mb-0 mt-1" style={{ fontSize: 13 }}>{subtitle}</p>}
              </div>
              <button type="button" className="btn-close" onClick={onClose}/>
            </div>
            <div className="modal-body p-4">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}