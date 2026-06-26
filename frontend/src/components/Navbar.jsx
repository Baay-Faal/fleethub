import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Power, Bell } from 'lucide-react';
import api from '../api/axios';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications/non_lues/');
            setNotifications(res.data);
        } catch (error) {
            console.error("Erreur notifications", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000); // Polling toutes les 30s
            return () => clearInterval(interval);
        }
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await api.post(`/notifications/${id}/marquer_lu/`);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la notification", error);
        }
    };

    return (
        <header style={{ height: '100px', backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}>VUE D'ENSEMBLE</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                
                <div style={{ position: 'relative' }}>
                    <button onClick={() => setIsNotifOpen(!isNotifOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bell size={22} strokeWidth={1.5} color="var(--text-main)" />
                        {notifications.length > 0 && (
                            <span style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: 'var(--danger)', color: 'white', fontSize: '10px', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {notifications.length}
                            </span>
                        )}
                    </button>
                    
                    {isNotifOpen && (
                        <div style={{ position: 'absolute', top: '40px', right: '-50px', width: '320px', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '8px', zIndex: 1000, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                            <div style={{ padding: '15px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>NOTIFICATIONS</div>
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {notifications.length === 0 ? (
                                    <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>Aucune nouvelle notification</div>
                                ) : (
                                    notifications.map(n => (
                                        <div key={n.id} style={{ padding: '15px', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ fontSize: '13px', lineHeight: '1.5' }}>{n.message}</div>
                                            <button onClick={() => markAsRead(n.id)} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', padding: 0 }}>
                                                Marquer comme lu
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <span style={{ fontWeight: 600, fontSize: '15px' }}>{user?.role || 'UTILISATEUR'}</span>
                
                <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '999px', backgroundColor: 'var(--bg-panel)', color: 'var(--text-main)', fontWeight: 500, transition: 'var(--transition-fast)', cursor: 'pointer', border: '1px solid var(--border-color)' }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#E5E5E5'; e.currentTarget.style.color = '#000'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-panel)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                >
                    <Power size={18} strokeWidth={1.5} /> DÉCONNEXION
                </button>
            </div>
        </header>
    );
};

export default Navbar;
