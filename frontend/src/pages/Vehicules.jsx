import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Search, Filter, AlertTriangle } from 'lucide-react';
import Modal from '../components/Modal';

const VEHICULES_SENEGAL = [
    { id: 1, marque: 'Toyota', modele: 'Hilux', annee: 2022, motorisation: 'DIESEL', type_vehicule: 'UTILITAIRE' },
    { id: 2, marque: 'Toyota', modele: 'Corolla', annee: 2020, motorisation: 'ESSENCE', type_vehicule: 'VOITURE' },
    { id: 3, marque: 'Toyota', modele: 'RAV4', annee: 2021, motorisation: 'ESSENCE', type_vehicule: 'VOITURE' },
    { id: 4, marque: 'Toyota', modele: 'Land Cruiser Prado', annee: 2023, motorisation: 'DIESEL', type_vehicule: 'VOITURE' },
    { id: 5, marque: 'Mitsubishi', modele: 'L200', annee: 2022, motorisation: 'DIESEL', type_vehicule: 'UTILITAIRE' },
    { id: 6, marque: 'Mitsubishi', modele: 'Pajero', annee: 2019, motorisation: 'DIESEL', type_vehicule: 'VOITURE' },
    { id: 7, marque: 'Ford', modele: 'Ranger', annee: 2022, motorisation: 'DIESEL', type_vehicule: 'UTILITAIRE' },
    { id: 8, marque: 'Hyundai', modele: 'Tucson', annee: 2021, motorisation: 'ESSENCE', type_vehicule: 'VOITURE' },
    { id: 9, marque: 'Hyundai', modele: 'Santa Fe', annee: 2020, motorisation: 'DIESEL', type_vehicule: 'VOITURE' },
    { id: 10, marque: 'Kia', modele: 'Sportage', annee: 2022, motorisation: 'ESSENCE', type_vehicule: 'VOITURE' },
    { id: 11, marque: 'Peugeot', modele: '3008', annee: 2021, motorisation: 'DIESEL', type_vehicule: 'VOITURE' },
    { id: 12, marque: 'Renault', modele: 'Duster', annee: 2022, motorisation: 'ESSENCE', type_vehicule: 'VOITURE' },
    { id: 13, marque: 'Tesla', modele: 'Model 3', annee: 2023, motorisation: 'ELECTRIQUE', type_vehicule: 'VOITURE' },
    { id: 14, marque: 'Hyundai', modele: 'Kona Electric', annee: 2022, motorisation: 'ELECTRIQUE', type_vehicule: 'VOITURE' },
    { id: 15, marque: 'Nissan', modele: 'Leaf', annee: 2021, motorisation: 'ELECTRIQUE', type_vehicule: 'VOITURE' },
    { id: 16, marque: 'BYD', modele: 'Atto 3', annee: 2023, motorisation: 'ELECTRIQUE', type_vehicule: 'VOITURE' },
];

