import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';

const Vehicules = () => {
    const [vehicules, setVehicules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        immatriculation: '',
        marque: '',
        modele: '',
        annee: new Date().getFullYear(),
        statut: 'DISPONIBLE'
    });
    const [formError, setFormError] = useState('');

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

    useEffect(() => {
        fetchVehicules();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            await api.post('/vehicules/', {
                ...formData,
                type_vehicule: 'VOITURE',
                motorisation: 'ESSENCE',
                date_achat: `${formData.annee}-01-01`,
                prix_achat: '0.00',
                vin: 'VIN-' + Date.now(),
                expiration_assurance: '2030-01-01',
                expiration_controle_technique: '2030-01-01'
            });
            setIsModalOpen(false);
            setFormData({ immatriculation: '', marque: '', modele: '', annee: new Date().getFullYear(), statut: 'DISPONIBLE' });
            fetchVehicules(); // Rafraîchit la liste
        } catch (error) {
            setFormError(error.response?.data?.detail || JSON.stringify(error.response?.data) || "Erreur lors de l'ajout du véhicule.");
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>VÉHICULES.</h1>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="NOUVEAU VÉHICULE">
                {formError && <div style={{ color: 'var(--danger)', marginBottom: '15px', fontWeight: 500 }}>{formError}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input type="text" name="immatriculation" placeholder="Immatriculation (ex: AB-123-CD)" value={formData.immatriculation} onChange={handleChange} className="input-field" required />
                    <input type="text" name="marque" placeholder="Marque (ex: Renault)" value={formData.marque} onChange={handleChange} className="input-field" required />
                    <input type="text" name="modele" placeholder="Modèle (ex: Clio)" value={formData.modele} onChange={handleChange} className="input-field" required />
                    <input type="number" name="annee" placeholder="Année" value={formData.annee} onChange={handleChange} className="input-field" required min="1990" max="2100" />
                    
                    <select name="statut" value={formData.statut} onChange={handleChange} className="input-field" required style={{ backgroundColor: '#fff', cursor: 'pointer' }}>
                        <option value="DISPONIBLE">DISPONIBLE</option>
                        <option value="EN_MAINTENANCE">EN MAINTENANCE</option>
                        <option value="EN_MISSION">EN MISSION</option>
                        <option value="HORS_SERVICE">HORS SERVICE</option>
                    </select>
                    
                    <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>ENREGISTRER</button>
                </form>
            </Modal>
        </div>
    );
};

export default Vehicules;
