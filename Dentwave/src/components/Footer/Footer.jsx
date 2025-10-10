import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaTiktok, FaFacebookMessenger } from "react-icons/fa";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#4a90e2", color: "#fff" }} className=" pt-4 pb-3 mt-5">
      <Container fluid className="px-5 py-2">
        <Row className="gy-4 gx-5 text-center text-md-start">
          <Col md={4}>
            <h5 className="fw-bold">🦷 Dentwave</h5>
            <p className="mb-0">Where beautiful smiles begin.</p>
          </Col>

          <Col md={4}>
            <h6 className="fw-bold mb-2">Contact Us</h6>
            <p className="mb-1">New Baneshwor - 01-4564444, 01-4592136</p>
            <p className="mb-1">Jawalakhel Chowk - 01-5424799</p>
            <p className="mb-1">Radhe Radhe, Bhaktapur - 01-6631035, 01-5916050</p>
            <p className="mb-1">Suncity, Pepsicola - 01-5910607</p>
            <p className="mb-0">Email: dentwavedental@gmail.com</p>
          </Col>

          <Col md={4}>
            <h6 className="fw-bold mb-2">Quick Links</h6>
            <ul className="list-unstyled mb-0">
              <li><a href="#about" className="text-light text-decoration-none">About</a></li>
              <li><a href="#appointment" className="text-light text-decoration-none">Appointment</a></li>
              <li><a href="#services" className="text-light text-decoration-none">Services</a></li>
              <li><a href="#contact" className="text-light text-decoration-none">Contact Us</a></li>
            </ul>
          </Col>
        </Row>

        <hr className="border-light my-3" />
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <p className="mb-0 text-center text-md-start">
            © {new Date().getFullYear()} Dentwave. All Rights Reserved.
          </p>

          <div className="d-flex justify-content-center gap-3 mt-2 mt-md-0">
            <a href="#" className="text-light fs-5"><FaFacebookF /></a>
            <a href="#" className="text-light fs-5"><FaFacebookMessenger /></a>
            <a href="#" className="text-light fs-5"><FaTiktok /></a>
            <a href="#" className="text-light fs-5"><FaInstagram /></a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
