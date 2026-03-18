import React, { useState, useEffect } from 'react';
import {
  Calendar, AlertCircle, User, Clock,
  RefreshCw, Activity, Stethoscope,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import Sidebar from '../component/Sidebar';

const API   = 'http://127.0.0.1:8000/api';
const today = new Date().toISOString().split('T')[0];

// ── Universal data fetcher ────────────────────────────────────────────
// ✅ FIXED: handles all response shapes:
//    - plain array              → [ {...}, {...} ]
//    - { appointments: [...] }  → AppointmentController
//    - { doctors: [...] }       → DoctorController
//    - { data: [...] }          → generic Laravel resource
function useApi(url) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    setError(false);
    try {
      const res  = await fetch(url);
      if (!res.ok) throw new Error();
      const json = await res.json();

      // ✅ FIXED: check every possible key
      if (Array.isArray(json)) {
        setData(json);
      } else if (Array.isArray(json.appointments)) {
        setData(json.appointments);
      } else if (Array.isArray(json.doctors)) {
        setData(json.doctors);
      } else if (Array.isArray(json.users)) {
        setData(json.users);
      } else if (Array.isArray(json.data)) {
        setData(json.data);
      } else {
        setData([]);
      }
    } catch {
      setError(true);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch_(); }, [url]);
  return { data, loading, error, refetch: fetch_ };
}

// ── Stat card ─────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, loading, sub }) {
  const colors = {
    blue:   { bg: '#eff6ff', accent: '#3b82f6' },
    red:    { bg: '#fef2f2', accent: '#ef4444' },
    green:  { bg: '#f0fdf4', accent: '#22c55e' },
    teal:   { bg: '#f0fdfa', accent: '#14b8a6' },
    purple: { bg: '#faf5ff', accent: '#a855f7' },
    amber:  { bg: '#fffbeb', accent: '#f59e0b' },
  };
  const c = colors[color] || colors.blue;

  return (
    <div className="col-xl-4 col-md-6">
      <div style={{
        background: '#fff',
        borderRadius: 14,
        padding: '22px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
        borderLeft: `4px solid ${c.accent}`,
        height: '100%',
      }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {label}
            </p>

            {loading ? (
              <div style={{ height: 36, width: 80, background: '#f3f4f6', borderRadius: 6, animation: 'pulse 1.5s ease infinite' }} />
            ) : (
              <h2 style={{ fontSize: 30, fontWeight: 800, color: '#111827', marginBottom: 2 }}>
                {value ?? '—'}
              </h2>
            )}

            {sub && !loading && (
              <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 0 }}>{sub}</p>
            )}
          </div>

          <div style={{
            width: 44, height: 44,
            borderRadius: 12,
            background: c.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {React.cloneElement(icon, { size: 20, color: c.accent })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Status pill ───────────────────────────────────────────────────────
function StatusPill({ status }) {
  const map = {
    Pending:   { bg: '#fffbeb', color: '#b45309' },
    Confirmed: { bg: '#f0fdf4', color: '#15803d' },
    Cancelled: { bg: '#fef2f2', color: '#b91c1c' },
    Completed: { bg: '#eff6ff', color: '#1d4ed8' },
  };
  const s = map[status] || { bg: '#f3f4f6', color: '#374151' };

  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 600,
    }}>
      {status}
    </span>
  );
}

