// src/pages/AppointmentManagement.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, RefreshCw, AlertTriangle } from 'lucide-react';

const API = 'http://127.0.0.1:8000/api';

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState({ open: false, apt: null });
  const [toast, setToast] = useState(null); // { message, type }

  useEffect(() => {
    fetchAppointments();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/appointments`);
      setAppointments(res.data);
    } catch (err) {
      showToast('Error loading appointments: ' + (err.response?.data?.message || err.message), 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (apt, newStatus) => {
    // Intercept cancel — show modal first
    if (newStatus === 'Cancelled') {
      setCancelModal({ open: true, apt });
      return;
    }
    await doStatusUpdate(apt.id, newStatus);
  };

  const doStatusUpdate = async (id, newStatus) => {
    try {
      const res = await axios.post(`${API}/appointments/update/${id}`, { status: newStatus });
      
      setAppointments(prev =>
        prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
      );

      // Show refund notice if Khalti payment was found
      if (res.data.refund_notice) {
        showToast('⚠️ ' + res.data.refund_notice, 'warning');
      } else {
        showToast(res.data.message || 'Appointment updated.');
      }

    } catch (err) {
      showToast('Error: ' + (err.response?.data?.message || err.message), 'danger');
      fetchAppointments();
    }
  };

  const confirmCancel = async () => {
    const { apt } = cancelModal;
    setCancelModal({ open: false, apt: null });
    await doStatusUpdate(apt.id, 'Cancelled');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this appointment?')) return;
    try {
      await axios.delete(`${API}/appointments/${id}`);
      setAppointments(prev => prev.filter(a => a.id !== id));
      showToast('Appointment deleted.');
    } catch (err) {
      showToast('Error deleting: ' + (err.response?.data?.message || err.message), 'danger');
    }
  };

  const getStatusColor = (status) => ({
    'Pending':   { bg: '#fff3cd', color: '#856404', border: '#ffc107' },
    'Confirmed': { bg: '#d1e7dd', color: '#0f5132', border: '#198754' },
    'Cancelled': { bg: '#f8d7da', color: '#842029', border: '#dc3545' },
    'Completed': { bg: '#cff4fc', color: '#055160', border: '#0dcaf0' },
  }[status] || { bg: '#e9ecef', color: '#495057', border: '#6c757d' });

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  if (loading) {
    return (
      <div style={{ marginLeft: '240px', marginTop: '60px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}
           className="p-4 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div style={{ marginLeft: '240px', marginTop: '60px', backgroundColor: '#f8f9fa', minHeight: '100vh' }} className="p-4">

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 9999,
          padding: '14px 20px', borderRadius: '10px', maxWidth: '420px',
          backgroundColor: toast.type === 'danger' ? '#f8d7da'
            : toast.type === 'warning' ? '#fff3cd' : '#d1e7dd',
          color: toast.type === 'danger' ? '#842029'
            : toast.type === 'warning' ? '#856404' : '#0f5132',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          border: `1px solid ${toast.type === 'danger' ? '#f5c6cb'
            : toast.type === 'warning' ? '#ffc107' : '#c3e6cb'}`,
          fontSize: '14px', fontWeight: '500', lineHeight: '1.5',
        }}>
          {toast.message}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModal.open && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '32px',
            maxWidth: '460px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                backgroundColor: '#fff3cd', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AlertTriangle size={22} color="#856404" />
              </div>
              <h5 style={{ margin: 0, fontWeight: '700' }}>Cancel Appointment</h5>
            </div>

            <p style={{ color: '#555', marginBottom: '8px', lineHeight: '1.6' }}>
              Are you sure you want to cancel the appointment for{' '}
              <strong>{cancelModal.apt?.patient_name}</strong> on{' '}
              <strong>{formatDate(cancelModal.apt?.appointment_date)}</strong>?
            </p>

            <div style={{
              backgroundColor: '#fff8e1', border: '1px solid #ffe082',
              borderRadius: '8px', padding: '12px 16px', marginBottom: '24px',
            }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#7c5e00', lineHeight: '1.6' }}>
                <strong>⚠️ Refund Notice:</strong> If the user paid via Khalti, they will be notified
                in-app to contact support for a manual refund. No automatic refund will be processed.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setCancelModal({ open: false, apt: null })}
                style={{
                  padding: '10px 20px', borderRadius: '8px', border: '1px solid #dee2e6',
                  backgroundColor: 'white', cursor: 'pointer', fontWeight: '500',
                }}
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmCancel}
                style={{
                  padding: '10px 20px', borderRadius: '8px', border: 'none',
                  backgroundColor: '#dc3545', color: 'white', cursor: 'pointer', fontWeight: '600',
                }}
              >
                Yes, Cancel It
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Appointment Management</h2>
        <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={fetchAppointments}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom py-3">
          <h5 className="mb-0">Appointment List</h5>
          <p className="text-muted mb-0 small">Manage all scheduled patient appointments</p>
        </div>
        <div className="card-body p-0">
          {appointments.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No appointments found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 py-3 ps-4">Patient</th>
                    <th className="border-0 py-3">Doctor</th>
                    <th className="border-0 py-3">Services</th>
                    <th className="border-0 py-3">Date / Time</th>
                    <th className="border-0 py-3">Cost</th>
                    <th className="border-0 py-3">Status</th>
                    <th className="border-0 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(apt => {
                    const sc = getStatusColor(apt.status);
                    return (
                      <tr key={apt.id}>
                        <td className="py-3 ps-4">
                          <div className="d-flex align-items-center gap-2">
                            <div style={{
                              width: 40, height: 40, borderRadius: '50%',
                              backgroundColor: '#e3f2fd', color: '#1976d2',
                              fontWeight: 'bold', fontSize: 14,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              {apt.patient_name?.charAt(0).toUpperCase() || 'P'}
                            </div>
                            <div>
                              <div className="fw-semibold">{apt.patient_name || 'Unknown'}</div>
                              <small className="text-muted">{apt.patient_email || '—'}</small>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="fw-semibold">{apt.doctor_name || 'Unknown'}</div>
                          <small className="text-muted">{apt.doctor_specialization || '—'}</small>
                        </td>
                        <td className="py-3">
                          {apt.services?.length > 0 ? apt.services.map((s, i) => (
                            <div key={i} className="small mb-1">
                              <span className="badge bg-light text-dark">{s.name}</span>
                            </div>
                          )) : <span className="text-muted small">No services</span>}
                        </td>
                        <td className="py-3">
                          <div className="fw-semibold">{formatDate(apt.appointment_date)}</div>
                          <small className="text-muted">{apt.appointment_time}</small>
                        </td>
                        <td className="py-3">
                          <span className="fw-semibold text-success">
                            Rs. {parseFloat(apt.total_cost).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3">
                          <select
                            className="form-select form-select-sm border-0"
                            value={apt.status}
                            onChange={e => handleStatusChange(apt, e.target.value)}
                            style={{
                              width: 'auto', minWidth: 130, cursor: 'pointer',
                              fontWeight: 600, borderRadius: 8,
                              backgroundColor: sc.bg,
                              color: sc.color,
                              border: `1px solid ${sc.border} !important`,
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-3">
                          <div className="d-flex justify-content-center">
                            <button
                              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                              onClick={() => handleDelete(apt.id)}
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}