const Vehicules = () => {
    const [vehicules, setVehicules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [formData, setFormData] = useState({
        immatriculation: '',
        marque: '',
        modele: '',
        annee: new Date().getFullYear(),
        type_vehicule: 'VOITURE',
        motorisation: 'ESSENCE',
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
                date_achat: `${formData.annee}-01-01`,
                prix_achat: '0.00',
                vin: 'VIN-' + Date.now(),
                expiration_assurance: '2030-01-01',
                expiration_controle_technique: '2030-01-01'
            });
            setIsModalOpen(false);
            setFormData({ immatriculation: '', marque: '', modele: '', annee: new Date().getFullYear(), type_vehicule: 'VOITURE', motorisation: 'ESSENCE', statut: 'DISPONIBLE' });
            fetchVehicules();
        } catch (error) {
            setFormError(error.response?.data?.detail || JSON.stringify(error.response?.data) || "Erreur lors de l'ajout du véhicule.");
        }
    };

    const exportCSV = () => {
        const header = "IMMATRICULATION,MARQUE,MODELE,ANNEE,MOTEUR,STATUT,KILOMETRAGE\n";
        const rows = vehicules.map(v => `${v.immatriculation},${v.marque},${v.modele},${v.annee},${v.motorisation},${v.statut},${v.kilometrage}`).join("\n");
        const csvContent = "data:text/csv;charset=utf-8," + header + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "vehicules_fleethub.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredVehicules = vehicules.filter(v => {
        const matchesSearch = (v.immatriculation + v.marque + v.modele).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? v.statut === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    const isMaintenanceDue = (v) => {
        if (v.motorisation === 'ELECTRIQUE') return false;
        return (v.kilometrage - (v.kilometrage_dernier_entretien || 0)) >= 15000;
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>VÉHICULES.</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-secondary" onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', color: '#fff', border: '1px solid #333' }}>
                        <span style={{ fontSize: '18px' }}>↓</span> EXPORTER CSV
                    </button>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} strokeWidth={2} /> AJOUTER
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                        type="text" 
                        placeholder="Rechercher par immatriculation, marque, modèle..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '40px', width: '100%' }}
                    />
                </div>
                <div style={{ position: 'relative', width: '250px' }}>
                    <Filter size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '40px', width: '100%', cursor: 'pointer' }}
                    >
                        <option value="">Tous les statuts</option>
                        <option value="DISPONIBLE">Disponible</option>
                        <option value="EN_UTILISATION">En utilisation</option>
                        <option value="EN_MAINTENANCE">En maintenance</option>
                        <option value="HORS_SERVICE">Hors service</option>
                    </select>
                </div>
            </div>

            <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--text-main)' }}>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>IMMATRICULATION</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>MARQUE / MODÈLE</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>MOTEUR</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>ANNÉE</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>STATUT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', fontWeight: 600 }}>CHARGEMENT...</td></tr>
                        ) : filteredVehicules.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>AUCUN VÉHICULE TROUVÉ</td></tr>
                        ) : (
                            filteredVehicules.map(v => (
                                <tr key={v.id} onClick={() => window.location.href = `/vehicules/${v.id}`} style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-panel)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td style={{ padding: '20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {v.immatriculation}
                                        {isMaintenanceDue(v) && (
                                            <div title="Entretien recommandé (> 15 000 km)" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center' }}>
                                                <AlertTriangle size={18} strokeWidth={2.5} />
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        {v.marque} {v.modele}
                                        <span style={{fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px'}}>{v.type_vehicule}</span>
                                    </td>
                                    <td style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>{v.motorisation}</td>
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
                    <div style={{ padding: '10px', backgroundColor: 'var(--bg-panel)', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '10px' }}>
                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '5px' }}>⚡ SÉLECTION RAPIDE SÉNÉGAL</label>
                        <select 
                            onChange={(e) => {
                                if (!e.target.value) return;
                                const v = VEHICULES_SENEGAL.find(veh => veh.id === parseInt(e.target.value));
                                if (v) {
                                    setFormData(prev => ({ ...prev, marque: v.marque, modele: v.modele, annee: v.annee, motorisation: v.motorisation, type_vehicule: v.type_vehicule }));
                                }
                            }}
                            className="input-field" 
                            style={{ backgroundColor: '#fff', cursor: 'pointer', border: '1px solid var(--border-color)', color: 'var(--text-main)', margin: 0 }}
                        >
                            <option value="">Sélectionner un véhicule fréquent...</option>
                            {VEHICULES_SENEGAL.map(v => (
                                <option key={v.id} value={v.id}>{v.marque} {v.modele} ({v.annee}) - {v.motorisation}</option>
                            ))}
                        </select>
                    </div>

                    <input type="text" name="immatriculation" placeholder="Immatriculation (ex: AB-123-CD)" value={formData.immatriculation} onChange={handleChange} className="input-field" required />
                    
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <input type="text" name="marque" placeholder="Marque" value={formData.marque} onChange={handleChange} className="input-field" style={{ flex: 1 }} required />
                        <input type="text" name="modele" placeholder="Modèle" value={formData.modele} onChange={handleChange} className="input-field" style={{ flex: 1 }} required />
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <select name="type_vehicule" value={formData.type_vehicule} onChange={handleChange} className="input-field" required style={{ backgroundColor: '#fff', cursor: 'pointer', flex: 1 }}>
                            <option value="VOITURE">VOITURE</option>
                            <option value="MOTO">MOTO</option>
                            <option value="CAMIONNETTE">CAMIONNETTE</option>
                            <option value="UTILITAIRE">UTILITAIRE</option>
                            <option value="CAMION">CAMION</option>
                        </select>

                        <select name="motorisation" value={formData.motorisation} onChange={handleChange} className="input-field" required style={{ backgroundColor: '#fff', cursor: 'pointer', flex: 1 }}>
                            <option value="ESSENCE">ESSENCE</option>
                            <option value="DIESEL">DIESEL</option>
                            <option value="HYBRIDE">HYBRIDE</option>
                            <option value="HYBRIDE_RECHARGEABLE">HYBRIDE RECH.</option>
                            <option value="ELECTRIQUE">ÉLECTRIQUE</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <input type="number" name="annee" placeholder="Année" value={formData.annee} onChange={handleChange} className="input-field" style={{ flex: 1 }} required min="1990" max="2100" />
                        
                        <select name="statut" value={formData.statut} onChange={handleChange} className="input-field" required style={{ backgroundColor: '#fff', cursor: 'pointer', flex: 1 }}>
                            <option value="DISPONIBLE">DISPONIBLE</option>
                            <option value="EN_MAINTENANCE">EN MAINTENANCE</option>
                            <option value="EN_MISSION">EN MISSION</option>
                            <option value="HORS_SERVICE">HORS SERVICE</option>
                        </select>
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>ENREGISTRER</button>
                </form>
            </Modal>
        </div>
    );
};

export default Vehicules;
