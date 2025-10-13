import React, { useState } from 'react';
import { Search, Bell, User, Plus, Edit, Trash2, Calendar, Settings } from 'lucide-react';
import AddTimeSlotModal from './AddTimeSlotModal';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Evelyn Reed', specialization: 'Pediatrics', experience: '12 years', contact: '555-123-4567', status: 'Active' },
    { id: 2, name: 'Dr. Marcus Thorne', specialization: 'Cardiology', experience: '18 years', contact: '555-987-6543', status: 'Active' },
    { id: 3, name: 'Dr. Isabella Cruz', specialization: 'Dermatology', experience: '7 years', contact: '555-555-1212', status: 'On Leave' },
    { id: 4, name: 'Dr. Benjamin Hayes', specialization: 'Orthopedics', experience: '10 years', contact: '555-222-3333', status: 'Active' },
    { id: 5, name: 'Dr. Olivia Chen', specialization: 'Neurology', experience: '15 years', contact: '555-444-5555', status: 'Vacation' }
  ]);

  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Evelyn Reed');
  
  const [availability] = useState([
    { id: 1, day: 'Monday', startTime: '09:00 AM', endTime: '10:30 AM', status: 'Available' },
    { id: 2, day: 'Monday', startTime: '10:00 AM', endTime: '11:00 AM', status: 'Available' },
    { id: 3, day: 'Wednesday', startTime: '01:00 PM', endTime: '02:00 PM', status: 'Booked' }
  ]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'success';
      case 'On Leave': return 'warning';
      case 'Vacation': return 'primary';
      case 'Available': return 'success';
      case 'Booked': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div style={{ marginLeft: '240px', marginTop: '60px', backgroundColor: '#f8f9fa', minHeight: '100vh' }} className="d-flex" >
     
      {/* Main Content */}
      <div className="flex-grow-1" style={{ marginLeft: '0' }}>
        <div className="d-lg-none d-block" style={{ marginLeft: '0' }}></div>
        <div className="d-none d-lg-block" style={{ marginLeft: '250px' }}></div>
        
      

        {/* Page Content */}
        <div className="p-4">
          <h2 className="mb-4">Doctor Management</h2>

          {/* Doctor Roster */}
          <div className="bg-white rounded shadow-sm p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Doctor Roster</h5>
              <button className="btn btn-outline-primary btn-sm">
                <Plus size={16} className="me-1" />
                Add Doctor
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th className="d-none d-md-table-cell">Specialization</th>
                    <th className="d-none d-lg-table-cell">Experience</th>
                    <th className="d-none d-sm-table-cell">Contact</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map(doctor => (
                    <tr key={doctor.id}>
                      <td>{doctor.name}</td>
                      <td className="d-none d-md-table-cell">{doctor.specialization}</td>
                      <td className="d-none d-lg-table-cell">{doctor.experience}</td>
                      <td className="d-none d-sm-table-cell">{doctor.contact}</td>
                      <td>
                        <span className={`badge bg-${getStatusColor(doctor.status)}`}>
                          {doctor.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-secondary">
                            <Edit size={14} />
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Doctor Availability */}
          <div className="bg-white rounded shadow-sm p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3">
              <h5 className="mb-0">Doctor Availability</h5>
              <div className="d-flex gap-2 w-100 w-md-auto">
                <select className="form-select form-select-sm" style={{ maxWidth: '200px' }}
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <button className="btn btn-outline-primary btn-sm">
                  <Calendar size={16} className="me-1" />
                  Add Time Slot
                </button>
              </div>
            </div>
  

            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Day</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {availability.map(slot => (
                    <tr key={slot.id}>
                      <td>{slot.day}</td>
                      <td>{slot.startTime}</td>
                      <td>{slot.endTime}</td>
                      <td>
                        <span className={`badge bg-${getStatusColor(slot.status)}`}>
                          {slot.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-secondary">
                            <Edit size={14} />
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <Trash2 size={14} />
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

        </div>
        </div>
  );
};

export default DoctorManagement;