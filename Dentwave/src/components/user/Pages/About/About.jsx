import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Container,Row,Col,Card} from 'react-bootstrap'
import Ourteam from './Ourteam'

const About = () => {
    const facilities = [
  {
    img: "facilities1.jpg",
    alt: "Reception Area",
    text: "Welcoming reception designed for your comfort and ease.",
  },
  {
    img: "facilities2.jpg",
    alt: "Dental Chair",
    text: "Latest technology for precise and gentle care.",
  },
  {
    img: "facilities3.jpg",
    alt: "Clinic Hygiene",
    text: "Ensuring top standards of hygiene and safety.",
  },
];

  return (
    <>
    <Header/>
    <section className='py-5 bg-light text-dark'>
        <Container >
            {/* OUr mission and story */}

        <div className='text-center mb-5'>
            <h2 style={{ color: "#4a90e2"}} className='fw-bold mt-4 mb-4'>Our Story & Mission</h2>
            <p  className='text-justify'>
                  At DentWave  Clinic, our journey began over a decade ago with a clear purpose to create a place where every patient feels valued, understood, and cared for. What started as a simple vision has grown into a trusted dental practice known for its commitment to excellence, comfort, and compassion.Founded by Dr.Ladies, a visionary dentist dedicated to transforming smiles, DentWave has become a place where patients of all ages feel safe, heard, and valued.
            </p>
            <p className="mt-5  text-justify">
           We believe that a healthy, beautiful smile has the power to transform lives — boosting confidence, enhancing well-being, and creating lasting impressions. Our goal is to provide exceptional dental care in an environment that feels warm, welcoming, and stress-free. Every visit is designed with your comfort in mind, combining modern technology, gentle techniques, and a personalized approach to care. Whether it’s a routine checkup, preventive treatment, or a complete smile makeover, we’re committed to helping you achieve and maintain the radiant smile you deserve.
          </p>
        </div>

        {/* Our Facilites */}
        <div className='text-center mb-4'>
            <h3 style={{ color: "#4a90e2"}} className='fw-bold '>Our Facilities</h3>
        </div>


        {/* card */}
        <Row className="g-4">
            {facilities.map((item,index)=>{
                return(
                <Col key={index} md={4}>
                    <Card className="h-100 shadow-sm border-0">
                        <Card.Img 
                        src={item.img}
                        alt={item.alt}
                        style={{height:220,objectFit: "cover"}}
                        />
                        <Card.Body className="text-center">
                        <Card.Text>{item.text}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                );
            })}
        </Row>

        </Container>
    </section>

    <Ourteam/>
    <Footer/>
 
    </>
  )
}

export default About