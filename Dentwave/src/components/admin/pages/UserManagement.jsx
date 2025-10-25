import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Filter, Plus, Eye, Edit, Trash2, ChevronDown } from 'lucide-react';

export default function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Dr. Emily Stone', email: 'emily@example.com', role: 'doctor' },
    { id: 3, name: 'Sarah Lee', email: 'sarah@example.com', role: 'patient' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add user locally
  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: users.length + 1,
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };
    setUsers([...users, newUser]);
    setShowModal(false);
    setFormData({ name: '', email: '', password: '', role: 'patient' });
  };

  // Delete user locally
  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // Role color styling
  const getRoleBadgeClass = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'text-danger';
      case 'doctor':
        return 'text-primary';
      case 'patient':
        return 'text-info';
      default:
        return 'text-secondary';
    }
  };

  return (
    <div
      className="p-4"
      style={{
        marginLeft: '240px',
        marginTop: '60px',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
      }}
    >
      {/* Breadcrumb */}
      <div className="mb-3">
        <span className="text-muted" style={{ fontSize: '14px' }}>
          Dashboard / User Management
        </span>
      </div>

      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">User Management</h2>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} className="me-2" /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="d-flex gap-3 mb-4">
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary d-flex align-items-center"
            type="button"
          >
            <Filter size={16} className="me-2" /> Role: All{' '}
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
                            fontSize: '14px',
                          }}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: '500' }}>{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-muted">{user.email}</span>
                    </td>
                    <td className="py-3">
                      <span
                        className={getRoleBadgeClass(user.role)}
                        style={{ fontWeight: '500' }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-link text-secondary p-1"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="btn btn-sm btn-link text-secondary p-1"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="btn btn-sm btn-link text-danger p-1"
                          title="Delete"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      No users found.
                    </td>
                  </tr>
                )}
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
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowModal(false)}
          ></div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header border-bottom">
                  <div>
                    <h5 className="modal-title mb-1">Add New User</h5>
                    <p
                      className="text-muted mb-0"
                      style={{ fontSize: '14px' }}
                    >
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
                    <label
                      className="form-label"
                      style={{ fontSize: '14px', fontWeight: '500' }}
                    >
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
                    <label
                      className="form-label"
                      style={{ fontSize: '14px', fontWeight: '500' }}
                    >
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
                    <label
                      className="form-label"
                      style={{ fontSize: '14px', fontWeight: '500' }}
                    >
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
                    <label
                      className="form-label"
                      style={{ fontSize: '14px', fontWeight: '500' }}
                    >
                      Role
                    </label>
                    <select
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
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
    </div>
  );
}
