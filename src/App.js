// src/App.js
import React, { useState } from 'react';
import UploadScreen from './components/UploadScreen';
import MatchResultScreen from './components/MatchResultScreen';
import FAQAccordion from './components/FAQAccordion';
import WaitlistForm from './components/WaitlistForm';
import './App.css'; // Global styles

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'upload', 'results', 'waitlist', 'faq'
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [uploadedImageFile, setUploadedImageFile] = useState(null);

  const handleImageUploaded = (previewUrl, imageFile) => {
    setUploadedImagePreview(previewUrl);
    setUploadedImageFile(imageFile);
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

  return (
    <div className="App">
      <header className="App-header">
        {/* Make h1 clickable to go to landing/home */}
        <h1 onClick={() => setCurrentView('landing')} style={{ cursor: 'pointer' }}>
          Looksy
        </h1>
        <nav>
          {/* <button onClick={() => setCurrentView('landing')}>Home</button> REMOVED */}
          <button onClick={() => setCurrentView('upload')}>Try Looksy</button>
          <button onClick={() => setCurrentView('faq')}>FAQ</button>
          <button onClick={() => setCurrentView('waitlist')}>Join Waitlist</button>
        </nav>
      </header>

      <main className="App-main">
        {currentView === 'landing' && (
          <div className="landing-content">
            {/* ... existing landing content from previous App.js ... */}
            <h2>Discover Your Digital Doppelgänger!</h2>
            <p>Ever wondered who out there shares your looks? Looksy connects you with people from our user community based on facial similarity. Upload your photo, get matched, and optionally connect!</p>
            {/* Placeholder for image changes - see point 2 below */}
            <div className="landing-image-container"> {/* Added a container for images */}
                <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1" alt="Person's face" className="landing-image" />
                {/* Placeholder for doppelganger image - needs styling */}
                <img src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=1" alt="Similar looking person" className="landing-image doppelganger-image" />
            </div>
            <div className="cta-buttons">
               {/* Add (Demo) to this button - see point 3 below */}
               <button onClick={() => setCurrentView('upload')} className="button-primary large">
                 Find My Lookalike Now <span className="demo-text">(Demo)</span>
               </button>
               <button onClick={() => setCurrentView('waitlist')} className="button-secondary large">Join the Waitlist</button>
            </div>
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
        {currentView === 'faq' && <FAQAccordion items={faqData} />}
      </main>

      <footer className="App-footer">
        <p>© {new Date().getFullYear()} Looksy. Your Face, Your Control.</p>
      </footer>
    </div>
  );
}

export default App;