// src/components/UploadScreen.js
import React, { useState, useRef } from 'react';
import './UploadScreen.css';

function UploadScreen({ onImageUpload }) {
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      setImageFile(null);
    }
  };

  const handleUploadClick = () => {
    if (imageFile) {
      console.log("Simulating upload of:", imageFile.name);
      onImageUpload(preview, imageFile);
    } else {
      alert("Please select an image first.");
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="upload-screen">
      <h2>Upload Your Photo</h2>
      <p>Find your lookalikes in our community!</p>

      <div className="upload-area" onClick={openFileDialog}>
        {preview ? (
          <img src={preview} alt="Preview" className="image-preview" />
        ) : (
          <div className="image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
            </svg>
            <p>Click to select or drag & drop</p>
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />

      <button onClick={openFileDialog} className="button-secondary">
        {preview ? 'Change Photo' : 'Select Photo'}
      </button>

      {preview && (
        <button onClick={handleUploadClick} className="button-primary">
          Find My Lookalikes
        </button>
      )}

      <div className="privacy-note">
        <p>Your privacy is important. You control if your image is stored or used for matching.</p>
      </div>
    </div>
  );
}

export default UploadScreen;