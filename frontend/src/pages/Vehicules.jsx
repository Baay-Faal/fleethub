import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';

const Vehicules = () => {
    const [vehicules, setVehicules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicules = async () => {
            try {
                const res = await api.get('/vehicules/');
                setVehicules(res.data);
            } catch (error) {
                console.error("Erreur vehicules", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicules();
    }, []);

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>VÉHICULES.</h1>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} strokeWidth={2} /> AJOUTER
                </button>
            </div>

            <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--text-main)' }}>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>IMMATRICULATION</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>MARQUE / MODÈLE</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>ANNÉE</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>STATUT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', fontWeight: 600 }}>CHARGEMENT...</td></tr>
                        ) : vehicules.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>AUCUN VÉHICULE ENREGISTRÉ</td></tr>
                        ) : (
                            vehicules.map(v => (
                                <tr key={v.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '20px', fontWeight: 600 }}>{v.immatriculation}</td>
                                    <td style={{ padding: '20px' }}>{v.marque} {v.modele}</td>
                                    <td style={{ padding: '20px', color: 'var(--text-muted)' }}>{v.annee}</td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{ 
                                            padding: '6px 12px', 
                                            borderRadius: '999px', 
                                            fontSize: '12px', 
                                            fontWeight: 600,
                                            backgroundColor: v.statut === 'DISPONIBLE' ? '#E8F5E9' : (v.statut === 'EN_MAINTENANCE' ? '#FFF3E0' : '#FFEBEE'),
                                            color: v.statut === 'DISPONIBLE' ? '#2E7D32' : (v.statut === 'EN_MAINTENANCE' ? '#EF6C00' : '#C62828')
                                        }}>
                                            {v.statut}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Vehicules;
