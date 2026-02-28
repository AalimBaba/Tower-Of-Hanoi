import React from 'react';
import img1 from '../images/img1.jpg';
import './BeachBackground.css';

const BeachBackground = () => {
  return (
    <div className="beach-background">
      <img src={img1} alt="Background" style={{display: 'none'}} />
      {/* Background image is set via CSS */}
    </div>
  );
};

export default BeachBackground;
