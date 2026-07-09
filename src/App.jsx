import React from 'react';
import './App.css';
import ParticlesBackground from './components/ParticlesBackground';
import Hero from './components/Hero';
import ExperienceCard from './components/ExperienceCard';
import ScrollToTop from './components/ScrollToTop';
import { experiences } from './data/cvData';

function App() {
  return (
    <div className="portfolio-app">
      <ParticlesBackground />

      <div className="app-wrapper fade-in hero-anim">
        <main className="container">
          <Hero />

          <section className="section-block">
            <div className="grid">
              {experiences.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} />
              ))}
            </div>
          </section>
        </main>
      </div>
      
      {/* زر العودة للأعلى */}
      <ScrollToTop />
    </div>
  );
}

export default App;