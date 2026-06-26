import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';

const DashboardPlaceholder = () => (
    <div className="glass-panel" style={{ padding: '30px' }}>
        <h2 style={{ marginBottom: '15px' }}>Tableau de bord</h2>
        <p style={{ color: 'var(--text-muted)' }}>Bienvenue sur FleetHub. Vos statistiques clés apparaîtront ici très prochainement.</p>
    </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPlaceholder />} />
            <Route path="vehicules" element={<div className="glass-panel" style={{ padding: '30px' }}><h3>Véhicules (En construction)</h3></div>} />
            <Route path="affectations" element={<div className="glass-panel" style={{ padding: '30px' }}><h3>Affectations (En construction)</h3></div>} />
            <Route path="energie" element={<div className="glass-panel" style={{ padding: '30px' }}><h3>Énergie (En construction)</h3></div>} />
            <Route path="entretiens" element={<div className="glass-panel" style={{ padding: '30px' }}><h3>Entretiens (En construction)</h3></div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
