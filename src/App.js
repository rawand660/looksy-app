// src/App.js
import React, { useState, useRef } from 'react';
import UploadScreen from './components/UploadScreen';
import MatchResultScreen from './components/MatchResultScreen';
import FAQAccordion from './components/FAQAccordion';
import WaitlistForm from './components/WaitlistForm';
// **IMPORTANT**: Create placeholder SVGs or actual badge SVGs/PNGs in your `public` folder
// For example, create `public/apple-store-badge-dark.svg` and `public/google-play-badge-dark.svg`
// If you put them in `src/assets`, you'll need to import them:
// import appleStoreBadgeDark from './assets/apple-store-badge-dark.svg';
// import googlePlayBadgeDark from './assets/google-play-badge-dark.svg';
// import resultsMockup from './assets/looksy-results-mockup.png'; // If screenshot is in src/assets
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [uploadedImageFile, setUploadedImageFile] = useState(null); // Keep if used

  const faqRef = useRef(null);
  const tryLooksyRef = useRef(null); // Optional ref for scrolling

  const handleImageUploaded = (previewUrl, imageFile) => {
    setUploadedImagePreview(previewUrl);
    setUploadedImageFile(imageFile); // Store the file if needed
    setCurrentView('results');
  };

  const handleStartOver = () => {
    setUploadedImagePreview(null);
    setUploadedImageFile(null);
    setCurrentView('upload');
  };

  const faqData = [
    { question: "How does Looksy work?", answer: "You upload a photo of your face. Our system (currently simulated with random matches) will then show you other users from our database who have a similar look. You'll see a similarity score and, if both you and your match opt-in, you can share Instagram handles to connect." },
    { question: "Is my photo stored? What about privacy?", answer: "Privacy is a core principle. When you upload, you'll have options to control if your image is stored for future matching or if it's only used for the current session. You also control if your Instagram handle is shared. We aim to be transparent about data usage." },
    { question: "How is the similarity percentage calculated?", answer: "For this MVP, the similarity score is randomly generated to simulate a real AI. In a full version, we would use advanced facial recognition AI to compare key facial features and calculate a precise visual similarity score." },
    { question: "Can I connect with my matches?", answer: "Yes! If you find a match and both you and the other person have opted to share your Instagram handles, the handle will be displayed, allowing you to connect outside of Looksy." },
    { question: "Is this app free?", answer: "The current MVP/demo is free to use. Future pricing models will be determined based on features and operational costs." }
  ];

  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavClick = (view, ref = null) => {
    if (view === 'landing' && ref) {
      setCurrentView('landing');
      setTimeout(() => scrollToRef(ref), 0);
    } else if (view === 'landing' && !ref) { // Handle clicking "Looksy" logo
      setCurrentView('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top of landing
    }
     else {
      setCurrentView(view);
      window.scrollTo(0, 0); // Scroll to top for non-landing views like upload/waitlist
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 onClick={() => handleNavClick('landing')} style={{ cursor: 'pointer' }}>
          Looksy
        </h1>
        <nav>
          <button onClick={() => handleNavClick('upload')}>Try Looksy</button>
          <button onClick={() => handleNavClick('landing', faqRef)}>FAQ</button>
          <button onClick={() => handleNavClick('waitlist')}>Join Waitlist</button>
        </nav>
      </header>

      <main className="App-main">
        {currentView === 'landing' && (
          <div className="long-landing-page">
            <section className="landing-section hero-section">
              <div className="section-content-wrapper hero-content-wrapper"> {/* Use section-content-wrapper */}
                <h2>Looksy - The AI-Driven Lookalike App</h2> {/* UPDATED HEADLINE */}
                <p>Ever wondered who shares your features? Looksy connects you with visually similar individuals from our user-contributed community based on (simulated) AI facial similarity. Upload your photo, get matched, and optionally connect!</p>
                <div className="landing-hero-visual">
                  <img
                    src="/looksy-results-mockup.png" /* MAKE SURE THIS PATH IS CORRECT (e.g., from public folder) */
                    // src={resultsMockup} // If imported from src/assets
                    alt="Looksy App Interface Example"
                    className="app-screenshot-mockup"
                  />
                </div>
                <div ref={tryLooksyRef} className="cta-buttons">
                   <button onClick={() => handleNavClick('upload')} className="button-primary large">
                     Find My Lookalike Now <span className="demo-text">(Demo)</span>
                   </button>
                   <button onClick={() => handleNavClick('waitlist')} className="button-secondary large">Join the Waitlist</button>
                </div>
              </div>
            </section>

            <section className="landing-section how-it-works-section">
              <div className="section-content-wrapper">
                <h2>How Looksy Works</h2>
                <div className="steps-container">
                  <div className="step">
                    <div className="step-icon">1</div>
                    <h3>Upload Your Photo</h3>
                    <p>Securely submit a clear photo of your face. Your privacy is paramount.</p>
                  </div>
                  <div className="step">
                    <div className="step-icon">2</div>
                    <h3>AI-Powered Matching</h3>
                    <p>(Simulated) Our AI analyzes facial features to find visually similar users.</p>
                  </div>
                  <div className="step">
                    <div className="step-icon">3</div>
                    <h3>See Your Lookalikes</h3>
                    <p>Discover users who share your look and see your similarity score.</p>
                  </div>
                  <div className="step">
                    <div className="step-icon">4</div>
                    <h3>Connect (Optional)</h3>
                    <p>If both you and your match opt-in, share Instagram handles to connect.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="landing-section features-section">
              <div className="section-content-wrapper">
                <h2>Why Looksy?</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <h3>User-Contributed Database</h3>
                        <p>Matches are made with real people from our community, not celebrities.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Privacy First</h3>
                        <p>You control your data – if your image is stored, matched, or shown.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Opt-In Connections</h3>
                        <p>Only share contact info if both you and your match agree.</p>
                    </div>
                </div>
              </div>
            </section>

            <section ref={faqRef} className="landing-section faq-section-landing">
              <div className="section-content-wrapper"> {/* Added wrapper for consistency */}
                {/* FAQAccordion will render its own h2 if defined within it, or style its container */}
                <FAQAccordion items={faqData} />
              </div>
            </section>

            {/* NEW DOWNLOAD SECTION */}
            <section className="landing-section download-app-section">
              <div className="section-content-wrapper">
                <h2>Download Looksy</h2>
                <div className="store-badges">
                  <a href="#" className="store-badge" title="Download on the App Store (Coming Soon)">
                    <img 
                        src="/apple-store-badge-dark.svg" /* UPDATE THIS PATH (e.g., from public folder) */
                        // src={appleStoreBadgeDark} // If imported from src/assets
                        alt="Download on the App Store (Coming Soon)" 
                    />
                  </a>
                  <a href="#" className="store-badge" title="Get it on Google Play (Coming Soon)">
                    <img 
                        src="/google-play-badge-dark.svg" /* UPDATE THIS PATH (e.g., from public folder) */
                        // src={googlePlayBadgeDark} // If imported from src/assets
                        alt="Get it on Google Play (Coming Soon)" 
                    />
                  </a>
                </div>
                <p>
                  Our app is launching soon on iOS and Android! 
                  <span className="coming-soon-text"> Stay tuned.</span>
                </p>
              </div>
            </section>

            <section className="landing-section final-cta-section">
                <div className="section-content-wrapper">
                    <h2>Ready to Find Your Lookalike?</h2>
                    <p>Join our waitlist to be the first to know when we fully launch, or try the demo now!</p>
                    <div className="cta-buttons">
                        <button onClick={() => handleNavClick('upload')} className="button-primary large">
                            Try the Demo <span className="demo-text">(Now)</span>
                        </button>
                        <button onClick={() => handleNavClick('waitlist')} className="button-secondary large">
                            Join Official Waitlist
                        </button>
                    </div>
                </div>
            </section>
          </div>
        )}
        {currentView === 'upload' && <UploadScreen onImageUpload={handleImageUploaded} />}
        {currentView === 'results' && (
          <MatchResultScreen
            userUploadedImage={uploadedImagePreview}
            onStartOver={handleStartOver}
          />
        )}
        {currentView === 'waitlist' && <WaitlistForm />}
      </main>

      <footer className="App-footer">
        <p>© {new Date().getFullYear()} Looksy. Your Face, Your Control.</p>
      </footer>
    </div>
  );
}

export default App;