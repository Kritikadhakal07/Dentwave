import React, { useState } from 'react';


export default function AppointmentManagement() {
  const [appointments] = useState([
    { id: 1, patient: 'Alice Johnson', doctor: 'Dr. Emily White', service: 'Check-up, ECG', dateTime: '2024-07-20 10:00 AM', status: 'Confirmed' },
    { id: 2, patient: 'Bob Williams', doctor: 'Dr. David Lee', service: 'Skin Rash Consultation', dateTime: '2024-07-20 02:30 PM', status: 'Pending' },
    { id: 3, patient: 'Charlie Brown', doctor: 'Dr. Sarah Davis', service: 'Vaccination', dateTime: '2024-07-21 09:00 AM', status: '' },
    { id: 4, patient: 'Diana Prince', doctor: 'Dr. Emily White', service: 'Stress Test', dateTime: '2024-07-21 11:30 AM', status: 'Confirmed' },
    { id: 5, patient: 'Eve Adams', doctor: 'Dr. Michael Chen', service: 'Migraine Consultation', dateTime: '2024-07-22 01:00 PM', status: 'Pending' },
    { id: 6, patient: 'Frank Green', doctor: 'Dr. David Lee', service: 'Acne Treatment', dateTime: '2024-07-22 03:45 PM', status: '' }
  ]);

  return (
    <div style={{  marginTop: '60px', backgroundColor: '#f8f9fa', minHeight: '100vh' }} className="d-flex vh-100 ">
     
    

    
      <div className="flex-grow-1 d-flex flex-column">

        {/* Main Content */}
        <div className="flex-grow-1 overflow-auto p-4">
          <h2 className="mb-1">Appointment Management</h2>
          
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">Appointment List</h5>
              <p className="text-muted">Manage all scheduled patient appointments.</p>
              
              {/* Filters */}
              <div className="row g-3 mb-3">
                <div className="col-md-2">
                  <select className="form-select">
                    <option>Filter by Doctor</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <select className="form-select">
                    <option>Filter by Patient</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <select className="form-select">
                    <option>Filter by Status</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <input type="date" className="form-control" placeholder="Start Date" />
                </div>
                <div className="col-md-2">
                  <input type="date" className="form-control" placeholder="End Date" />
                </div>
                <div className="col-md-2">
                  <button className="btn btn-primary w-100">Add New Appointment</button>
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Services</th>
                      <th>Date/Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(apt => (
                      <tr key={apt.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="bg-secondary rounded-circle" style={{ width: '30px', height: '30px' }}></div>
                            {apt.patient}
                          </div>
                        </td>
                        <td>{apt.doctor}</td>
                        <td>{apt.service}</td>
                        <td>{apt.dateTime}</td>
                        <td>
                          {apt.status && (
                            <span className={`badge ${apt.status === 'Confirmed' ? 'bg-success' : 'bg-warning'}`}>
                              {apt.status}
                            </span>
                          )}
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2">View Details</button>
                          <button className="btn btn-sm btn-outline-secondary">⋯</button>
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
    </div>
  );
}