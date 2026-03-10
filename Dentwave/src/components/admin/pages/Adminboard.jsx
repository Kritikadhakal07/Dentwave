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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();

      const json = await res.json();

      // Always normalize to array
      setData(Array.isArray(json) ? json : json.data || []);
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

// ── Stat card ─────────────────────────────────────────────
function StatCard({ label, value, icon, color, loading, sub }) {
  const colors = {
    blue: { bg: '#eff6ff', accent: '#3b82f6' },
    red: { bg: '#fef2f2', accent: '#ef4444' },
    green: { bg: '#f0fdf4', accent: '#22c55e' },
    teal: { bg: '#f0fdfa', accent: '#14b8a6' },
    purple: { bg: '#faf5ff', accent: '#a855f7' },
    amber: { bg: '#fffbeb', accent: '#f59e0b' }
  };

  const c = colors[color] || colors.blue;

  return (
    <div className="col-xl-4 col-md-6">
      <div style={{
        background: '#fff',
        borderRadius: 14,
        padding: '22px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
        borderLeft: `4px solid ${c.accent}`
      }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af' }}>
              {label}
            </p>

            {loading ? (
              <div style={{ height: 36, width: 80, background: '#f3f4f6' }} />
            ) : (
              <h2 style={{ fontSize: 30, fontWeight: 800 }}>
                {value ?? '—'}
              </h2>
            )}

            {sub && !loading && (
              <p style={{ fontSize: 12, color: '#6b7280' }}>{sub}</p>
            )}
          </div>

          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: c.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {React.cloneElement(icon, { size: 20, color: c.accent })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Status pill ───────────────────────────────────────────
function StatusPill({ status }) {
  const map = {
    Pending: { bg: '#fffbeb', color: '#b45309' },
    Confirmed: { bg: '#f0fdf4', color: '#15803d' },
    Cancelled: { bg: '#fef2f2', color: '#b91c1c' },
    Completed: { bg: '#eff6ff', color: '#1d4ed8' }
  };

  const s = map[status] || { bg: '#f3f4f6', color: '#374151' };

  return (
    <span style={{
      background: s.bg,
      color: s.color,
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600
    }}>
      {status}
    </span>
  );
}

// ── Main content ──────────────────────────────────────────
function MainContent() {

  const navigate = useNavigate();

  const { data: appointments, loading: loadAppt, refetch: refetchAppt } = useApi(`${API}/appointments`);
  const { data: users, loading: loadUsers } = useApi(`${API}/users`);
  const { data: doctors, loading: loadDoctors } = useApi(`${API}/doctors`);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchAppt();
    setRefreshing(false);
  };

  // ── Metrics ────────────────────────────────────────────
  const todayAppts = appointments.filter(a =>
    a.appointment_date?.startsWith(today)
  );

  const pendingAppts = appointments.filter(a =>
    a.status === 'Pending'
  );

  const upcomingAppts = appointments.filter(a =>
    a.appointment_date > today
  );

  const totalPatients = users.filter(u =>
    u.role === 'user'
  );

  const totalDoctors = doctors.filter(d =>
    d.status === 'Active'
  );

  const recentAppts = appointments.slice(0, 8);

  return (
    <div style={{ padding: '28px', background: '#f8fafc', minHeight: '100vh' }}>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-5">

        <div>
          <h2 style={{ fontWeight: 800 }}>Admin Dashboard</h2>
          <p style={{ color: '#6b7280' }}>
            {new Date().toDateString()}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid #ddd',
            background: '#fff'
          }}
        >
          <RefreshCw size={14} />
          Refresh
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
        />

        <StatCard
          label="Pending Approvals"
          value={pendingAppts.length}
          icon={<AlertCircle />}
          color="red"
          loading={loadAppt}
        />

        <StatCard
          label="Registered Patients"
          value={totalPatients.length}
          icon={<User />}
          color="purple"
          loading={loadUsers}
        />

        <StatCard
          label="Active Doctors"
          value={totalDoctors.length}
          icon={<Stethoscope />}
          color="teal"
          loading={loadDoctors}
        />

        <StatCard
          label="Total Appointments"
          value={appointments.length}
          icon={<Activity />}
          color="green"
          loading={loadAppt}
        />

        <StatCard
          label="Upcoming Bookings"
          value={upcomingAppts.length}
          icon={<Clock />}
          color="amber"
          loading={loadAppt}
        />

      </div>

      {/* Recent appointments */}
      <div style={{ background: '#fff', borderRadius: 12 }}>

        <div style={{ padding: 20 }}>
          <h5>Recent Appointments</h5>
        </div>

        <table className="table">

          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {recentAppts.length === 0 ? (
              <tr>
                <td colSpan="5">No appointments</td>
              </tr>
            ) : (
              recentAppts.map(appt => (
                <tr key={appt.id}>

                  <td>{appt.patient_name}</td>

                  <td>{appt.doctor_name}</td>

                  <td>{appt.appointment_date}</td>

                  <td>{appt.appointment_time}</td>

                  <td>
                    <StatusPill status={appt.status} />
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

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