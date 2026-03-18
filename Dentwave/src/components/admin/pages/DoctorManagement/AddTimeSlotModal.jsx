import React, { useState } from 'react';

const AddTimeSlotModal = ({ show, onClose, onSave, doctors }) => {
  const [formData, setFormData] = useState({
    doctor:    doctors[0]?.name || '',
    date:      '',          
    startTime: '09:00',
    endTime:   '10:00',
    status:    'Available'
  });

  if (!show) return null;

  // Convert 24-hour to 12-hour format for display
  const formatTime12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get today's date in YYYY-MM-DD for min attribute (no past dates)
  const today = new Date().toISOString().split('T')[0];

  // Derive day name from selected date for display in preview
  const getDayName = (dateStr) => {
    if (!dateStr) return '';
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return days[new Date(dateStr).getDay()];
  };

  // Generate time options in 24-hour format
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 17; hour++) {
      const time24 = `${String(hour).padStart(2, '0')}:00`;
      times.push({ value: time24, label: formatTime12Hour(time24) });
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    // Basic check — date must be selected
    if (!formData.date) {
      alert('Please select a date.');
      return;
    }

    // Check end time is after start time
    if (formData.endTime <= formData.startTime) {
      alert('End time must be after start time.');
      return;
    }

    const selectedDoctor = doctors.find(d => d.name === formData.doctor);

    // ✅ CHANGED: sends 'date' instead of 'day'
    const dataToSave = {
      doctor_id:  selectedDoctor?.id,
      date:       formData.date,        // e.g. "2026-03-25"
      start_time: formData.startTime,
      end_time:   formData.endTime,
      status:     formData.status
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

              {/* Doctor */}
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

              {/* ✅ CHANGED: Date picker instead of day dropdown */}
              <div className="mb-3">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-control"
                  min={today}         // cannot select past dates
                  required
                />
                {/* Show day name so admin knows what day they picked */}
                {formData.date && (
                  <small className="text-muted">
                    {getDayName(formData.date)}
                  </small>
                )}
              </div>

              {/* Start Time */}
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
                <small className="text-muted">24-hour: {formData.startTime}</small>
              </div>

              {/* End Time */}
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
                <small className="text-muted">24-hour: {formData.endTime}</small>
              </div>

              {/* Status */}
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

              {/* Preview — ✅ now shows actual date + day name */}
              {formData.date && (
                <div className="alert alert-info small">
                  <strong>Preview:</strong><br />
                  {formData.doctor} will be available on{' '}
                  <strong>{getDayName(formData.date)}, {formData.date}</strong>{' '}
                  from {formatTime12Hour(formData.startTime)} to {formatTime12Hour(formData.endTime)}
                </div>
              )}

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