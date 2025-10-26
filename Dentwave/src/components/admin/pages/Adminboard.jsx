import React from 'react';
import { Calendar, AlertCircle, UserCheck, RefreshCw, User, Clock, Plus, UserPlus, Search, Bell } from 'lucide-react';
function MainContent() {
  const metrics = [
    { label: 'Total Appointments Today', value: '120', icon: <Calendar size={20} className="text-primary" /> },
    { label: 'Pending Appointments', value: '15', icon: <AlertCircle size={20} className="text-danger" /> },
    { label: 'Total Users', value: '500', icon: <UserCheck size={20} className="text-success" /> },
    { label: 'Total Doctors', value: '25', icon: <RefreshCw size={20} className="text-info" /> },
    { label: 'Total Patients', value: '1200', icon: <User size={20} className="text-purple" /> },
    { label: 'Upcoming Bookings', value: '75', icon: <Clock size={20} className="text-warning" /> },
  ];

  return (
    <div className="p-4" style={{ marginTop: '60px' }}>
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Key Metrics */}
      <h5 className="mb-3">Key Metrics</h5>
      <div className="row g-3 mb-5">
        {metrics.map((metric, index) => (
          <div key={index} className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="text-muted" style={{ fontSize: '13px' }}>{metric.label}</span>
                  {metric.icon}
                </div>
                <h3 className="mb-0">{metric.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h5 className="mb-3">Quick Actions</h5>
      <div className="d-flex gap-3 flex-wrap">
        <button className="btn btn-primary d-flex align-items-center">
          <Plus size={18} className="me-2" />
          Add Service
        </button>
        <button className="btn btn-outline-secondary d-flex align-items-center">
          <UserPlus size={18} className="me-2" />
          Add Doctor
        </button>
        <button className="btn btn-outline-secondary d-flex align-items-center">
          <User size={18} className="me-2" />
          Manage Users
        </button>
      </div>
    </div>
  );
}

// Main App Component
export default function AdminDashboard() {
  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
     

      {/* Main Content Area */}
      <div style={{  width: 'calc(100% - 240px)' }}>
      

        {/* Main Content */}
        <MainContent />
      </div>

      <style>{`
        .text-purple {
          color: #8b5cf6;
        }
        
        .sidebar a:hover {
          background-color: #f8f9fa !important;
        }

        .card {
          transition: transform 0.2s;
        }

        .card:hover {
          transform: translateY(-2px);
        }

        .btn {
          font-size: 14px;
          padding: 8px 16px;
        }

        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
        }
      `}</style>
    </div>
  );
}