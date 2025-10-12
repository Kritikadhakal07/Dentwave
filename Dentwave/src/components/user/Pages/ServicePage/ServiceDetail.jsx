 const DetailsPage = () => (
    <div className="page-container">
      <div className="details-container">
        <div className="details-main">
          <img 
            src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=400&fit=crop" 
            alt="Professional Dental Cleaning" 
            className="details-hero-image"
          />

          <h2 className="details-title">Professional Dental Cleaning</h2>

          <p className="details-description">
            Maintain optimal oral health with our comprehensive dental cleaning. Our experienced hygienists use state-of-the-art equipment to remove plaque, tartar, and surface stains, leaving your teeth feeling fresh and looking brighter. Regular cleanings are essential for preventing cavities, gum disease, and bad breath.
          </p>

          <div className="details-meta">
            <div className="meta-item">
              <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>Duration: 45-60 minutes</span>
            </div>
            <div className="meta-item">
              <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <span>Estimated Cost: $120 - $180</span>
            </div>
          </div>

          <div className="details-section">
            <h4>Key Benefits</h4>
            <ul className="benefits-list">
              <li>Removes plaque and tartar build-up</li>
              <li>Prevents cavities and gum disease</li>
              <li>Freshens breath</li>
              <li>Brightens smile by removing surface stains</li>
              <li>Promotes overall oral health</li>
            </ul>
          </div>

          <div className="details-section">
            <h4>Procedure Overview</h4>
            <div className="procedure-step">
              <strong>**Oral Examination:**</strong>
              <p>The hygienist will first examine your mouth for any signs of gum disease or other oral health issues.</p>
            </div>
            <div className="procedure-step">
              <strong>**Plaque and Tartar Removal:**</strong>
              <p>Using specialized tools, plaque and hardened tartar (calculus) will be carefully removed from your tooth surfaces, both above and below the gum line.</p>
            </div>
            <div className="procedure-step">
              <strong>**Tooth Polishing:**</strong>
              <p>After cleaning, your teeth will be polished with a high-powered electric brush and gritty toothpaste to remove any remaining surface stains and make them smooth.</p>
            </div>
            <div className="procedure-step">
              <strong>**Flossing:**</strong>
              <p>A thorough flossing will be performed to ensure all areas between your teeth are clean.</p>
            </div>
            <div className="procedure-step">
              <strong>**Fluoride Treatment (Optional):**</strong>
              <p>A fluoride treatment may be applied to help protect your teeth against cavities.</p>
            </div>
          </div>

          <button className="btn-add-appointment">+ Add to Appointment</button>
        </div>

        <div className="details-sidebar">
          <h3 className="sidebar-title">Your Appointment Summary</h3>
          <p className="sidebar-empty">No services added yet</p>
          <button className="btn-proceed">Proceed to Booking</button>
        </div>
      </div>
    </div>
  );

 

