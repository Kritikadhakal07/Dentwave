import React, { useState, useEffect } from 'react';
import {
  Calendar, AlertCircle, UserCheck, User, Clock,
  Plus, UserPlus, RefreshCw, TrendingUp, CheckCircle,
  XCircle, Stethoscope, ChevronRight, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import Sidebar from '../component/Sidebar';

const API = 'http://127.0.0.1:8000/api';
const today = new Date().toISOString().split('T')[0];

function useApi(url) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(false);

  const fetch_ = async () => {
    setLoading(true); setError(false);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, [url]);
  return { data, loading, error, refetch: fetch_ };
}

// ── Stat card ────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, loading, sub }) {
  const colors = {
    blue:   { bg: '#eff6ff', accent: '#3b82f6', text: '#1d4ed8' },
    red:    { bg: '#fef2f2', accent: '#ef4444', text: '#b91c1c' },
    green:  { bg: '#f0fdf4', accent: '#22c55e', text: '#15803d' },
    teal:   { bg: '#f0fdfa', accent: '#14b8a6', text: '#0f766e' },
    purple: { bg: '#faf5ff', accent: '#a855f7', text: '#7e22ce' },
    amber:  { bg: '#fffbeb', accent: '#f59e0b', text: '#b45309' },
  };
  const c = colors[color] || colors.blue;

  return (
    <div className="col-xl-4 col-md-6">
      <div style={{
        background: '#fff', borderRadius: 14, padding: '22px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)',
        height: '100%', transition: 'transform 0.2s, box-shadow 0.2s',
        borderLeft: `4px solid ${c.accent}`,
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)'; }}
      >
        <div className="d-flex justify-content-between align-items-start">
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 10 }}>
              {label}
            </p>
            {loading ? (
              <div style={{ height: 36, width: 80, borderRadius: 8, background: '#f3f4f6', animation: 'pulse 1.5s infinite' }}/>
            ) : (
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#111827', marginBottom: 4, lineHeight: 1 }}>
                {value ?? '—'}
              </h2>
            )}
            {sub && !loading && (
              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 6, marginBottom: 0 }}>{sub}</p>
            )}
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {React.cloneElement(icon, { size: 20, color: c.accent })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Status pill ──────────────────────────────────────────────────────
function StatusPill({ status }) {
  const map = {
    Pending:   { bg: '#fffbeb', color: '#b45309', dot: '#f59e0b' },
    Confirmed: { bg: '#f0fdf4', color: '#15803d', dot: '#22c55e' },
    Cancelled: { bg: '#fef2f2', color: '#b91c1c', dot: '#ef4444' },
    Completed: { bg: '#eff6ff', color: '#1d4ed8', dot: '#3b82f6' },
  };
  const s = map[status] || { bg: '#f3f4f6', color: '#374151', dot: '#9ca3af' };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }}/>
      {status}
    </span>
  );
}

// ── Skeleton row ─────────────────────────────────────────────────────
function SkeletonRows({ cols = 4, rows = 5 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <tr key={i}>
      {Array.from({ length: cols }).map((_, j) => (
        <td key={j} className="py-3">
          <div style={{ height: 14, borderRadius: 6, background: '#f3f4f6', animation: 'pulse 1.5s infinite', width: j === 0 ? '70%' : '50%' }}/>
        </td>
      ))}
    </tr>
  ));
}

