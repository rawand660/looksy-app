// src/components/MatchResultScreen.js
import React, { useState, useEffect } from 'react';
import './MatchResultScreen.css'; // Make sure this CSS file has your latest dark theme styles

function MatchResultScreen({ userUploadedImage, onStartOver, uploadedImageFileObject }) {
  const [allMatches, setAllMatches] = useState([]); // Stores all sorted matches from backend
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0); // Index of the match to display
  const [isLoadingMatch, setIsLoadingMatch] = useState(true);
  const [error, setError] = useState(null);

  // Instagram related state
  const [showInstagram, setShowInstagram] = useState(false);
  const [userOptInInstagram, setUserOptInInstagram] = useState(false);
  const [userInstagramHandle, setUserInstagramHandle] = useState('');

  const BACKEND_URL = 'http://localhost:5001'; // Your Flask backend URL

  const fetchAndSetMatches = async () => {
    console.log("---- fetchAndSetMatches CALLED ----");
    console.log("Current uploadedImageFileObject:", uploadedImageFileObject);
    
    setIsLoadingMatch(true);
    setError(null);
    setAllMatches([]); 
    setCurrentMatchIndex(0);
    setShowInstagram(false);

    if (!uploadedImageFileObject) {
        console.error("No image file object provided to fetchAndSetMatches.");
        setError("No image file to analyze. Please upload again.");
        setIsLoadingMatch(false);
        return;
    }

    const formData = new FormData();
    formData.append('user_image', uploadedImageFileObject, uploadedImageFileObject.name);

    try {
      console.log(`Fetching from backend: ${BACKEND_URL}/analyze-face`);
      const response = await fetch(`${BACKEND_URL}/analyze-face`, {
        method: 'POST',
        body: formData,
      });
      console.log("Backend response status:", response.status, response.statusText);

      const responseBodyText = await response.text(); 
      console.log("Raw backend response body:", responseBodyText);

      if (!response.ok) {
        let errData = { error: `HTTP error! status: ${response.status}, Body: ${responseBodyText}` };
        try { errData = JSON.parse(responseBodyText); } catch (e) { /* use default */ }
        console.error("Parsed JSON error data from backend (if any):", errData);
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }

      const data = JSON.parse(responseBodyText);
      console.log("Data received and parsed from backend:", data);
      
      if (data.matches && data.matches.length > 0) {
        const processedMatches = data.matches.map(match => {
            let fullMatchImageUrl = match.match_image_url;
            if (match.match_image_url && !match.match_image_url.startsWith('http') && !match.match_image_url.startsWith('blob:')) {
                fullMatchImageUrl = `${BACKEND_URL}${match.match_image_url}`;
            }
            return { ...match, photo: fullMatchImageUrl, name: match.match_name, insta: match.match_insta, similarity_score: match.similarity_score, distance: match.distance };
        });
        setAllMatches(processedMatches);
        setCurrentMatchIndex(0); 
      } else {
        console.warn("No matches array or empty matches array received from backend:", data);
        setError("No lookalikes found for your image, or an issue occurred.");
        setAllMatches([]);
      }

    } catch (e) {
      console.error("!!!!!!!!!! CATCH BLOCK HIT IN fetchAndSetMatches !!!!!!!!!!! Full Error Object:", e);
      console.error("Error message:", e.message);
      // alert("ERROR FETCHING MATCHES! Check console. Details: " + e.message); // Optional alert
      setError(e.message || "Failed to get matches. Displaying fallback.");
      setAllMatches([]); 
    } finally {
      setIsLoadingMatch(false);
      console.log("---- fetchAndSetMatches FINISHED ----");
    }
  };

  useEffect(() => {
    console.log("---- MatchResultScreen useEffect triggered ----");
    console.log("useEffect - userUploadedImage (preview):", !!userUploadedImage); // Log presence of preview
    console.log("useEffect - uploadedImageFileObject:", !!uploadedImageFileObject); // Log presence of file object
    
    if (uploadedImageFileObject) { 
        fetchAndSetMatches();
    } else {
        console.warn("MatchResultScreen mounted or updated without uploadedImageFileObject.");
        if (!isLoadingMatch && !error && allMatches.length === 0) { 
            setError("Image data not ready for matching. Please upload an image.");
            setIsLoadingMatch(false); 
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedImageFileObject]);

  const handleFindAnotherMatch = () => {
    setShowInstagram(false); 
    setCurrentMatchIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex < allMatches.length) {
            return nextIndex;
        } else {
            alert("You've seen all top matches for this upload! Looping back to the first.");
            return 0; 
        }
    });
  };

  const currentMatch = allMatches.length > 0 && currentMatchIndex < allMatches.length ? allMatches[currentMatchIndex] : null;

  const handleUserOptInInstagramChange = (e) => { setUserOptInInstagram(e.target.checked); };
  const handleUserInstagramHandleChange = (e) => { setUserInstagramHandle(e.target.value); };
  const saveUserInstagramPreference = () => { console.log("Saving user Instagram preference:", userOptInInstagram, "Handle:", userInstagramHandle);};

  // Debug log before render
  if (isLoadingMatch) {
    console.log("RENDERING MatchResultScreen: isLoadingMatch is true");
  } else if (error && (!currentMatch || allMatches.length === 0)) { // Show error UI if error and no valid current match
    console.log("RENDERING MatchResultScreen: error state is:", error, "No current match or empty allMatches.");
  } else if (currentMatch) {
    console.log("RENDERING MatchResultScreen with currentMatch.photo:", currentMatch.photo, "Full currentMatch:", currentMatch);
  } else {
    console.log("RENDERING MatchResultScreen: Not loading, no error, but no currentMatch. This might be initial state or after error with no matches.");
  }

  if (isLoadingMatch) {
    return ( <div className="match-result-screen loading-active"><div className="loading-results"><div className="spinner"></div>Finding your lookalikes...</div></div>);
  }

  if (error && (!currentMatch || allMatches.length === 0)) {
    return ( <div className="match-result-screen error-active"><div className="error-message"><p>Oops! Something went wrong.</p><p>{error}</p><button onClick={fetchAndSetMatches} className="button-secondary" disabled={!uploadedImageFileObject}>Try Again</button><button onClick={() => { if(onStartOver) onStartOver(); }} className="button-primary">Upload New Photo</button></div></div>);
  }

  if (!isLoadingMatch && allMatches.length === 0 && !error) {
    return (<div className="match-result-screen"><div className="error-message"><p>No lookalikes found for this image. Try a different photo!</p><button onClick={() => { if(onStartOver) onStartOver(); }} className="button-primary">Upload New Photo</button></div></div>);
  }
  
  if (!currentMatch) { 
    return (<div className="match-result-screen"><div className="error-message"><p>Could not display a match. Please try uploading an image again.</p><button onClick={() => { if(onStartOver) onStartOver(); }} className="button-primary">Upload New Photo</button></div></div>);
  }

  return (
    <div className="match-result-screen">
      <h2>We Found a Match! <small>(#{currentMatchIndex + 1} of {allMatches.length})</small></h2>
      <div className="match-container">
        <div className="user-photo-container">
          <img src={userUploadedImage || `https://i.pravatar.cc/150?u=yourself${Date.now()}`} alt="You" className="profile-photo"/>
          <p>You</p>
        </div>
        <div className="similarity-score">
          <p>{currentMatch.similarity_score}%</p>
          <span>Similar</span>
          {currentMatch.distance !== undefined && <small style={{fontSize: '0.7em', opacity:0.7}}>(Dist: {currentMatch.distance})</small>}
        </div>
        <div className="match-photo-container">
          <img src={currentMatch.photo} alt={currentMatch.name || "Match"} className="profile-photo" />
          <p>{currentMatch.name || "Demo AI Face"}</p>
        </div>
      </div>

      {/* CORRECTED AND FULL INSTAGRAM UI SECTION */}
      {currentMatch.insta && (
        <div className="instagram-opt-in">
          <label>
            <input
              type="checkbox"
              checked={showInstagram}
              onChange={(e) => setShowInstagram(e.target.checked)}
            />
            Show {currentMatch.name}'s Instagram (if they've shared it)?
          </label>
        </div>
      )}
      {showInstagram && currentMatch.insta && (
        <div className="instagram-handle">
          <p>Connect with {currentMatch.name} on Instagram:
            <a href={`https://instagram.com/${currentMatch.insta}`} target="_blank" rel="noopener noreferrer">
              @{currentMatch.insta}
            </a>
          </p>
        </div>
      )}
      
      {/* User's own Instagram share UI */}
      <div className="user-instagram-share">
        <label>
          <input type="checkbox" checked={userOptInInstagram} onChange={handleUserOptInInstagramChange} />
          Share my Instagram handle if I match with others?
        </label>
        {userOptInInstagram && (
            <input type="text" placeholder="Your Instagram Handle" className="insta-input" value={userInstagramHandle} onChange={handleUserInstagramHandleChange} onBlur={saveUserInstagramPreference}/>
        )}
      </div>

      <div className="result-actions">
        <button 
            onClick={handleFindAnotherMatch} 
            className="button-secondary" 
            disabled={!uploadedImageFileObject || allMatches.length <= 1 || isLoadingMatch}> 
            Find Another Match 
        </button>
        <button onClick={() => { if(onStartOver) onStartOver(); }} className="button-primary" disabled={isLoadingMatch}>
            Upload New Photo
        </button>
      </div>
    </div>
  );
}

export default MatchResultScreen;