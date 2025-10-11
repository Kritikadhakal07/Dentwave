import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const Ourteam = () =>  {
  
  const teamMembers = [
    {
      img: "doctor1.jpg",
      name: "Dr. Elara Vance",
      role: "Lead Dentist & Founder",
      desc: "With over 15 years of experience, Dr. Vance is dedicated to providing personalized and gentle dental care.",
    },
     {
      img: "doctor4.jpg",
      name: "Mr. David Lee",
      role: "Office Manager",
      desc: "David ensures the smooth operation of our clinic, from scheduling to billing.",
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
      desc: "David ensures the smooth operation of our clinic, from scheduling to billing.",
    },
    {
      img: "doctor3.jpg",
      name: "Ms. Sarah Chen",
      role: "Dental Hygienist",
      desc: "Sarah is committed to educating patients on oral hygiene and performing thorough cleanings.",
    },
    
  ];

  
  return (
    <section className="py-5 ">
      <Container>
        <div className="text-center mb-5">
          <h2 style={{ color: "#4a90e2"}} className="fw-bold ">Meet Our Dedicated Team</h2>
        </div>

       
        <Row className="g-4">
          {teamMembers.map((member, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 text-center border-0 shadow-sm p-3">
                <Card.Img
                  src={member.img}
                  alt={member.name}
                  className="rounded-circle mx-auto"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    marginTop: 10,
                  }}
                />
                <Card.Body>
                  <Card.Title style={{ color: "#4a90e2"}} className="fw-bold ">
                    {member.name}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {member.role}
                  </Card.Subtitle>
                  <Card.Text style={{ fontSize: "0.9rem" }}>
                    {member.desc}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default Ourteam;
