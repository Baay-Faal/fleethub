import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';

const Affectations = () => {
    const [affectations, setAffectations] = useState([]);
    const [vehicules, setVehicules] = useState([]);
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        vehicule: '',
        utilisateur: '',
        date_debut: new Date().toISOString().split('T')[0],
        date_fin_prevue: ''
    });
    const [formError, setFormError] = useState('');

    const fetchData = async () => {
        try {
            const [affRes, vehRes, utilRes] = await Promise.all([
                api.get('/affectations/'),
                api.get('/vehicules/'),
                api.get('/utilisateurs/')
            ]);
            setAffectations(affRes.data);
            setVehicules(vehRes.data);
            setUtilisateurs(utilRes.data);
        } catch (error) {
            console.error("Erreur chargement", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            await api.post('/affectations/', {
                vehicule: formData.vehicule,
                chauffeur: formData.utilisateur,
                date_debut: formData.date_debut,
                date_fin: formData.date_fin_prevue || null,
                type_affectation: 'TEMPORAIRE'
            });
            setIsModalOpen(false);
            setFormData({ vehicule: '', utilisateur: '', date_debut: new Date().toISOString().split('T')[0], date_fin_prevue: '' });
            fetchData();
        } catch (error) {
            setFormError(error.response?.data?.detail || JSON.stringify(error.response?.data) || "Erreur lors de l'ajout.");
        }
    };
    
    const getVehiculeName = (id) => {
        const v = vehicules.find(v => v.id === id);
        return v ? `${v.marque} ${v.modele} (${v.immatriculation})` : id;
    };
    const getUtilisateurName = (id) => {
        const u = utilisateurs.find(u => u.id === id);
        return u ? `${u.prenom} ${u.nom}` : id;
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>AFFECTATIONS.</h1>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} strokeWidth={2} /> NOUVELLE MISSION
                </button>
            </div>

            <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--text-main)' }}>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>VÉHICULE</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>CHAUFFEUR</th>
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
                                    <td style={{ padding: '20px', fontWeight: 600 }}>{getVehiculeName(a.vehicule)}</td>
                                    <td style={{ padding: '20px' }}>{getUtilisateurName(a.utilisateur)}</td>
                                    <td style={{ padding: '20px', color: 'var(--text-muted)' }}>{new Date(a.date_debut).toLocaleDateString()}</td>
                                    <td style={{ padding: '20px', color: 'var(--text-muted)' }}>{a.date_fin_prevue ? new Date(a.date_fin_prevue).toLocaleDateString() : '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="NOUVELLE AFFECTATION">
                {formError && <div style={{ color: 'var(--danger)', marginBottom: '15px', fontWeight: 500 }}>{formError}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <select name="vehicule" value={formData.vehicule} onChange={handleChange} className="input-field" required style={{ backgroundColor: '#fff', cursor: 'pointer' }}>
                        <option value="">Sélectionner un véhicule</option>
                        {vehicules.filter(v => v.statut === 'DISPONIBLE').map(v => (
                            <option key={v.id} value={v.id}>{v.marque} {v.modele} ({v.immatriculation})</option>
                        ))}
                    </select>

                    <select name="utilisateur" value={formData.utilisateur} onChange={handleChange} className="input-field" required style={{ backgroundColor: '#fff', cursor: 'pointer' }}>
                        <option value="">Sélectionner un chauffeur</option>
                        {utilisateurs.filter(u => u.role === 'CHAUFFEUR' || u.role === 'ADMIN').map(u => (
                            <option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>
                        ))}
                    </select>

                    <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>DATE DE DÉBUT</label>
                        <input type="date" name="date_debut" value={formData.date_debut} onChange={handleChange} className="input-field" style={{ width: '100%' }} required />
                    </div>

                    <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>DATE DE FIN PRÉVUE (Optionnel)</label>
                        <input type="date" name="date_fin_prevue" value={formData.date_fin_prevue} onChange={handleChange} className="input-field" style={{ width: '100%' }} />
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>ENREGISTRER LA MISSION</button>
                </form>
            </Modal>
        </div>
    );
};

export default Affectations;
