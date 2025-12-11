import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AnimatedLogo: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Link to="/" className="animated-logo-container" style={{color: '#ffffff'}}>
      <div className={`logo-wrapper ${isScrolled ? 'scrolled' : ''}`} style={{color: '#ffffff'}}>
        <span className="logo-e" style={{color: '#3b82f6'}}>E</span>
        <span className={`logo-volution ${isScrolled ? 'hidden' : ''}`}>volution</span>
        <span className="logo-space"> </span>
        <span className="logo-g" style={{color: '#3b82f6'}}>G</span>
        <span className={`logo-adget ${isScrolled ? 'hidden' : ''}`}>adget</span>
      </div>
    </Link>
  );
};

export default AnimatedLogo;
