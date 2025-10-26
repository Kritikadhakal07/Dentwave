import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Plus } from 'lucide-react';

export default function ServiceManagement() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    price: '',
    duration: ''
  });

  // Sample service data
  const services = [
    {
      id: 1,
      name: 'General Consultation',
      description: 'A comprehensive health assessment and discussion of patient concerns with a general practitioner. Includes basic check-up.',
      price: '$80.00',
      duration: '30 min'
    },
    {
      id: 2,
      name: 'Dental Cleaning',
      description: 'Professional cleaning to remove plaque and tartar, polish teeth, and prevent gum disease. Recommended every six months.',
      price: '$120.00',
      duration: '60 min'
    },
    {
      id: 3,
      name: 'Physical Therapy Session',
      description: 'Personalized session with a licensed physical therapist to improve mobility, reduce pain, and restore function after injury or surgery. Focuses on exercises and manual therapy.',
      price: '$100.00',
      duration: '45 min'
    },
    {
      id: 4,
      name: 'Eye Exam',
      description: 'Comprehensive eye examination by an optometrist to assess visual acuity, screen for eye diseases, and update prescriptions. Includes retinal imaging.',
      price: '$95.00',
      duration: '40 min'
    },
    {
      id: 5,
      name: 'Vaccination Clinic',
      description: 'Administration of various vaccines for preventative health, including seasonal flu shots and routine immunizations. Quick and efficient service.',
      price: '$50.00',
      duration: '15 min'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    setShowModal(false);
    setFormData({
      serviceName: '',
      description: '',
      price: '',
      duration: ''
    });
  };

  return (
    <div className="p-4" style={{  marginTop: '60px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Service Management</h2>
        <button 
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setShowModal(true)}
        >
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
                  <th className="border-0 py-3 ps-4" style={{ width: '15%' }}>Service Name</th>
                  <th className="border-0 py-3" style={{ width: '40%' }}>Description</th>
                  <th className="border-0 py-3" style={{ width: '12%' }}>Price</th>
                  <th className="border-0 py-3" style={{ width: '12%' }}>Duration</th>
                  <th className="border-0 py-3 text-center" style={{ width: '21%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="py-3 ps-4">
                      <span style={{ fontWeight: '500' }}>{service.name}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-muted" style={{ fontSize: '14px' }}>
                        {service.description}
                      </span>
                    </td>
                    <td className="py-3">
                      <span style={{ fontWeight: '500' }}>{service.price}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-muted">{service.duration}</span>
                    </td>
                    <td className="py-3">
                      <div className="d-flex justify-content-center gap-2">
                        <button className="btn btn-sm btn-link text-primary" style={{ textDecoration: 'none', fontSize: '14px' }}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" style={{ fontSize: '14px', padding: '4px 16px' }}>
                          Remove
                        </button>
                        <button className="btn btn-sm btn-outline-primary" style={{ fontSize: '14px', padding: '4px 12px' }}>
                          Update Price
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New Service Modal */}
      {showModal && (
        <>
          <div 
            className="modal-backdrop fade show" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => setShowModal(false)}
          ></div>

          <div 
            className="modal fade show d-block" 
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header border-bottom">
                  <div>
                    <h5 className="modal-title mb-1">Add New Service</h5>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      Fill in the service details below.
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Service Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="serviceName"
                      value={formData.serviceName}
                      onChange={handleInputChange}
                      placeholder="Enter service name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter service description"
                      rows="4"
                      style={{ resize: 'none' }}
                    ></textarea>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <div className="mb-4">
                        <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                          Price
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input
                            type="number"
                            className="form-control"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="mb-4">
                        <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                          Duration
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            placeholder="30"
                          />
                          <span className="input-group-text">min</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2 justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      Add Service
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .table tbody tr {
          transition: background-color 0.2s;
          border-bottom: 1px solid #e9ecef;
        }

        .table tbody tr:hover {
          background-color: #f8f9fa;
        }

        .btn-link {
          text-decoration: none;
          padding: 4px 16px;
        }

        .btn-link:hover {
          background-color: #e7f1ff;
          border-radius: 4px;
        }

        .modal {
          display: block;
        }

        .form-control, .form-select, textarea {
          border: 1px solid #e0e0e0;
          padding: 10px 12px;
          font-size: 14px;
        }

        .form-control:focus, .form-select:focus, textarea:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.1);
        }

        .form-label {
          color: #495057;
          margin-bottom: 8px;
        }

        .card {
          border-radius: 8px;
        }

        .btn {
          font-size: 14px;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1040;
          width: 100vw;
          height: 100vh;
        }

        .modal.show {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1050;
          width: 100%;
          height: 100%;
          overflow: hidden;
          outline: 0;
        }

        .modal-dialog {
          max-width: 600px;
        }

        .input-group-text {
          background-color: #f8f9fa;
          border: 1px solid #e0e0e0;
          color: #6c757d;
          font-size: 14px;
        }

        .table thead th {
          font-weight: 600;
          font-size: 13px;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-sm {
          padding: 6px 12px;
        }
      `}</style>
    </div>
  );
}