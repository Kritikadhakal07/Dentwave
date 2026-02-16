import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from '../../LogoutButton';
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  UserCog,
  Calendar,
  Briefcase,
  Shield,
  User
} from 'lucide-react';

function Sidebar() {
  const sidebarItems = [
    { icon: <Home size={18} />, label: 'Dashboard', path: '/admindashboard' },
    { icon: <Users size={18} />, label: 'User Management', path: '/usermanagement' },
    { icon: <UserCog size={18} />, label: 'Doctor Management', path: '/doctormanagement' },
    { icon: <User size={18} />, label: 'Patient Management', path: '/patientmanagement' },
    { icon: <Calendar size={18} />, label: 'Appointment Management', path: '/appointmentmanagement' },
    { icon: <Briefcase size={18} />, label: 'Service Management', path: '/servicemanagement' },
  ];

  return (
    <div
      className="sidebar"
      style={{
        width: '240px',
        backgroundColor: '#fff',
        borderRight: '1px solid #e0e0e0',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        zIndex: 200
      }}
    >
      {/* Logo */}
      <Link to="/" className="navbar-brand">
          <img 
            className="logo" 
            src="logo.jpg" 
            alt="Logo"
            style={{ height: '50px' }}
          />
        </Link>

      {/* Menu */}
      <nav className="py-3">
        {sidebarItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `d-flex align-items-center px-3 py-2 text-decoration-none ${
                isActive ? 'bg-light text-primary' : 'text-secondary'
              }`
            }
            style={({ isActive }) => ({
              fontSize: '14px',
              transition: 'all 0.2s',
              borderLeft: isActive
                ? '3px solid #0d6efd'
                : '3px solid transparent'
            })}
          >
            <span className="me-2">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-top">
        <LogoutButton />
      </div>
    </div>
  );
}

export default Sidebar;
