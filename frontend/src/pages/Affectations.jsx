import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';
import jsPDF from 'jspdf';

const Affectations = () => {
    // ...
    const { user } = useContext(AuthContext);
    const [affectations, setAffectations] = useState([]);
    const [vehicules, setVehicules] = useState([]);
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        vehicule: '',
        utilisateur: '',
        date_debut: new Date().toISOString().split('T')[0],
        date_fin_prevue: '',
        kilometrage_depart: ''
    });
    const [formError, setFormError] = useState('');

    const fetchData = async () => {
        try {
            const [affRes, vehRes, utilRes] = await Promise.all([
                api.get('/affectations/'),
                api.get('/vehicules/'),
                api.get('/utilisateurs/')
            ]);
            
            // Si l'utilisateur est un chauffeur, il ne voit que ses propres missions
            if (user?.role === 'CHAUFFEUR') {
                const myAff = affRes.data.filter(a => a.chauffeur === user.id || a.chauffeur_details?.id === user.id);
                setAffectations(myAff);
            } else {
                setAffectations(affRes.data);
            }
            
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
    }, [user]);

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
                type_affectation: 'TEMPORAIRE',
                kilometrage_depart: formData.kilometrage_depart || null
            });
            setIsModalOpen(false);
            setFormData({ vehicule: '', utilisateur: '', date_debut: new Date().toISOString().split('T')[0], date_fin_prevue: '', kilometrage_depart: '' });
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

    const generateContract = (affectation) => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("CONTRAT DE MISE A DISPOSITION", 105, 30, { align: 'center' });
        
        doc.setFontSize(12);
        const vehicule = getVehiculeName(affectation.vehicule);
        const chauffeur = getUtilisateurName(affectation.chauffeur);
        const dateString = new Date().toLocaleDateString('fr-FR');
        
        const text = `
Entre les soussignés :

La direction de FLEETHUB,
D'une part,

Et :
M/Mme ${chauffeur}, en qualité de chauffeur,
D'autre part,

Il a été convenu ce qui suit :
Le véhicule suivant est mis à la disposition du chauffeur à compter du ${affectation.date_debut}.
- Véhicule : ${vehicule}
- Kilométrage au départ : ${affectation.kilometrage_depart || 'Non spécifié'} km

Le chauffeur s'engage à utiliser ce véhicule en "bon père de famille", à respecter le code de la route,
et à signaler tout dysfonctionnement dans les plus brefs délais.

Fait pour valoir ce que de droit.

Le ${dateString}
        `;
        
        doc.text(text, 20, 50);
        
        doc.text("Signature du Gestionnaire", 30, 200);
        doc.text("Signature du Chauffeur", 130, 200);
        
        doc.save(`Contrat_${chauffeur.replace(/\s/g, '_')}_${affectation.date_debut}.pdf`);
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>
                    {user?.role === 'CHAUFFEUR' ? 'MES MISSIONS.' : 'AFFECTATIONS.'}
                </h1>
                
                {user?.role !== 'CHAUFFEUR' && (
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} strokeWidth={2} /> NOUVELLE MISSION
                    </button>
                )}
            </div>

            <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--text-main)' }}>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>VÉHICULE</th>
                            {user?.role !== 'CHAUFFEUR' && (
                                <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>CHAUFFEUR</th>
                            )}
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>DÉBUT</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>FIN PRÉVUE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={user?.role === 'CHAUFFEUR' ? "3" : "4"} style={{ padding: '40px', textAlign: 'center', fontWeight: 600 }}>CHARGEMENT...</td></tr>
                        ) : affectations.length === 0 ? (
                            <tr><td colSpan={user?.role === 'CHAUFFEUR' ? "3" : "4"} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>AUCUNE AFFECTATION EN COURS</td></tr>
                        ) : (
                            affectations.map(a => (
                                <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '20px', fontWeight: 600 }}>{getVehiculeName(a.vehicule)}</td>
                                    {user?.role !== 'CHAUFFEUR' && (
                                        <td style={{ padding: '20px' }}>{getUtilisateurName(a.chauffeur)}</td>
                                    )}
                                    <td style={{ padding: '20px', color: 'var(--text-muted)' }}>{a.date_debut}</td>
                                    <td style={{ padding: '20px', color: 'var(--text-muted)' }}>{a.date_fin || 'Non définie'}</td>
                                    <td style={{ padding: '20px', textAlign: 'right' }}>
                                        <button onClick={() => generateContract(a)} style={{ padding: '8px 16px', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>
                                            📄 Contrat
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="NOUVELLE MISSION">
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
                        {utilisateurs.filter(u => u.role === 'CHAUFFEUR').map(u => (
                            <option key={u.id} value={u.id}>{u.prenom} {u.nom} ({u.email})</option>
                        ))}
                    </select>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Date de début</label>
                            <input type="date" name="date_debut" value={formData.date_debut} onChange={handleChange} className="input-field" required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Date de fin prévue</label>
                            <input type="date" name="date_fin_prevue" value={formData.date_fin_prevue} onChange={handleChange} className="input-field" />
                        </div>
                    </div>

                    <div>
                        <input type="number" name="kilometrage_depart" value={formData.kilometrage_depart} onChange={handleChange} className="input-field" placeholder="Kilométrage au départ" min="0" required />
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>AFFECTER LE VÉHICULE</button>
                </form>
            </Modal>
        </div>
    );
};

export default Affectations;
