import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar, Clock, CheckCircle, AlertCircle,
  RefreshCw, ChevronRight, User, TrendingUp, XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API = 'http://127.0.0.1:8000/api';

// ── Read doctor info from user_data (AuthContext stores it as JSON) ──
const getDoctor = () => {
  try { return JSON.parse(localStorage.getItem('user_data')) || {}; }
  catch { return {}; }
};
const getToken = () => localStorage.getItem('auth_token') || '';

const today = new Date().toISOString().split('T')[0];

// ── Stat Card ─────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, sub, loading }) {
  const palette = {
    blue:   { bg: '#eff6ff', accent: '#3b82f6', border: '#bfdbfe' },
    amber:  { bg: '#fffbeb', accent: '#f59e0b', border: '#fde68a' },
    green:  { bg: '#f0fdf4', accent: '#22c55e', border: '#bbf7d0' },
    red:    { bg: '#fef2f2', accent: '#ef4444', border: '#fecaca' },
    purple: { bg: '#faf5ff', accent: '#a855f7', border: '#e9d5ff' },
    teal:   { bg: '#f0fdfa', accent: '#14b8a6', border: '#99f6e4' },
  };
  const c = palette[color] || palette.blue;

  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '20px 22px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
      borderLeft: `4px solid ${c.accent}`, transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 10 }}>{label}</p>
          {loading
            ? <div style={{ height: 34, width: 70, borderRadius: 8, background: '#f3f4f6', animation: 'pulse 1.5s infinite' }}/>
            : <h2 style={{ fontSize: 30, fontWeight: 800, color: '#111827', marginBottom: 4, lineHeight: 1 }}>{value ?? '—'}</h2>
          }
          {sub && !loading && <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 6, marginBottom: 0 }}>{sub}</p>}
        </div>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: c.bg, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {React.cloneElement(icon, { size: 18, color: c.accent })}
        </div>
      </div>
    </div>
  );
}

// ── Status pill ───────────────────────────────────────────────────────
function StatusPill({ status }) {
  const map = {
    Pending:   { bg: '#fffbeb', color: '#b45309', dot: '#f59e0b' },
    Confirmed: { bg: '#f0fdf4', color: '#15803d', dot: '#22c55e' },
    Cancelled: { bg: '#fef2f2', color: '#b91c1c', dot: '#ef4444' },
    Completed: { bg: '#eff6ff', color: '#1d4ed8', dot: '#3b82f6' },
  };
  const s = map[status] || { bg: '#f3f4f6', color: '#374151', dot: '#9ca3af' };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }}/>
      {status}
    </span>
  );
}

// ── Skeleton rows ─────────────────────────────────────────────────────
function SkeletonRows({ cols, rows = 4 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <tr key={i}>
      {Array.from({ length: cols }).map((_, j) => (
        <td key={j} style={{ padding: '12px 16px' }}>
          <div style={{ height: 13, borderRadius: 6, background: '#f3f4f6', animation: 'pulse 1.5s infinite', width: j === 0 ? '70%' : '50%' }}/>
        </td>
      ))}
    </tr>
  ));
}

