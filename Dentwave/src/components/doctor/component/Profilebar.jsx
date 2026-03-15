import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, LogOut, User, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── Read from user_data JSON (set by AuthContext) ─────────────────────
const getUser = () => {
  try { return JSON.parse(localStorage.getItem('user_data')) || {}; }
  catch { return {}; }
};

export default function DoctorProfilebar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);

  // Re-read user_data on every dropdown open so profile edits reflect instantly
  const [user, setUser] = useState(getUser);

  useEffect(() => {
    if (dropdownOpen) setUser(getUser());
  }, [dropdownOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const doctorName  = user.name  || 'Doctor';
  const doctorEmail = user.email || 'doctor@dentwave.com';
  const doctorRole  = user.role  || 'Doctor';
  const initials    = doctorName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .dw-header {
          position: fixed; top: 0; right: 0; left: 240px; height: 64px;
          background: rgba(255,255,255,0.97); backdrop-filter: blur(12px);
          border-bottom: 1px solid #f0f2f5;
          display: flex; align-items: center; padding: 0 24px; gap: 12px;
          z-index: 200; font-family: 'DM Sans', sans-serif;
          box-shadow: 0 1px 0 #f0f0f0, 0 4px 20px rgba(0,0,0,0.03);
        }
        .dw-profile-btn {
          display: flex; align-items: center; gap: 9px;
          padding: 5px 10px 5px 5px; border-radius: 11px;
          border: 1.5px solid #eef0f3; background: #f8f9fb;
          cursor: pointer; transition: all 0.15s; user-select: none; flex-shrink: 0;
        }
        .dw-profile-btn:hover { background: #eff6ff; border-color: #bfdbfe; }
        .dw-avatar {
          width: 30px; height: 30px; border-radius: 8px;
          background: linear-gradient(135deg, #0ea5e9, #6366f1);
          color: #fff; font-size: 11px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .dw-profile-dd {
          position: absolute; top: calc(100% + 10px); right: 0; width: 230px;
          background: #fff; border-radius: 14px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
          border: 1px solid #f0f0f0; overflow: hidden;
          animation: dropIn 0.15s ease; z-index: 300;
        }
        .dw-dd-head { padding: 14px 16px; border-bottom: 1px solid #f3f4f6; }
        .dw-dd-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px; font-size: 13px; color: #374151;
          cursor: pointer; transition: background 0.12s; font-weight: 500;
        }
        .dw-dd-item:hover { background: #f8f9fb; }
        .dw-dd-item.danger { color: #ef4444; }
        .dw-dd-item.danger:hover { background: #fef2f2; }
        .dw-role-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 8px; border-radius: 20px;
          background: #f0fdfa; color: #0d9488;
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <header className="dw-header">
        {/* Page title */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', letterSpacing: '-0.2px' }}>
            Doctor Portal
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>
            Welcome back, {doctorName.split(' ')[0]}
          </div>
        </div>

        {/* Profile dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <div style={{ width: 1, height: 24, background: '#eef0f3', margin: '0 2px' }}/>
          <div style={{ position: 'relative' }} ref={dropRef}>
            <div className="dw-profile-btn" onClick={() => setDropdownOpen(v => !v)}>
              <div className="dw-avatar">{initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>{doctorName}</div>
                <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'capitalize' }}>{doctorRole}</div>
              </div>
              <ChevronDown size={13} color="#9ca3af"
                style={{ marginLeft: 2, transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}/>
            </div>

            {dropdownOpen && (
              <div className="dw-profile-dd">
                <div className="dw-dd-head">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div className="dw-avatar" style={{ width: 38, height: 38, fontSize: 13, borderRadius: 10 }}>{initials}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{doctorName}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{doctorEmail}</div>
                    </div>
                  </div>
                  <span className="dw-role-badge"><Stethoscope size={9}/> {doctorRole}</span>
                </div>
                <div className="dw-dd-item" onClick={() => { setDropdownOpen(false); navigate('/doctorprofile'); }}>
                  <User size={14} color="#6b7280"/> My Profile
                </div>
                <div style={{ height: 1, background: '#f3f4f6' }}/>
                <div className="dw-dd-item danger" onClick={handleLogout}>
                  <LogOut size={14}/> Sign Out
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}