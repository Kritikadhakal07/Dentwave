import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showAddTimeSlot, setShowAddTimeSlot] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [editTimeSlot, setEditTimeSlot] = useState(null);

  const [doctorForm, setDoctorForm] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    experience: '',
    contact: '',
    status: 'Active',
    image: null
  });

  // ✅ CHANGED: 'day' replaced with 'date'
  const [timeSlotForm, setTimeSlotForm] = useState({
    doctor_id:  '',
    date:       '',       // was: day: 'Monday'
    start_time: '09:00',
    end_time:   '10:00',
    status:     'Available'
  });

  // Today's date for min attribute — no past dates allowed
  const today = new Date().toISOString().split('T')[0];

  // Derive day name from date for display in table
  const getDayName = (dateStr) => {
    if (!dateStr) return '—';
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return days[new Date(dateStr).getDay()];
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      fetchTimeSlots(selectedDoctor);
    }
  }, [selectedDoctor]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/doctors");
      setDoctors(res.data);
      if (res.data.length > 0 && !selectedDoctor) {
        setSelectedDoctor(res.data[0].id);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const fetchTimeSlots = async (doctorId) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/time-slots/${doctorId}`);
      setTimeSlots(res.data);
    } catch (err) {
      console.error("Error fetching time slots:", err);
    }
  };

  const handleDoctorSubmit = async () => {
    try {
      const payload = new FormData();
      payload.append('name',           doctorForm.name);
      payload.append('email',          doctorForm.email);
      payload.append('password',       doctorForm.password);
      payload.append('specialization', doctorForm.specialization);
      payload.append('experience',     doctorForm.experience);
      payload.append('contact',        doctorForm.contact);
      payload.append('status',         doctorForm.status);
      if (doctorForm.image) payload.append('image', doctorForm.image);

      if (editDoctor) {
        await axios.post(`http://127.0.0.1:8000/api/doctors/update/${editDoctor.id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await axios.post("http://127.0.0.1:8000/api/doctors", payload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      fetchDoctors();
      setShowAddDoctor(false);
      setEditDoctor(null);
      setDoctorForm({ name: '', email: '', password: '', specialization: '', experience: '', contact: '', status: 'Active', image: null });
    } catch (err) {
      console.error("Error saving doctor:", err);
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/doctors/${id}`);
      fetchDoctors();
    } catch (err) {
      console.error("Error deleting doctor:", err);
      alert("Error deleting doctor");
    }
  };

  const openEditDoctor = (doctor) => {
    setEditDoctor(doctor);
    setDoctorForm({
      name:           doctor.name,
      email:          doctor.email || '',
      password:       '',
      specialization: doctor.specialization,
      experience:     doctor.experience,
      contact:        doctor.contact,
      status:         doctor.status,
      image:          null
    });
    setShowAddDoctor(true);
  };

  const handleTimeSlotSubmit = async () => {
    // ✅ CHANGED: validate date is selected
    if (!timeSlotForm.date) {
      alert('Please select a date.');
      return;
    }
    if (timeSlotForm.end_time <= timeSlotForm.start_time) {
      alert('End time must be after start time.');
      return;
    }

    try {
      // ✅ CHANGED: sends 'date' instead of 'day'
      const payload = {
        doctor_id:  timeSlotForm.doctor_id || selectedDoctor,
        date:       timeSlotForm.date,      // e.g. "2026-03-25"
        start_time: timeSlotForm.start_time,
        end_time:   timeSlotForm.end_time,
        status:     timeSlotForm.status
      };

      if (editTimeSlot) {
        await axios.post(`http://127.0.0.1:8000/api/time-slots/update/${editTimeSlot.id}`, payload);
      } else {
        await axios.post("http://127.0.0.1:8000/api/time-slots", payload);
      }

      await fetchTimeSlots(selectedDoctor);
      setShowAddTimeSlot(false);
      setEditTimeSlot(null);
      // ✅ CHANGED: reset with date instead of day
      setTimeSlotForm({ doctor_id: '', date: '', start_time: '09:00', end_time: '10:00', status: 'Available' });
    } catch (err) {
      console.error("Error saving time slot:", err);
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteTimeSlot = async (id) => {
    if (!window.confirm("Are you sure you want to delete this time slot?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/time-slots/${id}`);
      fetchTimeSlots(selectedDoctor);
    } catch (err) {
      console.error("Error deleting time slot:", err);
    }
  };

  const openEditTimeSlot = (slot) => {
    setEditTimeSlot(slot);
    // ✅ CHANGED: loads 'date' from slot instead of 'day'
    setTimeSlotForm({
      doctor_id:  slot.doctor_id,
      date:       slot.date,        // was: day: slot.day
      start_time: slot.start_time,
      end_time:   slot.end_time,
      status:     slot.status
    });
    setShowAddTimeSlot(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active':     return 'success';
      case 'On Leave':   return 'warning';
      case 'Vacation':   return 'primary';
      case 'Available':  return 'success';
      case 'Booked':     return 'danger';
      default:           return 'secondary';
    }
  };

  return (
    <div style={{ marginLeft: '240px', marginTop: '60px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="p-4">
        <h2 className="mb-4">Doctor Management</h2>

        {/* Doctor Roster */}
        <div className="bg-white rounded shadow-sm p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Doctor Roster</h5>
            <button className="btn btn-outline-primary btn-sm" onClick={() => setShowAddDoctor(true)}>
              <Plus size={16} className="me-1" /> Add Doctor
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Image</th><th>Name</th><th>Specialization</th>
                  <th>Experience</th><th>Contact</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map(doctor => (
                  <tr key={doctor.id}>
                    <td>
                      {doctor.image ? (
                        <img src={`http://127.0.0.1:8000/storage/${doctor.image}`} alt={doctor.name}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1976d2' }}>
                          {doctor.name.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td>{doctor.name}</td>
                    <td>{doctor.specialization}</td>
                    <td>{doctor.experience}</td>
                    <td>{doctor.contact}</td>
                    <td><span className={`badge bg-${getStatusColor(doctor.status)}`}>{doctor.status}</span></td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => openEditDoctor(doctor)}><Edit size={14} /></button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteDoctor(doctor.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Availability */}
        <div className="bg-white rounded shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Doctor Availability</h5>
            <div className="d-flex gap-2">
              <select className="form-select form-select-sm" style={{ maxWidth: '200px' }}
                value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <button className="btn btn-outline-primary btn-sm" onClick={() => setShowAddTimeSlot(true)}>
                <Calendar size={16} className="me-1" /> Add Time Slot
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  {/* ✅ CHANGED: Show both Date and Day columns */}
                  <th>Date</th><th>Day</th><th>Start Time</th><th>End Time</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {timeSlots.length === 0 ? (
                  <tr><td colSpan="6" className="text-center text-muted py-4">No time slots available.</td></tr>
                ) : (
                  timeSlots.map(slot => (
                    <tr key={slot.id}>
                      {/* ✅ CHANGED: show slot.date and derived day name */}
                      <td>{slot.date}</td>
                      <td>{getDayName(slot.date)}</td>
                      <td>{slot.start_time}</td>
                      <td>{slot.end_time}</td>
                      <td><span className={`badge bg-${getStatusColor(slot.status)}`}>{slot.status}</span></td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => openEditTimeSlot(slot)}><Edit size={14} /></button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTimeSlot(slot.id)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Doctor Modal — unchanged */}
        {showAddDoctor && (
          <>
            <div className="modal-backdrop fade show" onClick={() => { setShowAddDoctor(false); setEditDoctor(null); }}></div>
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{editDoctor ? 'Edit Doctor' : 'Add Doctor'}</h5>
                    <button type="button" className="btn-close" onClick={() => { setShowAddDoctor(false); setEditDoctor(null); }}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Profile Image</label>
                      <input type="file" className="form-control" accept="image/*" onChange={(e) => setDoctorForm({...doctorForm, image: e.target.files[0]})} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input className="form-control" value={doctorForm.name} onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-control" value={doctorForm.email} onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input type="password" className="form-control" value={doctorForm.password} onChange={(e) => setDoctorForm({...doctorForm, password: e.target.value})} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Specialization</label>
                      <input className="form-control" value={doctorForm.specialization} onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Experience</label>
                      <input className="form-control" value={doctorForm.experience} onChange={(e) => setDoctorForm({...doctorForm, experience: e.target.value})} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Contact</label>
                      <input className="form-control" value={doctorForm.contact} onChange={(e) => setDoctorForm({...doctorForm, contact: e.target.value})} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select className="form-select" value={doctorForm.status} onChange={(e) => setDoctorForm({...doctorForm, status: e.target.value})}>
                        <option>Active</option>
                        <option>On Leave</option>
                        <option>Vacation</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button onClick={() => { setShowAddDoctor(false); setEditDoctor(null); }} className="btn btn-secondary">Cancel</button>
                    <button onClick={handleDoctorSubmit} className="btn btn-primary">{editDoctor ? 'Update' : 'Save'}</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Add/Edit Time Slot Modal */}
        {showAddTimeSlot && (
          <>
            <div className="modal-backdrop fade show" onClick={() => { setShowAddTimeSlot(false); setEditTimeSlot(null); }}></div>
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{editTimeSlot ? 'Edit Time Slot' : 'Add Time Slot'}</h5>
                    <button type="button" className="btn-close" onClick={() => { setShowAddTimeSlot(false); setEditTimeSlot(null); }}></button>
                  </div>
                  <div className="modal-body">

                    {/* ✅ CHANGED: date picker instead of day dropdown */}
                    <div className="mb-3">
                      <label className="form-label">Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={timeSlotForm.date}
                        min={today}
                        onChange={(e) => setTimeSlotForm({...timeSlotForm, date: e.target.value})}
                        required
                      />
                      {/* Show day name below so admin knows what day it is */}
                      {timeSlotForm.date && (
                        <small className="text-muted">{getDayName(timeSlotForm.date)}</small>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Start Time</label>
                      <input type="time" className="form-control" value={timeSlotForm.start_time}
                        onChange={(e) => setTimeSlotForm({...timeSlotForm, start_time: e.target.value})} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">End Time</label>
                      <input type="time" className="form-control" value={timeSlotForm.end_time}
                        onChange={(e) => setTimeSlotForm({...timeSlotForm, end_time: e.target.value})} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select className="form-select" value={timeSlotForm.status}
                        onChange={(e) => setTimeSlotForm({...timeSlotForm, status: e.target.value})}>
                        <option>Available</option>
                        <option>Booked</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button onClick={() => { setShowAddTimeSlot(false); setEditTimeSlot(null); }} className="btn btn-secondary">Cancel</button>
                    <button onClick={handleTimeSlotSubmit} className="btn btn-primary">{editTimeSlot ? 'Update' : 'Save'}</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default DoctorManagement;