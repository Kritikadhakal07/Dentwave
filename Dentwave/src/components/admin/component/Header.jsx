import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Bell, ChevronDown, LogOut, User, Shield, X, Calendar, Stethoscope, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API = 'http://127.0.0.1:8000/api';

export default function Header() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [query, setQuery]               = useState('');
  const [searchOpen, setSearchOpen]     = useState(false);
  const [results, setResults]           = useState({ appointments: [], patients: [], doctors: [] });
  const [searching, setSearching]       = useState(false);

  const dropRef    = useRef(null);
  const notifRef   = useRef(null);
  const searchRef  = useRef(null);
  const debounceRef = useRef(null);

  const adminName  = localStorage.getItem('user_name')  || 'Admin';
  const adminEmail = localStorage.getItem('user_email') || 'admin@dentwave.com';
  const adminRole  = localStorage.getItem('user_role')  || 'admin';
  const initials   = adminName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current   && !dropRef.current.contains(e.target))   setDropdownOpen(false);
      if (notifRef.current  && !notifRef.current.contains(e.target))  setNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ESC closes search
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') { setSearchOpen(false); setQuery(''); } };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults({ appointments: [], patients: [], doctors: [] }); return; }
    setSearching(true);
    try {
      const [apptRes, usersRes, docRes] = await Promise.all([
        fetch(`${API}/appointments`),
        fetch(`${API}/users`),
        fetch(`${API}/doctors`),
      ]);
      const [appts, users, docs] = await Promise.all([apptRes.json(), usersRes.json(), docRes.json()]);
      const lq = q.toLowerCase();
      setResults({
        appointments: appts.filter(a =>
          a.patient_name?.toLowerCase().includes(lq) ||
          a.doctor_name?.toLowerCase().includes(lq)  ||
          a.status?.toLowerCase().includes(lq)
        ).slice(0, 4),
        patients: users.filter(u => u.role === 'user' && (
          u.name?.toLowerCase().includes(lq) ||
          u.email?.toLowerCase().includes(lq) ||
          (u.phone || '').includes(lq)
        )).slice(0, 3),
        doctors: docs.filter(d =>
          d.name?.toLowerCase().includes(lq) ||
          d.specialization?.toLowerCase().includes(lq)
        ).slice(0, 3),
      });
    } catch { /**/ }
    finally { setSearching(false); }
  }, []);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSearchOpen(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 350);
  };

  const totalResults = results.appointments.length + results.patients.length + results.doctors.length;
  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

 
  const formatDate  = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

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
        .dw-search-wrap { flex: 1; max-width: 440px; position: relative; }
        .dw-search-input {
          width: 100%; padding: 8px 34px 8px 38px;
          border-radius: 10px; border: 1.5px solid #eef0f3; background: #f8f9fb;
          font-size: 13px; font-family: 'DM Sans', sans-serif; color: #374151;
          outline: none; transition: all 0.2s;
        }
        .dw-search-input:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.08); }
        .dw-s-icon  { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #9ca3af; }
        .dw-s-clear { position: absolute; right: 9px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #9ca3af; background: none; border: none; padding: 2px; display: flex; border-radius: 4px; }
        .dw-s-clear:hover { color: #374151; background: #f3f4f6; }
        .dw-s-dropdown {
          position: absolute; top: calc(100% + 8px); left: 0; right: 0;
          background: #fff; border-radius: 14px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
          border: 1px solid #f0f0f0; overflow: hidden; animation: dropIn 0.15s ease;
          z-index: 400; max-height: 460px; overflow-y: auto;
        }
        .dw-s-section { padding: 10px 14px 4px; font-size: 10px; font-weight: 700; color: #9ca3af; letter-spacing: 0.8px; text-transform: uppercase; display: flex; align-items: center; gap: 5px; }
        .dw-s-row { display: flex; align-items: center; gap: 11px; padding: 9px 14px; cursor: pointer; transition: background 0.12s; }
        .dw-s-row:hover { background: #f8f9fb; }
        .dw-s-ico { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dw-s-empty { padding: 28px 0; text-align: center; color: #9ca3af; font-size: 13px; }
        .dw-s-footer { padding: 8px 14px; border-top: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; }
        .dw-kbd { padding: 2px 7px; border-radius: 5px; background: #f3f4f6; font-size: 10px; color: #9ca3af; font-weight: 600; border: 1px solid #e5e7eb; }
        .dw-icon-btn {
          position: relative; width: 36px; height: 36px; border-radius: 9px;
          border: 1.5px solid #eef0f3; background: #f8f9fb;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #6b7280; transition: all 0.15s; flex-shrink: 0;
        }
        .dw-icon-btn:hover { background: #eff6ff; border-color: #bfdbfe; color: #3b82f6; }
        .dw-notif-badge { position: absolute; top: -4px; right: -4px; width: 17px; height: 17px; background: #ef4444; border-radius: 50%; font-size: 9px; font-weight: 700; color: #fff; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; }
        .dw-notif-dd { position: absolute; top: calc(100% + 10px); right: 0; width: 320px; background: #fff; border-radius: 14px; box-shadow: 0 16px 48px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #f0f0f0; overflow: hidden; animation: dropIn 0.15s ease; z-index: 300; }
        .dw-notif-head { padding: 13px 16px 10px; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; }
        .dw-notif-item { padding: 11px 16px; display: flex; align-items: flex-start; gap: 11px; border-bottom: 1px solid #f9fafb; transition: background 0.12s; }
        .dw-notif-item:hover { background: #f8f9fb; }
        .dw-notif-item.unread { background: #fafbff; }
        .dw-profile-btn { display: flex; align-items: center; gap: 9px; padding: 5px 10px 5px 5px; border-radius: 11px; border: 1.5px solid #eef0f3; background: #f8f9fb; cursor: pointer; transition: all 0.15s; user-select: none; flex-shrink: 0; }
        .dw-profile-btn:hover { background: #eff6ff; border-color: #bfdbfe; }
        .dw-avatar { width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dw-profile-dd { position: absolute; top: calc(100% + 10px); right: 0; width: 230px; background: #fff; border-radius: 14px; box-shadow: 0 16px 48px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #f0f0f0; overflow: hidden; animation: dropIn 0.15s ease; z-index: 300; }
        .dw-dd-head { padding: 14px 16px; border-bottom: 1px solid #f3f4f6; }
        .dw-dd-item { display: flex; align-items: center; gap: 10px; padding: 10px 16px; font-size: 13px; color: #374151; cursor: pointer; transition: background 0.12s; font-weight: 500; }
        .dw-dd-item:hover { background: #f8f9fb; }
        .dw-dd-item.danger { color: #ef4444; }
        .dw-dd-item.danger:hover { background: #fef2f2; }
        .dw-role-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 20px; background: #eff6ff; color: #3b82f6; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        @keyframes dropIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin-s { to { transform: rotate(360deg); } }
        @keyframes pulse-s { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      <header className="dw-header">

        {/* Search */}
        <div className="dw-search-wrap" ref={searchRef}>
          <Search size={14} className="dw-s-icon"/>
          <input className="dw-search-input" type="text"
            placeholder="Search patients, appointments, doctors…"
            value={query} onChange={handleQueryChange}
            onFocus={() => query.trim() && setSearchOpen(true)}
          />
          {query && <button className="dw-s-clear" onClick={() => { setQuery(''); setSearchOpen(false); setResults({ appointments: [], patients: [], doctors: [] }); }}><X size={12}/></button>}

          {searchOpen && query.trim() && (
            <div className="dw-s-dropdown">
              {searching ? (
                <div className="dw-s-empty">
                  <div style={{ width: 18, height: 18, border: '2.5px solid #e5e7eb', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin-s 0.7s linear infinite', margin: '0 auto 8px' }}/>
                  Searching…
                </div>
              ) : totalResults === 0 ? (
                <div className="dw-s-empty">
                  <Search size={24} style={{ color: '#e5e7eb', marginBottom: 8, display: 'block', margin: '0 auto 8px' }}/>
                  No results for "<strong>{query}</strong>"
                </div>
              ) : (
                <>
                  {results.appointments.length > 0 && (
                    <>
                      <div className="dw-s-section"><Calendar size={9}/>Appointments</div>
                      {results.appointments.map(a => (
                        <div key={a.id} className="dw-s-row" onClick={() => { navigate('/appointmentmanagement'); setSearchOpen(false); setQuery(''); }}>
                          <div className="dw-s-ico" style={{ background: '#eff6ff' }}><Calendar size={13} color="#3b82f6"/></div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.patient_name || 'Unknown'}</div>
                            <div style={{ fontSize: 11, color: '#9ca3af' }}>{a.doctor_name} · {formatDate(a.appointment_date)}</div>
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, flexShrink: 0, padding: '2px 7px', borderRadius: 20, background: a.status === 'Pending' ? '#fffbeb' : a.status === 'Confirmed' ? '#f0fdf4' : '#f3f4f6', color: a.status === 'Pending' ? '#b45309' : a.status === 'Confirmed' ? '#15803d' : '#6b7280' }}>{a.status}</span>
                        </div>
                      ))}
                    </>
                  )}
                  {results.patients.length > 0 && (
                    <>
                      <div className="dw-s-section"><Users size={9}/>Patients</div>
                      {results.patients.map(p => (
                        <div key={p.id} className="dw-s-row" onClick={() => { navigate('/patientmanagement'); setSearchOpen(false); setQuery(''); }}>
                          <div className="dw-s-ico" style={{ background: '#faf5ff' }}><User size={13} color="#a855f7"/></div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.email}</div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {results.doctors.length > 0 && (
                    <>
                      <div className="dw-s-section"><Stethoscope size={9}/>Doctors</div>
                      {results.doctors.map(d => (
                        <div key={d.id} className="dw-s-row" onClick={() => { navigate('/doctormanagement'); setSearchOpen(false); setQuery(''); }}>
                          <div className="dw-s-ico" style={{ background: '#f0fdfa' }}><Stethoscope size={13} color="#14b8a6"/></div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{d.name}</div>
                            <div style={{ fontSize: 11, color: '#9ca3af' }}>{d.specialization}</div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  <div className="dw-s-footer">
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{totalResults} result{totalResults !== 1 ? 's' : ''}</span>
                    <span className="dw-kbd">ESC to close</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>

        
          <div style={{ width: 1, height: 24, background: '#eef0f3', margin: '0 2px' }}/>

          {/* Profile */}
          <div style={{ position: 'relative' }} ref={dropRef}>
            <div className="dw-profile-btn" onClick={() => { setDropdownOpen(v => !v); setNotifOpen(false); }}>
              <div className="dw-avatar">{initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>{adminName}</div>
                <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'capitalize' }}>{adminRole}</div>
              </div>
              <ChevronDown size={13} color="#9ca3af" style={{ marginLeft: 2, transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}/>
            </div>
            {dropdownOpen && (
              <div className="dw-profile-dd">
                <div className="dw-dd-head">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div className="dw-avatar" style={{ width: 38, height: 38, fontSize: 13, borderRadius: 10 }}>{initials}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{adminName}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{adminEmail}</div>
                    </div>
                  </div>
                  <span className="dw-role-badge"><Shield size={9}/> {adminRole}</span>
                </div>
                <div className="dw-dd-item" onClick={() => { setDropdownOpen(false); navigate('/admin/profile'); }}>
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