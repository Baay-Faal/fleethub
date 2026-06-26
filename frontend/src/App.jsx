import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicules from './pages/Vehicules';
import Affectations from './pages/Affectations';
import Energie from './pages/Energie';
import Entretiens from './pages/Entretiens';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="vehicules" element={<Vehicules />} />
            <Route path="affectations" element={<Affectations />} />
            <Route path="energie" element={<Energie />} />
            <Route path="entretiens" element={<Entretiens />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
