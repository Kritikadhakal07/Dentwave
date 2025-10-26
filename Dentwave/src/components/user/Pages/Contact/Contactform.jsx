import React ,{useState} from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";


export default function Contactform({ submitLabel = "Submit Message" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""

  });
  const [loading, setLoading]= useState(false);

  const handleInputChange = (e) =>{
const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/contact", formData);

// If res.data is a string, clean it first
let data = res.data;
if (typeof data === "string") {
  data = data.replace(/^<+/, ""); // remove any leading '<'
  data = JSON.parse(data);
}
alert(data.message);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
   <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-4 fw-bold" controlId="contactName">
        <Form.Label>Your Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          required
        />
      </Form.Group>

      <Form.Group className="mb-4 fw-bold" controlId="contactEmail">
        <Form.Label>Your Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="you@example.com"
          required
        />
      </Form.Group>

      <Form.Group className="mb-4 fw-bold" controlId="contactPhone">
        <Form.Label>Your Phone Number</Form.Label>
        <Form.Control
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder=""
        />
      </Form.Group>

      <Form.Group className="mb-4 fw-bold" controlId="contactMessage">
        <Form.Label>Your Message</Form.Label>
        <Form.Control
          as="textarea"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={4}
          placeholder="How can we help?"
          required
        />
      </Form.Group>

      <Button type="submit" className="w-100" disabled={loading}>
        {loading ? "Sending..." : submitLabel}
      </Button>
    </Form>
  );
}
