// app/(painelpersonalizado)/personalizar/components/screens/AnnouncementBarScreen.tsx
import React, { Fragment } from 'react';
import CheckboxField from '../ui/CheckboxField';
import TextareaField from '../ui/TextareaField';
import TextField from '../ui/TextField';
import { Tema } from '../EditorContext';

interface AnnouncementBarScreenProps {
    tema: Tema;
    handleTemaChange: (key: keyof Tema, value: any) => void;
    goBackToMainMenu: () => void;
}

const AnnouncementBarScreen: React.FC<AnnouncementBarScreenProps> = ({ tema, handleTemaChange, goBackToMainMenu }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}>
            <button onClick={goBackToMainMenu} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
            </button>
            <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Barra de Anúncio</h3>

            <CheckboxField
                label="Mostrar barra de anúncio"
                checked={tema.mostrarBarraAnuncio ?? false} // Use ?? false
                onChange={(val) => handleTemaChange('mostrarBarraAnuncio', val)}
            />

            {tema.mostrarBarraAnuncio && (
                <Fragment>
                    <TextareaField
                        label="Mensagem:"
                        value={tema.mensagemBarraAnuncio ?? ''} // Use ?? ''
                        onChange={(val) => handleTemaChange('mensagemBarraAnuncio', val)}
                        placeholder="Digite sua mensagem de anúncio..."
                        minHeight="38px"
                        maxHeight="80px"
                    />
                    <TextField
                        label="Link opcional:"
                        value={tema.linkBarraAnuncio ?? ''} // Use ?? ''
                        onChange={(val) => handleTemaChange('linkBarraAnuncio', val)}
                        placeholder="Ex: https://sua-loja.com/promocao"
                        type="url"
                    />
                </Fragment>
            )}
        </div>
    );
};

export default AnnouncementBarScreen;