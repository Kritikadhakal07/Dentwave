import React from "react";
import { Form, Button } from "react-bootstrap";

export default function Contactform({ submitLabel = "Submit Message" }) {
  return (
    <Form>
      <Form.Group className="mb-4 fw-bold" controlId="contactName">
        <Form.Label>Your Name</Form.Label>
        <Form.Control type="text" placeholder="" />
      </Form.Group>

      <Form.Group className="mb-4 fw-bold" controlId="contactEmail">
        <Form.Label>Your Email</Form.Label>
        <Form.Control type="email" placeholder="pujadhital@example.com" />
      </Form.Group>
           <Form.Group className="mb-4 fw-bold" controlId="contactEmail">
        <Form.Label>Your Phone Number</Form.Label>
        <Form.Control type="number" placeholder=" " />
      </Form.Group>

      <Form.Group className="mb-4 fw-bold" controlId="contactMessage">
        <Form.Label>Your Message</Form.Label>
        <Form.Control as="textarea" rows={4} placeholder="How can we help?" />
      </Form.Group>

      <Button className="w-100">{submitLabel}</Button>
    </Form>
  );
}
