import React from 'react';

const ExperienceCard = ({ exp }) => {
  return (
    <div className={`glass-panel card fade-in ${exp.delayClass}`}>
      <div className="card-content">
        <div className="card-header-sleek">
          <span className={`status-indicator ${exp.isActive ? 'active' : 'history'}`}>
            {exp.statusText}
          </span>
          <h4>{exp.title}</h4>
        </div>
        <span className="role">{exp.role}</span>
        <p className="card-desc">{exp.description}</p>
        
        {exp.logos && exp.logos.length > 0 && (
          <div className="logo-showcase">
            {exp.logos.map((logo, index) => (
              <a key={index} href={logo.url} target="_blank" rel="noopener noreferrer">
                <div className="logo-box">
                  <img src={logo.src} alt={logo.alt} className="company-logo" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="tags">
        {exp.tags.map((tag, index) => (
          <span key={index} className="glass-tag">{tag}</span>
        ))}
      </div>
    </div>
  );
};

export default ExperienceCard;