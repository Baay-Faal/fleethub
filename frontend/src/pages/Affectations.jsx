import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';

const Affectations = () => {
    const [affectations, setAffectations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAffectations = async () => {
            try {
                const res = await api.get('/affectations/');
                setAffectations(res.data);
            } catch (error) {
                console.error("Erreur affectations", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAffectations();
    }, []);

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>AFFECTATIONS.</h1>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} strokeWidth={2} /> NOUVELLE MISSION
                </button>
            </div>

            <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--text-main)' }}>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>VÉHICULE ID</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>CHAUFFEUR ID</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>DÉBUT</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>FIN PRÉVUE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', fontWeight: 600 }}>CHARGEMENT...</td></tr>
                        ) : affectations.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>AUCUNE AFFECTATION EN COURS</td></tr>
                        ) : (
                            affectations.map(a => (
                                <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '20px', fontWeight: 600 }}>{a.vehicule}</td>
                                    <td style={{ padding: '20px' }}>{a.utilisateur}</td>
                                    <td style={{ padding: '20px', color: 'var(--text-muted)' }}>{new Date(a.date_debut).toLocaleDateString()}</td>
                                    <td style={{ padding: '20px', color: 'var(--text-muted)' }}>{a.date_fin_prevue ? new Date(a.date_fin_prevue).toLocaleDateString() : '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Affectations;
