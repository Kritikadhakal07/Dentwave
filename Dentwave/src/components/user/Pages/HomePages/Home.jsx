import React from 'react';
import './Home.css';
import Hero from "../../../../assets/home.gif";
import ServicesSection from './Services';

const Home = () => {
  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <div className="container hero-section">
        <div className="row hero-content align-items-center">
          {/* Left Side */}
          <div className="col-md-6 left-side">
            
            <h1 className="hero-title">
              Your Journey to a Brighter Smile Starts Here
            </h1>
            <p className="hero-description">
              Experience comprehensive dental care in a state-of-the-art environment, tailored to meet unique needs.
            </p>
            <button className="btn btn-primary appointment-btn">
              Book an Appointment
            </button>
          </div>

          {/* Right Side */}
          <div className="col-md-6 right-side">
            <div className="hero-image-wrapper">
              <img 
                src={Hero} 
                alt="Modern Dental Office" 
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </div>

    <ServicesSection/>

      {/* Testimonials Section */}
      <div className="container testimonials-section">
        <h2 className="section-title">What Our Patients Say</h2>
        
        <div className="row testimonial-cards">
          {/* Testimonial 1 */}
          <div className="col-md-4 mb-4">
            <div className="testimonial-card">
              <div className="quote-icon">"</div>
              <p className="testimonial-text">
                The team at DentaCare Dental is absolutely wonderful! They made me feel at ease and comfortable during my visit. I'm so happy with the results from my teeth cleaning!
              </p>
              <div className="testimonial-author">
                <div className="author-avatar avatar-purple"></div>
                <div className="author-info">
                  <p className="author-name">Sarah M.</p>
                  <p className="author-role">Marketing Manager</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="col-md-4 mb-4">
            <div className="testimonial-card">
              <div className="quote-icon">"</div>
              <p className="testimonial-text">
                Professional, efficient, and genuinely caring! I brought my son in for his first dental visit and the staff was amazing with him. Highly recommend this practice!
              </p>
              <div className="testimonial-author">
                <div className="author-avatar avatar-blue"></div>
                <div className="author-info">
                  <p className="author-name">Michael T.</p>
                  <p className="author-role">Small Business Owner</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="col-md-4 mb-4">
            <div className="testimonial-card">
              <div className="quote-icon">"</div>
              <p className="testimonial-text">
                I used to dread going to the dentist, but not anymore! The staff at DentaCare Dental are so friendly and professional. They've truly transformed my dental experience!
              </p>
              <div className="testimonial-author">
                <div className="author-avatar avatar-green"></div>
                <div className="author-info">
                  <p className="author-name">Jessica L.</p>
                  <p className="author-role">Teacher</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Smile?</h2>
          <p className="cta-description">
            Schedule your consultation today and take the first step towards optimal dental health and a dazzling smile.
          </p>
          <button className="btn btn-primary cta-btn">
            Book Your Appointment Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;