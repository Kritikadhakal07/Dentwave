import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Ourteam from './Ourteam';
import './About.css';

// ── Data ──────────────────────────────────────────────────────────────────────

const facilities = [
  { img: "facilities1.jpg", alt: "Reception Area", tag: "First Impressions", text: "Welcoming reception designed for your comfort and ease." },
  { img: "facilities2.jpg", alt: "Dental Chair",   tag: "Advanced Tech",     text: "Latest technology for precise and gentle care." },
  { img: "facilities3.jpg", alt: "Clinic Hygiene", tag: "Certified Clean",   text: "Ensuring top standards of hygiene and safety." },
];

const values = [
  "Patient-First Philosophy",
  "Evidence-Based Dentistry",
  "Painless & Gentle Techniques",
  "Continuous Education & Training",
  "Transparent Pricing",
  "Eco-Conscious Practices",
];

const stats = [
  {
    icon: <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    number: "10+",
    label: "Years of trusted dental care in the community",
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    number: "8,500+",
    label: "Happy patients with healthy, radiant smiles",
  },
  {
    icon: <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    number: "98%",
    label: "Patient satisfaction rate across all treatments",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

const About = () => {
  return (
    <>
      <div className="about-page">

        {/* Hero */}
        <div className="about-hero">
          <span className="about-hero-eyebrow">DentWave Dental Clinic</span>
          <h1 className="about-hero-title">Where Every Smile Tells a Story</h1>
          <p className="about-hero-subtitle">
            Over a decade of compassionate, cutting-edge dental care — built on trust, driven by excellence.
          </p>
          <div className="about-hero-line" />
        </div>

        {/* Our Story */}
        <section className="story-section">
          <Container>
            <Row className="align-items-center g-5">

              {/* Left: Text */}
              <Col lg={6}>
                <span className="story-label">Our Origins</span>
                <h2 className="story-heading">A Practice Built on Purpose & Heart</h2>
                <div className="story-divider" />
                <p className="story-body">
                  At DentWave Clinic, our journey began over a decade ago with a clear purpose — to create a place where every patient feels valued, understood, and cared for. Founded by Dr. Ladies, DentWave grew from a simple vision into a trusted practice known for excellence and compassion.
                </p>
                <p className="story-body">
                  We believe a healthy smile has the power to transform lives — boosting confidence and well-being. Every visit combines modern technology, gentle techniques, and a truly personalized approach.
                </p>
              </Col>

              {/* Right: Stats Panel */}
              <Col lg={6}>
                <div className="story-visual">
                  <div className="story-card-bg" />
                  <div className="story-stats-panel">
                    {stats.map((stat, i) => (
                      <div className="stat-item" key={i}>
                        <div className="stat-icon-wrap">{stat.icon}</div>
                        <div>
                          <div className="stat-number">{stat.number}</div>
                          <div className="stat-label">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>

            </Row>
          </Container>
        </section>

        {/* Values */}
        <section className="values-strip">
          <Container>
            <Row className="align-items-center g-5">

              {/* Left: Heading */}
              <Col lg={5}>
                <span className="story-label">What We Stand For</span>
                <h2 className="values-heading">Our Guiding Principles</h2>
                <p className="values-sub">
                  Everything we do is rooted in these core beliefs — shaping every interaction, treatment, and outcome.
                </p>
              </Col>

              {/* Right: Value Pills */}
              <Col lg={7}>
                <Row>
                  {values.map((value, i) => (
                    <Col sm={6} key={i}>
                      <div className="value-pill">
                        <div className="value-dot" />
                        <p className="value-text">{value}</p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Col>

            </Row>
          </Container>
        </section>

        {/* Facilities */}
        <section className="facilities-section">
          <Container>
            <span className="section-eyebrow">State of the Art</span>
            <h2 className="section-heading">Our Facilities</h2>
            <p className="section-sub">
              Designed for your comfort, equipped for precision — every corner of our clinic reflects our standard of care.
            </p>
            <Row className="g-4">
              {facilities.map((item, i) => (
                <Col md={4} key={i}>
                  <div className="facility-card">
                    <img src={item.img} alt={item.alt} />
                    <div className="facility-overlay">
                      <span className="facility-tag">{item.tag}</span>
                      <div className="facility-alt">{item.alt}</div>
                      <p className="facility-text">{item.text}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

      </div>

      <Ourteam />
    </>
  );
};

export default About;