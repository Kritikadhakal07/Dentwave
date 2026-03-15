import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import './header.css';
import NotificationBell from './NotificationBell.jsx';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Call Laravel logout API
      await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container-fluid px-4">
        {/* Logo - Always on left */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img 
            className="logo" 
            src="logo.png" 
            alt="Logo"
            style={{ height: '50px' }}
          />
        </Link>

        {/* Mobile Toggle Button - Right side */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
          aria-expanded={isOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Middle & Right Sections */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarContent">
          {/* Middle Section - Navigation Links */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link fw-semibold ${isActive('/') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/about" 
                className={`nav-link fw-semibold ${isActive('/about') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/service" 
                className={`nav-link fw-semibold ${isActive('/service') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/contact" 
                className={`nav-link fw-semibold ${isActive('/contact') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Contact Us
              </Link>
            </li>
          </ul>

          {/* Right Section - Auth & CTA */}
          <div className="d-flex align-items-center gap-2">
          {isAuthenticated() ? (
  <>
    {/* Notification Bell — only for logged-in users */}
    <NotificationBell userId={user?.id} />

    <div className="d-flex align-items-center gap-2 px-3 py-2 bg-light rounded">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
      </svg>
      <span className="fw-semibold text-dark">{user?.name}</span>
    </div>
    <button className="btn btn-outline-danger" onClick={handleLogout}>
      Logout
    </button>
  </>
) : (
              // Not Logged In
              <>
                <Link to="/login" className="btn btn-outline-primary" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-outline-secondary" onClick={closeMenu}>
                  Register
                </Link>
              </>
            )}
            
            
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;