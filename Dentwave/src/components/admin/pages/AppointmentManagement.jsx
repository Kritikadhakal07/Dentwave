import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, RefreshCw } from 'lucide-react';

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      alert("Error loading appointments: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/appointments/update/${id}`, {
        status: newStatus
      });
      
      // Update local state immediately for better UX
      setAppointments(prev => prev.map(apt => 
        apt.id === id ? { ...apt, status: newStatus } : apt
      ));
      
    } catch (err) {
      console.error("Error updating appointment:", err);
      alert("Error updating appointment status: " + (err.response?.data?.message || err.message));
      // Revert on error
      fetchAppointments();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    
    try {
      await axios.delete(`http://127.0.0.1:8000/api/appointments/${id}`);
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error("Error deleting appointment:", err);
      alert("Error deleting appointment: " + (err.response?.data?.message || err.message));
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Pending': 'warning',
      'Confirmed': 'success',
      'Cancelled': 'danger',
      'Completed': 'info'
    };
    return colors[status] || 'secondary';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="p-4" style={{ marginLeft: '240px', marginTop: '60px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginLeft: '240px', marginTop: '60px', backgroundColor: '#f8f9fa', minHeight: '100vh' }} className="p-4">
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Appointment Management</h2>
        <button 
          className="btn btn-outline-primary d-flex align-items-center gap-2"
          onClick={fetchAppointments}
        >
          <RefreshCw size={16} />
          Refresh
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
                    <th className="border-0 py-3">Date/Time</th>
                    <th className="border-0 py-3">Cost</th>
                    <th className="border-0 py-3">Status</th>
                    <th className="border-0 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt.id}>
                      <td className="py-3 ps-4">
                        <div className="d-flex align-items-center gap-2">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ 
                              width: '40px', 
                              height: '40px', 
                              backgroundColor: '#e3f2fd', 
                              color: '#1976d2', 
                              fontWeight: 'bold', 
                              fontSize: '14px' 
                            }}
                          >
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
                        {apt.services && apt.services.length > 0 ? (
                          <div>
                            {apt.services.map((s, i) => (
                              <div key={i} className="small mb-1">
                                <span className="badge bg-light text-dark">{s.name}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted small">No services</span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="fw-semibold">{formatDate(apt.appointment_date)}</div>
                        <small className="text-muted">{apt.appointment_time}</small>
                      </td>
                      <td className="py-3">
                        <span className="fw-semibold text-success">
                          ${parseFloat(apt.total_cost).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3">
                        <select 
                          className={`form-select form-select-sm bg-${getStatusBadge(apt.status)} text-white border-0`}
                          value={apt.status}
                          onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                          style={{ 
                            width: 'auto', 
                            minWidth: '120px',
                            cursor: 'pointer',
                            fontWeight: '500'
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
                            title="Delete appointment"
                          >
                            <Trash2 size={14} />
                            Delete
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

      <style>{`
        .table tbody tr {
          transition: background-color 0.2s;
        }

        .table tbody tr:hover {
          background-color: #f8f9fa;
        }

        .form-select:focus {
          box-shadow: none;
          border-color: transparent;
        }

        .form-select option {
          background-color: white;
          color: #212529;
        }

        .card {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}