import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Form from "./Contactform";
import Contactform from "./Contactform";
import Header from "../../components/Header";
import Footer from "../../components/Footer";


export default function Contact() {

  return (
    <>
    <section className="hero1 text-center py-5" style={{ backgroundColor: "#f8fbff" }}>
     
        <h1 className="fw-bold mb-3" style={{ color: "#4a90e2" }}>
          Get in Touch With Us
        </h1>
        <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
          We're here to answer your questions, provide treatment details, and assist with
          appointment scheduling across all branches.
        </p>
     </section>

      <Container className="mt-5">
        <Row className="g-4">
          {/* Left: form */}
          <Col xs={12} md={6}>
            <Card className="border-0 shadow-lg h-100">
              <Card.Body>
                <h4 style={{ color: "#4a90e2" }} className="fw-bold mt-3 ">Send Us a Message</h4>
                <h5  className="fw-bold mt-4">Get In Touch Today</h5>
                <p className="text-muted mt-3">Fill out the form and we’ll get back to you.</p>
             <Contactform/>
              </Card.Body>
            </Card>
          </Col>

          {/* Right: details + map */}
          <Col xs={12} md={6}>
            <Card className="border-0 shadow-lg h-100 ">
              <Card.Body>
                <h4 style={{ color: "#4a90e2" }} className="fw-bold mt-3 mb-2 text-center">Our Location</h4>
                <p className="text-muted text-center">Plan your visit to Dentwave.</p>

                <div className="mb-3">
            <div className="text-center">

                  <strong > Address:</strong></div> <p className="mb-1 text-center">New Baneshwor - 01-4564444, 01-4592136</p>
            <p className="mb-1 text-center">Jawalakhel Chowk - 01-5424799</p>
            <p className="mb-1 text-center">Radhe Radhe, Bhaktapur - 01-6631035, 01-5916050</p>
            <p className="mb-1 text-center">Suncity, Pepsicola - 01-5910607</p><br />
            <div className="text-center">
                  <strong>Phone:</strong> 9807654783
                  </div>
                </div>

                <div className="mb-3 text-center">
                  <strong>Hours:</strong><br/>
                  Mon–Fri: 9:00 AM – 6:00 PM<br/>
                  Sat: 10:00 AM – 3:00 PM<br/>
                 
                </div>
                <div className="text-center">
                <strong className="d-block mb-2 item-center">Map</strong>
                </div>
                <div className="ratio ratio-4x3">
                  <iframe
                    title="Clinic Map"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=85.3045%2C27.686%2C85.3345%2C27.706&layer=mapnik&marker=27.696%2C85.3195"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    
    </>
  );
}