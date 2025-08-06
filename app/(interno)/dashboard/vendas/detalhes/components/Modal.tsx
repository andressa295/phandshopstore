'use client';
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSave?: () => void;
    saveButtonText?: string;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, onSave, saveButtonText = "Salvar", className }) => {
    return (
        <div className={`modal-overlay ${!isOpen ? 'modal-hidden' : ''}`} onClick={onClose}>
            <div className={`modal-content ${className || ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button onClick={onClose} className="modal-close-button">X</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    {onSave && <button onClick={onSave} className="modal-save-button">{saveButtonText}</button>}
                    <button onClick={onClose} className="modal-cancel-button">Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
