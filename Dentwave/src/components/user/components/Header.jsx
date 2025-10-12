import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import './header.css';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container-fluid px-4">
        {/* Logo - Always on left */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img 
            className="logo" 
            src="https://via.placeholder.com/150x50?text=Your+Logo" 
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
            <Link to="/login" className="btn btn-outline-primary" onClick={closeMenu}>
              Login
            </Link>
            <Link to="/register" className="btn btn-outline-secondary" onClick={closeMenu}>
              Register
            </Link>
            <button className="btn btn-primary btn-book d-flex align-items-center gap-2 justify-content-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
              </svg>
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;