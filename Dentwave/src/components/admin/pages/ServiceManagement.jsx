import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';

export default function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState(null);

  const [formData, setFormData] = useState({
    image: null,
    serviceName: '',
    description: '',
    cost: '',
    duration: '',
    keyBenefits: '',
    procedureOverview: ''
  });

  // Fetch services from backend
  const fetchServices = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/services");
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle input changes for ADD mode
  const handleInputChange = (e) => {
  const { name, value, files } = e.target;

  if ((name === "cost" || name === "duration") && Number(value) < 0) {
    return;
  }

  setFormData(prev => ({
    ...prev,
    [name]: files ? files[0] : value
  }));
};

  // Handle input changes for EDIT mode
  const handleEditChange = (e) => {
  const { name, value, files } = e.target;

  if ((name === "cost" || name === "duration") && Number(value) < 0) {
    return;
  }

  setEditService(prev => ({
    ...prev,
    [name]: files ? files[0] : value
  }));
};

  // Open modal for editing
  const openEditModal = (service) => {
    setEditService({
      id: service.id,
      serviceName: service.name,
      description: service.description,
      cost: service.cost,
      duration: service.duration,
      keyBenefits: service.key_benefits || '',
      procedureOverview: service.procedure_overview || '',
      image: null,
      old_image: service.image
    });
    setShowModal(true);
  };

  // Close modal and reset states
  const closeModal = () => {
    setShowModal(false);
    setEditService(null);
    setFormData({
      image: null,
      serviceName: '',
      description: '',
      cost: '',
      duration: '',
      keyBenefits: '',
      procedureOverview: ''
    });
  };

  // Handle Add or Update
  const handleAddOrUpdate = async () => {
    const data = editService || formData;

if (Number(data.cost) < 0) {
  return alert("Price cannot be negative");
}

if (Number(data.duration) <= 0) {
  return alert("Duration must be greater than 0");
}
    try {
      const payload = new FormData();
      
      if (editService) {
        // UPDATE mode
        payload.append("name", editService.serviceName);
        payload.append("description", editService.description);
        payload.append("cost", editService.cost);
        payload.append("duration", editService.duration);
        payload.append("key_benefits", editService.keyBenefits);
        payload.append("procedure_overview", editService.procedureOverview);
        
        if (editService.image) {
          payload.append("image", editService.image);
        }

        const res = await axios.post(
          `http://127.0.0.1:8000/api/services/update/${editService.id}`,
          payload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        // Refresh the services list
        await fetchServices();

      } else {
        // ADD mode
        payload.append("name", formData.serviceName);
        payload.append("description", formData.description);
        payload.append("cost", formData.cost);
        payload.append("duration", formData.duration);
        payload.append("key_benefits", formData.keyBenefits);
        payload.append("procedure_overview", formData.procedureOverview);
        
        if (formData.image) {
          payload.append("image", formData.image);
        }

        const res = await axios.post(
          "http://127.0.0.1:8000/api/services",
          payload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        // Refresh the services list
        await fetchServices();
      }

      closeModal();

    } catch (err) {
      console.error("Error adding/updating service:", err);
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/services/${id}`);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("Error deleting service: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-4" style={{ marginLeft: '240px', marginTop: '60px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Service Management</h2>
        <button className="btn btn-primary d-flex align-items-center" onClick={() => setShowModal(true)}>
          <Plus size={18} className="me-2" />
          Add New Service
        </button>
      </div>

      {/* Services Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Key Benefits</th>
                  <th>Procedure Overview</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(service => (
                  <tr key={service.id}>
                    <td>
                      {service.image && (
                        <img
                          src={`http://127.0.0.1:8000/storage/${service.image}`}
                          alt={service.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      )}
                    </td>
                    <td>{service.name}</td>
                    <td>{service.description}</td>
                    <td>${service.cost}</td>
                    <td>{service.duration} min</td>
                    <td>{service.key_benefits || '—'}</td>
                    <td>{service.procedure_overview || '—'}</td>
                    <td className="text-center">
                      <button 
                        className="btn btn-sm btn-link text-primary"
                        onClick={() => openEditModal(service)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger ms-1"
                        onClick={() => handleDelete(service.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div 
            className="modal-backdrop fade show" 
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} 
            onClick={closeModal}
          ></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header border-bottom">
                  <div>
                    <h5 className="modal-title">
                      {editService ? 'Edit Service' : 'Add New Service'}
                    </h5>
                    <p className="text-muted mb-0">Fill in the service details below.</p>
                  </div>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body p-4">
                  
                  <div className="mb-3">
                    <label className="form-label">Service Image</label>
                    <input 
                      type="file" 
                      name="image" 
                      accept="image/*" 
                      className="form-control" 
                      onChange={editService ? handleEditChange : handleInputChange}
                    />
                    {editService && editService.old_image && (
                      <small className="text-muted">Current image will be kept if no new image is uploaded</small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Service Name</label>
                    <input 
                      type="text" 
                      name="serviceName" 
                      className="form-control"
                      value={editService ? editService.serviceName : formData.serviceName}
                      onChange={editService ? handleEditChange : handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea 
                      name="description" 
                      className="form-control"
                      value={editService ? editService.description : formData.description}
                      onChange={editService ? handleEditChange : handleInputChange}
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <label className="form-label">Price</label>
                      <input 
                        type="number" 
                        name="cost" 
                         min="0"
                        step="0.01"
                        className="form-control"
                        value={editService ? editService.cost : formData.cost}
                        onChange={editService ? handleEditChange : handleInputChange}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label">Duration (min)</label>
                      <input 
                        type="number" 
                        name="duration" 
                        className="form-control"
                        min="1"
                        value={editService ? editService.duration : formData.duration}
                        onChange={editService ? handleEditChange : handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Key Benefits</label>
                    <textarea 
                      name="keyBenefits" 
                      className="form-control"
                      value={editService ? editService.keyBenefits : formData.keyBenefits}
                      onChange={editService ? handleEditChange : handleInputChange}
                      rows="2"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Procedure Overview</label>
                    <textarea 
                      name="procedureOverview" 
                      className="form-control"
                      value={editService ? editService.procedureOverview : formData.procedureOverview}
                      onChange={editService ? handleEditChange : handleInputChange}
                      rows="2"
                    ></textarea>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-outline-secondary" onClick={closeModal}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleAddOrUpdate}>
                      {editService ? "Update Service" : "Add Service"}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}