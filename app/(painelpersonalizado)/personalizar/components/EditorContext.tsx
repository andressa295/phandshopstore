// app\(painelpersonalizado)\personalizar\components\EditorContext.tsx (CORRIGIDO: INICIALIZAÇÃO DE TEMA E CONTEXTO COMPLETO)
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { TEMPLATES } from '../templates'; // Suas bases de tema

// Importar TODAS as interfaces do arquivo types/Tema.ts
import type { 
    Tema, HomePageModule, HomePageModuleConfig, BannerItem, TestimonialItem, YoutubeVideoItem, InfoItem, ContactConfig,
    CoresTema, TipografiaTema // Importar também sub-interfaces se usadas separadamente
} from '../../../../types/Tema'; // <<< AJUSTE O CAMINHO AQUI PARA SEU TYPES/TEMA.TS


interface EditorContextType {
    tema: Tema;
    setTema: React.Dispatch<React.SetStateAction<Tema>>;
    
    // Funções de manipulação do tema (passadas para o contexto)
    handleTemaChange: (key: keyof Tema, value: any) => void;
    handleNestedTemaChange: (parentKey: keyof Tema, subKey: string, value: any) => void;
    saveTheme: (theme: Tema) => void; // Função para salvar o tema no backend/localStorage

    // Propriedades de estado do UI da personalização (expostas pelo contexto)
    previewMode: 'desktop' | 'mobile';
    setPreviewMode: React.Dispatch<React.SetStateAction<'desktop' | 'mobile'>>;
    activeScreenKey: string;
    setActiveScreenKey: React.Dispatch<React.SetStateAction<string>>;
    editingModuleId: string | null;
    setEditingModuleId: React.Dispatch<React.SetStateAction<string | null>>;
    currentSidebarScreen: 'mainMenu' | 'modulesList' | 'moduleConfig' | 'settings'; // CORRIGIDO: Inclui 'mainMenu'
    setCurrentSidebarScreen: React.Dispatch<React.SetStateAction<'mainMenu' | 'modulesList' | 'moduleConfig' | 'settings'>>; // CORRIGIDO: Inclui 'mainMenu'
    
    // NOVO: Adicionado para gerenciar o estado de abertura dos menus na sidebar do personalizador
    openSidebarSections: Record<string, boolean>;
    setOpenSidebarSections: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

interface EditorProviderProps {
    children: ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {

    const getInitialContactConfig = (): ContactConfig => {
        if (typeof window !== 'undefined') {
            const storedContactConfig = localStorage.getItem('contactConfig');
            return storedContactConfig ? JSON.parse(storedContactConfig) : {
                nomeEmpresa: 'Minha Loja (Default)', cnpj: '', telefoneGeral: '', emailGeral: '',
                cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '',
                mostrarPaginaContato: false, tituloPaginaContato: '', mensagemPaginaContato: '', mostrarFormularioNaPagina: false,
                instagramUrl: '', facebookUrl: '', whatsappNumero: '', linkedinUrl: '', youtubeUrl: '', mapaUrl: '', horarioAtendimento: '', complemento: '',
            };
        }
        return {} as ContactConfig;
    };

    // Estados que serão compartilhados via contexto (e inicializados para evitar hidratação)
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [activeScreenKey, setActiveScreenKey] = useState<string>('mainMenu'); // CORRIGIDO: Default é 'mainMenu'
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
    const [currentSidebarScreen, setCurrentSidebarScreen] = useState<'mainMenu' | 'modulesList' | 'moduleConfig' | 'settings'>('mainMenu'); // CORRIGIDO: 'mainMenu' é o default
    const [openSidebarSections, setOpenSidebarSections] = useState<Record<string, boolean>>({}); // NOVO: Estado para menus da sidebar

    // Estado Tema (Inicialização Robustecida para evitar problemas de hidratação)
    const [tema, setTema] = useState<Tema>(() => {
        if (typeof window !== 'undefined') {
            const storedTema = localStorage.getItem('temaConfig');
            if (storedTema) {
                const loadedTema: Tema = JSON.parse(storedTema);
                // Mescla as configurações de contato (que podem ter sido salvas separadamente)
                loadedTema.infoContato = getInitialContactConfig(); 

                // Garante que as propriedades de UI do tema (previewMode, etc.) sejam inicializadas
                // ou carregadas se existirem no tema salvo, evitando undefined.
                loadedTema.previewMode = loadedTema.previewMode || previewMode;
                loadedTema.activeScreenKey = loadedTema.activeScreenKey || activeScreenKey;
                loadedTema.editingModuleId = loadedTema.editingModuleId || editingModuleId;
                loadedTema.currentSidebarScreen = loadedTema.currentSidebarScreen || currentSidebarScreen;

                return loadedTema;
            }
        }
        // Fallback para SSR ou primeira carga sem localStorage
        const defaultTema = TEMPLATES['Velvete']; // CRÍTICO: TEMPLATES['Velvete'] DEVE SER Tema
        const initialContactConfig = getInitialContactConfig();
        return {
            ...defaultTema,
            infoContato: initialContactConfig,
            previewMode: 'desktop',
            activeScreenKey: 'mainMenu', // Corrigido aqui também
            editingModuleId: null,
            currentSidebarScreen: 'mainMenu', // Corrigido aqui também
        } as Tema;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('temaConfig', JSON.stringify(tema));
            // Salva as configurações de contato separadamente também para consistência
            if (tema.infoContato) {
                localStorage.setItem('contactConfig', JSON.stringify(tema.infoContato));
            }
        }
    }, [tema]);

    const handleTemaChange = (key: keyof Tema, value: any) => {
        setTema(prevTema => ({
            ...prevTema,
            [key]: value
        }));
    };

    const handleNestedTemaChange = (parentKey: keyof Tema, subKey: string, value: any) => {
        setTema(prevTema => ({
            ...prevTema,
            [parentKey]: {
                ...(prevTema[parentKey] as any),
                [subKey]: value
            }
        }));
    };

    const saveTheme = (theme: Tema) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('temaConfig', JSON.stringify(theme));
            alert('Tema salvo com sucesso! (Simulado)');
        }
    };


    const contextValue: EditorContextType = {
        tema,
        setTema,
        handleTemaChange,
        handleNestedTemaChange,
        saveTheme,
        previewMode,
        setPreviewMode,
        activeScreenKey,
        setActiveScreenKey,
        editingModuleId,
        setEditingModuleId,
        currentSidebarScreen,
        setCurrentSidebarScreen,
        openSidebarSections, // NOVO: Expondo o estado dos menus
        setOpenSidebarSections, // NOVO: Expondo o setter dos menus
    };

    return (
        <EditorContext.Provider value={contextValue}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
};