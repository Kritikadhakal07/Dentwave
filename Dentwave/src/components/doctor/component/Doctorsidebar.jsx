import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, UserCircle,
  Activity, ChevronRight, LogOut
} from 'lucide-react';

const NAV = [
  {

    items: [{ label: 'Dashboard', icon: LayoutDashboard, path: '/doctordashboard' }]
  },
  {

    items: [
      { label: 'Appointments', icon: Calendar, path: '/appointments' },
      { label: 'My Profile', icon: UserCircle, path: '/doctorprofile' },
    ]
  }
];

export default function DoctorSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState(null);

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  const userName = localStorage.getItem('user_name') || 'Doctor';
  const userRole = localStorage.getItem('user_role') || 'Doctor';
  const initials = userName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        .dw-sidebar {
          position: fixed; top: 0; left: 0; width: 240px; height: 100vh;
          background: #0c0e14; display: flex; flex-direction: column;
          font-family: 'DM Sans', sans-serif; z-index: 300;
          border-right: 1px solid rgba(255,255,255,0.05);
        }
        .dw-brand {
          padding: 20px 18px; border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; gap: 11px; cursor: default; user-select: none;
        }
        .dw-brand-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: linear-gradient(135deg, #0ea5e9, #6366f1);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .dw-brand-name { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 800; color: #fff; letter-spacing: -0.3px; line-height: 1; }
        .dw-brand-sub  { font-size: 9.5px; color: #d1d5db; font-weight: 500; letter-spacing: 0.9px; text-transform: uppercase; margin-top: 2px; }
        .dw-nav { flex: 1; padding: 12px 10px; overflow-y: auto; scrollbar-width: none; }
        .dw-nav::-webkit-scrollbar { display: none; }
        .dw-section-label { font-size: 9px; font-weight: 700; color: #d1d5db; letter-spacing: 1.3px; text-transform: uppercase; padding: 0 8px; margin: 18px 0 5px; }
        .dw-section-label:first-child { margin-top: 2px; }
        .dw-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px; border-radius: 8px; cursor: pointer;
          transition: all 0.15s; margin-bottom: 1px; user-select: none; position: relative;
        }
        .dw-nav-label { font-size: 13.5px; font-weight: 500; flex: 1; transition: color 0.15s; }
        .dw-nav-arrow { opacity: 0; transition: opacity 0.15s, transform 0.15s; transform: translateX(-4px); }
        .dw-nav-item.inactive { color: #d1d5db; }
        .dw-nav-item.inactive:hover { background: rgba(255,255,255,0.05); color: #d1d5db; }
        .dw-nav-item.inactive:hover .dw-nav-arrow { opacity: 1; transform: translateX(0); }
        .dw-nav-item.active { background: rgba(14,165,233,0.1); color: #38bdf8; }
        .dw-nav-item.active .dw-nav-label { color: #38bdf8; font-weight: 600; }
        .dw-nav-item.active::before { content: ''; position: absolute; left: -10px; top: 50%; transform: translateY(-50%); width: 3px; height: 18px; border-radius: 0 3px 3px 0; background: #0ea5e9; }
        .dw-nav-item.active .dw-nav-arrow { opacity: 1; transform: translateX(0); color: #38bdf8; }
        .dw-sidebar-footer { padding: 12px 10px 16px; border-top: 1px solid rgba(255,255,255,0.05); }
        .dw-user-card { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 9px; background: rgba(255,255,255,0.03); margin-bottom: 6px; cursor: pointer; transition: background 0.15s; }
        .dw-user-card:hover { background: rgba(255,255,255,0.06); }
        .dw-user-avatar { width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dw-user-name { font-size: 12.5px; font-weight: 600; color: #e5e7eb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dw-user-role { font-size: 10px; color: #d1d5db; text-transform: capitalize; }
        .dw-logout-btn { display: flex; align-items: center; gap: 9px; width: 100%; padding: 8px 10px; border-radius: 8px; border: none; background: transparent; color: #3d4554; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
        .dw-logout-btn:hover { background: rgba(239,68,68,0.1); color: #f87171; }
      `}</style>

      <aside className="dw-sidebar">
        {/* Brand */}
        <div className="dw-brand">
          <div className="dw-brand-icon"><Activity size={17} color="#fff" /></div>
          <div>
            <div className="dw-brand-name">DentWave</div>
            <div className="dw-brand-sub">Doctor Portal</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="dw-nav">
          {NAV.map(({ section, items }) => (
            <div key={section}>
              <div className="dw-section-label">{section}</div>
              {items.map(({ label, icon: Icon, path }) => {
                const active = isActive(path);
                return (
                  <div key={path} className={`dw-nav-item ${active ? 'active' : 'inactive'}`}
                    onClick={() => navigate(path)}
                    onMouseEnter={() => setHovered(path)}
                    onMouseLeave={() => setHovered(null)}>
                    <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                    <span className="dw-nav-label">{label}</span>
                    <ChevronRight size={12} className="dw-nav-arrow" />
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="dw-sidebar-footer">
          <div className="dw-user-card" onClick={() => navigate('/doctorprofile')}>
            <div className="dw-user-avatar">{initials}</div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div className="dw-user-name">{userName}</div>
              <div className="dw-user-role">{userRole}</div>
            </div>
          </div>
          <button className="dw-logout-btn" onClick={handleLogout}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}