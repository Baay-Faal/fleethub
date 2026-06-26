import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={
            <div className="glass-panel animate-fade-in" style={{ padding: '40px', margin: '40px auto', maxWidth: '600px', textAlign: 'center' }}>
              <h1>Bienvenue sur FleetHub</h1>
              <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
                L'application Frontend est connectée et prête !
              </p>
              <button className="btn-primary" style={{ marginTop: '20px' }}>
                Accéder au Dashboard
              </button>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
