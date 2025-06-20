// app/(painelpersonalizado)/personalizar/components/module-configs/YoutubeVideoConfig.tsx
'use client';
import React from 'react';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import TextField from '../ui/TextField';
import TextareaField from '../ui/TextareaField';
import CheckboxField from '../ui/CheckboxField';
import { HomePageModule, Tema, YoutubeVideoItem } from '../EditorContext';

interface YoutubeVideoConfigProps {
    module: HomePageModule;
    goBackFromModuleConfig: () => void;
    handleModuleConfigChange: (moduleId: string, newConfig: Partial<HomePageModule['config']>) => void;
    tema: Tema;
    handleTemaChange: (key: keyof Tema, value: any) => void;
    handleNestedTemaChange: (parentKey: keyof Tema, subKey: string, value: any) => void;
}

const YoutubeVideoConfig: React.FC<YoutubeVideoConfigProps> = ({
    module,
    goBackFromModuleConfig,
    handleModuleConfigChange,
    tema,
}) => {
    const currentVideos: YoutubeVideoItem[] = (module.config?.videos as YoutubeVideoItem[]) || [{
        id: `yt_item_${Date.now()}`,
        youtubeId: '',
        title: '',
        description: '',
        autoplay: false,
        loop: false,
    }];

    const handleAddVideo = () => {
        const newVideo: YoutubeVideoItem = {
            id: `yt_item_${Date.now()}`,
            youtubeId: '',
            title: 'Novo Vídeo',
            description: '',
            autoplay: false,
            loop: false,
        };
        handleModuleConfigChange(module.id, { videos: [...currentVideos, newVideo] });
    };

    const handleRemoveVideo = (idToRemove: string) => {
        const updatedVideos = currentVideos.filter(video => video.id !== idToRemove);
        handleModuleConfigChange(module.id, { videos: updatedVideos });
    };

    const handleVideoItemChange = (id: string, key: keyof YoutubeVideoItem, value: any) => {
        const updatedVideos = currentVideos.map(video =>
            video.id === id ? { ...video, [key]: value } : video
        );
        handleModuleConfigChange(module.id, { videos: updatedVideos });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}>
            <button onClick={goBackFromModuleConfig} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                <FaArrowLeft size={14} /> Voltar aos Módulos da Página Inicial
            </button>
            <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Configurar Vídeos do YouTube: {module.fullLabel || module.label}</h3>
            <p style={{ fontSize: '0.85rem', color: '#777', fontFamily: 'Poppins, sans-serif' }}>
                Adicione os IDs dos vídeos do YouTube que deseja exibir em sua loja.
            </p>

            <TextField
                label="Título da Seção de Vídeos:"
                value={module.config?.title ?? ''}
                onChange={(val) => handleModuleConfigChange(module.id, { title: val })}
                placeholder="Ex: Nossos Vídeos Destaque"
            />

            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Vídeos ({currentVideos.length} no total)</h4>

                {currentVideos.map((video, index) => (
                    <div key={video.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px', marginBottom: '15px', backgroundColor: '#fdfdfd', position: 'relative' }}>
                        <h5 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>Vídeo #{index + 1}</h5>

                        {currentVideos.length > 1 && (
                            <button
                                onClick={() => handleRemoveVideo(video.id)}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: '#dc3545',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    zIndex: 1,
                                }}
                                title="Remover este vídeo"
                            >
                                <FaTrash size={12} />
                            </button>
                        )}

                        <TextField
                            label="ID do Vídeo do YouTube:"
                            value={video.youtubeId ?? ''}
                            onChange={(val) => handleVideoItemChange(video.id, 'youtubeId', val)}
                            placeholder="Ex: dQw4w9WgXcQ (somente o ID)"
                            description="Você encontra o ID no final do link do YouTube (depois de 'v=')"
                        />
                        <TextField
                            label="Título do Vídeo (opcional):"
                            value={video.title ?? ''}
                            onChange={(val) => handleVideoItemChange(video.id, 'title', val)}
                            placeholder="Título para o vídeo"
                        />
                        <TextareaField
                            label="Descrição do Vídeo (opcional):"
                            value={video.description ?? ''}
                            onChange={(val) => handleVideoItemChange(video.id, 'description', val)}
                            placeholder="Uma breve descrição sobre o vídeo."
                            minHeight="38px"
                            maxHeight="80px"
                        />
                        <CheckboxField
                            label="Reproduzir automaticamente?"
                            checked={video.autoplay ?? false}
                            onChange={(val) => handleVideoItemChange(video.id, 'autoplay', val)}
                        />
                        <CheckboxField
                            label="Reproduzir em loop?"
                            checked={video.loop ?? false}
                            onChange={(val) => handleVideoItemChange(video.id, 'loop', val)}
                        />
                    </div>
                ))}

                <button
                    onClick={handleAddVideo}
                    style={{
                        background: '#007bff',
                        color: '#fff',
                        border: 'none',
                        padding: '0.75rem 1.2rem',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 'normal',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontFamily: 'Poppins, sans-serif',
                        width: 'fit-content',
                        margin: '15px auto 0 auto'
                    }}
                >
                    <FaPlus size={14} /> Adicionar Novo Vídeo
                </button>
            </div>

            <button
                onClick={goBackFromModuleConfig}
                style={{
                    background: '#007bff',
                    color: '#fff',
                    border: 'none',
                    padding: '1rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    marginTop: '20px',
                    fontFamily: 'Poppins, sans-serif'
                }}
            >
                Voltar
            </button>
        </div>
    );
};

export default YoutubeVideoConfig;