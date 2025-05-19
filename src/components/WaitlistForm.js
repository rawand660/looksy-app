// src/components/WaitlistForm.js
import React, { useState } from 'react';
import './WaitlistForm.css';

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); // '', 'submitting', 'success', 'error'

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('submitting');

    // IMPORTANT: Replace YOUR_FORMSPREE_ENDPOINT with your actual Formspree endpoint ID
    // It will look something like 'https://formspree.io/f/abcdefgh'
    const formspreeEndpoint = 'https://formspree.io/f/xyzwvjyw';

    if (formspreeEndpoint.includes('YOUR_FORMSPREE_ENDPOINT')) {
        alert("Please replace 'YOUR_FORMSPREE_ENDPOINT' in WaitlistForm.js with your actual Formspree form ID.");
        setStatus('error');
        return;
    }

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json' // Important for Formspree to return JSON
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        // const data = await response.json(); // Formspree might send error details
        // if (data.errors) {
        //   console.error("Formspree errors:", data.errors);
        // }
        setStatus('error');
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus('error');
    }
  };

  return (
    <div className="waitlist-form-container">
      <h2>Join the Looksy Waitlist!</h2>
      <p>Be the first to know when we launch and get exclusive early access.</p>
      <form onSubmit={handleSubmit} className="waitlist-form">
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'submitting'}
        />
        <button type="submit" disabled={status === 'submitting'} className="button-primary">
          {status === 'submitting' ? 'Submitting...' : 'Join Waitlist'}
        </button>
      </form>
      {status === 'success' && <p className="form-message success">Thanks for joining! We'll keep you updated.</p>}
      {status === 'error' && <p className="form-message error">Oops! Something went wrong. Please ensure you've set up the Formspree endpoint or try again.</p>}
    </div>
  );
}

export default WaitlistForm;