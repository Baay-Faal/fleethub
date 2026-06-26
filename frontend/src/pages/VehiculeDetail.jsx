import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, CarFront, Users, Droplet, Wrench, Edit, Trash2, Download } from 'lucide-react';
import Modal from '../components/Modal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const VehiculeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [vehicule, setVehicule] = useState(null);
    const [affectations, setAffectations] = useState([]);
    const [consommations, setConsommations] = useState([]);
    const [entretiens, setEntretiens] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('AFFECTATIONS');

    // Pour l'édition de véhicule
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const fetchData = async () => {
        try {
            const [vehRes, affRes, consRes, entRes] = await Promise.all([
                api.get(`/vehicules/${id}/`),
                api.get('/affectations/'),
                api.get('/consommations/'),
                api.get('/entretiens/')
            ]);
            
            setVehicule(vehRes.data);
            setAffectations(affRes.data.filter(a => a.vehicule === parseInt(id) || a.vehicule_details?.id === parseInt(id)));
            setConsommations(consRes.data.filter(c => c.vehicule === parseInt(id) || c.vehicule_details?.id === parseInt(id)));
            setEntretiens(entRes.data.filter(e => e.vehicule === parseInt(id) || e.vehicule_details?.id === parseInt(id)));
            
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleEditChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

    const openEditModal = () => {
        setEditData({ ...vehicule });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/vehicules/${id}/`, editData);
            setVehicule(editData);
            setIsEditModalOpen(false);
        } catch (error) {
            alert("Erreur de modification");
        }
    };

    const handleDelete = async () => {
        if(window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule définitivement ?")) {
            try {
                await api.delete(`/vehicules/${id}/`);
                navigate('/vehicules');
            } catch (error) {
                alert("Erreur lors de la suppression");
            }
        }
    };

    const exportReport = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`RAPPORT DU VEHICULE : ${vehicule.immatriculation}`, 14, 20);
        
        doc.setFontSize(11);
        doc.text(`Marque / Modèle : ${vehicule.marque} ${vehicule.modele} (${vehicule.annee})`, 14, 30);
        doc.text(`Motorisation : ${vehicule.motorisation}`, 14, 36);
        doc.text(`Kilométrage total : ${vehicule.kilometrage} km`, 14, 42);
        
        const coutTotalCarburant = consommations.reduce((acc, curr) => acc + parseFloat(curr.prix || 0), 0);
        const coutTotalEntretiens = entretiens.reduce((acc, curr) => acc + parseFloat(curr.cout || 0), 0);
        doc.text(`Total Carburant : ${coutTotalCarburant} FCFA`, 14, 52);
        doc.text(`Total Entretiens : ${coutTotalEntretiens} FCFA`, 14, 58);
        doc.text(`Coût Global : ${coutTotalCarburant + coutTotalEntretiens} FCFA`, 14, 64);
        
        doc.text("HISTORIQUE DES DEPENSES :", 14, 80);
        
        const tableData = [];
        consommations.forEach(c => tableData.push([new Date(c.date).toLocaleDateString(), 'Carburant', `${c.litres || c.kwh} U`, `${c.prix} FCFA`]));
        entretiens.forEach(e => tableData.push([e.date_realisation || e.date_prevue, `Entretien (${e.type_intervention})`, e.nom_garage || '-', `${e.cout} FCFA`]));
        
        // Trier par date
        tableData.sort((a, b) => new Date(a[0].split('/').reverse().join('-')) - new Date(b[0].split('/').reverse().join('-')));
        
        doc.autoTable({
            startY: 85,
            head: [['Date', 'Type', 'Détail', 'Coût']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [0, 0, 0] }
        });
        
        doc.save(`Rapport_${vehicule.immatriculation}.pdf`);
    };

    if (loading) return <div style={{ padding: '40px' }}>Chargement...</div>;
    if (!vehicule) return <div style={{ padding: '40px' }}>Véhicule introuvable.</div>;

    const coutTotalCarburant = consommations.reduce((acc, curr) => acc + parseFloat(curr.prix || 0), 0);
    const coutTotalEntretiens = entretiens.reduce((acc, curr) => acc + parseFloat(curr.cout || 0), 0);

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
            <button onClick={() => navigate('/vehicules')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '20px', fontSize: '14px' }}>
                <ArrowLeft size={16} /> RETOUR AUX VÉHICULES
            </button>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                        <h1 style={{ fontSize: '3rem', margin: 0, fontFamily: 'Outfit, sans-serif', fontWeight: 900 }}>{vehicule.immatriculation}</h1>
                        <span className={`status-badge ${vehicule.statut}`}>{vehicule.statut.replace('_', ' ')}</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px', margin: 0 }}>
                        {vehicule.marque} {vehicule.modele} ({vehicule.annee}) - {vehicule.motorisation}
                    </p>
                </div>
                {user?.role === 'ADMIN' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn-secondary" onClick={exportReport} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', color: '#fff', border: '1px solid #333' }}>
                            <Download size={16} /> EXPORTER
                        </button>
                        <button className="btn-secondary" onClick={openEditModal} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', color: '#fff', border: '1px solid #333' }}>
                            <Edit size={16} /> MODIFIER
                        </button>
                        <button className="btn-secondary" onClick={handleDelete} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                            <Trash2 size={16} /> SUPPRIMER
                        </button>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="panel" style={{ backgroundColor: '#111111', color: '#FFFFFF', borderColor: '#111111' }}>
                    <div style={{ color: '#A0A0A0', fontSize: '14px', marginBottom: '10px', fontWeight: 600 }}>KILOMÉTRAGE TOTAL</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>{vehicule.kilometrage} km</div>
                </div>
                <div className="panel">
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '10px', fontWeight: 600 }}>TOTAL CARBURANT</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>{coutTotalCarburant.toLocaleString()} FCFA</div>
                </div>
                <div className="panel">
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '10px', fontWeight: 600 }}>TOTAL ENTRETIENS</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>{coutTotalEntretiens.toLocaleString()} FCFA</div>
                </div>
            </div>

            <div style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '30px', marginBottom: '30px' }}>
                <button onClick={() => setActiveTab('AFFECTATIONS')} style={{ background: 'none', border: 'none', padding: '10px 0', cursor: 'pointer', fontWeight: 600, color: activeTab === 'AFFECTATIONS' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'AFFECTATIONS' ? '2px solid var(--primary)' : '2px solid transparent' }}>
                    <Users size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }}/> HISTORIQUE AFFECTATIONS
                </button>
                <button onClick={() => setActiveTab('ENERGIE')} style={{ background: 'none', border: 'none', padding: '10px 0', cursor: 'pointer', fontWeight: 600, color: activeTab === 'ENERGIE' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'ENERGIE' ? '2px solid var(--primary)' : '2px solid transparent' }}>
                    <Droplet size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }}/> CARBURANT / ÉNERGIE
                </button>
                <button onClick={() => setActiveTab('ENTRETIENS')} style={{ background: 'none', border: 'none', padding: '10px 0', cursor: 'pointer', fontWeight: 600, color: activeTab === 'ENTRETIENS' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'ENTRETIENS' ? '2px solid var(--primary)' : '2px solid transparent' }}>
                    <Wrench size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }}/> ENTRETIENS
                </button>
            </div>

            {activeTab === 'AFFECTATIONS' && (
                <div className="panel" style={{ padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px' }}>
                                <th style={{ padding: '20px', fontWeight: 600 }}>CHAUFFEUR</th>
                                <th style={{ padding: '20px', fontWeight: 600 }}>DATE DÉBUT</th>
                                <th style={{ padding: '20px', fontWeight: 600 }}>DATE FIN</th>
                                <th style={{ padding: '20px', fontWeight: 600 }}>KM DÉPART</th>
                                <th style={{ padding: '20px', fontWeight: 600 }}>KM RETOUR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {affectations.length === 0 ? <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Aucune affectation</td></tr> : null}
                            {affectations.map(a => (
                                <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '20px', fontWeight: 500 }}>{a.chauffeur_details?.prenom} {a.chauffeur_details?.nom}</td>
                                    <td style={{ padding: '20px' }}>{a.date_debut}</td>
                                    <td style={{ padding: '20px' }}>{a.date_fin || '-'}</td>
                                    <td style={{ padding: '20px' }}>{a.kilometrage_depart || '-'}</td>
                                    <td style={{ padding: '20px' }}>{a.kilometrage_retour || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'ENERGIE' && (
                <div className="panel" style={{ padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px' }}>
                                <th style={{ padding: '20px', fontWeight: 600 }}>DATE</th>
                                <th style={{ padding: '20px', fontWeight: 600 }}>TYPE</th>
                                <th style={{ padding: '20px', fontWeight: 600 }}>QUANTITÉ</th>
                                <th style={{ padding: '20px', fontWeight: 600 }}>COÛT</th>
                                <th style={{ padding: '20px', fontWeight: 600 }}>KILOMÉTRAGE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consommations.length === 0 ? <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Aucun relevé</td></tr> : null}
                            {consommations.map(c => (
                                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '20px' }}>{new Date(c.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '20px' }}>{c.type_energie}</td>
                                    <td style={{ padding: '20px' }}>{c.type_energie === 'CARBURANT' ? `${c.litres} L` : `${c.kwh} kWh`}</td>
                                    <td style={{ padding: '20px', fontWeight: 600 }}>{c.prix} FCFA</td>
                                    <td style={{ padding: '20px' }}>{c.kilometrage} km</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'ENTRETIENS' && (
                <div className="panel" style={{ padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px' }}>
                                <th style={{ padding: '20px', fontWeight: 600 }}>DATE</th>
                                <th style={{ padding: '20px', fontWeight: 600 }}>TYPE</th>
                                <th style={{ padding: '20px', fontWeight: 600 }}>GARAGE</th>
                                <th style={{ padding: '20px', fontWeight: 600 }}>COÛT</th>
                                <th style={{ padding: '20px', fontWeight: 600 }}>KILOMÉTRAGE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entretiens.length === 0 ? <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Aucun entretien</td></tr> : null}
                            {entretiens.map(e => (
                                <tr key={e.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '20px' }}>{e.date_realisation || e.date_prevue}</td>
                                    <td style={{ padding: '20px' }}>{e.type_intervention}</td>
                                    <td style={{ padding: '20px' }}>{e.nom_garage || '-'}</td>
                                    <td style={{ padding: '20px', fontWeight: 600 }}>{e.cout} FCFA</td>
                                    <td style={{ padding: '20px' }}>{e.kilometrage} km</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal d'édition */}
            {isEditModalOpen && editData && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="MODIFIER LE VÉHICULE">
                    <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <input type="text" name="immatriculation" value={editData.immatriculation} onChange={handleEditChange} className="input-field" placeholder="Immatriculation" required />
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <input type="text" name="marque" value={editData.marque} onChange={handleEditChange} className="input-field" placeholder="Marque" required style={{ flex: 1 }} />
                            <input type="text" name="modele" value={editData.modele} onChange={handleEditChange} className="input-field" placeholder="Modèle" required style={{ flex: 1 }} />
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <input type="number" name="annee" value={editData.annee} onChange={handleEditChange} className="input-field" placeholder="Année" required style={{ flex: 1 }} />
                            <input type="number" name="kilometrage" value={editData.kilometrage} onChange={handleEditChange} className="input-field" placeholder="Kilométrage" required style={{ flex: 1 }} />
                        </div>
                        <select name="statut" value={editData.statut} onChange={handleEditChange} className="input-field">
                            <option value="DISPONIBLE">Disponible</option>
                            <option value="EN_UTILISATION">En utilisation</option>
                            <option value="EN_MAINTENANCE">En maintenance</option>
                            <option value="HORS_SERVICE">Hors service</option>
                        </select>
                        <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>SAUVEGARDER</button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default VehiculeDetail;
