// AddDoctorModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddDoctorModal = ({ show, onClose, doctorToEdit, onSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    experience: '',
    contact: '',
    status: 'Active',
    image: null
  });

  useEffect(() => {
    if (doctorToEdit) {
      setFormData({
        name: doctorToEdit.name || '',
        email: doctorToEdit.email || '',
        password: '',
        specialization: doctorToEdit.specialization || '',
        experience: doctorToEdit.experience || '',
        contact: doctorToEdit.contact || '',
        status: doctorToEdit.status || 'Active',
        image: null
      });
    }
  }, [doctorToEdit]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || (!doctorToEdit && !formData.password)) {
      alert("Name, Email, and Password are required");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) payload.append(key, value);
    });

    try {
      let response;
      if (doctorToEdit) {
        response = await axios.post(`http://127.0.0.1:8000/api/doctors/update/${doctorToEdit.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.post('http://127.0.0.1:8000/api/doctors', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      onSaved(response.data); // callback to refresh doctor list
      onClose();
      setFormData({
        name: '',
        email: '',
        password: '',
        specialization: '',
        experience: '',
        contact: '',
        status: 'Active',
        image: null
      });
    } catch (err) {
      console.error("Error saving doctor:", err.response?.data || err.message);
      alert("Failed to save doctor. Check console for details.");
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{doctorToEdit ? 'Edit Doctor' : 'Add Doctor'}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label>Profile Image</label>
                <input type="file" name="image" accept="image/*" className="form-control" onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label>Full Name</label>
                <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label>Email</label>
                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
              </div>
              {!doctorToEdit && (
                <div className="mb-3">
                  <label>Password</label>
                  <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} />
                </div>
              )}
              <div className="mb-3">
                <label>Specialization</label>
                <input type="text" name="specialization" className="form-control" value={formData.specialization} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label>Experience</label>
                <input type="number" name="experience" className="form-control" value={formData.experience} min="0" onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label>Contact</label>
                <input type="text" name="contact" className="form-control" value={formData.contact} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label>Status</label>
                <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Vacation</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>{doctorToEdit ? 'Update' : 'Save'}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDoctorModal;