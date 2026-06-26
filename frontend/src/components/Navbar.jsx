import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Power } from 'lucide-react';

const Navbar = () => {
    const { logout } = useContext(AuthContext);

    return (
        <header style={{ height: '100px', backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}>VUE D'ENSEMBLE</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                <span style={{ fontWeight: 600, fontSize: '15px' }}>ADMINISTRATEUR</span>
                <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '999px', backgroundColor: 'var(--bg-panel)', color: 'var(--text-main)', fontWeight: 500, transition: 'var(--transition-fast)' }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#E5E5E5'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-panel)'; }}
                >
                    <Power size={18} strokeWidth={1.5} /> DÉCONNEXION
                </button>
            </div>
        </header>
    );
};

export default Navbar;