// ── Main content ─────────────────────────────────────────────────────
function MainContent() {
  const navigate = useNavigate();

  const { data: appointments, loading: loadAppt, refetch: refetchAppt } = useApi(`${API}/appointments`);
  const { data: users,        loading: loadUsers }                       = useApi(`${API}/users`);
  const { data: doctors,      loading: loadDoctors }                     = useApi(`${API}/doctors`);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchAppt();
    setRefreshing(false);
  };

  // ── Derived metrics ───────────────────────────────────────────────
  const todayAppts    = appointments?.filter(a => a.appointment_date?.startsWith(today)) ?? [];
  const pendingAppts  = appointments?.filter(a => a.status === 'Pending')   ?? [];
  const upcomingAppts = appointments?.filter(a => a.appointment_date > today) ?? [];
  const totalPatients = users?.filter(u => u.role === 'user')   ?? [];
  const totalDoctors  = doctors?.filter(d => d.status === 'Active') ?? [];

  // ── Recent 8 appointments ─────────────────────────────────────────
  const recentAppts = (appointments ?? []).slice(0, 8);

  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  const formatTime = (t) => {
    if (!t) return '—';
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour < 12 ? 'AM' : 'PM'}`;
  };

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const avatarBg = (id) => ['#eff6ff','#faf5ff','#f0fdf4','#fffbeb','#fef2f2','#f0fdfa'][id % 6];
  const avatarFg = (id) => ['#3b82f6','#a855f7','#22c55e','#f59e0b','#ef4444','#14b8a6'][id % 6];

  return (
    <div style={{ padding: '28px 32px', background: '#f8fafc', minHeight: '100vh' }}>

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
        <div>
          <h2 style={{ fontWeight: 800, fontSize: 26, color: '#111827', marginBottom: 4 }}>Admin Dashboard</h2>
          <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 0 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}/>
          Refresh
        </button>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────── */}
      <div className="row g-3 mb-4">
        <StatCard label="Appointments Today"  value={loadAppt   ? null : todayAppts.length}    icon={<Calendar/>}     color="blue"   loading={loadAppt}   sub={`${pendingAppts.length} pending`}/>
        <StatCard label="Pending Approvals"   value={loadAppt   ? null : pendingAppts.length}   icon={<AlertCircle/>}  color="red"    loading={loadAppt}   sub="Needs attention"/>
        <StatCard label="Registered Patients" value={loadUsers  ? null : totalPatients.length}  icon={<User/>}         color="purple" loading={loadUsers}  sub="Total users"/>
        <StatCard label="Active Doctors"      value={loadDoctors? null : totalDoctors.length}   icon={<Stethoscope/>}  color="teal"   loading={loadDoctors} sub="On staff"/>
        <StatCard label="Total Appointments"  value={loadAppt   ? null : appointments?.length}  icon={<Activity/>}     color="green"  loading={loadAppt}   sub="All time"/>
        <StatCard label="Upcoming Bookings"   value={loadAppt   ? null : upcomingAppts.length}  icon={<Clock/>}        color="amber"  loading={loadAppt}   sub="Future dates"/>
      </div>

      {/* ── Quick actions ────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Quick Actions</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { label: 'Add Service',   icon: <Plus size={15}/>,       action: () => navigate('/servicemanagement'), style: { background: '#3b82f6', color: '#fff', border: 'none' } },
            { label: 'Add Doctor',    icon: <UserPlus size={15}/>,   action: () => navigate('/doctormanagement'),  style: { background: '#fff', color: '#374151', border: '1.5px solid #e5e7eb' } },
            { label: 'Manage Users',  icon: <UserCheck size={15}/>,  action: () => navigate('/usermanagement'),    style: { background: '#fff', color: '#374151', border: '1.5px solid #e5e7eb' } },
            { label: 'Appointments',  icon: <Calendar size={15}/>,   action: () => navigate('/appointmentmanagement'), style: { background: '#fff', color: '#374151', border: '1.5px solid #e5e7eb' } },
          ].map(({ label, icon, action, style }) => (
            <button key={label} onClick={action} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.15s', ...style }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Recent appointments table ────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h6 style={{ fontWeight: 700, color: '#111827', marginBottom: 2 }}>Recent Appointments</h6>
            <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 0 }}>Latest 8 bookings across all doctors</p>
          </div>
          <button onClick={() => navigate('/appointmentmanagement')}
            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            View all <ChevronRight size={14}/>
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Patient', 'Doctor', 'Date', 'Time', 'Cost', 'Payment', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadAppt ? (
                <SkeletonRows cols={7} rows={5}/>
              ) : recentAppts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af', fontSize: 13 }}>
                    No appointments yet.
                  </td>
                </tr>
              ) : recentAppts.map((appt, i) => (
                <tr key={appt.id} style={{ borderTop: '1px solid #f3f4f6', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: avatarBg(appt.user_id || i), color: avatarFg(appt.user_id || i), fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {getInitials(appt.patient_name || 'U')}
                      </div>
                      <span style={{ fontWeight: 500, color: '#111827' }}>{appt.patient_name || '—'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{appt.doctor_name || '—'}</td>
                  <td style={{ padding: '12px 16px', color: '#374151', whiteSpace: 'nowrap' }}>{formatDate(appt.appointment_date)}</td>
                  <td style={{ padding: '12px 16px', color: '#374151', whiteSpace: 'nowrap' }}>{formatTime(appt.appointment_time)}</td>
                  <td style={{ padding: '12px 16px', color: '#374151', whiteSpace: 'nowrap' }}>Rs. {parseFloat(appt.total_cost || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ textTransform: 'capitalize', color: '#6b7280' }}>{appt.payment_method || '—'}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <StatusPill status={appt.status}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mini summary bar ─────────────────────────────────── */}
        {!loadAppt && appointments?.length > 0 && (
          <div style={{ padding: '12px 24px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Confirmed', icon: <CheckCircle size={13}/>, color: '#22c55e', count: appointments.filter(a => a.status === 'Confirmed').length },
              { label: 'Pending',   icon: <AlertCircle size={13}/>, color: '#f59e0b', count: appointments.filter(a => a.status === 'Pending').length },
              { label: 'Cancelled', icon: <XCircle     size={13}/>, color: '#ef4444', count: appointments.filter(a => a.status === 'Cancelled').length },
              { label: 'Completed', icon: <TrendingUp  size={13}/>, color: '#3b82f6', count: appointments.filter(a => a.status === 'Completed').length },
            ].map(({ label, icon, color, count }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
                <span style={{ color }}>{icon}</span>
                <span style={{ fontWeight: 600, color: '#374151' }}>{count}</span> {label}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', width: 'calc(100% - 240px)' }}>
        <Header />
        <MainContent />
      </div>
    </div>
  );
}