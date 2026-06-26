import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Search, Filter } from 'lucide-react';
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

    const [isRemplacementModalOpen, setIsRemplacementModalOpen] = useState(false);
    const [selectedChauffeur, setSelectedChauffeur] = useState(null);
    const [selectedEntretien, setSelectedEntretien] = useState(null);
    const [remplacementData, setRemplacementData] = useState({ vehicule: '', kilometrage_depart: '' });
    const [remplacementError, setRemplacementError] = useState('');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

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

    const handleRemplacementSubmit = async (e) => {
        e.preventDefault();
        setRemplacementError('');
        try {
            await api.post('/affectations/', {
                vehicule: remplacementData.vehicule,
                chauffeur: selectedChauffeur.id,
                date_debut: new Date().toISOString().split('T')[0],
                type_affectation: 'TEMPORAIRE',
                kilometrage_depart: remplacementData.kilometrage_depart || 0
            });
            setIsRemplacementModalOpen(false);
            setRemplacementData({ vehicule: '', kilometrage_depart: '' });
            alert("Véhicule de remplacement affecté avec succès !");
            fetchData();
        } catch (error) {
            setRemplacementError(error.response?.data?.detail || "Erreur lors de l'affectation.");
        }
    };

    const handleValidation = async (id, newStatut) => {
        try {
            await api.patch(`/entretiens/${id}/`, { statut: newStatut });
            fetchData();
        } catch (error) {
            console.error("Erreur de validation", error);
            alert("Une erreur est survenue lors de la validation.");
        }
    };

    const getVehiculeName = (id) => {
        const v = vehicules.find(v => v.id === id);
        return v ? `${v.marque} ${v.modele} (${v.immatriculation})` : id;
    };

    const filteredEntretiens = entretiens.filter(e => {
        const vName = getVehiculeName(e.vehicule).toLowerCase();
        const cName = e.chauffeur_details ? `${e.chauffeur_details.prenom} ${e.chauffeur_details.nom}`.toLowerCase() : '';
        const searchStr = `${vName} ${cName}`;
        const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? e.statut === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>ENTRETIENS.</h1>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} strokeWidth={2} /> PLANIFIER
                </button>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                        type="text" 
                        placeholder="Rechercher par véhicule ou chauffeur..." 
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
                        <option value="EN_ATTENTE_VALIDATION">En attente de validation</option>
                        <option value="PLANIFIE">Planifié</option>
                        <option value="EN_COURS">En cours</option>
                        <option value="TERMINE">Terminé</option>
                        <option value="REFUSE">Refusé</option>
                    </select>
                </div>
            </div>

            <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--text-main)' }}>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>VÉHICULE</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>TYPE</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>DATE PRÉVUE</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>STATUT</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', fontWeight: 600 }}>CHARGEMENT...</td></tr>
                        ) : filteredEntretiens.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>AUCUN ENTRETIEN TROUVÉ</td></tr>
                        ) : (
                            filteredEntretiens.map(e => (
                                <tr key={e.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: e.est_immediat && e.statut === 'EN_ATTENTE_VALIDATION' ? '#FFF5F5' : 'transparent' }}>
                                    <td style={{ padding: '20px', fontWeight: 600 }}>
                                        {getVehiculeName(e.vehicule)}
                                        {e.est_immediat && <span style={{ color: 'var(--danger)', fontSize: '12px', marginLeft: '8px', fontWeight: 700 }}>⚠️ URGENCE</span>}
                                        {e.chauffeur_details && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Demande de : {e.chauffeur_details.prenom} {e.chauffeur_details.nom}</div>}
                                    </td>
                                    <td style={{ padding: '20px' }}>{e.type_intervention || e.type_entretien}</td>
                                    <td style={{ padding: '20px', color: 'var(--text-muted)' }}>{new Date(e.date_prevue).toLocaleDateString()}</td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{ 
                                            padding: '6px 12px', 
                                            borderRadius: '999px', 
                                            fontSize: '12px', 
                                            fontWeight: 600,
                                            backgroundColor: e.statut === 'TERMINE' ? '#E8F5E9' : (e.statut === 'EN_ATTENTE_VALIDATION' ? '#E3F2FD' : (e.statut === 'REFUSE' ? '#FFEBEE' : '#FFF3E0')),
                                            color: e.statut === 'TERMINE' ? '#2E7D32' : (e.statut === 'EN_ATTENTE_VALIDATION' ? '#1565C0' : (e.statut === 'REFUSE' ? '#C62828' : '#EF6C00'))
                                        }}>
                                            {e.statut}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        {e.statut === 'EN_ATTENTE_VALIDATION' && (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => handleValidation(e.id, 'PLANIFIE')} style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>ACCEPTER</button>
                                                <button onClick={() => handleValidation(e.id, 'REFUSE')} style={{ backgroundColor: '#F44336', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>REFUSER</button>
                                            </div>
                                        )}
                                        {(e.statut === 'PLANIFIE' || e.statut === 'EN_COURS') && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <button onClick={() => handleValidation(e.id, 'TERMINE')} style={{ backgroundColor: 'var(--text-main)', color: 'var(--bg-color)', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>TERMINER L'ENTRETIEN</button>
                                                {e.chauffeur_details && (
                                                    <button onClick={() => { setSelectedEntretien(e); setSelectedChauffeur(e.chauffeur_details); setIsRemplacementModalOpen(true); }} style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>AFFECTER REMPLACEMENT</button>
                                                )}
                                            </div>
                                        )}
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

                    <select name="type_entretien" value={formData.type_entretien} onChange={handleChange} className="input-field" required style={{ backgroundColor: '#fff', cursor: 'pointer' }} disabled={!formData.vehicule}>
                        <option value="REVISION">RÉVISION</option>
                        {vehicules.find(v => v.id === parseInt(formData.vehicule))?.motorisation === 'ELECTRIQUE' ? (
                            <>
                                <option value="BATTERIE">BATTERIE 12V</option>
                                <option value="SYSTEME_HT">SYSTÈME HAUTE TENSION (VE)</option>
                                <option value="MOTEUR_ELEC">MOTEUR ÉLECTRIQUE (VE)</option>
                            </>
                        ) : (
                            <>
                                <option value="VIDANGE">VIDANGE</option>
                                <option value="BATTERIE">BATTERIE</option>
                            </>
                        )}
                        <option value="REPARATION">RÉPARATION</option>
                        <option value="CONTROLE_TECHNIQUE">CONTRÔLE TECHNIQUE</option>
                        <option value="PNEUS">PNEUS</option>
                        <option value="AUTRE">AUTRE</option>
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
                    
                    <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>PLANIFIER L'ENTRETIEN</button>
                </form>
            </Modal>

            <Modal isOpen={isRemplacementModalOpen} onClose={() => setIsRemplacementModalOpen(false)} title="AFFECTER UN VÉHICULE DE REMPLACEMENT">
                {remplacementError && <div style={{ color: 'var(--danger)', marginBottom: '15px', fontWeight: 500 }}>{remplacementError}</div>}
                <div style={{ marginBottom: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Chauffeur : <strong style={{ color: 'var(--text-main)' }}>{selectedChauffeur?.prenom} {selectedChauffeur?.nom}</strong>
                </div>
                <form onSubmit={handleRemplacementSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <select name="vehicule" value={remplacementData.vehicule} onChange={(e) => setRemplacementData({...remplacementData, vehicule: e.target.value})} className="input-field" required style={{ backgroundColor: '#fff', cursor: 'pointer' }}>
                        <option value="">Sélectionner un véhicule DISPONIBLE</option>
                        {vehicules.filter(v => v.statut === 'DISPONIBLE' && v.id !== selectedEntretien?.vehicule).map(v => (
                            <option key={v.id} value={v.id}>{v.marque} {v.modele} ({v.immatriculation})</option>
                        ))}
                    </select>
                    
                    <input type="number" placeholder="Kilométrage de départ (optionnel)" value={remplacementData.kilometrage_depart} onChange={(e) => setRemplacementData({...remplacementData, kilometrage_depart: e.target.value})} className="input-field" min="0" />

                    <button type="submit" className="btn-primary" style={{ marginTop: '16px', backgroundColor: '#2196F3' }}>VALIDER LE REMPLACEMENT</button>
                </form>
            </Modal>
        </div>
    );
};

export default Entretiens;
