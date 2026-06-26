import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';

const Entretiens = () => {
    const [entretiens, setEntretiens] = useState([]);
    const [vehicules, setVehicules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        vehicule: '',
        type_entretien: 'REVISION',
        description: '',
        date_prevue: '',
        cout_estime: '',
        statut: 'PLANIFIE'
    });
    const [formError, setFormError] = useState('');

    const fetchData = async () => {
        try {
            const [entRes, vehRes] = await Promise.all([
                api.get('/entretiens/'),
                api.get('/vehicules/')
            ]);
            setEntretiens(entRes.data);
            setVehicules(vehRes.data);
        } catch (error) {
            console.error("Erreur", error);
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
            await api.post('/entretiens/', {
                vehicule: formData.vehicule,
                type_intervention: formData.type_entretien,
                date_prevue: formData.date_prevue,
                cout: formData.cout_estime || 0,
                statut: formData.statut,
                kilometrage: 0
            });
            setIsModalOpen(false);
            setFormData({ vehicule: '', type_entretien: 'REVISION', description: '', date_prevue: '', cout_estime: '', statut: 'PLANIFIE' });
            fetchData();
        } catch (error) {
            setFormError(error.response?.data?.detail || JSON.stringify(error.response?.data) || "Erreur lors de l'ajout.");
        }
    };

    const getVehiculeName = (id) => {
        const v = vehicules.find(v => v.id === id);
        return v ? `${v.marque} ${v.modele} (${v.immatriculation})` : id;
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>ENTRETIENS.</h1>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} strokeWidth={2} /> PLANIFIER
                </button>
            </div>

            <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--text-main)' }}>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>VÉHICULE</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>TYPE</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>DATE PRÉVUE</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>COÛT EST.</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>STATUT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', fontWeight: 600 }}>CHARGEMENT...</td></tr>
                        ) : entretiens.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>AUCUN ENTRETIEN PROGRAMMÉ</td></tr>
                        ) : (
                            entretiens.map(e => (
                                <tr key={e.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '20px', fontWeight: 600 }}>{getVehiculeName(e.vehicule)}</td>
                                    <td style={{ padding: '20px' }}>{e.type_entretien}</td>
                                    <td style={{ padding: '20px', color: 'var(--text-muted)' }}>{new Date(e.date_prevue).toLocaleDateString()}</td>
                                    <td style={{ padding: '20px', fontWeight: 600 }}>{e.cout_estime ? `${e.cout_estime} FCFA` : '-'}</td>
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="NOUVEL ENTRETIEN">
                {formError && <div style={{ color: 'var(--danger)', marginBottom: '15px', fontWeight: 500 }}>{formError}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <select name="vehicule" value={formData.vehicule} onChange={handleChange} className="input-field" required style={{ backgroundColor: '#fff', cursor: 'pointer' }}>
                        <option value="">Sélectionner un véhicule</option>
                        {vehicules.map(v => (
                            <option key={v.id} value={v.id}>{v.marque} {v.modele} ({v.immatriculation})</option>
                        ))}
                    </select>

                    <select name="type_entretien" value={formData.type_entretien} onChange={handleChange} className="input-field" required style={{ backgroundColor: '#fff', cursor: 'pointer' }}>
                        <option value="REVISION">RÉVISION</option>
                        <option value="REPARATION">RÉPARATION</option>
                        <option value="CONTROLE_TECHNIQUE">CONTRÔLE TECHNIQUE</option>
                        <option value="PNEUS">PNEUS</option>
                    </select>

                    <input type="text" name="description" placeholder="Description courte (ex: Changement plaquettes)" value={formData.description} onChange={handleChange} className="input-field" />
                    
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>DATE PRÉVUE</label>
                        <input type="date" name="date_prevue" value={formData.date_prevue} onChange={handleChange} className="input-field" style={{ width: '100%' }} required />
                    </div>

                    <input type="number" step="0.01" name="cout_estime" placeholder="Coût Estimé (FCFA) (Optionnel)" value={formData.cout_estime} onChange={handleChange} className="input-field" min="0" />

                    <select name="statut" value={formData.statut} onChange={handleChange} className="input-field" required style={{ backgroundColor: '#fff', cursor: 'pointer' }}>
                        <option value="PLANIFIE">PLANIFIÉ</option>
                        <option value="EN_COURS">EN COURS</option>
                        <option value="TERMINE">TERMINÉ</option>
                    </select>
                    
                    <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>PLANIFIER</button>
                </form>
            </Modal>
        </div>
    );
};

export default Entretiens;
