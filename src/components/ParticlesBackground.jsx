import React, { useEffect, useRef } from 'react';

const ParticlesBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouse = { x: null, y: null, radius: 150 };
    let isMagnetic = false;

    const handleMouseMove = (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init(); 
    };

    const handleProfileEnter = () => { isMagnetic = true; };
    const handleProfileLeave = () => { isMagnetic = false; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('resize', handleResize);

    // Dynamic profile detection
    const profileEl = document.getElementById('profile-wrapper');
    if (profileEl) {
      profileEl.addEventListener('mouseenter', handleProfileEnter);
      profileEl.addEventListener('mouseleave', handleProfileLeave);
    }

    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.baseSize = size;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Dynamic Masking Logic
        let profileX = window.innerWidth - 300;
        let profileY = 200;
        if (profileEl) {
          const rect = profileEl.getBoundingClientRect();
          profileX = rect.left + rect.width / 2;
          profileY = rect.top + rect.height / 2;
        }

        const dxP = this.x - profileX;
        const dyP = this.y - profileY;
        const distToProfile = Math.sqrt(dxP * dxP + dyP * dyP);
        
        if (distToProfile < 160) {
            this.size = 0; 
        } else {
            this.size = this.baseSize;
        }

        // Smart Pulse Logic
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            this.size = this.baseSize * 2.5;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
          } else {
            ctx.shadowBlur = 0;
          }
        }

        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      particlesArray = [];
      let numberOfParticles = (canvas.height * canvas.width) / 14000; 
      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1.5) + 0.5; 
        let x = Math.random() * (canvas.width - size * 2) + size * 2;
        let y = Math.random() * (canvas.height - size * 2) + size * 2;
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;
        let color = '#00d4ff';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
          
          let connectionDistance = (canvas.width / 8) * (canvas.height / 8);
          
          if (distance < connectionDistance) {
            opacityValue = 1 - (distance / 12000);
            
            if (isMagnetic && mouse.x != null && mouse.y != null) {
              let distToMouse = Math.sqrt(Math.pow(particlesArray[a].x - mouse.x, 2) + Math.pow(particlesArray[a].y - mouse.y, 2));
              if (distToMouse < mouse.radius * 2.5) {
                opacityValue = opacityValue * 2.5; 
              }
            } else {
              opacityValue = opacityValue * 0.4; 
            }

            ctx.strokeStyle = `rgba(0, 212, 255, ${opacityValue})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    }

    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('resize', handleResize);
      if (profileEl) {
        profileEl.removeEventListener('mouseenter', handleProfileEnter);
        profileEl.removeEventListener('mouseleave', handleProfileLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles-canvas"></canvas>;
};

export default ParticlesBackground;