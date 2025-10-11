import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Form from "./Contactform";
import Contactform from "./Contactform";
import Header from "../../components/Header";
import Footer from "../../components/Footer";


export default function Contact() {
  return (
    <>
    <Header/>
    <section className="py-5 bg-light">
      <div className="text-center mb-5">
        <h2 className="display-6 fw-bold mb-2">Get in Touch With SmileCare Dental</h2>
        <p className="text-muted mb-0">
          We’re here to answer questions, schedule appointments, and provide the best dental care.
        </p>
      </div>

      <Container>
        <Row className="g-4">
          {/* Left: form */}
          <Col xs={12} md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h5 className="fw-bold mb-2">Send Us a Message</h5>
                <p className="text-muted">Fill out the form and we’ll get back to you.</p>
             <Contactform/>
              </Card.Body>
            </Card>
          </Col>

          {/* Right: details + map */}
          <Col xs={12} md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h5 className="fw-bold mb-2">Our Location</h5>
                <p className="text-muted">Plan your visit to Dentwave Dental.</p>

                <div className="mb-3">
                  <strong>Address:</strong> 123 Dental Lane, City, State, 12345<br/>
                  <strong>Phone:</strong> (123) 456-7890
                </div>

                <div className="mb-3">
                  <strong>Hours:</strong><br/>
                  Mon–Fri: 9:00 AM – 6:00 PM<br/>
                  Sat: 10:00 AM – 3:00 PM<br/>
                  Sun: Closed
                </div>

                <strong className="d-block mb-2">Map</strong>
                <div className="ratio ratio-4x3">
                  <iframe
                    title="Clinic Map"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-122.4194%2C37.7749%2C-122.4094%2C37.7849&layer=mapnik&marker=37.7799%2C-122.4144"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
    <Footer/>
    </>
  );
}

