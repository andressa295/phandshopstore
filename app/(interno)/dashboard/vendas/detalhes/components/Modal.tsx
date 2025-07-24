'use client';

import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean; // Controla visibilidade via CSS
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSave?: () => void; // onSave não recebe data aqui, a lógica é no componente pai
    saveButtonText?: string;
    className?: string; // Para adicionar classes de visibilidade (ex: 'modal-hidden')
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, onSave, saveButtonText = "Salvar", className }) => {
    // A visibilidade é controlada por CSS usando a classe `modal-hidden`
    return (
        // A classe 'modal-hidden' será adicionada quando !isOpen, controlando o display:none
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

export default Modal; // Exporta como default