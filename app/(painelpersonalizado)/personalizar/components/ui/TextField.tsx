// app/(painelpersonalizado)/personalizar/components/ui/TextField.tsx
import React, { CSSProperties } from 'react';

interface TextFieldProps {
    label: string;
    value: string | number | undefined; // Aceita string, number ou undefined
    onChange: (newValue: string) => void; // Sempre retorna string para o handler
    placeholder?: string;
    type?: 'text' | 'number' | 'email' | 'url';
    description?: string;
    style?: CSSProperties; // Adicionada prop style
}

const TextField: React.FC<TextFieldProps> = ({ label, value, onChange, placeholder, type = 'text', description, style }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Se for tipo número e o valor estiver vazio, retorne uma string vazia ou null,
        // mas é melhor sempre retornar string, e o parseFloat lidará com isso.
        onChange(e.target.value);
    };

    return (
        <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>{label}</label>
            <input
                type={type}
                value={value ?? ''} // Forneça um valor padrão
                onChange={handleChange}
                placeholder={placeholder}
                style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    width: '100%',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.85rem',
                    height: '38px',
                    boxSizing: 'border-box',
                    ...(style || {}) // Aplica estilos passados, garantindo que seja um objeto
                }}
            />
            {description && <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '5px', marginBottom: '0', fontFamily: 'Poppins, sans-serif' }}>{description}</p>}
        </div>
    );
};

export default TextField;