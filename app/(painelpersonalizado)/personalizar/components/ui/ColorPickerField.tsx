// app\(editorpainel)\personalizar\components\ui\ColorPickerField.tsx
import React from 'react';
import { Tema, CoresTema } from '../EditorContext'; // Ajuste o caminho se necessário

interface ColorPickerFieldProps {
    label: string;
    description?: string;
    value: string;
    onChange: (newValue: string) => void;
}

const ColorPickerField: React.FC<ColorPickerFieldProps> = ({ label, description, value, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: value,
                    border: '1px solid #ccc',
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0
                }}>
                    <input
                        type="color"
                        value={value}
                        onChange={handleChange}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer',
                            padding: 0,
                            border: 'none'
                        }}
                    />
                </div>
                <div>
                    <h4 style={{ margin: '0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>{label}</h4>
                    {description && <p style={{ margin: '0', fontSize: '0.75rem', color: '#666', fontFamily: 'Poppins, sans-serif' }}>{description}</p>}
                </div>
            </div>
        </div>
    );
};

export default ColorPickerField;