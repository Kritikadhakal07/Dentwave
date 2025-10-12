import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  Filter, Plus, Eye, Edit, Trash2, ChevronDown
} from 'lucide-react';

export default function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Patient',
    status: 'Pending'
  });

  // Sample user data
  const users = [
    { id: 1, name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'Admin', status: 'Active', avatar: 'AJ' },
    { id: 2, name: 'Dr. Bob Williams', email: 'bob.williams@example.com', role: 'Doctor', status: 'Active', avatar: 'BW' },
    { id: 3, name: 'Charlie Brown', email: 'charlie.brown@example.com', role: 'Patient', status: 'Inactive', avatar: 'CB' },
    { id: 4, name: 'Dana Miller', email: 'dana.miller@example.com', role: 'Staff', status: 'Active', avatar: 'DM' },
    { id: 5, name: 'Eve Davis', email: 'eve.davis@example.com', role: 'Patient', status: 'Pending', avatar: 'ED' },
    { id: 6, name: 'Frank White', email: 'frank.white@example.com', role: 'Doctor', status: 'Inactive', avatar: 'FW' },
    { id: 7, name: 'Grace Taylor', email: 'grace.taylor@example.com', role: 'Admin', status: 'Active', avatar: 'GT' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowModal(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'Patient',
      status: 'Pending'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Active': return 'bg-success';
      case 'Inactive': return 'bg-secondary';
      case 'Pending': return 'bg-warning';
      default: return 'bg-secondary';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'Admin': return 'text-danger';
      case 'Doctor': return 'text-primary';
      case 'Patient': return 'text-info';
      case 'Staff': return 'text-success';
      default: return 'text-secondary';
    }
  };

  return (
    <div className="p-4" style={{ marginLeft: '240px', marginTop: '60px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-3">
        <span className="text-muted" style={{ fontSize: '14px' }}>Dashboard / User Management</span>
      </div>

      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">User Management</h2>
        <button 
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} className="me-2" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="d-flex gap-3 mb-4">
        <div className="dropdown">
          <button className="btn btn-outline-secondary d-flex align-items-center" type="button">
            <Filter size={16} className="me-2" />
            Role: All
            <ChevronDown size={16} className="ms-2" />
          </button>
        </div>
        <div className="dropdown">
          <button className="btn btn-outline-secondary d-flex align-items-center" type="button">
            <Filter size={16} className="me-2" />
            Status: All
            <ChevronDown size={16} className="ms-2" />
          </button>
        </div>
      </div>

      {/* User List Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom py-3">
          <h5 className="mb-0">User List</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 py-3 ps-4">Name</th>
                  <th className="border-0 py-3">Email</th>
                  <th className="border-0 py-3">Role</th>
                  <th className="border-0 py-3">Status</th>
                  <th className="border-0 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3 ps-4">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            fontWeight: '600',
                            fontSize: '14px'
                          }}
                        >
                          {user.avatar}
                        </div>
                        <span style={{ fontWeight: '500' }}>{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-muted">{user.email}</span>
                    </td>
                    <td className="py-3">
                      <span className={getRoleBadgeClass(user.role)} style={{ fontWeight: '500' }}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <span 
                        className={`badge ${getStatusBadgeClass(user.status)}`}
                        style={{ fontSize: '12px', padding: '4px 12px' }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="d-flex justify-content-center gap-2">
                        <button className="btn btn-sm btn-link text-secondary p-1" title="View">
                          <Eye size={18} />
                        </button>
                        <button className="btn btn-sm btn-link text-secondary p-1" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button className="btn btn-sm btn-link text-danger p-1" title="Delete">
                          <Trash2 size={18} />
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

      {/* Add User Modal */}
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
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header border-bottom">
                  <div>
                    <h5 className="modal-title mb-1">Add New User</h5>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      Fill in the details below to create a new user account.
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
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Role
                    </label>
                    <select
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="Patient">Patient</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Admin">Admin</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Status
                    </label>
                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
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
                      Add User
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
        }

        .table tbody tr:hover {
          background-color: #f8f9fa;
        }

        .btn-link {
          text-decoration: none;
        }

        .btn-link:hover {
          background-color: #f8f9fa;
          border-radius: 4px;
        }

        .modal {
          display: block;
        }

        .form-control, .form-select {
          border: 1px solid #e0e0e0;
          padding: 10px 12px;
          font-size: 14px;
        }

        .form-control:focus, .form-select:focus {
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
      `}</style>
    </div>
  );
}