export default function DoctorDashboard() {
  const navigate   = useNavigate();
  const doctor     = getDoctor();
  const doctorId   = doctor.id;
  const firstName  = (doctor.name || 'Doctor').split(' ')[0];

  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);

  const fetchAppointments = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res  = await fetch(`${API}/appointments`, {
        headers: { 'Authorization': `Bearer ${getToken()}`, 'Accept': 'application/json' }
      });
      const data = await res.json();
      const all  = Array.isArray(data) ? data : (data.appointments || []);
      // Filter to this doctor's appointments only
      const mine = all.filter(a => String(a.doctor_id) === String(doctorId));
      setAppointments(mine);
    } catch { /**/ }
    finally { setLoading(false); setRefreshing(false); }
  }, [doctorId]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  // ── Derived stats ─────────────────────────────────────────────────
  const todayAppts     = appointments.filter(a => a.appointment_date?.startsWith(today));
  const pendingAppts   = appointments.filter(a => a.status === 'Pending');
  const completedAppts = appointments.filter(a => a.status === 'Completed');
  const upcomingAppts  = appointments.filter(a => a.appointment_date > today).sort((a, b) => a.appointment_date.localeCompare(b.appointment_date));
  const confirmedAppts = appointments.filter(a => a.status === 'Confirmed');

  // Recent 6 appointments
  const recentAppts = [...appointments]
    .sort((a, b) => new Date(b.appointment_date + 'T' + b.appointment_time) - new Date(a.appointment_date + 'T' + a.appointment_time))
    .slice(0, 6);

  const formatDate = (d) => d
    ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  const formatTime = (t) => {
    if (!t) return '—';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}`;
  };

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const avatarBg = (id) => ['#eff6ff','#faf5ff','#f0fdf4','#fffbeb','#fef2f2','#f0fdfa'][(id || 0) % 6];
  const avatarFg = (id) => ['#3b82f6','#a855f7','#22c55e','#f59e0b','#ef4444','#14b8a6'][(id || 0) % 6];

  const card = {
    background: '#fff', borderRadius: 14,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  };

  return (
    <div style={{ padding: '28px 28px 40px', background: '#f8fafc', minHeight: '100vh', marginLeft: 240, marginTop: 64, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes spin  { to{transform:rotate(360deg)} }
        table { width: 100%; border-collapse: collapse; }
        th    { text-align: left; }
        tr:hover td { background: #f9fafb; }
      `}</style>

      {/* ── Page header ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, Dr. {firstName} 
          </h2>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 0 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            {' · '}
            <span style={{ color: todayAppts.length > 0 ? '#3b82f6' : '#9ca3af', fontWeight: 600 }}>
              {todayAppts.length} appointment{todayAppts.length !== 1 ? 's' : ''} today
            </span>
          </p>
        </div>
        <button onClick={() => fetchAppointments(true)} disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <RefreshCw size={13} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}/>
          Refresh
        </button>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Today's Appointments" value={loading ? null : todayAppts.length}    icon={<Calendar/>}     color="blue"   loading={loading} sub={`${confirmedAppts.filter(a=>a.appointment_date?.startsWith(today)).length} confirmed`}/>
        <StatCard label="Pending"              value={loading ? null : pendingAppts.length}  icon={<AlertCircle/>}  color="amber"  loading={loading} sub="Needs attention"/>
        <StatCard label="Completed"            value={loading ? null : completedAppts.length} icon={<CheckCircle/>}  color="green"  loading={loading} sub="All time"/>
        <StatCard label="Upcoming"             value={loading ? null : upcomingAppts.length} icon={<Clock/>}        color="purple" loading={loading} sub="Future dates"/>
      </div>

      {/* ── Main grid ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* Recent appointments table */}
        <div style={card}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h6 style={{ fontWeight: 700, color: '#111827', marginBottom: 2 }}>Recent Appointments</h6>
              <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 0 }}>Your latest patient appointments</p>
            </div>
            <button onClick={() => navigate('/appointments')}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              View all <ChevronRight size={13}/>
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Patient', 'Services', 'Date', 'Time', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? <SkeletonRows cols={5}/> :
                  recentAppts.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: '40px 0', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No appointments yet.</td></tr>
                  ) : recentAppts.map(a => (
                    <tr key={a.id} style={{ borderTop: '1px solid #f3f4f6', transition: 'background 0.12s', cursor: 'pointer' }}
                      onClick={() => navigate('/appointments')}>
                      <td style={{ padding: '11px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: avatarBg(a.user_id), color: avatarFg(a.user_id), fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {getInitials(a.patient_name || 'U')}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{a.patient_name || '—'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '11px 16px', fontSize: 12, color: '#6b7280', maxWidth: 160 }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                          {a.services?.length ? a.services.map(s => s.name).join(', ') : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '11px 16px', fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>{formatDate(a.appointment_date)}</td>
                      <td style={{ padding: '11px 16px', fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>{formatTime(a.appointment_time)}</td>
                      <td style={{ padding: '11px 16px' }}><StatusPill status={a.status}/></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          {/* Summary bar */}
          {!loading && appointments.length > 0 && (
            <div style={{ padding: '10px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                { label: 'Confirmed', icon: <CheckCircle size={12}/>, color: '#22c55e', count: confirmedAppts.length },
                { label: 'Pending',   icon: <AlertCircle size={12}/>, color: '#f59e0b', count: pendingAppts.length   },
                { label: 'Cancelled', icon: <XCircle     size={12}/>, color: '#ef4444', count: appointments.filter(a=>a.status==='Cancelled').length },
                { label: 'Completed', icon: <TrendingUp  size={12}/>, color: '#3b82f6', count: completedAppts.length },
              ].map(({ label, icon, color, count }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
                  <span style={{ color }}>{icon}</span>
                  <span style={{ fontWeight: 700, color: '#374151' }}>{count}</span> {label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Today's schedule */}
          <div style={card}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f3f4f6' }}>
              <h6 style={{ fontWeight: 700, color: '#111827', marginBottom: 1 }}>Today's Schedule</h6>
              <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 0 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div style={{ padding: '6px 0', maxHeight: 280, overflowY: 'auto' }}>
              {loading ? (
                <div style={{ padding: '20px 18px' }}>
                  {[1,2,3].map(i => <div key={i} style={{ height: 48, borderRadius: 10, background: '#f3f4f6', animation: 'pulse 1.5s infinite', marginBottom: 8 }}/>)}
                </div>
              ) : todayAppts.length === 0 ? (
                <div style={{ padding: '28px 18px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                  <Calendar size={28} style={{ color: '#e5e7eb', marginBottom: 8, display: 'block', margin: '0 auto 8px' }}/>
                  No appointments today
                </div>
              ) : todayAppts
                .sort((a, b) => a.appointment_time?.localeCompare(b.appointment_time))
                .map(a => (
                  <div key={a.id} style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f9fafb', transition: 'background 0.12s', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => navigate('/appointments')}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', minWidth: 52, textAlign: 'center', background: '#f3f4f6', borderRadius: 7, padding: '4px 6px' }}>
                      {formatTime(a.appointment_time)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.patient_name || '—'}</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.services?.map(s => s.name).join(', ') || '—'}
                      </p>
                    </div>
                    <StatusPill status={a.status}/>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Upcoming — next 4 future appointments */}
          <div style={card}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h6 style={{ fontWeight: 700, color: '#111827', marginBottom: 0 }}>Upcoming</h6>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>Next {Math.min(upcomingAppts.length, 4)}</span>
            </div>
            <div style={{ padding: '6px 0' }}>
              {loading ? (
                <div style={{ padding: '12px 18px' }}>
                  {[1,2].map(i => <div key={i} style={{ height: 44, borderRadius: 10, background: '#f3f4f6', animation: 'pulse 1.5s infinite', marginBottom: 8 }}/>)}
                </div>
              ) : upcomingAppts.length === 0 ? (
                <p style={{ padding: '20px 18px', textAlign: 'center', color: '#9ca3af', fontSize: 13, marginBottom: 0 }}>No upcoming appointments.</p>
              ) : upcomingAppts.slice(0, 4).map(a => (
                <div key={a.id} style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 11, borderBottom: '1px solid #f9fafb', cursor: 'pointer', transition: 'background 0.12s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => navigate('/appointments')}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: avatarBg(a.user_id), color: avatarFg(a.user_id), fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {getInitials(a.patient_name || 'U')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.patient_name}</p>
                    <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 0 }}>{formatDate(a.appointment_date)} · {formatTime(a.appointment_time)}</p>
                  </div>
                  <ChevronRight size={13} color="#d1d5db"/>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ ...card, padding: '16px 18px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 12 }}>Quick Actions</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'View All Appointments', icon: <Calendar size={14}/>, action: () => navigate('/appointments'), primary: true },
                { label: 'My Profile',            icon: <User size={14}/>,     action: () => navigate('/doctorprofile'), primary: false },
              ].map(({ label, icon, action, primary }) => (
                <button key={label} onClick={action}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px', borderRadius: 10, border: primary ? 'none' : '1.5px solid #e5e7eb', background: primary ? '#3b82f6' : '#fff', color: primary ? '#fff' : '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.15s', width: '100%' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}