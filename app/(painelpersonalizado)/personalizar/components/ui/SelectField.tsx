// app/(painelpersonalizado)/personalizar/components/ui/SelectField.tsx
import React from 'react';

interface SelectFieldProps {
    label: string;
    value: string | undefined; // Pode ser undefined
    onChange: (newValue: string) => void;
    options: { value: string; label: string }[];
    description?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, options, description }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    };

    return (
        <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>{label}</label>
            <select
                value={value ?? ''} // Forneça um valor padrão para evitar undefined no HTML
                onChange={handleChange}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', height: '38px', boxSizing: 'border-box' }}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
            {description && <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '5px', marginBottom: '0', fontFamily: 'Poppins, sans-serif' }}>{description}</p>}
        </div>
    );
};

export default SelectField;