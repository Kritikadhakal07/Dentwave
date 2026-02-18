import React from "react";
import { Nav, Button } from "react-bootstrap";
/* Subtle hover / active like the screenshot */
import LogoutButton from '../../LogoutButton';


const Doctorsidebar = () => {
  return (
    <aside
      className="d-flex flex-column border-end bg-white"
      style={{ width: 260, minHeight: "100vh" }}
    >
      {/* Header / Logo */}
      <div className="px-3 py-3 border-bottom">
         <div className="p-3 border-bottom">
        <h4 className="text-primary m-0" style={{ fontFamily: 'cursive' }}>✱ Dentwave</h4>
      </div>
      </div>

      {/* Nav items */}
      <Nav className="flex-column px-2 pt-2" variant="pills">
        <Nav.Link 
          href="#dashboard"
          style={{background:"white",color:"gray"  }}
          className="d-flex align-items-center gap-2 rounded-2 px-2 py-2 sidebar-link"
          active
        >
          <i className="bi bi-grid-3x3-gap"></i>
          <span>Dashboard</span>
        </Nav.Link>

        <Nav.Link 
          href="#appointments"
          style={{color:"gray"  }}

          className="d-flex align-items-center gap-2 rounded-2 px-2 py-2 sidebar-link"
        >
          <i className="bi bi-calendar3"></i>
          <span>My Appointments</span>
        </Nav.Link>

        <Nav.Link
          href="#profile"
          style={{color:"gray"  }}

          className="d-flex align-items-center gap-2 rounded-2 px-2 py-2 sidebar-link"
        >
          <i className="bi bi-person"></i>
          <span>Profile</span>
        </Nav.Link>
      </Nav>

      {/* Push logout to bottom */}
      <div className="mt-auto p-3">
        <Button variant="danger" className="w-100 d-flex align-items-center justify-content-center gap-2">
          <i className="bi bi-box-arrow-right"></i>
          Logout
        </Button>
      </div>

      <LogoutButton />
    </aside>
  );
};

export default Doctorsidebar;