// ── Main content ──────────────────────────────────────────────────────
function MainContent() {
  const navigate = useNavigate();

  // ✅ All three endpoints — useApi now handles each response shape
  const { data: appointments, loading: loadAppt,    refetch: refetchAppt } = useApi(`${API}/appointments`);
  const { data: users,        loading: loadUsers  }                        = useApi(`${API}/users`);
  const { data: doctors,      loading: loadDoctors }                       = useApi(`${API}/doctors`);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchAppt();
    setRefreshing(false);
  };

  // ── Derived metrics ───────────────────────────────────────────────
  const todayAppts    = appointments.filter(a => a.appointment_date?.startsWith(today));
  const pendingAppts  = appointments.filter(a => a.status === 'Pending');
  const upcomingAppts = appointments.filter(a => a.appointment_date > today);
  const totalPatients = users.filter(u => u.role === 'user');
  const activeDoctors = doctors.filter(d => d.status === 'Active');

  // Show 8 most recent appointments
  const recentAppts = [...appointments]
    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))
    .slice(0, 8);

  return (
    <div style={{ padding: '28px', background: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin   { to { transform: rotate(360deg); } }
      `}</style>

      {/* Page header */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
        <div>
          <h2 style={{ fontWeight: 800, color: '#111827', marginBottom: 4 }}>Admin Dashboard</h2>
          <p style={{ color: '#6b7280', marginBottom: 0 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 18px', borderRadius: 9,
            border: '1.5px solid #e5e7eb',
            background: '#fff', color: '#374151',
            fontSize: 13, fontWeight: 600,
            cursor: refreshing ? 'not-allowed' : 'pointer',
            opacity: refreshing ? 0.7 : 1,
          }}
        >
          <RefreshCw
            size={14}
            style={{ animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }}
          />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        <StatCard
          label="Appointments Today"
          value={todayAppts.length}
          icon={<Calendar />}
          color="blue"
          loading={loadAppt}
          sub={todayAppts.length === 1 ? '1 scheduled' : `${todayAppts.length} scheduled`}
        />
        <StatCard
          label="Pending Approvals"
          value={pendingAppts.length}
          icon={<AlertCircle />}
          color="red"
          loading={loadAppt}
          sub="Needs confirmation"
        />
        <StatCard
          label="Registered Patients"
          value={totalPatients.length}
          icon={<User />}
          color="purple"
          loading={loadUsers}
          sub="Total user accounts"
        />
        <StatCard
          label="Active Doctors"
          value={activeDoctors.length}
          icon={<Stethoscope />}
          color="teal"
          loading={loadDoctors}
          sub={`of ${doctors.length} total`}
        />
        <StatCard
          label="Total Appointments"
          value={appointments.length}
          icon={<Activity />}
          color="green"
          loading={loadAppt}
          sub="All time"
        />
        <StatCard
          label="Upcoming Bookings"
          value={upcomingAppts.length}
          icon={<Clock />}
          color="amber"
          loading={loadAppt}
          sub="Future dates"
        />
      </div>

      {/* Recent appointments table */}
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.07)', overflow: 'hidden' }}>

        {/* Table header */}
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h5 style={{ fontWeight: 700, color: '#111827', marginBottom: 2 }}>Recent Appointments</h5>
            <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 0 }}>Latest {recentAppts.length} appointments</p>
          </div>
          <button
            onClick={() => navigate('/admin/appointments')}
            style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            View all →
          </button>
        </div>

        {/* Loading skeleton */}
        {loadAppt ? (
          <div style={{ padding: '24px 22px' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 16, animation: 'pulse 1.5s ease infinite' }}>
                <div style={{ height: 16, width: '20%', background: '#f3f4f6', borderRadius: 4 }} />
                <div style={{ height: 16, width: '20%', background: '#f3f4f6', borderRadius: 4 }} />
                <div style={{ height: 16, width: '15%', background: '#f3f4f6', borderRadius: 4 }} />
                <div style={{ height: 16, width: '10%', background: '#f3f4f6', borderRadius: 4 }} />
                <div style={{ height: 16, width: '12%', background: '#f3f4f6', borderRadius: 4 }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ background: '#f9fafb' }}>
                <tr>
                  <th style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 22px', border: 'none' }}>Patient</th>
                  <th style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 16px', border: 'none' }}>Doctor</th>
                  <th style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 16px', border: 'none' }}>Date</th>
                  <th style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 16px', border: 'none' }}>Time</th>
                  <th style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 16px', border: 'none' }}>Payment</th>
                  <th style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 16px', border: 'none' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppts.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: 14 }}>
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  recentAppts.map(appt => (
                    <tr key={appt.id} style={{ cursor: 'pointer' }}>
                      <td style={{ padding: '14px 22px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {/* Avatar initial */}
                          <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: '#eff6ff', color: '#3b82f6',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700, flexShrink: 0,
                          }}>
                            {(appt.patient_name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                            {appt.patient_name || '—'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle', fontSize: 13, color: '#374151' }}>
                        {appt.doctor_name || '—'}
                      </td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle', fontSize: 13, color: '#374151' }}>
                        {appt.appointment_date || '—'}
                      </td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle', fontSize: 13, color: '#374151' }}>
                        {appt.appointment_time || '—'}
                      </td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        <span style={{
                          fontSize: 12, fontWeight: 600,
                          color: appt.payment_method === 'khalti' ? '#5C2D91' : '#374151',
                          background: appt.payment_method === 'khalti' ? '#f5f0ff' : '#f3f4f6',
                          padding: '3px 9px', borderRadius: 20,
                          textTransform: 'capitalize',
                        }}>
                          {appt.payment_method || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        <StatusPill status={appt.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────
export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', width: '100%' }}>
        <Header />
        <MainContent />
      </div>
    </div>
  );
}