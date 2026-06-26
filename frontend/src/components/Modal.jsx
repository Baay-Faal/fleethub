import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 100, backdropFilter: 'blur(2px)',
            overflowY: 'auto', padding: '5vh 20px'
        }}>
            <div className="animate-fade-in" style={{
                backgroundColor: 'var(--bg-color)',
                width: '100%', maxWidth: '500px',
                margin: '0 auto',
                border: '1px solid var(--text-main)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '24px', borderBottom: '1px solid var(--border-color)'
                }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{title}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        <X size={24} color="var(--text-main)" strokeWidth={1.5} />
                    </button>
                </div>
                <div style={{ padding: '32px 24px' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
