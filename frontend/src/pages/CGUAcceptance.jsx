import React, { useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';
import logo from '../assets/logo.png';

const CGUAcceptance = () => {
    const { user, login } = useContext(AuthContext); // login fonction pour forcer un rechargement du contexte si besoin, ou on fait un checkMe()
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!accepted) return;
        setLoading(true);
        try {
            await api.post('/utilisateurs/accepter_cgu/');
            // On recharge la page pour que le AuthContext reprenne la main et voit cgu_acceptees = true
            window.location.reload();
        } catch (error) {
            console.error("Erreur lors de l'acceptation des CGU", error);
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
            <div style={{ margin: 'auto', width: '100%', maxWidth: '800px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <img src={logo} alt="FleetHub Logo" style={{ width: '180px', marginBottom: '20px' }} />
                    <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit, sans-serif' }}>Bienvenue sur FleetHub.</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Avant de commencer, veuillez accepter nos conditions d'utilisation.</p>
                </div>

                <div className="panel" style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '30px', padding: '30px', backgroundColor: 'var(--bg-panel)' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>CONDITIONS GÉNÉRALES D'UTILISATION ET POLITIQUE DE CONFIDENTIALITÉ</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '15px' }}>
                        En utilisant FleetHub, vous acceptez de vous conformer aux politiques internes de l'entreprise concernant l'utilisation du matériel roulant.
                    </p>
                    <h3 style={{ fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>1. Usage des véhicules</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '15px' }}>
                        Tout véhicule qui vous est confié doit être utilisé en "bon père de famille". Il est strictement interdit d'en faire un usage à des fins personnelles sans l'accord préalable de la direction. Le chauffeur est responsable des infractions au code de la route commises pendant la période d'affectation.
                    </p>
                    <h3 style={{ fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>2. Collecte des données</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '15px' }}>
                        Pour des raisons de sécurité et de gestion de flotte, la plateforme FleetHub collecte et enregistre les informations relatives à vos trajets, au kilométrage, ainsi qu'aux dépenses de carburant et d'entretien. Vos données personnelles (nom, contact) sont conservées de manière sécurisée et ne sont accessibles qu'aux administrateurs et gestionnaires autorisés.
                    </p>
                    <h3 style={{ fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px' }}>3. Déclaration de sinistre ou panne</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '15px' }}>
                        Le chauffeur s'engage à signaler immédiatement à son gestionnaire toute anomalie, voyant d'alerte, accrochage ou panne, afin de garantir le maintien du véhicule en bon état et de déclencher les procédures de maintenance adaptées.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 500 }}>
                        <input 
                            type="checkbox" 
                            checked={accepted} 
                            onChange={(e) => setAccepted(e.target.checked)} 
                            style={{ width: '24px', height: '24px', cursor: 'pointer' }}
                        />
                        J'ai lu et j'accepte les Conditions Générales d'Utilisation.
                    </label>

                    <button 
                        type="submit" 
                        disabled={!accepted || loading}
                        className={accepted ? "btn-primary" : "btn-secondary"} 
                        style={{ 
                            padding: '15px 40px', 
                            fontSize: '1.1rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px',
                            opacity: accepted ? 1 : 0.5,
                            cursor: accepted ? 'pointer' : 'not-allowed'
                        }}
                    >
                        <ShieldCheck size={24} /> {loading ? "VALIDATION..." : "ACCÉDER À MON ESPACE"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CGUAcceptance;
