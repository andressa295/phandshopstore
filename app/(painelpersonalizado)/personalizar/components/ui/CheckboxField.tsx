import React from 'react';

interface CheckboxFieldProps {
    label: string;
    checked: boolean; // Mantenha como boolean
    onChange: (checked: boolean) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, checked, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    };

    return (
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif', marginBottom: '0.8rem' }}>
            <input
                type="checkbox"
                checked={checked} // Já espera boolean
                onChange={handleChange}
                style={{ width: '16px', height: '16px', flexShrink: 0 }}
            />
            {label}
        </label>
    );
};

export default CheckboxField;