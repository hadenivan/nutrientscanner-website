import React from 'react';
import './App.css';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="nav-brand">
            <img src="/Logo.png" alt="NutriView" className="logo" />
          </div>
          <nav className="nav-links">
            <a href="#home">Home</a>
            <a href="#problem">Problem</a>
            <a href="#solution">Solution</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#founder">Founder</a>
            <a href="#waitlist">Waitlist</a>
          </nav>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          {isMobileMenuOpen && (
            <nav className="mobile-nav">
              <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
              <a href="#problem" onClick={() => setIsMobileMenuOpen(false)}>Problem</a>
              <a href="#solution" onClick={() => setIsMobileMenuOpen(false)}>Solution</a>
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>How It Works</a>
              <a href="#founder" onClick={() => setIsMobileMenuOpen(false)}>Founder</a>
              <a href="#waitlist" onClick={() => setIsMobileMenuOpen(false)}>Waitlist</a>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">See What's Really in Your Food.</h1>
            <p className="hero-subtitle">
              NutriView uses NIRS technology to instantly measure nutrient density, flavor potential, and durability.
            </p>
            <div className="hero-ctas">
              <a href="#waitlist" className="btn-primary">Join the Waitlist</a>
              <a href="#how-it-works" className="btn-secondary">Learn How It Works</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="product-showcase">
              <div className="device-mockup">
                <div className="device-screen">
                  <div className="device-results">
                    <div className="result-header">
                      <span className="overall-rating">Overall Quality: A+</span>
                    </div>
                    <div className="result-line">
                      <span className="nutrient">Vitamin C</span>
                      <span className="value">45mg</span>
                    </div>
                    <div className="result-line">
                      <span className="nutrient">Antioxidants</span>
                      <span className="value">High</span>
                    </div>
                    <div className="result-line">
                      <span className="nutrient">Iron</span>
                      <span className="value">2.1mg</span>
                    </div>
                    <div className="result-line">
                      <span className="nutrient">&Beta;-Carotene</span>
                      <span className="value">8.2mg</span>
                    </div>
                    <div className="result-line">
                      <span className="nutrient">Folate</span>
                      <span className="value">120μg</span>
                    </div>
                    <div className="result-line">
                      <span className="nutrient">Fiber</span>
                      <span className="value">Excellent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="problem">
        <div className="container">
          <h2 className="section-title">The Problem</h2>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon">Invisible Quality</div>
              <h3>Hidden Nutritional Differences</h3>
              <p>Produce that looks identical can vary in nutrition significantly, but consumers have no way to tell.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">Misleading Labels</div>
              <h3>Unreliable Certifications</h3>
              <p>Certifications only describe practices; they don't guarantee higher nutrient density, flavor, or shelf life.</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">Farmer Disadvantage</div>
              <h3>Undervalued Produce</h3>
              <p>Farmers who grow nutrient-dense food cannot prove its value at market and often compete only on price.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="solution">
        <div className="container">
          <h2 className="section-title">Our Solution</h2>
          <div className="solution-content">
            <div className="solution-text">
              <p className="solution-description">
                NutriView Scanner reveals invisible food quality instantly. Using NIRS technology and machine learning, it measures nutrient density, flavor potential, and shelf life—bringing transparency back to agriculture.
              </p>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">Instant Results</div>
                  <h4>Real-time Analysis</h4>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">Cost Effective</div>
                  <h4>Affordable</h4>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">Non-Invasive</div>
                  <h4>Non-Destructive</h4>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">Mobile Ready</div>
                  <h4>Portable</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">Scan</div>
              <h3>Scan your produce</h3>
              <p>Point NutriView Scanner at any fresh produce to begin analysis</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">Analyze</div>
              <h3>Get instant insights</h3>
              <p>Receive nutrient data, quality scores, and recommendations in the app</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">Decide</div>
              <h3>Make smarter choices</h3>
              <p>Buy, sell, or grow with confidence using real nutritional data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section id="founder" className="founder">
        <div className="container">
          <div className="founder-content">
            <div className="founder-photo">
              <img src="/Haden (founder).png" alt="Haden Harrison, Founder of NutriView" />
            </div>
            <div className="founder-text">
              <h2>Meet the Founder</h2>
              <h3>Haden Harrison</h3>
              <p>
                An ag tech entrepreneur passionate about Canadian agriculture and food transparency. Growing up in and around agriculture, I recognize the critical need for farmers to demonstrate the true value of their produce and for consumers to know exactly what they're buying. Our mission is to empower Canadian farmers to showcase the real quality of their crops while giving consumers the transparency they deserve in the food they choose for their families.
              </p>
              <div className="founder-credentials">
                <span className="credential">Canadian Agricultural Experience</span>
                <span className="credential">Farmer-Focused Innovation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Waitlist Section */}
      <section id="waitlist" className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Be the first to experience food transparency.</h2>
            <p>Join farmers, distributors, and consumers bringing transparency back to agriculture.</p>
            <form className="waitlist-form" onSubmit={(e) => {
              e.preventDefault();
              const email = e.target.email.value;
              if (email) {
                window.location.href = `mailto:hadenivan@gmail.com?subject=NutriView Waitlist Signup&body=Please add ${email} to the NutriView Scanner waitlist.`;
              }
            }}>
              <input type="email" name="email" placeholder="Enter your email" required />
              <button type="submit" className="btn-primary">Join Waitlist</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <img src="/Logo.png" alt="NutriView" className="footer-logo" />
              <p className="footer-tagline">Bringing transparency to the food system.</p>
            </div>
            <div className="footer-info">
              <div className="footer-section">
                <h4>Contact</h4>
                <p>hadenivan@gmail.com</p>
                <p>(306) 741-4101</p>
                <p><a href="https://www.linkedin.com/in/hadenharrison/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
              </div>
              <div className="footer-section">
                <h4>Company</h4>
                <p>NutriView Scanner</p>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copyright">
              <p>&copy; 2024 NutriView. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;