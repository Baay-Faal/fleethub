import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';

const DashboardPlaceholder = () => (
    <div className="panel animate-fade-in" style={{ maxWidth: '800px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>RÉSUMÉ DE LA FLOTTE</h2>
        <p style={{ color: 'var(--text-muted)' }}>Statistiques clés et alertes imminentes apparaîtront ici.</p>
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
            <Route path="vehicules" element={<div className="panel"><h2>VÉHICULES</h2></div>} />
            <Route path="affectations" element={<div className="panel"><h2>AFFECTATIONS</h2></div>} />
            <Route path="energie" element={<div className="panel"><h2>ÉNERGIE</h2></div>} />
            <Route path="entretiens" element={<div className="panel"><h2>ENTRETIENS</h2></div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
