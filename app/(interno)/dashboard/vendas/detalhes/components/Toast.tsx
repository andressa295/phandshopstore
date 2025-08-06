'use client'; 

import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning'; // CORREÇÃO: Adicionando o tipo 'warning'
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Fecha após 3 segundos
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast-notification toast-${type}`}>
            {message}
            <button onClick={onClose} className="toast-close-button">X</button>
        </div>
    );
};

export default Toast;
