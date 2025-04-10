import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import './Footer.css';

const Footer = ({
  companyName = 'Your Company',
  year = new Date().getFullYear(),
  links = [],
  socials = [],
  logo,
  showCopyright = true,
  className = '',
}) => {
  return (
    <footer className={`app-footer ${className}`}>
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-brand">
            {logo && (
              <img src={logo} alt={`${companyName} logo`} className="footer-logo" />
            )}
            <span className="footer-company-name">{companyName}</span>
          </div>
          
          {showCopyright && (
            <div className="footer-copyright">
              &copy; {year} {companyName}. All rights reserved.
            </div>
          )}
        </div>
        
        <div className="footer-center">
          {links.length > 0 && (
            <ul className="footer-links">
              {links.map((link, index) => (
                <li key={`link-${index}`} className="footer-link-item">
                  <Link to={link.url} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="footer-right">
          {socials.length > 0 && (
            <ul className="footer-socials">
              {socials.map((social, index) => (
                <li key={`social-${index}`} className="social-item">
                  <a 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-legal">
          <Link to="/privacy-policy" className="legal-link">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="legal-link">
            Terms of Service
          </Link>
          <Link to="/contact-us" className="legal-link">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  companyName: PropTypes.string,
  year: PropTypes.number,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  socials: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
    })
  ),
  logo: PropTypes.string,
  showCopyright: PropTypes.bool,
  className: PropTypes.string,
};

export default Footer;