import React from 'react';
import './Home.css';
import Hero from "../../../../assets/home.gif";

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

      {/* Services Section */}
      <div className="container services-section">
        <h2 className="section-title">Our Services</h2>
        
        <div className="row service-cards">
          {/* Service Card 1 */}
          <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
            <div className="service-card">
              <div className="service-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
              <h3 className="service-title">General Dentistry</h3>
              <p className="service-description">
                Routine check-ups, cleanings, and preventive care to maintain optimal oral health.
              </p>
            </div>
          </div>

          {/* Service Card 2 */}
          <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
            <div className="service-card">
              <div className="service-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3 className="service-title">Cosmetic Dentistry</h3>
              <p className="service-description">
                Enhance your smile with teeth whitening, veneers, and other cosmetic procedures.
              </p>
            </div>
          </div>

          {/* Service Card 3 */}
          <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
            <div className="service-card">
              <div className="service-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <h3 className="service-title">Orthodontics</h3>
              <p className="service-description">
                Achieve straighter teeth with braces, clear aligners, and other orthodontic solutions.
              </p>
            </div>
          </div>

          {/* Service Card 4 */}
          <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
            <div className="service-card">
              <div className="service-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3 className="service-title">Dental Implants</h3>
              <p className="service-description">
                Replace missing teeth with durable, natural-looking dental implants.
              </p>
            </div>
          </div>
        </div>
      </div>

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