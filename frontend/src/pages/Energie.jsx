import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';

const Energie = () => {
    const [consommations, setConsommations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConsommations = async () => {
            try {
                const res = await api.get('/consommations/');
                setConsommations(res.data);
            } catch (error) {
                console.error("Erreur consommations", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConsommations();
    }, []);

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>ÉNERGIE.</h1>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} strokeWidth={2} /> AJOUTER RELEVÉ
                </button>
            </div>

            <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--text-main)' }}>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>VÉHICULE ID</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>TYPE</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>QUANTITÉ</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>COÛT</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>DATE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', fontWeight: 600 }}>CHARGEMENT...</td></tr>
                        ) : consommations.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>AUCUN RELEVÉ ÉNERGÉTIQUE</td></tr>
                        ) : (
                            consommations.map(c => (
                                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '20px', fontWeight: 600 }}>{c.vehicule}</td>
                                    <td style={{ padding: '20px' }}>{c.type_energie}</td>
                                    <td style={{ padding: '20px' }}>{c.quantite}</td>
                                    <td style={{ padding: '20px', fontWeight: 600 }}>{c.cout_total} €</td>
                                    <td style={{ padding: '20px', color: 'var(--text-muted)' }}>{new Date(c.date_releve).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Energie;
