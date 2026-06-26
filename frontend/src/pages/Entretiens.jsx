import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';

const Entretiens = () => {
    const [entretiens, setEntretiens] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntretiens = async () => {
            try {
                const res = await api.get('/entretiens/');
                setEntretiens(res.data);
            } catch (error) {
                console.error("Erreur entretiens", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEntretiens();
    }, []);

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>ENTRETIENS.</h1>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} strokeWidth={2} /> PLANIFIER
                </button>
            </div>

            <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--text-main)' }}>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>VÉHICULE ID</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>TYPE</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>DATE PRÉVUE</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>STATUT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', fontWeight: 600 }}>CHARGEMENT...</td></tr>
                        ) : entretiens.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>AUCUN ENTRETIEN PROGRAMMÉ</td></tr>
                        ) : (
                            entretiens.map(e => (
                                <tr key={e.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '20px', fontWeight: 600 }}>{e.vehicule}</td>
                                    <td style={{ padding: '20px' }}>{e.type_entretien}</td>
                                    <td style={{ padding: '20px', color: 'var(--text-muted)' }}>{new Date(e.date_prevue).toLocaleDateString()}</td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{ 
                                            padding: '6px 12px', 
                                            borderRadius: '999px', 
                                            fontSize: '12px', 
                                            fontWeight: 600,
                                            backgroundColor: e.statut === 'TERMINE' ? '#E8F5E9' : '#FFF3E0',
                                            color: e.statut === 'TERMINE' ? '#2E7D32' : '#EF6C00'
                                        }}>
                                            {e.statut}
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

export default Entretiens;
