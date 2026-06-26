import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CarFront, Calendar, BatteryCharging, Wrench } from 'lucide-react';
import logo from '../assets/logo.png';

const Sidebar = () => {
    const navItems = [
        { path: '/', name: 'TABLEAU DE BORD', icon: <LayoutDashboard strokeWidth={1.5} size={22} /> },
        { path: '/vehicules', name: 'VÉHICULES', icon: <CarFront strokeWidth={1.5} size={22} /> },
        { path: '/affectations', name: 'AFFECTATIONS', icon: <Calendar strokeWidth={1.5} size={22} /> },
        { path: '/energie', name: 'ÉNERGIE', icon: <BatteryCharging strokeWidth={1.5} size={22} /> },
        { path: '/entretiens', name: 'ENTRETIENS', icon: <Wrench strokeWidth={1.5} size={22} /> },
    ];

    return (
        <aside style={{ width: '280px', backgroundColor: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
            <div style={{ padding: '30px 24px', display: 'flex', alignItems: 'center', height: '100px' }}>
                <img src={logo} alt="FleetHub" style={{ height: '40px', filter: 'grayscale(100%) contrast(150%)' }} />
            </div>
            <nav style={{ flex: 1, padding: '10px 12px' }}>
                {navItems.map(item => (
                    <NavLink 
                        key={item.path} 
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 16px',
                            color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                            backgroundColor: isActive ? 'var(--bg-panel)' : 'transparent',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none', transition: 'var(--transition-fast)',
                            fontWeight: isActive ? 600 : 500,
                            fontFamily: 'Inter, sans-serif'
                        })}
                    >
                        {item.icon}
                        <span style={{ fontSize: '14px', letterSpacing: '0.02em' }}>{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
