import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Edit2, Save, X, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Calendar, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import Sidebar from '../component/Sidebar';

const API = 'http://127.0.0.1:8000/api';

function ProfilePage() {
  const navigate = useNavigate();

  // Read from localStorage
  const [adminId]    = useState(() => localStorage.getItem('user_id'));
  const [adminName,  setAdminName]  = useState(() => localStorage.getItem('user_name')  || '');
  const [adminEmail, setAdminEmail] = useState(() => localStorage.getItem('user_email') || '');
  const [adminRole]                 = useState(() => localStorage.getItem('user_role')  || 'admin');

  const [editing, setEditing]       = useState(false);
  const [saving,  setSaving]        = useState(false);
  const [success, setSuccess]       = useState('');
  const [error,   setError]         = useState('');

  // Profile form
  const [form, setForm] = useState({ name: adminName, email: adminEmail, phone: '' });
  const [formErrors, setFormErrors] = useState({});

  // Password form
  const [pwdForm, setPwdForm]       = useState({ password: '', confirm: '' });
  const [pwdErrors, setPwdErrors]   = useState({});
  const [showPwd, setShowPwd]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdSaving, setPwdSaving]   = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');

  // Stats
  const [stats, setStats] = useState({ totalUsers: 0, totalAppointments: 0, totalDoctors: 0 });

  useEffect(() => {
  // Always fetch the logged-in admin's data directly by ID
  if (adminId) {
    fetch(`${API}/users/${adminId}`)          // uses your show($id) endpoint
      .then(r => r.json())
      .then(me => {
        if (me && me.id) {
          setForm({ name: me.name, email: me.email, phone: me.phone || '' });
          setAdminName(me.name);
          setAdminEmail(me.email);
          // Sync localStorage too
          localStorage.setItem('user_name',  me.name);
          localStorage.setItem('user_email', me.email);
        }
      })
      .catch(() => {});
  }

  // Fetch stats
  Promise.all([
    fetch(`${API}/users`).then(r => r.json()),
    fetch(`${API}/appointments`).then(r => r.json()),
    fetch(`${API}/doctors`).then(r => r.json()),
  ]).then(([users, appts, docs]) => {
    setStats({
      totalUsers:        users.filter(u => u.role === 'user').length,
      totalAppointments: appts.length,
      totalDoctors:      docs.filter(d => d.status === 'Active').length,
    });
  }).catch(() => {});
}, [adminId]);

  const initials = adminName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  // ── Save profile info ─────────────────────────────────────────────
  const handleSave = async () => {
    const errs = {};
    if (!form.name.trim())  errs.name  = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email.';
    if (Object.keys(errs).length) { setFormErrors(errs); return; }

    setSaving(true); setError(''); setSuccess('');
    try {
      const res  = await fetch(`${API}/users/update/${adminId}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: adminRole, status: 'Active' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed.');

      // Update localStorage
      localStorage.setItem('user_name',  form.name);
      localStorage.setItem('user_email', form.email);
      setAdminName(form.name);
      setAdminEmail(form.email);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      setFormErrors({});
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setForm({ name: adminName, email: adminEmail, phone: form.phone });
    setFormErrors({});
    setEditing(false);
  };

  // ── Change password ───────────────────────────────────────────────
  const handleChangePassword = async () => {
    const errs = {};
    if (!pwdForm.password)           errs.password = 'New password is required.';
    else if (pwdForm.password.length < 6) errs.password = 'Min 6 characters.';
    if (pwdForm.password !== pwdForm.confirm) errs.confirm = 'Passwords do not match.';
    if (Object.keys(errs).length) { setPwdErrors(errs); return; }

    setPwdSaving(true); setPwdErrors({}); setPwdSuccess('');
    try {
      const res  = await fetch(`${API}/users/update/${adminId}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: adminName, email: adminEmail, password: pwdForm.password, role: adminRole, status: 'Active' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password update failed.');
      setPwdSuccess('Password changed successfully!');
      setPwdForm({ password: '', confirm: '' });
      setTimeout(() => setPwdSuccess(''), 4000);
    } catch (err) {
      setPwdErrors({ api: err.message });
    } finally {
      setPwdSaving(false);
    }
  };

  const memberSince = localStorage.getItem('created_at')
    ? new Date(localStorage.getItem('created_at')).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'N/A';

  return (
    <div style={{ padding: '28px 32px', background: '#f8fafc', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* Page title */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontWeight: 800, fontSize: 24, color: '#111827', marginBottom: 4 }}>My Profile</h2>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 0 }}>Manage your account information and security settings.</p>
      </div>

      {/* Success / error banners */}
      {success && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '11px 16px', marginBottom: 20, fontSize: 13, color: '#15803d' }}>
          <CheckCircle size={15}/> {success}
        </div>
      )}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '11px 16px', marginBottom: 20, fontSize: 13, color: '#b91c1c' }}>
          <AlertCircle size={15}/> {error}
          <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c', padding: 0 }}><X size={14}/></button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>

        {/* ── Left: Identity card ───────────────────────────────── */}
        <div>
          {/* Avatar card */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '32px 24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)', marginBottom: 16 }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: '#fff', fontSize: 28, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(14,165,233,0.3)' }}>
              {initials}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: 17, color: '#111827', marginBottom: 4 }}>{adminName}</h3>
            <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>{adminEmail}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, background: '#eff6ff', color: '#3b82f6', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Shield size={10}/> {adminRole}
            </div>
          </div>

          {/* Stats */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 14 }}>System Overview</p>
            {[
              { icon: <User size={14}/>,     color: '#a855f7', bg: '#faf5ff', label: 'Patients',     value: stats.totalUsers },
              { icon: <Calendar size={14}/>, color: '#3b82f6', bg: '#eff6ff', label: 'Appointments', value: stats.totalAppointments },
              { icon: <Activity size={14}/>, color: '#14b8a6', bg: '#f0fdfa', label: 'Active Doctors',value: stats.totalDoctors },
            ].map(({ icon, color, bg, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid #f9fafb' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
                <span style={{ fontSize: 13, color: '#6b7280', flex: 1 }}>{label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Forms ─────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Profile info */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h6 style={{ fontWeight: 700, color: '#111827', marginBottom: 2 }}>Personal Information</h6>
                <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 0 }}>Update your name, email and contact details.</p>
              </div>
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  <Edit2 size={13}/> Edit
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleCancelEdit}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 9, border: '1.5px solid #e5e7eb', background: '#fff', color: '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    <X size={13}/> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 9, border: 'none', background: saving ? '#9ca3af' : '#3b82f6', color: '#fff', fontSize: 12, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
                    {saving ? <><span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-p 0.7s linear infinite', display: 'inline-block' }}/> Saving…</> : <><Save size={13}/> Save</>}
                  </button>
                </div>
              )}
            </div>

            <div style={{ padding: '24px' }}>
              {!editing ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {[
                    { icon: <User size={14}/>,   label: 'Full Name', value: adminName,  color: '#3b82f6', bg: '#eff6ff' },
                    { icon: <Mail size={14}/>,   label: 'Email',     value: adminEmail, color: '#a855f7', bg: '#faf5ff' },
                    { icon: <Phone size={14}/>,  label: 'Phone',     value: form.phone || '—', color: '#14b8a6', bg: '#f0fdfa' },
                    { icon: <Shield size={14}/>, label: 'Role',      value: adminRole,  color: '#f59e0b', bg: '#fffbeb' },
                  ].map(({ icon, label, value, color, bg }) => (
                    <div key={label} style={{ padding: '14px 16px', borderRadius: 12, background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 26, height: 26, borderRadius: 7, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 0, textTransform: label === 'Role' ? 'capitalize' : 'none' }}>{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Full Name *</label>
                    <input value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setFormErrors(fe => ({ ...fe, name: '' })); }}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: `1.5px solid ${formErrors.name ? '#ef4444' : '#e5e7eb'}`, fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}/>
                    {formErrors.name && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{formErrors.name}</p>}
                  </div>
                  {/* Email */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email Address *</label>
                    <input type="email" value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setFormErrors(fe => ({ ...fe, email: '' })); }}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: `1.5px solid ${formErrors.email ? '#ef4444' : '#e5e7eb'}`, fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}/>
                    {formErrors.email && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{formErrors.email}</p>}
                  </div>
                  {/* Phone */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Phone</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="Phone number"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}/>
                  </div>
                  {/* Role (read-only) */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Role</label>
                    <input value={adminRole} readOnly
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#f9fafb', color: '#9ca3af', boxSizing: 'border-box', textTransform: 'capitalize' }}/>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Change Password */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #f3f4f6' }}>
              <h6 style={{ fontWeight: 700, color: '#111827', marginBottom: 2 }}>Change Password</h6>
              <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 0 }}>Use a strong password with at least 6 characters.</p>
            </div>
            <div style={{ padding: '24px' }}>
              {pwdSuccess && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 9, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#15803d' }}>
                  <CheckCircle size={14}/> {pwdSuccess}
                </div>
              )}
              {pwdErrors.api && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 9, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#b91c1c' }}>
                  <AlertCircle size={14}/> {pwdErrors.api}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>New Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPwd ? 'text' : 'password'} value={pwdForm.password}
                      onChange={e => { setPwdForm(f => ({ ...f, password: e.target.value })); setPwdErrors(pe => ({ ...pe, password: '' })); }}
                      placeholder="Min 6 characters"
                      style={{ width: '100%', padding: '9px 36px 9px 12px', borderRadius: 9, border: `1.5px solid ${pwdErrors.password ? '#ef4444' : '#e5e7eb'}`, fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}/>
                    <button onClick={() => setShowPwd(v => !v)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}>
                      {showPwd ? <EyeOff size={14}/> : <Eye size={14}/>}
                    </button>
                  </div>
                  {pwdErrors.password && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{pwdErrors.password}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Confirm Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showConfirm ? 'text' : 'password'} value={pwdForm.confirm}
                      onChange={e => { setPwdForm(f => ({ ...f, confirm: e.target.value })); setPwdErrors(pe => ({ ...pe, confirm: '' })); }}
                      placeholder="Repeat new password"
                      style={{ width: '100%', padding: '9px 36px 9px 12px', borderRadius: 9, border: `1.5px solid ${pwdErrors.confirm ? '#ef4444' : '#e5e7eb'}`, fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}/>
                    <button onClick={() => setShowConfirm(v => !v)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}>
                      {showConfirm ? <EyeOff size={14}/> : <Eye size={14}/>}
                    </button>
                  </div>
                  {pwdErrors.confirm && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{pwdErrors.confirm}</p>}
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <button onClick={handleChangePassword} disabled={pwdSaving}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 9, border: 'none', background: pwdSaving ? '#9ca3af' : '#111827', color: '#fff', fontSize: 13, fontWeight: 600, cursor: pwdSaving ? 'not-allowed' : 'pointer' }}>
                  {pwdSaving
                    ? <><span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-p 0.7s linear infinite', display: 'inline-block' }}/> Saving…</>
                    : <><Lock size={13}/> Update Password</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin-p { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function AdminProfile() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', width: 'calc(100% - 240px)' }}>
        <Header />
        <div style={{ marginTop: '64px' }}>
          <ProfilePage />
        </div>
      </div>
    </div>
  );
}