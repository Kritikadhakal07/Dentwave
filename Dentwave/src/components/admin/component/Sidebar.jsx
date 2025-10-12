// Sidebar Component
function Sidebar() {
  const sidebarItems = [
    // { icon: <Home size={18} />, label: 'Dashboard', active: true },
    // { icon: <Users size={18} />, label: 'User Management' },
    // { icon: <UserCog size={18} />, label: 'Doctor Management' },
    // { icon: <User size={18} />, label: 'Patient Management' },
    // { icon: <Calendar size={18} />, label: 'Appointment Management' },
    // { icon: <Briefcase size={18} />, label: 'Service Management' },
    // { icon: <Shield size={18} />, label: 'Credential Management' },

    <p>hshbdc</p>
  ];

  return (
    <div className="sidebar" style={{ 
      width: '240px', 
      backgroundColor: '#fff', 
      borderRight: '1px solid #e0e0e0',
      position: 'fixed',
      height: '100vh',
      overflowY: 'auto',
      zIndex: 200
    }}>
      {/* Logo */}
      <div className="p-3 border-bottom">
        <h4 className="text-primary m-0" style={{ fontFamily: 'cursive' }}>✱ logo</h4>
      </div>

      {/* Menu Items */}
      <nav className="py-3">
        {sidebarItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`d-flex align-items-center px-3 py-2 text-decoration-none ${
              item.active ? 'bg-light text-primary' : 'text-secondary'
            }`}
            style={{ 
              fontSize: '14px',
              transition: 'all 0.2s',
              borderLeft: item.active ? '3px solid #0d6efd' : '3px solid transparent'
            }}
          >
            <span className="me-2">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>

      {/* Settings at bottom */}
      {/* <div style={{ position: 'absolute', bottom: '80px', width: '100%' }}>
        <a
          href="#"
          className="d-flex align-items-center px-3 py-2 text-decoration-none text-white"
          style={{ backgroundColor: '#0d6efd', margin: '0 12px', borderRadius: '6px' }}
        >
          <Settings size={18} className="me-2" />
          Settings
        </a>
      </div>

    //   {/* Footer Links */}
      {/* <div className="border-top p-3" style={{ position: 'absolute', bottom: '0', width: '100%', backgroundColor: '#fff' }}>
        <div className="d-flex justify-content-around">
          <a href="#" className="text-secondary text-decoration-none" style={{ fontSize: '12px' }}>Company</a>
          <a href="#" className="text-secondary text-decoration-none" style={{ fontSize: '12px' }}>Resources</a>
          <a href="#" className="text-secondary text-decoration-none" style={{ fontSize: '12px' }}>Legal</a>
        </div>
      </div>  */}
    </div>
  );
}

export default Sidebar;