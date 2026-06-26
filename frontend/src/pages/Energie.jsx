import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';

const Energie = () => {
    const [consommations, setConsommations] = useState([]);
    const [vehicules, setVehicules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        vehicule: '',
        type_energie: 'CARBURANT',
        quantite: '',
        cout_total: '',
        date_releve: new Date().toISOString().split('T')[0]
    });
    const [formError, setFormError] = useState('');

    const fetchData = async () => {
        try {
            const [consoRes, vehRes] = await Promise.all([
                api.get('/consommations/'),
                api.get('/vehicules/')
            ]);
            setConsommations(consoRes.data);
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
            const payload = {
                vehicule: formData.vehicule,
                chauffeur: 1, // On assigne l'admin par défaut
                date: formData.date_releve + 'T12:00:00Z',
                type_energie: formData.type_energie,
                prix: formData.cout_total,
                kilometrage: 0
            };
            if (formData.type_energie === 'CARBURANT') {
                payload.litres = formData.quantite;
            } else {
                payload.kwh = formData.quantite;
            }
            await api.post('/consommations/', payload);
            setIsModalOpen(false);
            setFormData({ vehicule: '', type_energie: 'CARBURANT', quantite: '', cout_total: '', date_releve: new Date().toISOString().split('T')[0] });
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
                <h1 style={{ fontSize: '3rem', margin: 0 }}>ÉNERGIE.</h1>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} strokeWidth={2} /> AJOUTER RELEVÉ
                </button>
            </div>

            <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--text-main)' }}>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>VÉHICULE</th>
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
                                    <td style={{ padding: '20px', fontWeight: 600 }}>{getVehiculeName(c.vehicule)}</td>
                                    <td style={{ padding: '20px' }}>{c.type_energie}</td>
                                    <td style={{ padding: '20px' }}>{c.quantite} {c.type_energie === 'ELECTRICITE' ? 'kWh' : 'L'}</td>
                                    <td style={{ padding: '20px', fontWeight: 600 }}>{c.cout_total} €</td>
                                    <td style={{ padding: '20px', color: 'var(--text-muted)' }}>{new Date(c.date_releve).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="NOUVEAU RELEVÉ">
                {formError && <div style={{ color: 'var(--danger)', marginBottom: '15px', fontWeight: 500 }}>{formError}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <select name="vehicule" value={formData.vehicule} onChange={handleChange} className="input-field" required style={{ backgroundColor: '#fff', cursor: 'pointer' }}>
                        <option value="">Sélectionner un véhicule</option>
                        {vehicules.map(v => (
                            <option key={v.id} value={v.id}>{v.marque} {v.modele} ({v.immatriculation})</option>
                        ))}
                    </select>

                    <select name="type_energie" value={formData.type_energie} onChange={handleChange} className="input-field" required style={{ backgroundColor: '#fff', cursor: 'pointer' }}>
                        <option value="CARBURANT">CARBURANT (Litres)</option>
                        <option value="RECHARGE">RECHARGE ÉLECTRIQUE (kWh)</option>
                    </select>

                    <input type="number" step="0.01" name="quantite" placeholder="Quantité (L ou kWh)" value={formData.quantite} onChange={handleChange} className="input-field" required min="0.01" />
                    
                    <input type="number" step="0.01" name="cout_total" placeholder="Coût Total (€)" value={formData.cout_total} onChange={handleChange} className="input-field" required min="0.01" />

                    <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>DATE DU RELEVÉ</label>
                        <input type="date" name="date_releve" value={formData.date_releve} onChange={handleChange} className="input-field" style={{ width: '100%' }} required />
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>ENREGISTRER</button>
                </form>
            </Modal>
        </div>
    );
};

export default Energie;
