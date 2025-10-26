import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    role: 'user',
    status: 'Pending'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        // Update user
        await axios.post(`http://127.0.0.1:8000/api/users/update/${editUser.id}`, formData);
      } else {
        // Create new user
        await axios.post("http://127.0.0.1:8000/api/users", formData);
      }
      
      fetchUsers();
      closeModal();
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error deleting user: " + (err.response?.data?.message || err.message));
    }
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      phone: user.phone || '',
      gender: user.gender || '',
      role: user.role,
      status: user.status
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      gender: '',
      role: 'user',
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
      case 'admin': return 'text-danger';
      case 'doctor': return 'text-primary';
      case 'user': return 'text-info';
      default: return 'text-secondary';
    }
  };

  const getRoleDisplayName = (role) => {
    switch(role) {
      case 'admin': return 'Admin';
      case 'doctor': return 'Doctor';
      case 'user': return 'User';
      default: return role;
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="p-4" style={{ marginLeft: '240px', marginTop: '60px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="mb-3">
        <span className="text-muted" style={{ fontSize: '14px' }}>
          Dashboard / User Management
        </span>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">User Management</h2>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} className="me-2" /> Add User
        </button>
      </div>

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
                  <th className="border-0 py-3">Phone</th>
                  <th className="border-0 py-3">Gender</th>
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
                          {getInitials(user.name)}
                        </div>
                        <span style={{ fontWeight: '500' }}>{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-muted">{user.email}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-muted">{user.phone || '—'}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-muted text-capitalize">{user.gender || '—'}</span>
                    </td>
                    <td className="py-3">
                      <span className={getRoleBadgeClass(user.role)} style={{ fontWeight: '500' }}>
                        {getRoleDisplayName(user.role)}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button 
                          className="btn btn-sm btn-link text-secondary p-1" 
                          title="Edit"
                          onClick={() => openEditModal(user)}
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

      {/* Add/Edit User Modal */}
      {showModal && (
        <>
          <div 
            className="modal-backdrop fade show" 
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1040
            }}
            onClick={closeModal}
          ></div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1050,
              overflow: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <div className="modal-dialog" style={{ margin: '0 auto', maxWidth: '500px', width: '100%' }}>
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header border-bottom">
                  <div>
                    <h5 className="modal-title mb-1">
                      {editUser ? 'Edit User' : 'Add New User'}
                    </h5>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      {editUser ? 'Update user information below.' : 'Fill in the details below to create a new user account.'}
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={closeModal}
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
                    <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Phone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Gender
                    </label>
                    <select
                      className="form-select"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" style={{ fontSize: '14px', fontWeight: '500' }}>
                      Password {editUser && <small className="text-muted">(leave blank to keep current)</small>}
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
                      <option value="user">User</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
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
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      {editUser ? 'Update User' : 'Add User'}
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

        .modal-dialog {
          position: relative;
          pointer-events: auto;
        }

        .modal-content {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 100%;
          pointer-events: auto;
          background-color: #fff;
          background-clip: padding-box;
          border: 1px solid rgba(0,0,0,.2);
          border-radius: 0.5rem;
          outline: 0;
        }

        @media (max-height: 700px) {
          .modal {
            align-items: flex-start !important;
            padding-top: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
