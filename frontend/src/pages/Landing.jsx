import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Compass, Users, Activity, Settings } from 'lucide-react';
import './Landing.css';

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: delay }}
      whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
      className="feature-card"
    >
      <div className="feature-icon">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="logo">FLEETHUB.</div>
        <button className="btn-login-outline" onClick={() => navigate('/login')}>
          SE CONNECTER
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-background"
          style={{ 
            y: y1,
            opacity: opacity,
            rotateX: mousePosition.y * -0.5,
            rotateY: mousePosition.x * 0.5,
          }}
        />
        <div className="hero-overlay" />
        
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            LA FLOTTE.<br />REPENSER.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Contrôle absolu. Maintenance prédictive. Design minimaliste. <br />
            Pilotez vos véhicules avec la précision que vous méritez.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="hero-buttons"
          >
            <button className="btn-primary-large" onClick={() => navigate('/dashboard')}>
              ACCÉDER AU PORTAIL
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.div 
          className="features-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>L'EXCELLENCE OPÉRATIONNELLE.</h2>
          <p>Une architecture conçue pour la performance brute.</p>
        </motion.div>

        <div className="features-grid">
          <FeatureCard 
            icon={Activity} 
            title="SUIVI EN TEMPS RÉEL" 
            description="Vue d'ensemble instantanée sur l'état de la flotte. Chaque véhicule, chaque affectation."
            delay={0.1}
          />
          <FeatureCard 
            icon={Shield} 
            title="MAINTENANCE PRÉDICTIVE" 
            description="Anticipez les pannes. Alertes automatiques de révision au seuil des 15 000 km."
            delay={0.2}
          />
          <FeatureCard 
            icon={Zap} 
            title="PERFORMANCE ÉNERGÉTIQUE" 
            description="Suivi du carburant et de l'énergie électrique. Optimisez vos coûts par kilomètre."
            delay={0.3}
          />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="cta-section">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="cta-box"
        >
          <h2>PRÊT À PRENDRE LE CONTRÔLE ?</h2>
          <button className="btn-primary-large" onClick={() => navigate('/login')}>
            DÉMARRER MAINTENANT
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
