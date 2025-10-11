import React from "react";
import { Form, Button } from "react-bootstrap";

export default function Contactform({ submitLabel = "Submit Message" }) {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="contactName">
        <Form.Label>Your Name</Form.Label>
        <Form.Control type="text" placeholder="John Doe" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="contactEmail">
        <Form.Label>Your Email</Form.Label>
        <Form.Control type="email" placeholder="john.doe@example.com" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="contactMessage">
        <Form.Label>Your Message</Form.Label>
        <Form.Control as="textarea" rows={4} placeholder="How can we help?" />
      </Form.Group>

      <Button className="w-100">{submitLabel}</Button>
    </Form>
  );
}
