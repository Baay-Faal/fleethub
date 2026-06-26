import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Si déjà connecté, on redirige vers l'accueil
    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (!res.success) {
            setError(res.error);
        } else {
            navigate('/');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)' }}>
            <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <img src={logo} alt="FleetHub Logo" style={{ height: '50px', marginBottom: '30px' }} />
                <h2 style={{ marginBottom: '20px' }}>Connexion</h2>
                {error && <div style={{ color: 'var(--danger)', marginBottom: '15px' }}>{error}</div>}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="email" 
                        placeholder="Adresse email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Mot de passe" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                        required
                    />
                    <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <LogIn size={20} /> Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
