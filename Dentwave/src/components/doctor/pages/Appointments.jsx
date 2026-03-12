import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, RefreshCw, Eye, CheckCircle, XCircle,
  AlertCircle, ChevronDown, X, Filter
} from 'lucide-react';

const API = 'http://127.0.0.1:8000/api';

const getDoctor = () => {
  try { return JSON.parse(localStorage.getItem('user_data')) || {}; }
  catch { return {}; }
};
const getToken = () => localStorage.getItem('auth_token') || '';

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
    <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: '4px 11px', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }}/>
      {status}
    </span>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────
function Modal({ children, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 400, backdropFilter: 'blur(2px)' }}/>
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', borderRadius: 18, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', zIndex: 401, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
        {children}
      </div>
    </>
  );
}

export default function AppointmentsPage() {
  const doctor   = getDoctor();
  const doctorId = doctor.id;

  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [error,        setError]        = useState('');

  // filters
  const [search,        setSearch]        = useState('');
  const [statusFilter,  setStatusFilter]  = useState('All');

  // modal
  const [selected,  setSelected]  = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view' | 'update'
  const [editStatus, setEditStatus] = useState('');
  const [saving,     setSaving]     = useState(false);
  const [saveMsg,    setSaveMsg]    = useState('');
  const [saveErr,    setSaveErr]    = useState('');

  // ── Fetch ─────────────────────────────────────────────────────────
  const fetchAppointments = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError('');
    try {
      const res  = await fetch(`${API}/appointments`, {
        headers: { 'Authorization': `Bearer ${getToken()}`, 'Accept': 'application/json' }
      });
      const data = await res.json();
      const all  = Array.isArray(data) ? data : (data.appointments || []);
      const mine = all.filter(a => String(a.doctor_id) === String(doctorId));
      setAppointments(mine.sort((a, b) =>
        new Date(b.appointment_date + 'T' + b.appointment_time) - new Date(a.appointment_date + 'T' + a.appointment_time)
      ));
    } catch {
      setError('Failed to load appointments. Please try again.');
    } finally { setLoading(false); setRefreshing(false); }
  }, [doctorId]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  // ── Filter ────────────────────────────────────────────────────────
  const filtered = appointments.filter(a => {
    const lq = search.toLowerCase();
    const matchSearch = !search ||
      a.patient_name?.toLowerCase().includes(lq) ||
      a.appointment_date?.includes(lq) ||
      a.services?.some(s => s.name?.toLowerCase().includes(lq));
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── Update status ─────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!selected || !editStatus) return;
    setSaving(true); setSaveMsg(''); setSaveErr('');
    try {
      const res  = await fetch(`${API}/appointments/update/${selected.id}`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${getToken()}`,
          'Accept':        'application/json',
        },
        body: JSON.stringify({ status: editStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed.');
      setSaveMsg('Status updated successfully!');
      await fetchAppointments(true);
      // Update selected locally
      setSelected(prev => ({ ...prev, status: editStatus }));
      setTimeout(() => { setSaveMsg(''); setModalMode('view'); }, 1500);
    } catch (err) {
      setSaveErr(err.message);
    } finally { setSaving(false); }
  };

  // ── Helpers ───────────────────────────────────────────────────────
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
  const avatarBg = (id) => ['#eff6ff','#faf5ff','#f0fdf4','#fffbeb','#fef2f2','#f0fdfa'][(id||0)%6];
  const avatarFg = (id) => ['#3b82f6','#a855f7','#22c55e','#f59e0b','#ef4444','#14b8a6'][(id||0)%6];

  const STATUSES = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

  const inputStyle = { padding: '9px 12px', borderRadius: 9, border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 };

  return (
    <div style={{ padding: '28px 28px 40px', background: '#f8fafc', minHeight: '100vh', marginLeft: 240, marginTop: 64, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes spin  { to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        tr:hover td { background: #f9fafb !important; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 4 }}>My Appointments</h2>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 0 }}>
            {loading ? 'Loading…' : `${filtered.length} appointment${filtered.length !== 1 ? 's' : ''}${statusFilter !== 'All' ? ` · ${statusFilter}` : ''}`}
          </p>
        </div>
        <button onClick={() => fetchAppointments(true)} disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <RefreshCw size={13} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}/>
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '11px 16px', marginBottom: 18, fontSize: 13, color: '#b91c1c' }}>
          <AlertCircle size={15}/> {error}
          <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c', padding: 0 }}><X size={14}/></button>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 220, maxWidth: 360 }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search patient, service, date…"
            style={{ ...inputStyle, paddingLeft: 34, paddingRight: search ? 32 : 12 }}/>
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}>
              <X size={13}/>
            </button>
          )}
        </div>

        {/* Status filter tabs */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: '7px 14px', borderRadius: 9, border: `1.5px solid ${statusFilter === s ? '#3b82f6' : '#e5e7eb'}`, background: statusFilter === s ? '#3b82f6' : '#fff', color: statusFilter === s ? '#fff' : '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
              {s}
              {s !== 'All' && !loading && (
                <span style={{ marginLeft: 5, opacity: 0.75, fontSize: 10 }}>
                  ({appointments.filter(a => a.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                {['Patient', 'Services', 'Date', 'Time', 'Cost', 'Payment', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} style={{ padding: '13px 16px' }}>
                        <div style={{ height: 13, borderRadius: 6, background: '#f3f4f6', animation: 'pulse 1.5s infinite', width: j === 0 ? '70%' : '50%' }}/>
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px 0', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                    {search || statusFilter !== 'All' ? 'No appointments match your filters.' : 'No appointments assigned to you yet.'}
                  </td>
                </tr>
              ) : filtered.map(a => (
                <tr key={a.id} style={{ borderTop: '1px solid #f3f4f6', transition: 'background 0.12s', cursor: 'default' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: avatarBg(a.user_id), color: avatarFg(a.user_id), fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {getInitials(a.patient_name || 'U')}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: '#111827', fontSize: 13 }}>{a.patient_name || '—'}</p>
                        {a.patient_email && <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>{a.patient_email}</p>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', maxWidth: 150 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                      {a.services?.length ? a.services.map(s => s.name).join(', ') : '—'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#374151', whiteSpace: 'nowrap' }}>{formatDate(a.appointment_date)}</td>
                  <td style={{ padding: '12px 16px', color: '#374151', whiteSpace: 'nowrap' }}>{formatTime(a.appointment_time)}</td>
                  <td style={{ padding: '12px 16px', color: '#374151', whiteSpace: 'nowrap' }}>Rs. {parseFloat(a.total_cost || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', textTransform: 'capitalize' }}>{a.payment_method || '—'}</td>
                  <td style={{ padding: '12px 16px' }}><StatusPill status={a.status}/></td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => { setSelected(a); setModalMode('view'); setEditStatus(a.status); setSaveMsg(''); setSaveErr(''); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      <Eye size={13}/> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────── */}
      {selected && (
        <Modal onClose={() => setSelected(null)}>
          {/* Header */}
          <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h5 style={{ fontWeight: 800, color: '#111827', marginBottom: 4 }}>
                {modalMode === 'view' ? 'Appointment Details' : 'Update Status'}
              </h5>
              <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 0 }}>
                APP-{selected.id} · <StatusPill status={selected.status}/>
              </p>
            </div>
            <button onClick={() => setSelected(null)}
              style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', flexShrink: 0 }}>
              <X size={15}/>
            </button>
          </div>

          <div style={{ padding: '20px 24px 24px' }}>

            {modalMode === 'view' ? (
              <>
                {/* Patient info */}
                <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 10 }}>Patient Information</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      ['Name',  selected.patient_name  || '—'],
                      ['Email', selected.patient_email || '—'],
                      ['Phone', selected.patient_phone || '—'],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2, fontWeight: 600 }}>{k}</p>
                        <p style={{ fontSize: 13, color: '#111827', fontWeight: 500, marginBottom: 0 }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Appointment info */}
                <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 10 }}>Appointment Details</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      ['Date',      formatDate(selected.appointment_date)],
                      ['Time',      formatTime(selected.appointment_time)],
                      ['Duration',  `${selected.total_duration} min`],
                      ['Cost',      `Rs. ${parseFloat(selected.total_cost || 0).toLocaleString()}`],
                      ['Payment',   selected.payment_method || '—'],
                      ['Services',  selected.services?.map(s => s.name).join(', ') || '—'],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2, fontWeight: 600 }}>{k}</p>
                        <p style={{ fontSize: 13, color: '#111827', fontWeight: 500, marginBottom: 0 }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setSelected(null)}
                    style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                    Close
                  </button>
                  {selected.status !== 'Cancelled' && selected.status !== 'Completed' && (
                    <button onClick={() => { setModalMode('update'); setSaveMsg(''); setSaveErr(''); }}
                      style={{ flex: 2, padding: '10px', borderRadius: 10, border: 'none', background: '#3b82f6', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                      Update Status
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Banners */}
                {saveMsg && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 9, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#15803d' }}>
                    <CheckCircle size={14}/> {saveMsg}
                  </div>
                )}
                {saveErr && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 9, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#b91c1c' }}>
                    <AlertCircle size={14}/> {saveErr}
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Patient</label>
                  <input value={selected.patient_name} readOnly style={{ ...inputStyle, background: '#f9fafb', color: '#9ca3af' }}/>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div>
                    <label style={labelStyle}>Date</label>
                    <input value={formatDate(selected.appointment_date)} readOnly style={{ ...inputStyle, background: '#f9fafb', color: '#9ca3af' }}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Time</label>
                    <input value={formatTime(selected.appointment_time)} readOnly style={{ ...inputStyle, background: '#f9fafb', color: '#9ca3af' }}/>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Update Status</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['Confirmed', 'Completed', 'Cancelled'].map(s => {
                      const active = editStatus === s;
                      const colors = { Confirmed: '#22c55e', Completed: '#3b82f6', Cancelled: '#ef4444' };
                      return (
                        <button key={s} onClick={() => setEditStatus(s)}
                          style={{ flex: 1, padding: '10px 8px', borderRadius: 10, border: `2px solid ${active ? colors[s] : '#e5e7eb'}`, background: active ? colors[s] : '#fff', color: active ? '#fff' : '#374151', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          {s === 'Confirmed' && <CheckCircle size={13}/>}
                          {s === 'Completed' && <CheckCircle size={13}/>}
                          {s === 'Cancelled' && <XCircle size={13}/>}
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setModalMode('view')}
                    style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                    ← Back
                  </button>
                  <button onClick={handleUpdate} disabled={saving || editStatus === selected.status}
                    style={{ flex: 2, padding: '10px', borderRadius: 10, border: 'none', background: saving || editStatus === selected.status ? '#9ca3af' : '#111827', color: '#fff', fontWeight: 700, cursor: saving || editStatus === selected.status ? 'not-allowed' : 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    {saving
                      ? <><span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }}/> Saving…</>
                      : 'Save Changes'}
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}