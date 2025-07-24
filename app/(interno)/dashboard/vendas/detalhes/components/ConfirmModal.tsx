'use client';
import React, { useEffect } from 'react';

interface ConfirmModalProps {
    isOpen: boolean; // Controla visibilidade via CSS
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    className?: string; // Para adicionar classes de visibilidade
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", className }) => {
    // A visibilidade é controlada por CSS usando a classe `modal-hidden`
    // Este pode permanecer condicional simples se o erro persistir, ou usar a mesma abordagem do Modal.
    // Para consistência, usaremos a mesma classe `modal-hidden`
    return (
        <div className={`modal-overlay ${!isOpen ? 'modal-hidden' : ''}`} onClick={onClose}>
            <div className={`modal-content confirm-modal-content ${className || ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button onClick={onClose} className="modal-close-button">X</button>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button onClick={onConfirm} className="modal-save-button">{confirmText}</button>
                    <button onClick={onClose} className="modal-cancel-button">{cancelText}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal; // Exporta como default