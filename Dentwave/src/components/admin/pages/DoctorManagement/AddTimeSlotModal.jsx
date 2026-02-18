import React, { useState } from 'react';

const AddTimeSlotModal = ({ show, onClose, onSave, doctors }) => {
  const [formData, setFormData] = useState({
    doctor: doctors[0]?.name || '',
    day: 'Monday',
    startTime: '09:00',  // Changed to 24-hour format
    endTime: '10:00',    // Changed to 24-hour format
    status: 'Available'
  });

  if (!show) return null;

  // Convert 24-hour to 12-hour format for display
  const formatTime12Hour = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Generate time options in 24-hour format
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 17; hour++) {
      const time24 = `${String(hour).padStart(2, '0')}:00`;
      times.push({
        value: time24,
        label: formatTime12Hour(time24)
      });
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    // Find the doctor ID from the selected name
    const selectedDoctor = doctors.find(d => d.name === formData.doctor);
    
    // Send data with doctor_id instead of doctor name
    const dataToSave = {
      doctor_id: selectedDoctor?.id,
      day: formData.day,
      start_time: formData.startTime,  // Already in 24-hour format
      end_time: formData.endTime,      // Already in 24-hour format
      status: formData.status
    };
    
    onSave(dataToSave);
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
                <label className="form-label">Doctor *</label>
                <select 
                  name="doctor" 
                  value={formData.doctor} 
                  onChange={handleChange} 
                  className="form-select"
                  required
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Day *</label>
                <select 
                  name="day" 
                  value={formData.day} 
                  onChange={handleChange} 
                  className="form-select"
                  required
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <option key={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Start Time *</label>
                <select 
                  name="startTime" 
                  value={formData.startTime} 
                  onChange={handleChange} 
                  className="form-select"
                  required
                >
                  {timeOptions.map(time => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
                <small className="text-muted">Selected: {formData.startTime} (24-hour format)</small>
              </div>

              <div className="mb-3">
                <label className="form-label">End Time *</label>
                <select 
                  name="endTime" 
                  value={formData.endTime} 
                  onChange={handleChange} 
                  className="form-select"
                  required
                >
                  {timeOptions.map(time => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
                <small className="text-muted">Selected: {formData.endTime} (24-hour format)</small>
              </div>

              <div className="mb-3">
                <label className="form-label">Status *</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange} 
                  className="form-select"
                  required
                >
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                </select>
              </div>

              {/* Preview */}
              <div className="alert alert-info small">
                <strong>Preview:</strong><br />
                {formData.doctor} will be available on {formData.day}s from {formatTime12Hour(formData.startTime)} to {formatTime12Hour(formData.endTime)}
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={onClose} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSubmit} className="btn btn-primary">Save Time Slot</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTimeSlotModal;