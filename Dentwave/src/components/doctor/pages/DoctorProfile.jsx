import React, { useState, useEffect, useCallback } from 'react';
import {
  User, Phone, Stethoscope, Edit2, Save, X, Lock,
  Eye, EyeOff, CheckCircle, AlertCircle, Calendar, Activity, Clock
} from 'lucide-react';
import DoctorSidebar from '../component/Doctorsidebar';
import Header from '../component/Profilebar';

const API      = 'http://127.0.0.1:8000/api';
const IMG_BASE = 'http://127.0.0.1:8000/';

// ── Helpers ───────────────────────────────────────────────────────────
const getUser   = () => { try { return JSON.parse(localStorage.getItem('user_data')) || {}; } catch { return {}; } };
const getToken  = () => localStorage.getItem('auth_token') || '';

function DoctorProfilePage() {
  const storedUser = getUser();

  // ── The logged-in user (from users table via AuthContext) ─────────
  const [userId]    = useState(storedUser.id    || '');
  const [userName,  setUserName]  = useState(storedUser.name  || '');
  const [userEmail, setUserEmail] = useState(storedUser.email || '');

  // ── The doctor record (from doctors table) ────────────────────────
  const [doctorRecord, setDoctorRecord] = useState(null); // full doctors row
  const [doctorId,     setDoctorId]     = useState(null);

  // ── Form state (doctor fields) ────────────────────────────────────
  const [editing,    setEditing]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [success,    setSuccess]    = useState('');
  const [error,      setError]      = useState('');
  const [form,       setForm]       = useState({ name: '', specialization: '', experience: '', contact: '', status: 'Active' });
  const [formErrors, setFormErrors] = useState({});

  // ── Image ─────────────────────────────────────────────────────────
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  // ── Password ──────────────────────────────────────────────────────
  const [pwdForm,     setPwdForm]     = useState({ current_password: '', password: '', confirm: '' });
  const [pwdErrors,   setPwdErrors]   = useState({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdSaving,   setPwdSaving]   = useState(false);
  const [pwdSuccess,  setPwdSuccess]  = useState('');

  // ── Stats ─────────────────────────────────────────────────────────
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });

  // ── Fetch doctor record by matching name/email from users table ───
  // Strategy: GET /api/doctors → find the one whose name matches the logged-in user
  // (most reliable since doctors table may store user_id or just name)
  const fetchDoctor = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/doctors`, { headers: { Accept: 'application/json' } });
      const data = await res.json();
      const doctors = Array.isArray(data) ? data : (data.doctors || []);

      // Match by user_id first, then fall back to name match
      let doc = doctors.find(d => String(d.user_id) === String(userId));
      if (!doc) doc = doctors.find(d => d.name?.toLowerCase() === userName.toLowerCase());

      if (doc) {
        setDoctorRecord(doc);
        setDoctorId(doc.id);
        setForm({
          name:           doc.name           || '',
          specialization: doc.specialization || '',
          experience:     doc.experience     || '',
          contact:        doc.contact        || '',
          status:         doc.status         || 'Active',
        });
        setCurrentImage(doc.image ? `${IMG_BASE}${doc.image}` : null);
      }
    } catch { /**/ }
  }, [userId, userName]);

  // ── Fetch appointment stats ───────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/appointments`, {
        headers: { Authorization: `Bearer ${getToken()}`, Accept: 'application/json' }
      });
      const data = await res.json();
      const all  = Array.isArray(data) ? data : (data.appointments || []);
      // Filter by doctor_id (doctorId from doctors table)
      const mine = all.filter(a => String(a.doctor_id) === String(doctorId));
      setStats({
        total:     mine.length,
        pending:   mine.filter(a => a.status === 'Pending').length,
        completed: mine.filter(a => a.status === 'Completed').length,
      });
    } catch { /**/ }
  }, [doctorId]);

  useEffect(() => { fetchDoctor(); }, [fetchDoctor]);
  useEffect(() => { if (doctorId) fetchStats(); }, [doctorId, fetchStats]);

  const initials  = (userName || form.name || 'DR').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const avatarSrc = imagePreview || currentImage;

  // ── Image upload ──────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ── Save doctor profile (POST /api/doctors/update/{doctorId}) ─────
  const handleSave = async () => {
    const errs = {};
    if (!form.name.trim())           errs.name           = 'Name is required.';
    if (!form.specialization.trim()) errs.specialization = 'Specialization is required.';
    if (!form.experience.trim())     errs.experience     = 'Experience is required.';
    if (!form.contact.trim())        errs.contact        = 'Contact is required.';
    if (Object.keys(errs).length)    { setFormErrors(errs); return; }

    if (!doctorId) { setError('Doctor record not found. Contact admin.'); return; }

    const id = localStorage.getItem('doctor_id');
    setSaving(true); setError(''); setSuccess('');
    try {
      const body = new FormData();
      body.append('name',           form.name);
      body.append('specialization', form.specialization);
      body.append('experience',     form.experience);
      body.append('contact',        form.contact);
      body.append('status',         form.status);
      if (imageFile) body.append('image', imageFile);

      const res  = await fetch(`${API}/doctors/update/${doctorId}`, {
        method:  'POST',
        headers: { Accept: 'application/json', Authorization: `Bearer ${getToken()}` },
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed.');

      // Also update the name in users table so AuthContext stays in sync
      await fetch(`${API}/users/update/${userId}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name: form.name, email: userEmail, role: storedUser.role || 'doctor', status: 'Active' }),
      });

      // Sync localStorage user_data
      const updatedUser = { ...getUser(), name: form.name };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      setUserName(form.name);

      setImageFile(null);
      setImagePreview(null);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      setFormErrors({});
      fetchDoctor();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Change password (uses AuthController@changePassword) ──────────
  const handleChangePassword = async () => {
    const errs = {};
    if (!pwdForm.current_password)            errs.current_password = 'Current password is required.';
    if (!pwdForm.password)                    errs.password         = 'New password is required.';
    else if (pwdForm.password.length < 6)     errs.password         = 'Minimum 6 characters.';
    if (pwdForm.password !== pwdForm.confirm) errs.confirm          = 'Passwords do not match.';
    if (Object.keys(errs).length) { setPwdErrors(errs); return; }

    setPwdSaving(true); setPwdErrors({}); setPwdSuccess('');
    try {
      const res  = await fetch(`${API}/change-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          current_password:          pwdForm.current_password,
          new_password:              pwdForm.password,
          new_password_confirmation: pwdForm.confirm,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password update failed.');
      setPwdSuccess('Password changed successfully!');
      setPwdForm({ current_password: '', password: '', confirm: '' });
      setTimeout(() => setPwdSuccess(''), 4000);
    } catch (err) {
      setPwdErrors({ api: err.message });
    } finally {
      setPwdSaving(false);
    }
  };

  // ── Styles ────────────────────────────────────────────────────────
  const card       = { background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)', overflow: 'hidden' };
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 };
  const inputStyle = (err) => ({
    width: '100%', padding: '9px 12px', borderRadius: 9,
    border: `1.5px solid ${err ? '#ef4444' : '#e5e7eb'}`,
    fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  });

  // ── Password field helper ─────────────────────────────────────────
  const PwdField = ({ field, show, setShow, label }) => (
    <div>
      <label style={labelStyle}>{label} *</label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={pwdForm[field]}
          onChange={e => { setPwdForm(f => ({ ...f, [field]: e.target.value })); setPwdErrors(pe => ({ ...pe, [field]: '' })); }}
          placeholder="••••••"
          style={{ ...inputStyle(!!pwdErrors[field]), paddingRight: 36 }}
        />
        <button onClick={() => setShow(v => !v)}
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}>
          {show ? <EyeOff size={14}/> : <Eye size={14}/>}
        </button>
      </div>
      {pwdErrors[field] && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, marginBottom: 0 }}>{pwdErrors[field]}</p>}
    </div>
  );

  return (
    <div style={{ padding: '28px 32px', background: '#f8fafc', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin-p { to { transform: rotate(360deg); } }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      {/* Page title */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 800, fontSize: 24, color: '#111827', marginBottom: 4 }}>My Profile</h2>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 0 }}>Manage your professional details and account security.</p>
      </div>

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

      {/* No doctor record warning */}
      {!doctorRecord && !error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '11px 16px', marginBottom: 20, fontSize: 13, color: '#b45309' }}>
          <AlertCircle size={15}/>
          Loading doctor profile… If this persists, your account may not be linked to a doctor record.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 22, alignItems: 'start' }}>

        {/* ── Left ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Avatar card */}
          <div style={{ ...card, padding: '28px 22px', textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
              {avatarSrc ? (
                <img src={avatarSrc} alt={userName}
                  style={{ width: 78, height: 78, borderRadius: 20, objectFit: 'cover', border: '3px solid #e0f2fe', boxShadow: '0 8px 24px rgba(14,165,233,0.2)' }}/>
              ) : (
                <div style={{ width: 78, height: 78, borderRadius: 20, background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: '#fff', fontSize: 26, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 8px 24px rgba(14,165,233,0.25)' }}>
                  {initials}
                </div>
              )}
              {/* Upload button */}
              <label htmlFor="docImgUpload"
                style={{ position: 'absolute', bottom: -4, right: -4, width: 26, height: 26, borderRadius: '50%', background: '#0ea5e9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                <Edit2 size={10}/>
              </label>
              <input id="docImgUpload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }}/>
            </div>

            {/* Name — shows live as user edits */}
            <h3 style={{ fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 3 }}>
              {editing ? (form.name || '—') : (userName || form.name || '—')}
            </h3>
            <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 10 }}>{userEmail}</p>

            {form.specialization && (
              <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 10 }}>{form.specialization}</p>
            )}

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 11px', borderRadius: 20, background: '#f0fdfa', color: '#0d9488', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Stethoscope size={9}/> Doctor
            </div>

            {/* Status badge */}
            {form.status && (
              <div style={{ marginTop: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 11px', borderRadius: 20, background: form.status === 'Active' ? '#f0fdf4' : '#f3f4f6', color: form.status === 'Active' ? '#15803d' : '#6b7280', fontSize: 10, fontWeight: 700 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: form.status === 'Active' ? '#22c55e' : '#9ca3af' }}/> {form.status}
                </span>
              </div>
            )}

            {/* Show staged image note */}
            {imageFile && (
              <p style={{ fontSize: 11, color: '#3b82f6', marginTop: 10, marginBottom: 0 }}>
                New photo staged — save to apply.
              </p>
            )}
          </div>

          {/* Stats */}
          <div style={{ ...card, padding: '18px 20px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 12 }}>My Appointments</p>
            {[
              { icon: <Calendar size={13}/>, color: '#3b82f6', bg: '#eff6ff', label: 'Total',     value: stats.total     },
              { icon: <Clock size={13}/>,    color: '#f59e0b', bg: '#fffbeb', label: 'Pending',   value: stats.pending   },
              { icon: <Activity size={13}/>, color: '#14b8a6', bg: '#f0fdfa', label: 'Completed', value: stats.completed },
            ].map(({ icon, color, bg, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 0', borderBottom: '1px solid #f9fafb' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
                <span style={{ fontSize: 13, color: '#6b7280', flex: 1 }}>{label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Professional info */}
          <div style={card}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h6 style={{ fontWeight: 700, color: '#111827', marginBottom: 2 }}>Professional Information</h6>
                <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 0 }}>Update your name, specialization and contact details.</p>
              </div>
              {!editing ? (
                <button onClick={() => { setForm(f => ({ ...f })); setEditing(true); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  <Edit2 size={12}/> Edit
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setEditing(false); setFormErrors({}); setImageFile(null); setImagePreview(null); fetchDoctor(); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 9, border: '1.5px solid #e5e7eb', background: '#fff', color: '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    <X size={12}/> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 9, border: 'none', background: saving ? '#9ca3af' : '#3b82f6', color: '#fff', fontSize: 12, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
                    {saving
                      ? <><span style={{ width: 11, height: 11, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-p 0.7s linear infinite', display: 'inline-block' }}/> Saving…</>
                      : <><Save size={12}/> Save</>}
                  </button>
                </div>
              )}
            </div>

            <div style={{ padding: '22px' }}>
              {!editing ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { icon: <User size={13}/>,        color: '#3b82f6', bg: '#eff6ff', label: 'Full Name',      value: form.name           || '—' },
                    { icon: <Stethoscope size={13}/>, color: '#0d9488', bg: '#f0fdfa', label: 'Specialization', value: form.specialization || '—' },
                    { icon: <Clock size={13}/>,       color: '#f59e0b', bg: '#fffbeb', label: 'Experience',     value: form.experience     || '—' },
                    { icon: <Phone size={13}/>,       color: '#a855f7', bg: '#faf5ff', label: 'Contact',        value: form.contact        || '—' },
                  ].map(({ icon, color, bg, label, value }) => (
                    <div key={label} style={{ padding: '13px 15px', borderRadius: 11, background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 6, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { field: 'name',           label: 'Full Name *',      placeholder: 'Your name'          },
                    { field: 'specialization', label: 'Specialization *', placeholder: 'e.g. Orthodontist'  },
                    { field: 'experience',     label: 'Experience *',     placeholder: 'e.g. 5 Years'       },
                    { field: 'contact',        label: 'Contact *',        placeholder: 'Phone number'       },
                  ].map(({ field, label, placeholder }) => (
                    <div key={field}>
                      <label style={labelStyle}>{label}</label>
                      <input
                        value={form[field]}
                        onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setFormErrors(fe => ({ ...fe, [field]: '' })); }}
                        placeholder={placeholder}
                        style={inputStyle(!!formErrors[field])}
                      />
                      {formErrors[field] && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, marginBottom: 0 }}>{formErrors[field]}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Change password */}
          <div style={card}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #f3f4f6' }}>
              <h6 style={{ fontWeight: 700, color: '#111827', marginBottom: 2 }}>Change Password</h6>
              <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 0 }}>Enter your current password to set a new one.</p>
            </div>
            <div style={{ padding: '22px' }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <PwdField field="current_password" show={showCurrent} setShow={setShowCurrent} label="Current Password"/>
                <PwdField field="password"         show={showPwd}     setShow={setShowPwd}     label="New Password"/>
                <PwdField field="confirm"          show={showConfirm} setShow={setShowConfirm} label="Confirm Password"/>
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
    </div>
  );

}

export default function DoctorProfile() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <DoctorSidebar />
      <div style={{ marginLeft: '240px', width: 'calc(100% - 240px)' }}>
        <Header />
        <div style={{ marginTop: '64px' }}>
          <DoctorProfilePage />
        </div>
      </div>
    </div>
  );
}