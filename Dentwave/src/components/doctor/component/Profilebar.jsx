
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  Search, Bell} from 'lucide-react';

// Header Component
function Profilebar() {
  return (
    <nav className="navbar navbar-light bg-white border-bottom px-4 py-3" style={{ position: 'fixed', top: 0, right: 0, left: '240px', zIndex: 100 }}>
      <div className="container-fluid">
        <div className="d-flex align-items-center flex-grow-1">
          <div className="position-relative" style={{ maxWidth: '400px', width: '100%' }}>
            <Search size={18} className="position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
            <input
              type="search"
              className="form-control ps-5"
              placeholder="Search appointments, patients..."
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-link text-secondary position-relative p-0">
            <Bell size={20} />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
              3
            </span>
          </button>
          <div className="rounded-circle bg-secondary" style={{ width: '36px', height: '36px', backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
        </div>
      </div>
    </nav>
  );
}

export default Profilebar;