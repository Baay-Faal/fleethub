import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { ArrowUpRight, CarFront, Users } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({ vehicules: 0, disponibles: 0, affectations: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Pour aller vite on recupère tout, mais dans un vrai projet on ferait un endpoint de stats
                const [vehiculesRes, affectationsRes] = await Promise.all([
                    api.get('/vehicules/'),
                    api.get('/affectations/')
                ]);
                
                const vehicules = vehiculesRes.data.length || 0;
                const dispos = vehiculesRes.data.filter(v => v.statut === 'DISPONIBLE').length || 0;
                const affectations = affectationsRes.data.length || 0;

                setStats({ vehicules, disponibles: dispos, affectations });
            } catch (error) {
                console.error("Erreur chargement stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '40px' }}>RÉSUMÉ DE LA FLOTTE.</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>TOTAL VÉHICULES</span>
                        <CarFront size={20} strokeWidth={1.5} />
                    </div>
                    <div style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{stats.vehicules}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <ArrowUpRight size={16} /> Enregistrés dans la base
                    </div>
                </div>

                <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#111111', color: '#FFFFFF', borderColor: '#111111' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A0A0A0' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>VÉHICULES DISPONIBLES</span>
                        <CarFront size={20} strokeWidth={1.5} />
                    </div>
                    <div style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{stats.disponibles}</div>
                    <div style={{ color: '#A0A0A0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        Prêts pour une nouvelle affectation
                    </div>
                </div>

                <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>AFFECTATIONS ACTIVES</span>
                        <Users size={20} strokeWidth={1.5} />
                    </div>
                    <div style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{stats.affectations}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        Missions en cours
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
