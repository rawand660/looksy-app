// src/components/FAQAccordion.js
import React, { useState } from 'react';
import './FAQAccordion.css';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={onClick}>
        {question}
        <span className={`faq-icon ${isOpen ? 'open' : ''}`}>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="faq-answer">{answer}</div>}
    </div>
  );
};

function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null); // Only one item open at a time

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Toggle or close others
  };

  return (
    <div className="faq-accordion">
      <h2>Frequently Asked Questions</h2>
      {items.map((item, index) => (
        <FAQItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
}

export default FAQAccordion;
