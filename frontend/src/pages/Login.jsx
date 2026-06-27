import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (!res.success) {
            setError(res.error);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            <div style={{ flex: 1, backgroundColor: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10%' }}>
                <img src={logo} alt="FleetHub" style={{ height: '50px', marginBottom: 'auto', alignSelf: 'flex-start', filter: 'grayscale(100%)' }} />
                
                <div className="animate-fade-in" style={{ maxWidth: '450px', width: '100%' }}>
                    <h1 style={{ fontSize: '3.5rem', lineHeight: '1', marginBottom: '40px' }}>VOTRE FLOTTE.<br/>SOUS CONTRÔLE.</h1>
                    {error && <div style={{ color: 'var(--danger)', marginBottom: '20px', fontWeight: 500 }}>{error}</div>}
                    
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <input 
                            type="email" 
                            placeholder="Adresse e-mail" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            required
                        />
                        <input 
                            type="password" 
                            placeholder="Mot de passe" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            required
                        />
                        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                            <span>SE CONNECTER</span>
                            <ArrowRight size={20} strokeWidth={2} />
                        </button>
                    </form>
                </div>
                <div style={{ marginTop: 'auto', color: 'var(--text-muted)', fontSize: '13px' }}>
                    &copy; 2026 FleetHub Inc. Tous droits réservés.
                </div>
            </div>
            
            {/* Background image style Nike pour le côté droit */}
            <div style={{ flex: 1, backgroundColor: '#111111', backgroundImage: 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) contrast(120%)' }}>
            </div>
        </div>
    );
};

export default Login;
