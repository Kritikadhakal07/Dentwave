import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

export default function PatientManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
const [editFormData, setEditFormData] = useState({
  name: '',
  contact: '',
  address: '',
  status: 'Active',
  medicalHistory: ''
});

// Open edit modal with selected patient data
const handleEdit = (patient) => {
  setSelectedPatient(patient);
  setEditFormData({
    name: patient.name,
    contact: patient.contact,
    address: patient.address,
    status: patient.status,
    medicalHistory: patient.medicalHistory || ''
  });
  setShowEditModal(true);
};

// Handle input changes in edit modal
const handleEditChange = (e) => {
  const { name, value } = e.target;
  setEditFormData(prev => ({ ...prev, [name]: value }));
};

// Handle save changes (static for now)
const handleEditSubmit = () => {
  console.log('Edited patient data:', editFormData);
  alert('Patient updated successfully (static demo)');
  setShowEditModal(false);
};

    // Add patient form state
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    status: 'Active',
   
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (static only for now)
  const handleSubmit = () => {
    console.log('New patient data:', formData);
    alert('Patient added successfully (static demo)');
    setShowAddModal(false);
    setFormData({
      name: '',
      contact: '',
      address: '',
      status: 'Active',
    
    });
  };


  // Static patient data (mocked)
  const patients = [
    { 
      id: 1,
      name: 'Alice Johnson',
      contact: 'alice@example.com',
      address: '123 Oak Ave, City, Country',
      appointments: 5,
      lastPayment: 'Paid',
      status: 'Active',
      medicalHistory: 'Seasonal allergies, last check-up 2023.',
      avatar: 'AJ',
      appointmentHistory: [
        { date: '2025-10-12', doctor: 'Dr. Sharma', treatment: 'Root Canal', status: 'Completed' },
        { date: '2025-09-20', doctor: 'Dr. Lama', treatment: 'Cleaning', status: 'Paid' }
      ],
      paymentHistory: [
        { txnId: 'TXN-1234', amount: 'Rs. 1500', method: 'Khalti', status: 'Paid', date: '2025-10-12' },
        { txnId: 'TXN-1220', amount: 'Rs. 800', method: 'eSewa', status: 'Paid', date: '2025-09-20' }
      ]
    },
    { 
      id: 2,
      name: 'Bob Williams',
      contact: 'bob@example.com',
      address: '456 Pine St, City, Country',
      appointments: 3,
      lastPayment: 'Pending',
      status: 'Inactive',
      medicalHistory: 'Hypertension, regular monitoring required.',
      avatar: 'BW',
      appointmentHistory: [
        { date: '2025-09-10', doctor: 'Dr. Lama', treatment: 'Check-up', status: 'Pending' }
      ],
      paymentHistory: [
        { txnId: 'TXN-1210', amount: 'Rs. 500', method: 'Cash', status: 'Pending', date: '2025-09-10' }
      ]
    }
  ];

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowDetailsModal(true);
  };

  const getStatusBadgeClass = (status) => status === 'Active' ? 'bg-success' : 'bg-secondary';

  const getPaymentBadge = (paymentStatus) => {
    if (paymentStatus === 'Paid') return 'bg-success';
    if (paymentStatus === 'Pending') return 'bg-warning text-dark';
    return 'bg-secondary';
  };

  return (
    <div className="p-4" style={{ marginTop: '60px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Patient Management</h2>
        <button className="btn btn-primary d-flex align-items-center" onClick={() => setShowAddModal(true)}>
          <Plus size={18} className="me-2" />
          Add New Patient
        </button>
      </div>

      {/* Patient Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 py-3 ps-4">NAME</th>
                  <th className="border-0 py-3">CONTACT</th>
                  <th className="border-0 py-3">ADDRESS</th>
                  <th className="border-0 py-3">APPOINTMENTS</th>
                  <th className="border-0 py-3">LAST PAYMENT</th>
                  <th className="border-0 py-3">STATUS</th>
                  <th className="border-0 py-3 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 ps-4">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: '40px', height: '40px', backgroundColor: '#e3f2fd', color: '#1976d2', fontWeight: '600' }}
                        >
                          {p.avatar}
                        </div>
                        <span style={{ fontWeight: '500' }}>{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted">{p.contact}</td>
                    <td className="py-3 text-muted">{p.address}</td>
                    <td className="py-3">{p.appointments}</td>
                    <td className="py-3">
                      <span className={`badge ${getPaymentBadge(p.lastPayment)}`} style={{ fontSize: '12px', padding: '4px 12px' }}>
                        {p.lastPayment}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`badge ${getStatusBadgeClass(p.status)}`} style={{ fontSize: '12px', padding: '4px 12px' }}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <button className="btn btn-sm btn-link text-secondary" onClick={() => handleViewDetails(p)} title="View">
                        <Eye size={18} />
                      </button>
                      <button className="btn btn-sm btn-link text-secondary" title="Edit" onClick={() => setShowEditModal(true)}><Edit size={18} /></button>
                      <button className="btn btn-sm btn-link text-danger" title="Delete"><Trash2 size={18} /></button>
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
        </>
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

            <div className="mb-4">
              <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                Medical History
              </label>
              <textarea
                className="form-control"
                name="medicalHistory"
                value={editFormData.medicalHistory}
                onChange={handleEditChange}
                placeholder="Enter medical history"
                rows="3"
                style={{ resize: 'none' }}
              ></textarea>
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

      

      {/* Patient Details Modal */}
      {showDetailsModal && selectedPatient && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowDetailsModal(false)}></div>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header border-bottom">
                  <div>
                    <h5 className="modal-title mb-1">Patient Details: {selectedPatient.name}</h5>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      Overview of patient's information, appointments, and payments.
                    </p>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
                </div>

                <div className="modal-body p-4">
                  {/* Patient Information */}
                  <h6 className="mb-3">Patient Information</h6>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p><strong>Name:</strong> {selectedPatient.name}</p>
                      <p><strong>Contact:</strong> {selectedPatient.contact}</p>
                      <p><strong>Status:</strong> {selectedPatient.status}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Address:</strong> {selectedPatient.address}</p>
                      <p><strong>Appointments:</strong> {selectedPatient.appointments}</p>
                    </div>
                  </div>

                  {/* Appointment History */}
                  <h6 className="mt-4 mb-2">Appointment History</h6>
                  <div className="table-responsive mb-3">
                    <table className="table table-sm table-striped">
                      <thead className="bg-light">
                        <tr>
                          <th>Date</th>
                          <th>Doctor</th>
                          <th>Treatment</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPatient.appointmentHistory.map((a, index) => (
                          <tr key={index}>
                            <td>{a.date}</td>
                            <td>{a.doctor}</td>
                            <td>{a.treatment}</td>
                            <td>
                              <span className="badge bg-info text-dark">{a.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Payment History */}
                  <h6 className="mt-4 mb-2">Payment History</h6>
                  <div className="table-responsive">
                    <table className="table table-sm table-striped">
                      <thead className="bg-light">
                        <tr>
                          <th>Transaction ID</th>
                          <th>Amount</th>
                          <th>Method</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPatient.paymentHistory.map((pay, index) => (
                          <tr key={index}>
                            <td>{pay.txnId}</td>
                            <td>{pay.amount}</td>
                            <td>{pay.method}</td>
                            <td>
                              <span className={`badge ${getPaymentBadge(pay.status)}`}>{pay.status}</span>
                            </td>
                            <td>{pay.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-end mt-4">
                    <button className="btn btn-primary" onClick={() => setShowDetailsModal(false)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .table tbody tr:hover { background-color: #f8f9fa; }
        .btn-link { text-decoration: none; }
        .btn-link:hover { background-color: #f8f9fa; border-radius: 4px; }
        .modal { display: block; }
        .modal-dialog { max-width: 800px; }
      `}</style>
    </div>
  );
}