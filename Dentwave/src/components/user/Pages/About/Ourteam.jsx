import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";

const Ourteam = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/doctors"
      );
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  return (
    <section className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 style={{ color: "#4a90e2" }} className="fw-bold">
            Meet Our Dedicated Team
          </h2>
        </div>

        <Row className="g-4">
          {doctors.map((doctor) => (
            <Col key={doctor.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 text-center border-0 shadow-sm p-3">
                
                {/* Doctor Image */}
                {doctor.image && (
                  <Card.Img
                    src={`http://127.0.0.1:8000/storage/${doctor.image}`}
                    alt={doctor.name}
                    className="rounded-circle mx-auto"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      marginTop: 10,
                    }}
                  />
                )}

                <Card.Body>
                  <Card.Title
                    style={{ color: "#4a90e2" }}
                    className="fw-bold"
                  >
                    {doctor.name}
                  </Card.Title>

                  <Card.Subtitle className="mb-2 text-muted">
                    {doctor.specialization}
                  </Card.Subtitle>

                  <Card.Text style={{ fontSize: "0.9rem" }}>
                    {doctor.experience} Years Experience
                  </Card.Text>

                  
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Ourteam;