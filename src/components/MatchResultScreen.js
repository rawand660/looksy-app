// src/components/MatchResultScreen.js
import React, { useState, useEffect } from 'react';
import './MatchResultScreen.css';

// Sample "database" of potential matches
const fakeMatchesDb = [
  { id: '1', name: "Alex P.", photo: "https://i.pravatar.cc/300?img=1", insta: "alex_p_looks" },
  { id: '2', name: "Jordan B.", photo: "https://i.pravatar.cc/300?img=2", insta: null },
  { id: '3', name: "Casey L.", photo: "https://i.pravatar.cc/300?img=3", insta: "casey_looks_fab" },
  { id: '4', name: "Morgan R.", photo: "https://i.pravatar.cc/300?img=4", insta: "morgan_r_official" },
  { id: '5', name: "Riley S.", photo: "https://i.pravatar.cc/300?img=5", insta: null },
  { id: '6', name: "Devon K.", photo: "https://i.pravatar.cc/300?img=7", insta: "devon_k_style" },
  { id: '7', name: "Sam W.", photo: "https://i.pravatar.cc/300?img=8", insta: null }
];

function getSimulatedMatch() {
  const randomMatchData = fakeMatchesDb[Math.floor(Math.random() * fakeMatchesDb.length)];
  return {
    ...randomMatchData,
    similarity: Math.floor(Math.random() * (95 - 70 + 1)) + 70 // Score between 70-95%
  };
}

function MatchResultScreen({ userUploadedImage, onFindAnother, onStartOver }) {
  const [match, setMatch] = useState(null);
  const [showInstagram, setShowInstagram] = useState(false);
  const [userOptInInstagram, setUserOptInInstagram] = useState(false);
  const [userInstagramHandle, setUserInstagramHandle] = useState('');

  useEffect(() => {
    const fetchedMatch = getSimulatedMatch();
    setMatch(fetchedMatch);
    setShowInstagram(false); // Reset for new match
  }, [userUploadedImage]); // Re-fetch if a new image is "processed"

  const handleFindAnother = () => {
    const newMatch = getSimulatedMatch();
    setMatch(newMatch);
    setShowInstagram(false);
    if(onFindAnother) onFindAnother();
  }

  const handleShowInstagramToggle = (e) => {
    setShowInstagram(e.target.checked);
  };

  const handleUserOptInInstagram = (e) => {
    setUserOptInInstagram(e.target.checked);
    // In a real app, save this to backend
    console.log("User Instagram opt-in:", e.target.checked, "Handle:", userInstagramHandle);
  };

  if (!match) {
    return <div className="loading-results">Finding your match...</div>;
  }

  return (
    <div className="match-result-screen">
      <h2>We Found a Match!</h2>
      <div className="match-container">
        <div className="user-photo-container">
          <img src={userUploadedImage || "https://i.pravatar.cc/150?u=yourself"} alt="You" className="profile-photo" />
          <p>You</p>
        </div>
        <div className="similarity-score">
          <p>{match.similarity}%</p>
          <span>Similar</span>
        </div>
        <div className="match-photo-container">
          <img src={match.photo} alt={match.name} className="profile-photo" />
          <p>{match.name}</p>
        </div>
      </div>

      {match.insta && (
        <div className="instagram-opt-in">
          <label>
            <input
              type="checkbox"
              checked={showInstagram}
              onChange={handleShowInstagramToggle}
            />
            Show {match.name}'s Instagram (if they've shared it)?
          </label>
        </div>
      )}

      {showInstagram && match.insta && (
        <div className="instagram-handle">
          <p>Connect with {match.name} on Instagram:
            <a href={`https://instagram.com/${match.insta}`} target="_blank" rel="noopener noreferrer">
              @{match.insta}
            </a>
          </p>
        </div>
      )}

      <div className="user-instagram-share">
        <label>
          <input
            type="checkbox"
            checked={userOptInInstagram}
            onChange={handleUserOptInInstagram}
          />
          Share my Instagram handle if I match with others?
        </label>
        {userOptInInstagram && (
            <input
                type="text"
                placeholder="Your Instagram Handle (e.g., your_name)"
                className="insta-input"
                value={userInstagramHandle}
                onChange={(e) => setUserInstagramHandle(e.target.value)}
                onBlur={handleUserOptInInstagram} // Save on blur or on a separate button
            />
        )}
      </div>

      <div className="result-actions">
        <button onClick={handleFindAnother} className="button-secondary">Find Another Match</button>
        <button onClick={() => { if(onStartOver) onStartOver(); }} className="button-primary">Upload New Photo</button>
      </div>
    </div>
  );
}

export default MatchResultScreen;