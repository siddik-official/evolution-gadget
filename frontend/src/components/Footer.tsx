import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Evulation Gadget</h3>
          <p>Your trusted source for gadget reviews and evaluations.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/gadgets">Gadgets</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Categories</h4>
          <ul>
            <li><a href="/category/smartphone">Smartphones</a></li>
            <li><a href="/category/laptop">Laptops</a></li>
            <li><a href="/category/tablet">Tablets</a></li>
            <li><a href="/category/accessories">Accessories</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="/help">Help Center</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Evulation Gadget. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
