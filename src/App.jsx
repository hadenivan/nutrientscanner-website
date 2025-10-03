import React from 'react';
import StaggeredMenu from './components/StaggeredMenu';
import Masonry from './components/Masonry';
import ClickSpark from './components/ClickSpark';
import LogoLoop from './components/LogoLoop';
import './App.css';

function App() {
  // Navigation menu items
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '#home' },
    { label: 'The Problem', ariaLabel: 'Learn about food system challenges', link: '#problem' },
    { label: 'Our Solution', ariaLabel: 'See our nutrient scanner', link: '#solution' },
    { label: 'For Farmers', ariaLabel: 'How farmers benefit', link: '#farmers' },
    { label: 'Technology', ariaLabel: 'How it works', link: '#tech' },
    { label: 'About Us', ariaLabel: 'Meet the team', link: '#about' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' }
  ];

  // Social links
  const socialItems = [
    { label: 'Twitter', link: 'https://twitter.com/nutriview' },
    { label: 'LinkedIn', link: 'https://linkedin.com/company/nutriview' },
    { label: 'Email', link: 'mailto:hello@nutriview.com' }
  ];

  // Masonry gallery items - showing different aspects of agriculture
  const galleryItems = [
    {
      id: "1",
      img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=900&fit=crop",
      url: "https://example.com/farmer-working",
      height: 400,
      title: "Farmer Testing Crops"
    },
    {
      id: "2", 
      img: "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=600&h=750&fit=crop",
      url: "https://example.com/pricing",
      height: 300,
      title: "Nutrient-Dense Produce"
    },
    {
      id: "3",
      img: "https://images.unsplash.com/photo-1564760049443-e8ad59e4d2a3?w=600&h=800&fit=crop", 
      url: "https://example.com/technology",
      height: 600,
      title: "Close-up Crop Analysis"
    },
    {
      id: "4",
      img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=700&fit=crop",
      url: "https://example.com/results",
      height: 350,
      title: "Fresh Market Display"
    },
    {
      id: "5",
      img: "https://images.unsplash.com/photo-1582095133179-bfd08d2dea78?w=600&h=500&fit=crop",
      url: "https://example.com/benefits", 
      height: 500,
      title: "Sustainable Farming"
    },
    {
      id: "6",
      img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020c?w=600&h=650&fit=crop",
      url: "https://example.com/partnerships",
      height: 450,
      title: "Farm to Table Journey"
    }
  ];

  // Partner logos (you can replace with actual partners)
  const partnerLogos = [
    { src: "/logos/usda.png", alt: "USDA", href: "https://usda.gov" },
    { src: "/logos/cornell.png", alt: "Cornell University", href: "https://cornell.edu" },
    { src: "/logos/farmers-market.png", alt: "Farmers Market", href: "https://farmersmarket.com" },
    { src: "/logos/agriculture-portal.png", alt: "Agriculture Portal", href: "https://agricultureportal.com" }
  ];

  return (
    <div className="App">
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#fff"
        openMenuButtonColor="#4ADE80"
        changeMenuColorOnOpen={true}
        colors={['#065F46', '#10B981', '#059669']}
        logoUrl="/logo.svg"
        accentColor="#10B981"
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
      />

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            See What's <span className="highlight">Really</span> in Your Food
          </h1>
          <p className="hero-subtitle">
            The handheld nutrient scanner that reveals the invisible qualities of fresh produce—
            nutrient density, flavor potential, and durability—in real time.
          </p>
          <div className="hero-actions">
            <ClickSpark
              sparkColor='#10B981'
              sparkSize={12}
              sparkRadius={20}
              sparkCount={10}
              duration={500}
            >
              <button className="btn btn-primary">
                See the Technology
              </button>
            </ClickSpark>
            <button className="btn btn-secondary">Watch Demo</button>
          </div>
        </div>
        <div className="hero-device">
          <div className="device-showcase">
            <div className="scanner-mockup">
              <div className="scanning-overlay"></div>
              <div className="results-display">
                <div className="result-item">
                  <span className="nutrient">Vitamin C</span>
                  <span className="value">45mg</span>
                </div>
                <div className="result-item">
                  <span className="nutrient">Iron</span>
                  <span className="value">2.1mg</span>
                </div>
                <div className="result-item">
                  <span className="nutrient">Antioxidants</span>
                  <span className="value high">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="problem-section">
        <div className="container">
          <h2 className="section-title">The Hidden Crisis in Our Food System</h2>
          <div className="problems-grid">
            <div className="problem-card">
              <div className="problem-icon">
                <span className="icon">👁️</span>
              </div>
              <h3>Nutrient Blindness</h3>
              <p>Food nutrient quality varies by up to <strong>200x</strong>, but consumers can't see it. Neither can farmers prove their crop quality.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">
                <span className="icon">📋</span>
              </div>
              <h3>Label Confusion</h3>
              <p>Certifications like organic tell you about <em>farming practices</em>, not actual <strong>nutritional value</strong>.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">
                <span className="icon">🌱</span>
              </div>
              <h3>Farmer Disadvantage</h3>
              <p>Farmers can't measure or prove nutrient density, missing <strong>fair value</strong> for their best crops.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">
                <span className="icon">🏪</span>
              </div>
              <h3>Retail Gap</h3>
              <p>Grocers and distributors have no affordable way to verify and communicate food quality to customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="solution-section">
        <div className="container">
          <div className="solution-content">
            <div className="solution-text">
              <h2 className="section-title">Introducing NutriView Scanner</h2>
              <p className="solution-description">
                A handheld device powered by near-infrared spectroscopy (NIRS) and machine learning. 
                Measure nutrient density, flavor potential, and durability—instantly, affordably, without destroying your produce.
              </p>
              <div className="solution-features">
                <div className="feature">
                  <span className="feature-icon">⚡</span>
                  <span><strong>Instant Results</strong> - Seconds, not weeks</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">💰</span>
                  <span><strong>Affordable</strong> - Accessible to farmers</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🛡️</span>
                  <span><strong>Non-Destructive</strong> - No sample damage</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📱</span>
                  <span><strong>Portable</strong> - Use anywhere</span>
                </div>
              </div>
            </div>
            <div className="solution-visual">
              <div className="tech-showcase">
                <div className="scanner-handheld">
                  <div className="screen-display">
                    <div className="scanning-animation"></div>
                    <div className="nutrition-bars">
                      <div className="bar vitamin-c"></div>
                      <div className="bar iron"></div>
                      <div className="bar antioxidants"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Farmers Section */}
      <section id="farmers" className="farmers-section">
        <div className="container">
          <h2 className="section-title">Built for Farmers</h2>
          <p className="section-subtitle">
            Finally prove what you've always known: your nutrient-dense crops deserve premium pricing
          </p>
          <div className="farmers-benefits">
            <div className="benefit-column">
              <h3>🌿 Prove Quality</h3>
              <p>Measure and document nutrient density directly in the field. Show concrete data to buyers.</p>
            </div>
            <div className="benefit-column">
              <h3>💵 Capture Fair Value</h3>
              <p>Command premium prices for verified nutrient-dense produce. No more guessing at quality.</p>
            </div>
            <div className="benefit-column">
              <h3>📊 Make Better Decisions</h3>
              <p>Connect your practices to measurable outcomes. Optimize growing methods for nutrition.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="tech" className="tech-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="tech-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Point & Measure</h3>
                <p>Simply point your NutriView Scanner at any fruit, vegetable, or grain.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Analyze</h3>
                <p>Near-infrared spectroscopy captures the molecular fingerprint instantly.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Get Insights</h3>
                <p>Receive detailed nutritional analysis, durability predictions, and flavor potential.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="container">
          <h2 className="section-title">Real Agriculture Data</h2>
          <p className="section-subtitle">
            See how NutriView Scanner brings transparency to every level of the food system
          </p>
          <Masonry
            items={galleryItems}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.95}
            blurToFocus={true}
            colorShiftOnHover={false}
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="founder-info">
              <div className="founder-photo">
                <img 
                  src="/founder-photo.jpg" 
                  alt="Haden Harrison, Founder of NutriView"
                  className="founder-image"
                />
              </div>
              <div className="founder-details">
                <h2>Meet the Founder</h2>
                <h3>Haden Harrison</h3>
                <p>
                  As someone who grew up around agriculture, I've seen firsthand how farmers produce 
                  incredible, nutrient-dense crops but struggle to prove it to buyers. Our tool bridges 
                  that gap—giving farmers the data they need to capture fair value and consumers 
                  the transparency they deserve.
                </p>
                <div className="founder-credentials">
                  <div className="credential">
                    <span className="credential-icon">🎓</span>
                    <span>Agricultural Technology Researcher</span>
                  </div>
                  <div className="credential">
                    <span className="credential-icon">🌾</span>
                    <span>Farming Community Advocate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
        <div className="container">
          <h2 className="section-title">Trusted by Agriculture Leaders</h2>
          <LogoLoop
            logos={partnerLogos}
            speed={120}
            direction="left"
            logoHeight={48}
            gap={60}
            pauseOnHover={true}
            scaleOnHover={true}
            fadeOut={false}
            ariaLabel="Agriculture partners and supporters"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Food System?</h2>
            <p>Join farmers, distributors, and consumers who are bringing transparency back to agriculture.</p>
            <div className="cta-form">
              <input 
                type="email" 
                placeholder="Enter your email to join the waitlist" 
                className="email-input"
              />
              <ClickSpark
                sparkColor='#10B981'
                sparkSize={10}
                sparkRadius={15}
                sparkCount={8}
                duration={400}
              >
                <button className="btn btn-primary">Join Waitlist</button>
              </ClickSpark>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <footer id="contact" className="contact-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <span className="logo-icon">🌱</span>
                <span>NutriView</span>
              </div>
              <p>Bringing transparency, accountability, and trust back to the food system.</p>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>hello@nutriview.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="footer-section">
              <h4>For Farmers</h4>
              <p>farmers@nutriview.com</p>
              <p>Supporting sustainable agriculture</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 NutriView. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
