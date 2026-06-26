import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, CalendarCheck, Zap, Wrench } from 'lucide-react';
import logo from '../assets/logo.png';

const Sidebar = () => {
    const navItems = [
        { path: '/', name: 'Tableau de bord', icon: <LayoutDashboard size={20} /> },
        { path: '/vehicules', name: 'Véhicules', icon: <Car size={20} /> },
        { path: '/affectations', name: 'Affectations', icon: <CalendarCheck size={20} /> },
        { path: '/energie', name: 'Énergie', icon: <Zap size={20} /> },
        { path: '/entretiens', name: 'Entretiens', icon: <Wrench size={20} /> },
    ];

    return (
        <aside style={{ width: '260px', backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70px' }}>
                <img src={logo} alt="FleetHub" style={{ height: '35px', filter: 'brightness(0) invert(1)' }} />
            </div>
            <nav style={{ flex: 1, padding: '20px 0' }}>
                {navItems.map(item => (
                    <NavLink 
                        key={item.path} 
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 24px',
                            color: isActive ? 'var(--primary-color)' : 'var(--text-muted)',
                            backgroundColor: isActive ? 'rgba(0, 102, 255, 0.1)' : 'transparent',
                            borderRight: isActive ? '3px solid var(--primary-color)' : '3px solid transparent',
                            textDecoration: 'none', transition: 'var(--transition-fast)'
                        })}
                    >
                        {item.icon}
                        <span style={{ fontWeight: 500 }}>{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
