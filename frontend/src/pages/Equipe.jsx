import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';

const Equipe = () => {
    const { user } = useContext(AuthContext);
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        password: '',
        role: 'CHAUFFEUR'
    });
    const [formError, setFormError] = useState('');

    const fetchUtilisateurs = async () => {
        try {
            const res = await api.get('/utilisateurs/');
            if (user?.role === 'GESTIONNAIRE') {
                setUtilisateurs(res.data.filter(u => u.role === 'CHAUFFEUR'));
            } else {
                setUtilisateurs(res.data);
            }
        } catch (error) {
            console.error("Erreur equipe", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUtilisateurs();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            await api.post('/utilisateurs/', formData);
            setIsModalOpen(false);
            setFormData({ prenom: '', nom: '', email: '', password: '', role: 'CHAUFFEUR' });
            fetchUtilisateurs(); // Rafraîchit la liste
        } catch (error) {
            setFormError(error.response?.data?.detail || JSON.stringify(error.response?.data) || "Erreur lors de l'ajout.");
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>ÉQUIPE.</h1>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} strokeWidth={2} /> NOUVEAU MEMBRE
                </button>
            </div>

            <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--text-main)' }}>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>MEMBRE</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>EMAIL</th>
                            <th style={{ padding: '20px', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)' }}>RÔLE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" style={{ padding: '40px', textAlign: 'center', fontWeight: 600 }}>CHARGEMENT...</td></tr>
                        ) : utilisateurs.length === 0 ? (
                            <tr><td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>AUCUN MEMBRE ENREGISTRÉ</td></tr>
                        ) : (
                            utilisateurs.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '20px', fontWeight: 600 }}>{u.prenom} {u.nom}</td>
                                    <td style={{ padding: '20px', color: 'var(--text-muted)' }}>{u.email}</td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{ 
                                            padding: '6px 12px', 
                                            borderRadius: '999px', 
                                            fontSize: '12px', 
                                            fontWeight: 600,
                                            backgroundColor: u.role === 'ADMIN' ? '#E1BEE7' : (u.role === 'GESTIONNAIRE' ? '#E3F2FD' : '#F5F5F5'),
                                            color: u.role === 'ADMIN' ? '#6A1B9A' : (u.role === 'GESTIONNAIRE' ? '#1565C0' : '#424242')
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="NOUVEAU MEMBRE">
                {formError && <div style={{ color: 'var(--danger)', marginBottom: '15px', fontWeight: 500 }}>{formError}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} className="input-field" style={{ flex: 1 }} required />
                        <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} className="input-field" style={{ flex: 1 }} required />
                    </div>

                    <input type="email" name="email" placeholder="Adresse email" value={formData.email} onChange={handleChange} className="input-field" required />
                    <input type="password" name="password" placeholder="Mot de passe temporaire" value={formData.password} onChange={handleChange} className="input-field" required minLength="6" />

                    <select name="role" value={formData.role} onChange={handleChange} className="input-field" required style={{ backgroundColor: '#fff', cursor: 'pointer' }}>
                        <option value="CHAUFFEUR">CHAUFFEUR</option>
                        {user?.role === 'ADMIN' && (
                            <>
                                <option value="GESTIONNAIRE">GESTIONNAIRE</option>
                                <option value="ADMIN">ADMINISTRATEUR</option>
                            </>
                        )}
                    </select>
                    
                    <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>CRÉER LE COMPTE</button>
                </form>
            </Modal>
        </div>
    );
};

export default Equipe;
