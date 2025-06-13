// src/components/MatchResultScreen.js
import React, { useState, useEffect } from 'react';
import './MatchResultScreen.css'; // Ensure this CSS file has the dark theme updates

// Helper function to generate a fake name
const firstNames = ["Alex", "Jordan", "Casey", "Morgan", "Riley", "Devon", "Sam", "Taylor", "Chris", "Jamie"];
const lastInitials = ["P.", "B.", "L.", "R.", "S.", "K.", "W.", "M.", "J.", "T."];

function generateFakeName() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastNameInitial = lastInitials[Math.floor(Math.random() * lastInitials.length)];
  return `${firstName} ${lastNameInitial}`;
}

// Function to fetch an image from ThisPersonDoesNotExist.com
async function fetchAiFace() {
  try {
    // Adding a timestamp or random query param to try and bypass cache
    const response = await fetch(`https://thispersondoesnotexist.com/?${new Date().getTime()}`);
    if (!response.ok) {
      throw new Error('Network response was not ok for AI face');
    }
    const imageBlob = await response.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    return imageObjectURL;
  } catch (error) {
    console.error("Error fetching AI face:", error);
    // Fallback to a placeholder if the fetch fails
    return `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70) + 1}`; // Pravatar as fallback
  }
}


function MatchResultScreen({ userUploadedImage, onStartOver }) { // Removed onFindAnother for now as it's handled internally
  const [match, setMatch] = useState(null); // Will store { name, photo, similarity }
  const [isLoadingMatch, setIsLoadingMatch] = useState(true);
  const [showInstagram, setShowInstagram] = useState(false); // Keep this for UI consistency
  const [userOptInInstagram, setUserOptInInstagram] = useState(false);
  const [userInstagramHandle, setUserInstagramHandle] = useState('');

  const findNewMatch = async () => {
    setIsLoadingMatch(true);
    setMatch(null); // Clear previous match
    setShowInstagram(false); // Reset checkbox

    // Simulate a slight delay for "processing"
    await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay

    const aiMatchPhoto = await fetchAiFace();
    const newMatchData = {
      name: generateFakeName(),
      photo: aiMatchPhoto,
      similarity: Math.floor(Math.random() * (95 - 70 + 1)) + 70, // Score 70-95%
      insta: Math.random() > 0.5 ? `${generateFakeName().toLowerCase().replace(/\s+/g, '_').replace('.', '')}_looks` : null // 50% chance of having an insta
    };
    setMatch(newMatchData);
    setIsLoadingMatch(false);
  };

  useEffect(() => {
    findNewMatch(); // Fetch the first match when component mounts or userUploadedImage changes

    // Cleanup function to revoke the object URL when the component unmounts or the image changes
    return () => {
      if (match && match.photo && match.photo.startsWith('blob:')) {
        URL.revokeObjectURL(match.photo);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userUploadedImage]); // Re-fetch if a new image is "processed" (or on mount)


  const handleUserOptInInstagramChange = (e) => {
    setUserOptInInstagram(e.target.checked);
    console.log("User Instagram opt-in:", e.target.checked, "Handle:", userInstagramHandle);
  };

  const handleUserInstagramHandleChange = (e) => {
    setUserInstagramHandle(e.target.value);
  };

  const saveUserInstagramPreference = () => {
    console.log("Saving user Instagram preference:", userOptInInstagram, "Handle:", userInstagramHandle);
  };


  if (isLoadingMatch || !match) {
    return (
      <div className="match-result-screen loading-active"> {/* Added class for loading state */}
        <div className="loading-results">
          <div className="spinner"></div> {/* Simple CSS spinner */}
          Finding your lookalike...
        </div>
      </div>
    );
  }

  return (
    <div className="match-result-screen">
      <h2>We Found a Match!</h2>
      <div className="match-container">
        <div className="user-photo-container">
          <img
            src={userUploadedImage || `https://i.pravatar.cc/150?u=yourself${Date.now()}`} // Default placeholder
            alt="You"
            className="profile-photo"
          />
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
              onChange={(e) => setShowInstagram(e.target.checked)}
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
            onChange={handleUserOptInInstagramChange}
          />
          Share my Instagram handle if I match with others?
        </label>
        {userOptInInstagram && (
            <input
                type="text"
                placeholder="Your Instagram Handle (e.g., your_name)"
                className="insta-input"
                value={userInstagramHandle}
                onChange={handleUserInstagramHandleChange}
                onBlur={saveUserInstagramPreference}
            />
        )}
      </div>

      <div className="result-actions">
        <button onClick={findNewMatch} className="button-secondary">Find Another Match</button>
        <button onClick={() => { if(onStartOver) onStartOver(); }} className="button-primary">Upload New Photo</button>
      </div>
    </div>
  );
}

export default MatchResultScreen;