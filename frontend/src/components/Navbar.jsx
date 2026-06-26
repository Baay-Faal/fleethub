import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { logout } = useContext(AuthContext);

    return (
        <header style={{ height: '70px', backgroundColor: 'var(--bg-panel)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 5 }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 600 }}>Espace de Gestion</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                    <div style={{ backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '50%', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={18} />
                    </div>
                    <span style={{ fontWeight: 500 }}>Administrateur</span>
                </div>
                <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', transition: 'var(--transition-fast)' }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--danger)'; e.currentTarget.style.color = 'white'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--danger)'; }}
                >
                    <LogOut size={16} /> Déconnexion
                </button>
            </div>
        </header>
    );
};

export default Navbar;
