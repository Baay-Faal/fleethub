import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CarFront, Calendar, BatteryCharging, Wrench, Users, Power } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Sidebar = () => {
    const { user, logout } = React.useContext(AuthContext);

    let menuItems = [];

    if (user?.role === 'CHAUFFEUR') {
        menuItems = [
            { path: '/dashboard', name: 'DASHBOARD', icon: <LayoutDashboard strokeWidth={1.5} size={22} /> },
            { path: '/affectations', name: 'MES MISSIONS', icon: <Calendar strokeWidth={1.5} size={22} /> },
        ];
    } else if (user?.role === 'GESTIONNAIRE') {
        menuItems = [
            { path: '/dashboard', name: 'DASHBOARD', icon: <LayoutDashboard strokeWidth={1.5} size={22} /> },
            { path: '/vehicules', name: 'VÉHICULES', icon: <CarFront strokeWidth={1.5} size={22} /> },
            { path: '/affectations', name: 'AFFECTATIONS', icon: <Calendar strokeWidth={1.5} size={22} /> },
            { path: '/energie', name: 'ÉNERGIE', icon: <BatteryCharging strokeWidth={1.5} size={22} /> },
            { path: '/entretiens', name: 'ENTRETIENS', icon: <Wrench strokeWidth={1.5} size={22} /> },
            { path: '/equipe', name: 'ÉQUIPE', icon: <Users strokeWidth={1.5} size={22} /> },
        ];
    } else {
        // ADMIN
        menuItems = [
            { path: '/dashboard', name: 'DASHBOARD', icon: <LayoutDashboard strokeWidth={1.5} size={22} /> },
            { path: '/vehicules', name: 'VÉHICULES', icon: <CarFront strokeWidth={1.5} size={22} /> },
            { path: '/affectations', name: 'AFFECTATIONS', icon: <Calendar strokeWidth={1.5} size={22} /> },
            { path: '/energie', name: 'ÉNERGIE', icon: <BatteryCharging strokeWidth={1.5} size={22} /> },
            { path: '/entretiens', name: 'ENTRETIENS', icon: <Wrench strokeWidth={1.5} size={22} /> },
            { path: '/equipe', name: 'ÉQUIPE', icon: <Users strokeWidth={1.5} size={22} /> },
        ];
    }

    return (
        <div style={{
            width: '260px',
            height: '100vh',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-color)',
        }}>
            <div style={{ padding: '40px 32px', borderBottom: '1px solid var(--border-color)' }}>
                <img src={logo} alt="FleetHub" style={{ width: '150px' }} />
                {user?.role && (
                    <div style={{ marginTop: '10px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px' }}>
                        ESPACE {user.role}
                    </div>
                )}
            </div>
            
            <nav style={{ flex: 1, padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        {item.icon}
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)' }}>
                <button 
                    onClick={logout}
                    className="nav-item" 
                    style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                    <Power strokeWidth={1.5} size={22} />
                    DÉCONNEXION
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
