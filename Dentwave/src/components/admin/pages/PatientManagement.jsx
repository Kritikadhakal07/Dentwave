import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Plus, Eye, Edit, Trash2, Search, RefreshCw, AlertCircle, X } from 'lucide-react';

const API = 'http://127.0.0.1:8000/api';

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  phone: '',
  gender: '',
  status: 'Active',
  role: 'user',
};

export default function PatientManagement() {
  const [patients, setPatients]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError]                 = useState('');
  const [search, setSearch]               = useState('');

  const [showAddModal, setShowAddModal]       = useState(false);
  const [showEditModal, setShowEditModal]     = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData]               = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]           = useState({});

  // ── Fetch all users with role=user ───────────────────────────────
  const fetchPatients = async () => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${API}/users`);
      const data = await res.json();
      // Filter only regular users (patients)
      setPatients(data.filter(u => u.role === 'user'));
    } catch {
      setError('Failed to load patients. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  // ── Filtered list ─────────────────────────────────────────────────
  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    (p.phone || '').includes(search)
  );

  // ── Form helpers ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (isEdit = false) => {
    const errs = {};
    if (!formData.name.trim())  errs.name  = 'Name is required.';
    if (!formData.email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email format.';
    if (!isEdit && !formData.password) errs.password = 'Password is required.';
    if (!isEdit && formData.password && formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters.';
    return errs;
  };

  // ── Add patient ───────────────────────────────────────────────────
  const handleAdd = async () => {
    const errs = validateForm(false);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }

    setActionLoading(true);
    try {
      const res  = await fetch(`${API}/users`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'user' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add patient.');
      await fetchPatients();
      setShowAddModal(false);
      setFormData(EMPTY_FORM);
      setFormErrors({});
    } catch (err) {
      setFormErrors({ api: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // ── Open edit modal ───────────────────────────────────────────────
  const openEdit = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      name:     patient.name,
      email:    patient.email,
      password: '',
      phone:    patient.phone || '',
      gender:   patient.gender || '',
      status:   patient.status,
      role:     'user',
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  // ── Save edit ─────────────────────────────────────────────────────
  const handleEdit = async () => {
    const errs = validateForm(true);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }

    setActionLoading(true);
    try {
      const res  = await fetch(`${API}/users/update/${selectedPatient.id}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'user' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update patient.');
      await fetchPatients();
      setShowEditModal(false);
      setFormErrors({});
    } catch (err) {
      setFormErrors({ api: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // ── Delete patient ────────────────────────────────────────────────
  const handleDelete = async () => {
    setActionLoading(true);
    try {
      const res  = await fetch(`${API}/users/${selectedPatient.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete patient.');
      await fetchPatients();
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
    } finally {
      setActionLoading(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────
  const getInitials = (name) =>
    name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const avatarColors = ['#e3f2fd', '#fce4ec', '#e8f5e9', '#fff3e0', '#f3e5f5', '#e0f7fa'];
  const textColors   = ['#1976d2', '#c2185b', '#388e3c', '#f57c00', '#7b1fa2', '#0097a7'];
  const colorIdx     = (id) => id % avatarColors.length;

  const statusBadge = (s) => ({
    Active:   'bg-success',
    Inactive: 'bg-secondary',
    Pending:  'bg-warning text-dark',
  }[s] || 'bg-secondary');

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  // ── Shared form fields ────────────────────────────────────────────
  const FormFields = ({ isEdit }) => (
    <>
      {formErrors.api && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2" style={{ fontSize: 13 }}>
          <AlertCircle size={15}/> {formErrors.api}
        </div>
      )}

      <div className="row g-3">
        <div className="col-12">
          <label className="form-label fw-500" style={{ fontSize: 13 }}>Full Name *</label>
          <input className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
            name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name"/>
          {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
        </div>

        <div className="col-12">
          <label className="form-label" style={{ fontSize: 13 }}>Email Address *</label>
          <input type="email" className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
            name="email" value={formData.email} onChange={handleChange} placeholder="Enter email"/>
          {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
        </div>

        <div className="col-12">
          <label className="form-label" style={{ fontSize: 13 }}>
            Password {isEdit ? <span className="text-muted fw-normal">(leave blank to keep current)</span> : '*'}
          </label>
          <input type="password" className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
            name="password" value={formData.password} onChange={handleChange}
            placeholder={isEdit ? 'Enter new password to change' : 'Min 6 characters'}/>
          {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label" style={{ fontSize: 13 }}>Phone</label>
          <input className="form-control" name="phone" value={formData.phone}
            onChange={handleChange} placeholder="Phone number"/>
        </div>

        <div className="col-md-6">
          <label className="form-label" style={{ fontSize: 13 }}>Gender</label>
          <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label" style={{ fontSize: 13 }}>Status</label>
          <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>
    </>
  );

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="p-4" style={{ marginLeft: '240px', marginTop: '60px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Patient Management</h2>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>
            {loading ? 'Loading…' : `${filtered.length} patient${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={fetchPatients}>
            <RefreshCw size={14}/> Refresh
          </button>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => { setFormData(EMPTY_FORM); setFormErrors({}); setShowAddModal(true); }}>
            <Plus size={18}/> Add Patient
          </button>
        </div>
      </div>

      {/* Global error */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" style={{ fontSize: 13 }}>
          <AlertCircle size={15}/> {error}
          <button className="btn-close btn-sm ms-auto" onClick={() => setError('')}/>
        </div>
      )}

      

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"/>
              <p className="text-muted mt-2 mb-0" style={{ fontSize: 13 }}>Loading patients…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p className="mb-0">{search ? 'No patients match your search.' : 'No patients found.'}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 py-3 ps-4">NAME</th>
                    <th className="border-0 py-3">EMAIL</th>
                    <th className="border-0 py-3">PHONE</th>
                    <th className="border-0 py-3">GENDER</th>
                    <th className="border-0 py-3">STATUS</th>
                    <th className="border-0 py-3">JOINED</th>
                    <th className="border-0 py-3 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(patient => (
                    <tr key={patient.id}>
                      <td className="py-3 ps-4">
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ width: 38, height: 38, backgroundColor: avatarColors[colorIdx(patient.id)], color: textColors[colorIdx(patient.id)], fontWeight: 700, fontSize: 13 }}>
                            {getInitials(patient.name)}
                          </div>
                          <span style={{ fontWeight: 500 }}>{patient.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-muted" style={{ fontSize: 13 }}>{patient.email}</td>
                      <td className="py-3 text-muted" style={{ fontSize: 13 }}>{patient.phone || '—'}</td>
                      <td className="py-3 text-muted" style={{ fontSize: 13, textTransform: 'capitalize' }}>{patient.gender || '—'}</td>
                      <td className="py-3">
                        <span className={`badge ${statusBadge(patient.status)}`} style={{ fontSize: 11, padding: '4px 10px' }}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="py-3 text-muted" style={{ fontSize: 13 }}>{formatDate(patient.created_at)}</td>
                      <td className="py-3">
                        <div className="d-flex justify-content-center gap-1">
                          <button className="btn btn-sm btn-link text-secondary p-1" title="View"
                            onClick={() => { setSelectedPatient(patient); setShowDetailsModal(true); }}>
                            <Eye size={17}/>
                          </button>
                          <button className="btn btn-sm btn-link text-secondary p-1" title="Edit"
                            onClick={() => openEdit(patient)}>
                            <Edit size={17}/>
                          </button>
                          <button className="btn btn-sm btn-link text-danger p-1" title="Delete"
                            onClick={() => { setSelectedPatient(patient); setShowDeleteModal(true); }}>
                            <Trash2 size={17}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── ADD MODAL ─────────────────────────────────────────────── */}
      {showAddModal && (
        <Modal title="Add New Patient" subtitle="Fill in the patient's details below."
          onClose={() => setShowAddModal(false)}>
          <FormFields isEdit={false}/>
          <div className="d-flex gap-2 justify-content-end mt-4">
            <button className="btn btn-outline-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdd} disabled={actionLoading}>
              {actionLoading ? <><span className="spinner-border spinner-border-sm me-2"/>Adding…</> : 'Add Patient'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── EDIT MODAL ────────────────────────────────────────────── */}
      {showEditModal && selectedPatient && (
        <Modal title={`Edit: ${selectedPatient.name}`} subtitle="Update the patient's information."
          onClose={() => setShowEditModal(false)}>
          <FormFields isEdit={true}/>
          <div className="d-flex gap-2 justify-content-end mt-4">
            <button className="btn btn-outline-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleEdit} disabled={actionLoading}>
              {actionLoading ? <><span className="spinner-border spinner-border-sm me-2"/>Saving…</> : 'Save Changes'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── DETAILS MODAL ─────────────────────────────────────────── */}
      {showDetailsModal && selectedPatient && (
        <Modal title="Patient Details" subtitle={`Overview of ${selectedPatient.name}'s record.`}
          onClose={() => setShowDetailsModal(false)}>
          <div className="text-center mb-4">
            <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
              style={{ width: 64, height: 64, backgroundColor: avatarColors[colorIdx(selectedPatient.id)], color: textColors[colorIdx(selectedPatient.id)], fontWeight: 700, fontSize: 22 }}>
              {getInitials(selectedPatient.name)}
            </div>
            <h6 className="mb-0">{selectedPatient.name}</h6>
            <span className={`badge ${statusBadge(selectedPatient.status)} mt-1`} style={{ fontSize: 11 }}>
              {selectedPatient.status}
            </span>
          </div>

          {[
            ['Email',   selectedPatient.email],
            ['Phone',   selectedPatient.phone || '—'],
            ['Gender',  selectedPatient.gender ? selectedPatient.gender.charAt(0).toUpperCase() + selectedPatient.gender.slice(1) : '—'],
            ['Role',    'Patient'],
            ['Joined',  formatDate(selectedPatient.created_at)],
          ].map(([label, value]) => (
            <div key={label} className="d-flex justify-content-between py-2 border-bottom" style={{ fontSize: 13 }}>
              <span className="text-muted">{label}</span>
              <span className="fw-500 text-end" style={{ maxWidth: '60%', wordBreak: 'break-word' }}>{value}</span>
            </div>
          ))}

          <div className="d-flex gap-2 justify-content-end mt-4">
            <button className="btn btn-outline-secondary" onClick={() => setShowDetailsModal(false)}>Close</button>
            <button className="btn btn-primary" onClick={() => { setShowDetailsModal(false); openEdit(selectedPatient); }}>
              Edit Patient
            </button>
          </div>
        </Modal>
      )}

      {/* ── DELETE CONFIRM MODAL ──────────────────────────────────── */}
      {showDeleteModal && selectedPatient && (
        <Modal title="Delete Patient" subtitle="" onClose={() => setShowDeleteModal(false)} size="sm">
          <div className="text-center py-2">
            <div className="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 52, height: 52 }}>
              <Trash2 size={22} className="text-danger"/>
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
        .table tbody tr { transition: background-color 0.15s; }
        .table tbody tr:hover { background-color: #f8f9fa; }
        .btn-link { text-decoration: none; }
        .btn-link:hover { background-color: #f0f0f0; border-radius: 6px; }
        .form-control, .form-select { border: 1px solid #e0e0e0; padding: 9px 12px; font-size: 14px; }
        .form-control:focus, .form-select:focus { border-color: #0d6efd; box-shadow: 0 0 0 0.2rem rgba(13,110,253,0.1); }
        .fw-500 { font-weight: 500; }
        .card { border-radius: 10px; }
        .input-group .form-control { border-left: none; }
        .input-group .input-group-text { border-right: none; }
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