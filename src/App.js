// src/App.js
import React, { useState, useRef } from 'react';
import UploadScreen from './components/UploadScreen';
import MatchResultScreen from './components/MatchResultScreen';
import FAQAccordion from './components/FAQAccordion';
import WaitlistForm from './components/WaitlistForm';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [uploadedImageFileObject, setUploadedImageFileObject] = useState(null);

  const faqRef = useRef(null);

  const handleImageUploaded = (previewUrl, imageFile) => {
    setUploadedImagePreview(previewUrl);
    setUploadedImageFileObject(imageFile);
    setCurrentView('results');
  };

  const handleStartOver = () => {
    setUploadedImagePreview(null);
    setUploadedImageFileObject(null);
    setCurrentView('upload');
  };

  const faqData = [
    { question: "How does Looksy work?", answer: "You upload a photo of your face. Our system then compares your facial features to a pre-set collection of AI-generated faces using a real facial recognition API. You'll see your top matches sorted by a calculated similarity score. If both users were real and opted-in, you could connect!" },
    { question: "Is my photo stored? What about privacy?", answer: "Privacy is our core principle. In this demo, your uploaded photo is sent to our backend for a one-time analysis and is deleted from the server immediately after processing. We do not store your image. The full app will be built with explicit, granular consent for all data usage." },
    { question: "How is the similarity percentage calculated?", answer: "When you upload an image, we use a production-grade facial recognition model to convert your face and our demo faces into numerical data called 'embeddings.' The similarity score is then calculated based on the mathematical distance between your embedding and each of the demo face embeddings." },
    { question: "Can I connect with my matches?", answer: "In this demo, the matches are AI-generated and do not have real social media profiles. The 'Show Instagram' feature is a functional UI demonstration of how opt-in connections would work in the final app, where real users could consent to share their information." }
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
    } else if (view === 'landing' && !ref) {
      setCurrentView('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView(view);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div onClick={() => handleNavClick('landing')} className="logo-container">
          <img src="/logo.png" alt="Looksy Logo" className="app-logo-img" />
          <span className="logo-text">Looksy</span>
        </div>
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
              <div className="section-content-wrapper hero-content-wrapper">
                {/* The hero icon div is now removed for a cleaner look */}
                <h2>Looksy - The AI-Driven Lookalike App</h2>
                <p>Ever wondered who shares your features? Looksy connects you with visually similar individuals from our user-contributed community based on real AI facial similarity analysis.</p>
                <div className="cta-buttons">
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
                    <h3>1. Upload Photo</h3>
                    <p>Securely submit a clear photo of your face. Your image is deleted after analysis.</p>
                  </div>
                  <div className="step">
                    <div className="step-icon">2</div>
                    <h3>2. AI Analysis</h3>
                    <p>Our AI converts your facial features into a unique mathematical signature.</p>
                  </div>
                  <div className="step">
                    <div className="step-icon">3</div>
                    <h3>3. See Matches</h3>
                    <p>Discover AI-generated faces from our demo set, sorted by similarity to you.</p>
                  </div>
                  <div className="step">
                    <div className="step-icon">4</div>
                    <h3>4. Connect</h3>
                    <p>In the full app, you can optionally connect with real users if you both consent.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="landing-section features-section">
              <div className="section-content-wrapper">
                <h2>Privacy-First by Design</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <h3>User-Contributed</h3>
                        <p>No scraping. The full app's lookalike pool will be built only from users who explicitly opt-in.</p>
                    </div>
                    <div className="feature-item">
                        <h3>You Are In Control</h3>
                        <p>Your photo is only used for the one-time analysis and is not stored. You control all your data.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Consent is Key</h3>
                        <p>Sharing contact information like an Instagram handle is double opt-in. It only happens if both you and your match agree.</p>
                    </div>
                </div>
              </div>
            </section>

            <section ref={faqRef} className="landing-section faq-section-landing">
              <div className="section-content-wrapper">
                <FAQAccordion items={faqData} />
              </div>
            </section>

            <section className="landing-section download-app-section">
              <div className="section-content-wrapper">
                <h2>Download Looksy</h2>
                <div className="store-badges">
                  <div className="store-badge non-interactive-badge" title="Download on the App Store (Coming Soon)">
                    <img src="/apple-store-badge-dark.png" alt="Download on the App Store (Coming Soon)"/>
                  </div>
                  <div className="store-badge non-interactive-badge" title="Get it on Google Play (Coming Soon)">
                    <img src="/google-play-badge-dark.png" alt="Get it on Google Play (Coming Soon)"/>
                  </div>
                </div>
                <p>Our app is launching soon on iOS and Android!<span className="coming-soon-text"> Stay tuned.</span></p>
              </div>
            </section>

            <section className="landing-section final-cta-section">
                <div className="section-content-wrapper">
                    <h2>Ready to Find Your Lookalike?</h2>
                    <p>Join our waitlist to be the first to know when we fully launch, or try the working demo now!</p>
                    <div className="cta-buttons">
                        <button onClick={() => handleNavClick('upload')} className="button-primary large">Find My Lookalike Now <span className="demo-text">(Demo)</span></button>
                        <button onClick={() => handleNavClick('waitlist')} className="button-secondary large">Join Official Waitlist</button>
                    </div>
                </div>
            </section>
          </div>
        )}
        {currentView === 'upload' && <UploadScreen onImageUpload={handleImageUploaded} />}
        {currentView === 'results' && (<MatchResultScreen userUploadedImage={uploadedImagePreview} uploadedImageFileObject={uploadedImageFileObject} onStartOver={handleStartOver} />)}
        {currentView === 'waitlist' && <WaitlistForm />}
      </main>

      <footer className="App-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Looksy. Your Face, Your Control.</p>
          <div className="social-links">
            <a href="https://instagram.com/looksyapp" target="_blank" rel="noopener noreferrer" aria-label="Looksy on Instagram"><img src="/instagram-white.png" alt="Instagram" className="social-icon" /></a>
            <a href="https://x.com/looksyapp" target="_blank" rel="noopener noreferrer" aria-label="Looksy on Twitter (X)"><img src="/twitter-white.png" alt="Twitter X" className="social-icon" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;