import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';


export default function PatientManagement() {
  const[patient, setPatient]= useState([]);
  const[loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

const [editFormData, setEditFormData] = useState({
  name: '',
  contact: '',
  address: '',
  status: 'Active',
 
});

const fetchPatient = async () => {
  try{
    const res = await axios.get("http://127.0.0.1:8000/api/patients");
    setPatient(res.data);
  }catch (err){
    console.error("Error fetching patients:" , err);
  } finally{
    setLoading(false);
  }
};


useEffect(() =>{
  fetchPatient();
},[]);

  
  // Add new patient
  const handleAdd = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/patients`, formData);
      alert("Patient added successfully!");
      setShowAddModal(false);
      fetchPatient();
    } catch (err) {
      console.error("Error adding patient:", err);
    }
  };

// Open edit modal with selected patient data
const handleEdit = (patient) => {
  setSelectedPatient(patient);
  setEditFormData({
    name: patient.name,
    contact: patient.contact,
    address: patient.address,
    status: patient.status,
  });
  setShowEditModal(true);
};


 //  View patient details
  const handleView = async (id) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/patients/${id}`);
      setSelectedPatient(res.data);
      setShowDetailsModal(true);
    } catch (err) {
      console.error("Error fetching patient details:", err);
    }
  };

  // Update patient
  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/patients/${selectedPatient.id}`, formData);
      alert("Patient updated successfully!");
      setShowEditModal(false);
      fetchPatient();
    } catch (err) {
      console.error("Error updating patient:", err);
    }
  };

  //  Delete patient
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/patients/${id}`);
        alert("Patient deleted successfully!");
        fetchPatient();
      } catch (err) {
        console.error("Error deleting patient:", err);
      }
    }
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
                {patient.map((p) => (
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
                      <button className="btn btn-sm btn-link text-secondary" onClick={() => handleView(p)} title="View">
                        <Eye size={18} />
                      </button>
                      <button className="btn btn-sm btn-link text-secondary" title="Edit" onClick={() => handleEdit(p)}><Edit size={18} /></button>
                      <button className="btn btn-sm btn-link text-danger" title="Delete" onClick={() => handleDelete(p)}><Trash2 size={18} /></button>
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