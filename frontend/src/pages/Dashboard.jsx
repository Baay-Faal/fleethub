import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { ArrowUpRight, CarFront, Users, Navigation, Plus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ vehicules: 0, disponibles: 0, affectations: 0 });
    const [mesMissions, setMesMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal Chauffeur (Énergie)
    const [isEnergieModalOpen, setIsEnergieModalOpen] = useState(false);
    const [energieData, setEnergieData] = useState({ type_energie: 'CARBURANT', quantite: '', prix: '', kilometrage: '' });
    const [energieError, setEnergieError] = useState('');

    // Modal Chauffeur (Entretien)
    const [isEntretienModalOpen, setIsEntretienModalOpen] = useState(false);
    const [entretienData, setEntretienData] = useState({ type_intervention: 'REVISION', est_immediat: false, date_prevue: new Date().toISOString().split('T')[0], description: '', kilometrage: '' });
    const [entretienError, setEntretienError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user?.role === 'CHAUFFEUR') {
                    const [affRes, vehRes] = await Promise.all([
                        api.get('/affectations/'),
                        api.get('/vehicules/')
                    ]);
                    const m = affRes.data
                        .filter(a => a.chauffeur_details?.id === user.id || a.chauffeur === user.id)
                        .map(a => ({
                            ...a,
                            vehicule_details: vehRes.data.find(v => v.id === a.vehicule)
                        }));
                    setMesMissions(m);
                } else {
                    const [vehiculesRes, affectationsRes, utilisateursRes] = await Promise.all([
                        api.get('/vehicules/'),
                        api.get('/affectations/'),
                        api.get('/utilisateurs/')
                    ]);
                    
                    const vehicules = vehiculesRes.data.length || 0;
                    const dispos = vehiculesRes.data.filter(v => v.statut === 'DISPONIBLE').length || 0;
                    const affectations = affectationsRes.data.length || 0;
                    const chauffeurs = utilisateursRes.data.filter(u => u.role === 'CHAUFFEUR').length || 0;

                    setStats({ vehicules, disponibles: dispos, affectations, chauffeurs });
                }
            } catch (error) {
                console.error("Erreur chargement dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleEnergieChange = (e) => {
        const { name, value } = e.target;
        let newData = { ...energieData, [name]: value };

        // Auto-calcul du prix pour le Sénégal
        if (name === 'quantite' && newData.type_energie === 'CARBURANT') {
            const currentMission = mesMissions[mesMissions.length - 1];
            const motorisation = currentMission?.vehicule_details?.motorisation;
            
            let prixUnitaire = 0;
            if (motorisation === 'ESSENCE' || motorisation === 'HYBRIDE') prixUnitaire = 920;
            if (motorisation === 'DIESEL') prixUnitaire = 690;
            
            if (prixUnitaire > 0 && value) {
                newData.prix = (parseFloat(value) * prixUnitaire).toFixed(0); // FCFA sans virgule
            } else if (!value) {
                newData.prix = '';
            }
        }
        setEnergieData(newData);
    };

    const handleEnergieSubmit = async (e) => {
        e.preventDefault();
        setEnergieError('');
        const currentMission = mesMissions[mesMissions.length - 1];
        if (!currentMission) {
            setEnergieError("Aucun véhicule assigné.");
            return;
        }

        try {
            const payload = {
                vehicule: currentMission.vehicule,
                chauffeur: user.id,
                date: new Date().toISOString(),
                type_energie: energieData.type_energie,
                prix: energieData.prix,
                kilometrage: energieData.kilometrage
            };
            if (energieData.type_energie === 'CARBURANT') {
                payload.litres = energieData.quantite;
            } else {
                payload.kwh = energieData.quantite;
            }

            await api.post('/consommations/', payload);
            setIsEnergieModalOpen(false);
            setEnergieData({ type_energie: 'CARBURANT', quantite: '', prix: '', kilometrage: '' });
            alert("Plein enregistré avec succès !");
        } catch (error) {
            setEnergieError(error.response?.data?.detail || JSON.stringify(error.response?.data) || "Erreur lors de l'enregistrement.");
        }
    };

    const handleEntretienChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEntretienData({ ...entretienData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleEntretienSubmit = async (e) => {
        e.preventDefault();
        setEntretienError('');
        const currentMission = mesMissions[mesMissions.length - 1];
        if (!currentMission) {
            setEntretienError("Aucun véhicule assigné.");
            return;
        }

        try {
            const payload = {
                vehicule: currentMission.vehicule,
                type_intervention: entretienData.type_intervention,
                est_immediat: entretienData.est_immediat,
                date_prevue: entretienData.date_prevue,
                description: entretienData.description,
                kilometrage: entretienData.kilometrage,
                cout: 0
            };

            await api.post('/entretiens/', payload);
            setIsEntretienModalOpen(false);
            setEntretienData({ type_intervention: 'REVISION', est_immediat: false, date_prevue: new Date().toISOString().split('T')[0], description: '', kilometrage: '' });
            alert("Demande d'entretien envoyée au gestionnaire avec succès !");
        } catch (error) {
            setEntretienError(error.response?.data?.detail || JSON.stringify(error.response?.data) || "Erreur lors de la demande d'entretien.");
        }
    };

    if (loading) return <div style={{ padding: '40px' }}>Chargement du tableau de bord...</div>;

    if (user?.role === 'CHAUFFEUR') {
        return (
            <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>BONJOUR, {user.prenom || 'CHAUFFEUR'}.</h1>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '18px' }}>Bienvenue sur votre espace de conduite.</p>
                    </div>
                    {mesMissions.length > 0 && (
                        <button className="btn-primary" onClick={() => setIsEnergieModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Plus size={18} strokeWidth={2} /> DÉCLARER UN PLEIN
                        </button>
                    )}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                    <div className="panel" style={{ backgroundColor: '#111111', color: '#FFFFFF', borderColor: '#111111' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A0A0A0', marginBottom: '20px' }}>
                            <span style={{ fontWeight: 600, fontSize: '14px' }}>MISSION ACTUELLE</span>
                            <Navigation size={20} strokeWidth={1.5} />
                        </div>
                        {mesMissions.length > 0 ? (
                            <div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', lineHeight: 1, marginBottom: '10px' }}>
                                    {mesMissions[mesMissions.length - 1].vehicule_details?.immatriculation || "Véhicule Assigné"}
                                </div>
                                <div style={{ color: '#A0A0A0', fontSize: '14px', marginBottom: '20px' }}>
                                    {mesMissions[mesMissions.length - 1].vehicule_details?.marque} {mesMissions[mesMissions.length - 1].vehicule_details?.modele}
                                </div>
                                <button className="btn-secondary" onClick={() => setIsEntretienModalOpen(true)} style={{ marginTop: '10px' }}>
                                    🔧 Demander un Entretien
                                </button>
                            </div>
                        ) : (
                            <div style={{ padding: '20px 0', color: '#A0A0A0' }}>
                                Aucune mission ne vous est actuellement assignée.
                            </div>
                        )}
                    </div>
                </div>

                <Modal isOpen={isEnergieModalOpen} onClose={() => setIsEnergieModalOpen(false)} title="DÉCLARER UN PLEIN">
                    {energieError && <div style={{ color: 'var(--danger)', marginBottom: '15px', fontWeight: 500 }}>{energieError}</div>}
                    <form onSubmit={handleEnergieSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <select name="type_energie" value={energieData.type_energie} onChange={handleEnergieChange} className="input-field" required style={{ backgroundColor: '#fff', cursor: 'pointer' }}>
                            <option value="CARBURANT">Carburant (Essence/Diesel)</option>
                            <option value="RECHARGE">Recharge Électrique</option>
                        </select>
                        <input type="number" step="0.01" name="quantite" placeholder={energieData.type_energie === 'CARBURANT' ? "Quantité (Litres)" : "Quantité (kWh)"} value={energieData.quantite} onChange={handleEnergieChange} className="input-field" required min="0.1" />
                        <input type="number" step="0.01" name="prix" placeholder="Prix Total payé (FCFA)" value={energieData.prix} onChange={handleEnergieChange} className="input-field" required min="1" />
                        <input type="number" name="kilometrage" placeholder="Kilométrage affiché au compteur" value={energieData.kilometrage} onChange={handleEnergieChange} className="input-field" required min="0" />
                        <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>ENREGISTRER LE RELEVÉ</button>
                    </form>
                </Modal>

                <Modal isOpen={isEntretienModalOpen} onClose={() => setIsEntretienModalOpen(false)} title="DEMANDER UN ENTRETIEN">
                    {entretienError && <div style={{ color: 'var(--danger)', marginBottom: '15px', fontWeight: 500 }}>{entretienError}</div>}
                    <form onSubmit={handleEntretienSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <select name="type_intervention" value={entretienData.type_intervention} onChange={handleEntretienChange} className="input-field" required style={{ backgroundColor: '#fff', cursor: 'pointer' }}>
                            <option value="REVISION">Révision</option>
                            {mesMissions[mesMissions.length - 1]?.vehicule_details?.motorisation === 'ELECTRIQUE' ? (
                                <>
                                    <option value="BATTERIE">Batterie 12V</option>
                                    <option value="SYSTEME_HT">Système Haute Tension (VE)</option>
                                    <option value="MOTEUR_ELEC">Moteur Électrique (VE)</option>
                                </>
                            ) : (
                                <>
                                    <option value="VIDANGE">Vidange</option>
                                    <option value="BATTERIE">Batterie</option>
                                </>
                            )}
                            <option value="PNEUS">Changement de pneus</option>
                            <option value="CONTROLE_TECHNIQUE">Contrôle technique</option>
                            <option value="AUTRE">Autre</option>
                        </select>
                        <input type="date" name="date_prevue" value={entretienData.date_prevue} onChange={handleEntretienChange} className="input-field" required />
                        <input type="number" name="kilometrage" placeholder="Kilométrage actuel" value={entretienData.kilometrage} onChange={handleEntretienChange} className="input-field" required min="0" />
                        <textarea name="description" placeholder="Description du problème (optionnel)" value={entretienData.description} onChange={handleEntretienChange} className="input-field" style={{ minHeight: '80px', resize: 'vertical' }}></textarea>
                        
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: 'var(--danger)' }}>
                            <input type="checkbox" name="est_immediat" checked={entretienData.est_immediat} onChange={handleEntretienChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                            C'est une urgence / Panne immédiate
                        </label>

                        <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>ENVOYER LA DEMANDE</button>
                    </form>
                </Modal>
            </div>
        );
    }

    // Vue Admin et Gestionnaire
    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '40px' }}>RÉSUMÉ DE LA FLOTTE.</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>TOTAL VÉHICULES</span>
                        <CarFront size={20} strokeWidth={1.5} />
                    </div>
                    <div style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{stats.vehicules}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <ArrowUpRight size={16} /> Enregistrés dans la base
                    </div>
                </div>

                <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#111111', color: '#FFFFFF', borderColor: '#111111' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A0A0A0' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>VÉHICULES DISPONIBLES</span>
                        <CarFront size={20} strokeWidth={1.5} />
                    </div>
                    <div style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{stats.disponibles}</div>
                    <div style={{ color: '#A0A0A0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        Prêts pour une nouvelle affectation
                    </div>
                </div>

                <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>AFFECTATIONS ACTIVES</span>
                        <Users size={20} strokeWidth={1.5} />
                    </div>
                    <div style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{stats.affectations}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <ArrowUpRight size={16} /> En cours de réalisation
                    </div>
                </div>

                <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>TOTAL CHAUFFEURS</span>
                        <Users size={20} strokeWidth={1.5} />
                    </div>
                    <div style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{stats.chauffeurs}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <ArrowUpRight size={16} /> Prêts à conduire
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
