import { Clock, DollarSign, ChevronLeft, CheckCircle, ListChecks } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,600;0,700;1,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:      #18181b;
    --ink-2:    #52525b;
    --ink-3:    #a1a1aa;
    --surface:  #ffffff;
    --base:     #f4f3ef;
    --border:   #e4e4e7;
    --accent:   #2563eb;
    --accent-lt:#eff4ff;
    --accent-dk:#1d4ed8;
    --radius:   16px;
    --shadow:   0 1px 3px rgba(0,0,0,.05), 0 8px 24px rgba(0,0,0,.07);
    --font:     'Sora', sans-serif;
    --font-d:   'Lora', serif;
  }

  .sd-page {
    min-height: 100vh;
    background: var(--base);
    padding: 40px 16px 72px;
    font-family: var(--font);
  }

  .sd-wrap { max-width: 860px; margin: 0 auto; }

  .sd-back {
    background: none; border: none; color: var(--accent); cursor: pointer;
    display: inline-flex; align-items: center; gap: 5px;
    font-family: var(--font); font-weight: 600; font-size: 13px;
    margin-bottom: 28px; padding: 6px 0; transition: gap .15s;
  }
  .sd-back:hover { gap: 9px; }

  .sd-img-wrap {
    border-radius: 20px 20px 0 0;
    overflow: hidden; position: relative;
    box-shadow: 0 -2px 0 0 var(--border);
  }

  .sd-img {
    width: 100%; height: 340px; object-fit: cover; display: block;
    transition: transform .5s ease; background: #f0ece3;
  }
  .sd-img-wrap:hover .sd-img { transform: scale(1.02); }

  .sd-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(24,24,27,.55) 0%, transparent 55%);
    pointer-events: none;
  }

  .sd-img-badge { position: absolute; bottom: 22px; left: 24px; display: flex; gap: 10px; }

  .sd-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,.15); backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.25);
    color: #fff; border-radius: 100px; padding: 6px 14px;
    font-size: 12px; font-weight: 600;
  }

  .sd-card {
    background: var(--surface); border-radius: 0 0 20px 20px;
    box-shadow: var(--shadow); padding: 36px 36px 40px;
    animation: fadeUp .4s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .sd-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    gap: 16px; padding-bottom: 24px; border-bottom: 1px solid var(--border);
    margin-bottom: 24px; flex-wrap: wrap;
  }

  .sd-title {
    font-family: var(--font-d); font-size: clamp(22px, 4vw, 30px);
    font-weight: 700; color: var(--ink); line-height: 1.2; flex: 1; min-width: 0;
  }

  .sd-price-tag {
    background: var(--accent-lt); border: 1px solid #bfdbfe;
    border-radius: 12px; padding: 10px 18px; text-align: right; flex-shrink: 0;
  }
  .sd-price-label { font-size: 10px; font-weight: 600; color: var(--ink-3); text-transform: uppercase; letter-spacing: .8px; }
  .sd-price-value { font-size: 22px; font-weight: 800; color: var(--accent); margin-top: 2px; }

  .sd-desc {
    color: var(--ink-2); line-height: 1.8; font-size: 14.5px;
    font-weight: 300; margin-bottom: 28px;
  }

  .sd-meta { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 32px; }

  .sd-meta-item {
    display: flex; align-items: center; gap: 10px;
    background: var(--base); border: 1px solid var(--border);
    border-radius: 12px; padding: 12px 16px; font-size: 13px;
    color: var(--ink-2); flex: 1; min-width: 140px;
  }

  .sd-meta-icon {
    width: 36px; height: 36px; background: var(--accent-lt);
    border-radius: 9px; display: flex; align-items: center;
    justify-content: center; flex-shrink: 0;
  }

  .sd-meta-text { font-size: 11px; color: var(--ink-3); margin-bottom: 2px; }
  .sd-meta-val  { font-weight: 700; color: var(--ink); font-size: 14px; }

  .sd-section { margin-bottom: 32px; }

  .sd-sec-head {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; font-weight: 700; color: var(--ink);
    text-transform: uppercase; letter-spacing: .8px;
    margin-bottom: 16px; padding-bottom: 10px;
    border-bottom: 2px solid var(--base);
  }

  .sd-benefits { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  .sd-benefit {
    display: flex; align-items: flex-start; gap: 10px;
    background: var(--base); border: 1px solid var(--border);
    border-radius: 10px; padding: 12px 14px; font-size: 13px;
    color: var(--ink-2); line-height: 1.5;
    transition: border-color .15s, background .15s;
  }
  .sd-benefit:hover { border-color: #bfdbfe; background: var(--accent-lt); }

  .sd-steps { position: relative; padding-left: 4px; }
  .sd-steps::before {
    content: ''; position: absolute; left: 12px; top: 13px; bottom: 13px;
    width: 2px; background: linear-gradient(to bottom, #bfdbfe, var(--border));
    border-radius: 2px;
  }

  .sd-step { display: flex; gap: 16px; margin-bottom: 16px; align-items: flex-start; position: relative; }

  .sd-step-num {
    width: 26px; height: 26px; border-radius: 50%;
    background: var(--accent); color: #fff;
    font-size: 11px; font-weight: 700; display: flex;
    align-items: center; justify-content: center; flex-shrink: 0;
    position: relative; z-index: 1;
    box-shadow: 0 0 0 3px var(--accent-lt);
  }

  .sd-step-text { font-size: 14px; color: var(--ink-2); line-height: 1.7; padding-top: 3px; }

  .sd-cta {
    margin-top: 8px; width: 100%; padding: 15px;
    background: var(--accent); color: #fff; border: none;
    border-radius: 12px; font-family: var(--font); font-weight: 700; font-size: 15px;
    cursor: pointer; transition: background .2s, transform .12s, box-shadow .2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .sd-cta:hover  { background: var(--accent-dk); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(37,99,235,.28); }
  .sd-cta:active { transform: translateY(0); box-shadow: none; }

  .sd-empty {
    min-height: 100vh; background: var(--base);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font);
  }
  .sd-empty-inner { text-align: center; }
  .sd-empty-text { color: var(--ink-3); margin-bottom: 18px; font-size: 14px; }
  .sd-empty-btn {
    background: var(--accent); color: #fff; border: none;
    border-radius: 10px; padding: 11px 26px;
    font-family: var(--font); font-weight: 600; cursor: pointer; font-size: 14px;
    transition: background .15s;
  }
  .sd-empty-btn:hover { background: var(--accent-dk); }

  @media (max-width: 640px) {
    .sd-page    { padding: 28px 14px 60px; }
    .sd-card    { padding: 24px 18px 28px; }
    .sd-img     { height: 220px; }
    .sd-benefits { grid-template-columns: 1fr; }
    .sd-header  { flex-direction: column; gap: 12px; }
    .sd-price-tag { align-self: flex-start; text-align: left; }
    .sd-img-badge { flex-direction: column; gap: 6px; bottom: 14px; left: 16px; }
  }

  @media (max-width: 400px) {
    .sd-title   { font-size: 20px; }
    .sd-meta    { flex-direction: column; }
    .sd-meta-item { min-width: unset; width: 100%; }
  }
`;

const ServiceDetailsPage = ({ service, onBack, onAddToAppointment }) => {
   const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleAddToAppointment = (service) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    onAddToAppointment(service);
  };
  if (!service) {
    return (
      <>
        <style>{CSS}</style>
        <div className="sd-empty">
          <div className="sd-empty-inner">
            <p className="sd-empty-text">No service selected.</p>
            <button className="sd-empty-btn" onClick={onBack}>Back to Services</button>
          </div>
        </div>
      </>
    );
  }

  const benefits = service.key_benefits
    ? service.key_benefits.split(",").map(b => b.trim()).filter(Boolean)
    : [];

  const steps = service.procedure_overview
    ? service.procedure_overview.split(".").map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <>
      <style>{CSS}</style>
      <div className="sd-page">
        <div className="sd-wrap">

          <button className="sd-back" onClick={onBack}>
            <ChevronLeft size={16}/> Back to Services
          </button>

          {/* Hero */}
          <div className="sd-img-wrap">
            <img
              src={`http://127.0.0.1:8000/storage/${service.image}`}
              alt={service.name}
              className="sd-img"
              onError={e => { e.target.src = ""; }}
            />
            <div className="sd-img-overlay"/>
            <div className="sd-img-badge">
              {service.duration && (
                <span className="sd-badge"><Clock size={12}/> {service.duration} min</span>
              )}
              {service.cost && (
                <span className="sd-badge"><DollarSign size={12}/> Rs. {parseFloat(service.cost).toFixed(2)}</span>
              )}
            </div>
          </div>

          {/* Card */}
          <div className="sd-card">

            <div className="sd-header">
              <h1 className="sd-title">{service.name}</h1>
              <div className="sd-price-tag">
                <p className="sd-price-label">Starting from</p>
                <p className="sd-price-value">
                  {service.cost ? `Rs. ${parseFloat(service.cost).toFixed(2)}` : "Consultation"}
                </p>
              </div>
            </div>

            <p className="sd-desc">{service.description}</p>

            <div className="sd-meta">
              <div className="sd-meta-item">
                <div className="sd-meta-icon"><Clock size={17} color="#2563eb"/></div>
                <div>
                  <p className="sd-meta-text">Duration</p>
                  <p className="sd-meta-val">{service.duration ? `${service.duration} min` : "N/A"}</p>
                </div>
              </div>
              <div className="sd-meta-item">
                <div className="sd-meta-icon"><DollarSign size={17} color="#2563eb"/></div>
                <div>
                  <p className="sd-meta-text">Cost</p>
                  <p className="sd-meta-val">{service.cost ? `Rs. ${parseFloat(service.cost).toFixed(2)}` : "Consultation"}</p>
                </div>
              </div>
            </div>

            {benefits.length > 0 && (
              <div className="sd-section">
                <p className="sd-sec-head"><CheckCircle size={14} color="#2563eb"/> Key Benefits</p>
                <div className="sd-benefits">
                  {benefits.map((b, i) => (
                    <div key={i} className="sd-benefit">
                      <CheckCircle size={14} color="#2563eb" style={{ flexShrink: 0, marginTop: 1 }}/>
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {steps.length > 0 && (
              <div className="sd-section">
                <p className="sd-sec-head"><ListChecks size={14} color="#2563eb"/> Procedure Overview</p>
                <div className="sd-steps">
                  {steps.map((step, i) => (
                    <div key={i} className="sd-step">
                      <span className="sd-step-num">{i + 1}</span>
                      <p className="sd-step-text">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            
<button className="sd-cta" onClick={() => handleAddToAppointment(service)}>
              + Add to Appointment
            </button>

          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetailsPage;