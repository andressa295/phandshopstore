// app\(painelpersonalizado)\personalizar\components\ui\TextareaField.tsx
import React, { CSSProperties } from 'react'; // Import CSSProperties

interface TextareaFieldProps {
    label: string;
    value: string;
    onChange: (newValue: string) => void;
    placeholder?: string;
    minHeight?: string;
    maxHeight?: string;
    description?: string;
    style?: CSSProperties; // Adicionado para permitir estilos inline personalizados
}

const TextareaField: React.FC<TextareaFieldProps> = ({ label, value, onChange, placeholder, minHeight = '38px', maxHeight = '150px', description, style }) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>{label}</label>
            <textarea
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    height: minHeight,
                    minHeight: minHeight,
                    maxHeight: maxHeight,
                    resize: 'vertical',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                    ...style // Aplica os estilos passados via prop
                }}
            />
            {description && <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '5px', marginBottom: '0', fontFamily: 'Poppins, sans-serif' }}>{description}</p>}
        </div>
    );
};

export default TextareaField;