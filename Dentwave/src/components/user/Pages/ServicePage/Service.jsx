

// Services Data
const servicesData = [
  {
    id: 1,
    title: 'Routine Check-ups',
    description: 'Regular examinations and professional cleanings to maintain optimal oral health and prevent dental issues.',
    price: 120,
    duration: 60,
    icon: '🦷',
    details: {
      duration: '45-60 minutes',
      cost: '$120 - $180',
      benefits: [
        'Removes plaque and tartar build-up',
        'Prevents cavities and gum disease',
        'Freshens breath',
        'Brightens smile by removing surface stains',
        'Promotes overall oral health'
      ],
      procedure: [
        '**Oral Examination:** The hygienist will first examine your mouth for any signs of gum disease or other oral health issues.',
        '**Plaque and Tartar Removal:** Using specialized tools, plaque and hardened tartar (calculus) will be carefully removed from your tooth surfaces, both above and below the gum line.',
        '**Tooth Polishing:** After cleaning, your teeth will be polished with a high-powered electric brush and gritty toothpaste to remove any remaining surface stains and make them smooth.',
        '**Flossing:** A thorough flossing will be performed to ensure all areas between your teeth are clean.',
        '**Fluoride Treatment (Optional):** A fluoride treatment may be applied to help protect your teeth against cavities.'
      ]
    }
  },
  {
    id: 2,
    title: 'Cosmetic Fillings',
    description: 'Tooth-colored composite fillings to restore decayed teeth, blending seamlessly with your natural smile.',
    price: 180,
    duration: 45,
    icon: '⚙️'
  },
  {
    id: 3,
    title: 'Teeth Whitening',
    description: 'Professional teeth whitening treatments to brighten your smile and remove years of stains.',
    price: 350,
    duration: 90,
    icon: '✨'
  },
  {
    id: 4,
    title: 'Dental Implants',
    description: 'Permanent solutions for missing teeth using advanced implant technology, restoring function and aesthetics.',
    price: 0,
    duration: 120,
    icon: '🔩',
    priceText: 'Consultation Required'
  },
  {
    id: 5,
    title: 'Orthodontics',
    description: 'Braces and aligners to correct misaligned teeth and jaws, improving both appearance and oral health.',
    price: 0,
    duration: 60,
    icon: '😁',
    priceText: 'Consultation Required'
  },
  {
    id: 6,
    title: 'Root Canal Therapy',
    description: 'Specialized treatment to save a tooth that is badly infected or damaged, relieving pain and preserving natural teeth.',
    price: 700,
    duration: 90,
    icon: '💉'
  },
  {
    id: 7,
    title: 'Dental Veneers',
    description: 'Custom-made, thin shells designed to cover the front surface of teeth to improve appearance.',
    price: 950,
    duration: 120,
    icon: '🦷'
  },
  {
    id: 8,
    title: 'Gum Treatment',
    description: 'Specialized care for gum diseases, including deep cleanings and other therapeutic procedures.',
    price: 250,
    duration: 75,
    icon: '💗'
  },
  {
    id: 9,
    title: 'Emergency Dental Care',
    description: 'Prompt treatment for urgent dental issues such as severe toothache, broken tooth, or dental injuries.',
    price: 0,
    duration: 60,
    icon: '🚨',
    priceText: 'Contact for Details'
  }
];

// Services Page Component
const Services = ({ onLearnMore }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '50px 0' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">Our Dental Services</h1>
          <p className="text-muted" style={{ maxWidth: '700px', margin: '0 auto' }}>
            At Your Dental, we are dedicated to providing comprehensive dental care 
            tailored to your needs. Explore our range of services designed to ensure your oral 
            health and beautiful smile.
          </p>
        </div>

        <div className="row g-4">
          {servicesData.map((service) => (
            <div key={service.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm" style={{ transition: 'all 0.3s' }}>
                <div 
                  className="card-img-top d-flex align-items-center justify-content-center" 
                  style={{ 
                    height: '200px', 
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    fontSize: '4rem'
                  }}
                >
                  {service.icon}
                </div>
                
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold mb-3">{service.title}</h5>
                  <p className="card-text text-muted small mb-3" style={{ minHeight: '60px' }}>
                    {service.description}
                  </p>
                  <p className="text-primary fw-semibold mb-3">
                    {service.priceText || `From $${service.price}`}
                  </p>
                  <button 
                    onClick={() => onLearnMore(service)}
                    className="btn btn-link text-primary text-decoration-none p-0 mt-auto"
                    style={{ textAlign: 'left' }}
                  >
                    Learn More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;






