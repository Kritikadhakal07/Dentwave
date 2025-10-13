import React, { useState } from 'react';

const AddTimeSlotModal = ({ show, onClose, onSave, doctors }) => {
  const [formData, setFormData] = useState({
    doctor: doctors[0]?.name || '',
    day: 'Monday',
    startTime: '9:00 AM',
    endTime: '10:00 AM',
    status: 'Available'
  });

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-3 shadow-sm">
            <div className="modal-header">
              <h5 className="modal-title">Add Time Slot</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <p className="text-muted small mb-3">
                Define a new availability time slot for a doctor.
              </p>

              <div className="mb-3">
                <label className="form-label">Doctor</label>
                <select name="doctor" value={formData.doctor} onChange={handleChange} className="form-select">
                  {doctors.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Day</label>
                <select name="day" value={formData.day} onChange={handleChange} className="form-select">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <option key={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Start Time</label>
                <select name="startTime" value={formData.startTime} onChange={handleChange} className="form-select">
                  {['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'].map(time => (
                    <option key={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">End Time</label>
                <select name="endTime" value={formData.endTime} onChange={handleChange} className="form-select">
                  {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'].map(time => (
                    <option key={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="form-select">
                  <option>Available</option>
                  <option>Booked</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={onClose} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSubmit} className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTimeSlotModal;
