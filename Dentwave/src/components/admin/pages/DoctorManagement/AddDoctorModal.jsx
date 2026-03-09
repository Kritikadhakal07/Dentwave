import React, { useState } from 'react';

const AddDoctorModal = ({ show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience: '',
    contact: '',
    status: 'Active'
  });

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  

  const handleSubmit = () => {
  if (formData.experience < 0) {
    alert("Experience cannot be negative");
    return;
  }

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
              <h5 className="modal-title">Add Doctor</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Specialization</label>
                <input name="specialization" value={formData.specialization} onChange={handleChange} className="form-control" />
              </div>
              <div className="mb-3">
  <label className="form-label">Experience (Years)</label>
  <input
    type="number"
    name="experience"
    value={formData.experience}
    onChange={handleChange}
    className="form-control"
    min="0"
  />
</div>
              

              
              <div className="mb-3">
                <label className="form-label">Contact</label>
                <input name="contact" value={formData.contact} onChange={handleChange} className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="form-select">
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Vacation</option>
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

export default AddDoctorModal;
