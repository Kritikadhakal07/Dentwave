import React from 'react';

const AddTimeSlotModal = ({ 
  show, 
  onClose, 
  doctors, 
  newSlot, 
  setNewSlot, 
  onSave 
}) => {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
      <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <div>
                <h5 className="modal-title mb-0">Add Time Slot</h5>
                <p className="text-muted small mb-0">Define a new availability time slot for a doctor.</p>
              </div>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label text-end d-block" style={{ width: '100px', display: 'inline-block' }}>
                  <span className="float-start">Doctor</span>
                </label>
                <select 
                  className="form-select ms-2"
                  value={newSlot.doctor}
                  onChange={(e) => setNewSlot({ ...newSlot, doctor: e.target.value })}
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-end d-block" style={{ width: '100px', display: 'inline-block' }}>
                  <span className="float-start">Day</span>
                </label>
                <select 
                  className="form-select ms-2"
                  value={newSlot.day}
                  onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                >
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                  <option>Sunday</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-end d-block" style={{ width: '100px', display: 'inline-block' }}>
                  <span className="float-start">Start Time</span>
                </label>
                <select 
                  className="form-select ms-2"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                >
                  <option>9:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>12:00 PM</option>
                  <option>1:00 PM</option>
                  <option>2:00 PM</option>
                  <option>3:00 PM</option>
                  <option>4:00 PM</option>
                  <option>5:00 PM</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-end d-block" style={{ width: '100px', display: 'inline-block' }}>
                  <span className="float-start">End Time</span>
                </label>
                <select 
                  className="form-select ms-2"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                >
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>12:00 PM</option>
                  <option>1:00 PM</option>
                  <option>2:00 PM</option>
                  <option>3:00 PM</option>
                  <option>4:00 PM</option>
                  <option>5:00 PM</option>
                  <option>6:00 PM</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-end d-block" style={{ width: '100px', display: 'inline-block' }}>
                  <span className="float-start">Status</span>
                </label>
                <select 
                  className="form-select ms-2"
                  value={newSlot.status}
                  onChange={(e) => setNewSlot({ ...newSlot, status: e.target.value })}
                >
                  <option>Available</option>
                  <option>Booked</option>
                </select>
              </div>
            </div>

            <div className="modal-footer border-0">
              <button type="button" className="btn btn-light" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-dark" onClick={onSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTimeSlotModal;