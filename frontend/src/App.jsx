import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicules from './pages/Vehicules';
import VehiculeDetail from './pages/VehiculeDetail';
import Affectations from './pages/Affectations';
import Energie from './pages/Energie';
import Entretiens from './pages/Entretiens';
import Equipe from './pages/Equipe';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/vehicules" element={<Vehicules />} />
                        <Route path="/vehicules/:id" element={<VehiculeDetail />} />
                        <Route path="/affectations" element={<Affectations />} />
                        <Route path="/energie" element={<Energie />} />
                        <Route path="/entretiens" element={<Entretiens />} />
                        <Route path="/equipe" element={<Equipe />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
