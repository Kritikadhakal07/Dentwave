import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Ourteam.css";

const teamMembers = [
  {
    img: "doctor1.jpg",
    name: "Dr. Elara Vance",
    role: "Lead Dentist & Founder",
    desc: "With over 15 years of experience, Dr. Vance is dedicated to providing personalized and gentle dental care.",
  },
  {
    img: "doctor2.jpg",
    name: "Dr. Marcus Thorne",
    role: "Orthodontics Specialist",
    desc: "Dr. Thorne brings a passion for creating perfect smiles through advanced orthodontic treatments.",
  },
  {
    img: "doctor3.jpg",
    name: "Ms. Sarah Chen",
    role: "Dental Hygienist",
    desc: "Sarah is committed to educating patients on oral hygiene and performing thorough cleanings.",
  },
  {
    img: "doctor4.jpg",
    name: "Mr. David Lee",
    role: "Office Manager",
    desc: "David ensures the smooth operation of our clinic, from scheduling to patient billing.",
  },
];

const Ourteam = () => {
  return (
    <section className="team-section">
      <Container>

        {/* Header */}
        <span className="team-eyebrow">The People Behind Your Smile</span>
        <h2 className="team-heading">Meet Our Dedicated Team</h2>
        <p className="team-sub">
          Passionate professionals committed to making every visit comfortable, caring, and exceptional.
        </p>

        {/* Cards */}
        <Row className="g-4 justify-content-center">
          {teamMembers.map((member, i) => (
            <Col key={i} xs={12} sm={6} md={4} lg={3}>
              <div className="member-card">

                {/* Avatar with gradient ring */}
                <div className="member-avatar-wrap">
                  <img src={member.img} alt={member.name} />
                </div>

                {/* Info */}
                <div className="member-name">{member.name}</div>
                <span className="member-role">{member.role}</span>
                <div className="member-divider" />
                <p className="member-desc">{member.desc}</p>

              </div>
            </Col>
          ))}
        </Row>

      </Container>
    </section>
  );
};

export default Ourteam;