import React, { useState, useEffect, useCallback } from 'react';
import { User, Phone, Stethoscope, Edit2, Save, X, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Calendar, Activity, Clock } from 'lucide-react';
import Header from '../component/Profilebar';
import DoctorSidebar from '../component/Doctorsidebar';

const API      = 'http://127.0.0.1:8000/api';
const IMG_BASE = 'http://127.0.0.1:8000/';

function DoctorProfilePage() {

  const [doctorId]  = useState(() => localStorage.getItem('doctor_id'));
  const [doctorName,  setDoctorName]  = useState(() => localStorage.getItem('user_name')  || '');
  const [doctorEmail, setDoctorEmail] = useState(() => localStorage.getItem('user_email') || '');
  const [doctorRole]                  = useState('Doctor');
  const [loading, setLoading] = useState(true); // ✅ ADD loading state

  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  const [form, setForm] = useState({
    name: '', specialization: '', experience: '', contact: '', status: 'Active'
  });
  const [formErrors, setFormErrors] = useState({});

  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const [pwdForm,     setPwdForm]     = useState({ password: '', confirm: '' });
  const [pwdErrors,   setPwdErrors]   = useState({});
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdSaving,   setPwdSaving]   = useState(false);
  const [pwdSuccess,  setPwdSuccess]  = useState('');

  const [stats, setStats] = useState({ totalAppointments: 0, pending: 0, completed: 0 });

  const fetchProfile = useCallback(async () => {
    // ✅ FIX: Re-read doctorId directly from localStorage in case state wasn't set yet
    const id = localStorage.getItem('doctor_id');
    if (!id) {
      setError('Doctor ID not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/doctor/profile/${id}`);
      
      // ✅ FIX: Check response status before parsing
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const doc = await res.json();

      if (!doc || !doc.id) {
        setError('Profile data not found.');
        setLoading(false);
        return;
      }

      // ✅ FIX: Ensure all fields are set with fallbacks
      setForm({
        name:           doc.name           || '',
        specialization: doc.specialization || '',
        experience:     String(doc.experience || ''),
        contact:        String(doc.contact    || ''),
        status:         doc.status         || 'Active',
      });

      const name  = doc.name  || '';
      const email = doc.email || '';
      setDoctorName(name);
      setDoctorEmail(email);
      localStorage.setItem('user_name',  name);
      localStorage.setItem('user_email', email);

      // ✅ FIX: Handle image path correctly
      if (doc.image) {
        // Avoid double slashes
        const imgUrl = doc.image.startsWith('http')
          ? doc.image
          : `${IMG_BASE}${doc.image.startsWith('/') ? doc.image.slice(1) : doc.image}`;
        setCurrentImage(imgUrl);
      } else {
        setCurrentImage(null);
      }

    } catch (err) {
      setError(`Failed to load profile: ${err.message}`);
    } finally {
      setLoading(false); // ✅ Always stop loading
    }
  }, []); // ✅ No dependency on doctorId state — reads from localStorage directly

  useEffect(() => {
    fetchProfile();

    const id = localStorage.getItem('doctor_id');
    if (!id) return;

    fetch(`${API}/appointments`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch appointments');
        return r.json();
      })
      .then(data => {
        const list = Array.isArray(data) ? data : (data.appointments || []);
        const appts = list.filter(a => String(a.doctor_id) === String(id));
        setStats({
          totalAppointments: appts.length,
          pending:   appts.filter(a => a.status === 'Pending').length,
          completed: appts.filter(a => a.status === 'Completed').length,
        });
      })
      .catch(err => console.warn('Appointments fetch failed:', err));
  }, [fetchProfile]);

  const initials = doctorName
    ? doctorName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const errs = {};
    if (!form.name.trim())           errs.name           = 'Name is required.';
    if (!form.specialization.trim()) errs.specialization = 'Specialization is required.';
    if (!form.experience.trim())     errs.experience     = 'Experience is required.';
    if (!form.contact.trim())        errs.contact        = 'Contact is required.';
    if (Object.keys(errs).length) { setFormErrors(errs); return; }

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

      const res  = await fetch(`${API}/doctor/profile/${id}`, {
        method:  'POST',
        headers: { Accept: 'application/json' },
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed.');

      await fetchProfile();
      setDoctorName(form.name);
      localStorage.setItem('user_name', form.name);
      setImageFile(null);
      setImagePreview(null);
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
    setFormErrors({});
    setImageFile(null);
    setImagePreview(null);
    setEditing(false);
  };

  const handleChangePassword = async () => {
    const errs = {};
    if (!pwdForm.password)                errs.password = 'New password is required.';
    else if (pwdForm.password.length < 6) errs.password = 'Min 6 characters.';
    if (pwdForm.password !== pwdForm.confirm) errs.confirm = 'Passwords do not match.';
    if (Object.keys(errs).length) { setPwdErrors(errs); return; }

    const userId = localStorage.getItem('user_id');
    if (!userId) { setPwdErrors({ api: 'User ID not found in session.' }); return; }

    setPwdSaving(true); setPwdErrors({}); setPwdSuccess('');
    try {
      const res  = await fetch(`${API}/users/update/${userId}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: doctorName, email: doctorEmail,
          password: pwdForm.password, role: 'doctor', status: 'Active'
        }),
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

  const avatarSrc = imagePreview || currentImage;

  // ✅ Show loading spinner while fetching
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin-p 0.7s linear infinite', margin: '0 auto 12px' }}/>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Loading profile…</p>
        </div>
        <style>{`@keyframes spin-p { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '28px 32px', background: '#f8fafc', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin-p { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontWeight: 800, fontSize: 24, color: '#111827', marginBottom: 4 }}>My Profile</h2>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 0 }}>Manage your account information and security settings.</p>
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

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>

        {/* ── Left ─────────────────────────────────────────────── */}
        <div>
          <div style={{ background: '#fff', borderRadius: 16, padding: '32px 24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)', marginBottom: 16 }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
              {avatarSrc ? (
                <img src={avatarSrc} alt={doctorName}
                  style={{ width: 80, height: 80, borderRadius: 20, objectFit: 'cover', border: '3px solid #e0f2fe', boxShadow: '0 8px 24px rgba(14,165,233,0.2)' }}/>
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: '#fff', fontSize: 28, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 8px 24px rgba(14,165,233,0.3)' }}>
                  {initials}
                </div>
              )}
              <label htmlFor="docImgUpload"
                style={{ position: 'absolute', bottom: -4, right: -4, width: 24, height: 24, borderRadius: '50%', background: '#0ea5e9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                <Edit2 size={10}/>
              </label>
              <input id="docImgUpload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }}/>
            </div>

            <h3 style={{ fontWeight: 700, fontSize: 17, color: '#111827', marginBottom: 4 }}>{doctorName || '—'}</h3>
            <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>{doctorEmail}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, background: '#f0fdfa', color: '#0d9488', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Stethoscope size={10}/> {doctorRole}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 14 }}>My Appointments</p>
            {[
              { icon: <Calendar size={14}/>, color: '#3b82f6', bg: '#eff6ff', label: 'Total',     value: stats.totalAppointments },
              { icon: <Clock size={14}/>,    color: '#f59e0b', bg: '#fffbeb', label: 'Pending',   value: stats.pending           },
              { icon: <Activity size={14}/>, color: '#14b8a6', bg: '#f0fdfa', label: 'Completed', value: stats.completed         },
            ].map(({ icon, color, bg, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid #f9fafb' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
                <span style={{ fontSize: 13, color: '#6b7280', flex: 1 }}>{label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h6 style={{ fontWeight: 700, color: '#111827', marginBottom: 2 }}>Professional Information</h6>
                <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 0 }}>Update your name, specialization and contact details.</p>
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
                    {saving
                      ? <><span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-p 0.7s linear infinite', display: 'inline-block' }}/> Saving…</>
                      : <><Save size={13}/> Save</>}
                  </button>
                </div>
              )}
            </div>

            <div style={{ padding: '24px' }}>
              {!editing ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {[
                    { icon: <User size={14}/>,       color: '#3b82f6', bg: '#eff6ff', label: 'Full Name',      value: form.name           },
                    { icon: <Stethoscope size={14}/>, color: '#0d9488', bg: '#f0fdfa', label: 'Specialization', value: form.specialization },
                    { icon: <Clock size={14}/>,       color: '#f59e0b', bg: '#fffbeb', label: 'Experience',     value: form.experience     },
                    { icon: <Phone size={14}/>,       color: '#a855f7', bg: '#faf5ff', label: 'Contact',        value: form.contact        },
                  ].map(({ icon, label, value, color, bg }) => (
                    <div key={label} style={{ padding: '14px 16px', borderRadius: 12, background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 26, height: 26, borderRadius: 7, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 0 }}>{value || '—'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Full Name *</label>
                    <input value={form.name}
                      onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setFormErrors(fe => ({ ...fe, name: '' })); }}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: `1.5px solid ${formErrors.name ? '#ef4444' : '#e5e7eb'}`, fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}/>
                    {formErrors.name && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{formErrors.name}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Specialization *</label>
                    <input value={form.specialization}
                      onChange={e => { setForm(f => ({ ...f, specialization: e.target.value })); setFormErrors(fe => ({ ...fe, specialization: '' })); }}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: `1.5px solid ${formErrors.specialization ? '#ef4444' : '#e5e7eb'}`, fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}/>
                    {formErrors.specialization && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{formErrors.specialization}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Experience *</label>
                    <input value={form.experience} placeholder="e.g. 5 Years"
                      onChange={e => { setForm(f => ({ ...f, experience: e.target.value })); setFormErrors(fe => ({ ...fe, experience: '' })); }}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: `1.5px solid ${formErrors.experience ? '#ef4444' : '#e5e7eb'}`, fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}/>
                    {formErrors.experience && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{formErrors.experience}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Contact *</label>
                    <input value={form.contact}
                      onChange={e => { setForm(f => ({ ...f, contact: e.target.value })); setFormErrors(fe => ({ ...fe, contact: '' })); }}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: `1.5px solid ${formErrors.contact ? '#ef4444' : '#e5e7eb'}`, fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}/>
                    {formErrors.contact && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{formErrors.contact}</p>}
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