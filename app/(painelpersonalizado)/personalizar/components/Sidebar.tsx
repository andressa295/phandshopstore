// Sidebar.tsx
'use client';

import React, { useState } from 'react';
import { useEditor, Tema, HomePageModule } from './EditorContext';
import { FaArrowLeft } from 'react-icons/fa';

import MainMenuScreen from './screens/MainMenuScreen';
import ColorsScreen from './screens/ColorsScreen';
import FontsScreen from './screens/FontsScreen';
import DesignerTypeScreen from './screens/DesignerTypeScreen';
import ProductListScreen from './screens/ProductListScreen';
import AnnouncementBarScreen from './screens/AnnouncementBarScreen';
import ShoppingCartScreen from './screens/ShoppingCartScreen';
import FooterScreen from './screens/FooterScreen';
import AdvancedCssScreen from './screens/AdvancedCssScreen';
import HomePageModulesListScreen from './screens/HomePageModulesListScreen';
import ModuleConfigScreenWrapper from './screens/ModuleConfigScreenWrapper';
import ProductDetailScreen from './screens/ProductDetailScreen';

import { personalizacaoMenuItems } from './utils/constants';

interface SidebarProps {
    activeScreenKey: string;
    setActiveScreenKey: (key: string) => void;
}

export default function Sidebar({ activeScreenKey, setActiveScreenKey }: SidebarProps) {
    const { tema, setTema, saveTheme } = useEditor();

    const [currentSidebarScreen, setCurrentSidebarScreen] = useState<string>('mainMenu');
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const handleTemaChange = (key: keyof Tema, value: any) => {
        setTema((prevTema: Tema) => ({
            ...prevTema,
            [key]: value
        }));
    };

    const handleNestedTemaChange = (parentKey: keyof Tema, subKey: string, value: any) => {
        setTema((prevTema: Tema) => ({
            ...prevTema,
            [parentKey]: {
                ...(prevTema[parentKey] as any),
                [subKey]: value
            }
        }));
    };

    const handleModuleConfigChange = (moduleId: string, newConfig: Partial<HomePageModule['config']>) => {
        setTema((prevTema: Tema) => ({
            ...prevTema,
            homePageModules: prevTema.homePageModules.map((module: HomePageModule) =>
                module.id === moduleId
                    ? { ...module, config: { ...(module.config || {}), ...newConfig } as HomePageModule['config'] }
                    : module
            )
        }));
    };

    const navigateToScreen = (screenKey: string) => {
        setCurrentSidebarScreen(screenKey);
        setActiveScreenKey(screenKey);
        setOpenMenus({});
        setEditingModuleId(null);
    };

    const goBackToMainMenu = () => {
        setCurrentSidebarScreen('mainMenu');
        setActiveScreenKey('mainMenu');
        setEditingModuleId(null);
    };

    const goBackFromModuleConfig = () => {
        setEditingModuleId(null);
        setCurrentSidebarScreen('HomePageModulesList');
        setActiveScreenKey('HomePageModulesList');
    };

    const renderScreenContent = () => {
        const screenContentPadding: React.CSSProperties = {
            padding: '0 15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            boxSizing: 'border-box',
        };

        const renderScreenWithOptionalHeader = (
            title: string,
            ScreenComponent: React.ElementType,
            screenProps: any,
            showBackButton: boolean = true,
            backAction: () => void = goBackToMainMenu,
            backButtonLabel: string = 'Voltar ao Menu Principal'
        ) => {
            return (
                <>
                    {showBackButton && (
                        <div style={{
                            background: '#ffffff',
                            padding: '15px',
                            borderBottom: '1px solid #eee',
                            flexShrink: 0,
                            boxSizing: 'border-box',
                        }}>
                            <button onClick={backAction} style={{
                                background: 'none',
                                border: 'none',
                                color: '#333',
                                cursor: 'pointer',
                                textAlign: 'left',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: 'bold',
                                fontFamily: 'Poppins, sans-serif',
                                padding: '0',
                                marginBottom: '10px',
                            }}>
                                <FaArrowLeft size={14} /> {backButtonLabel}
                            </button>
                            <h3 style={{ color: '#333', fontSize: '1.1rem', margin: '0', fontFamily: 'Poppins, sans-serif' }}>
                                {title}
                            </h3>
                        </div>
                    )}
                    <div style={screenContentPadding}>
                        <ScreenComponent {...screenProps} />
                    </div>
                </>
            );
        };

        if (editingModuleId) {
            const moduleToEdit = tema.homePageModules.find((m: HomePageModule) => m.id === editingModuleId);
            if (moduleToEdit) {
                return renderScreenWithOptionalHeader(
                    `Configurar: ${moduleToEdit.fullLabel || moduleToEdit.label}`,
                    ModuleConfigScreenWrapper,
                    {
                        module: moduleToEdit,
                        goBack: goBackFromModuleConfig,
                        handleModuleConfigChange,
                        tema, setTema, handleTemaChange, handleNestedTemaChange
                    },
                    true,
                    goBackFromModuleConfig,
                    'Voltar aos Módulos da Página Inicial'
                );
            }
        }

        switch (currentSidebarScreen) {
            case 'mainMenu':
                return (
                    <MainMenuScreen
                        personalizacaoMenuItems={personalizacaoMenuItems}
                        activeScreenKey={activeScreenKey}
                        navigateToScreen={navigateToScreen}
                        openMenus={openMenus}
                        setOpenMenus={setOpenMenus}
                    />
                );
            case 'HomePageModulesList':
                return renderScreenWithOptionalHeader(
                    'Módulos da Página Inicial',
                    HomePageModulesListScreen,
                    {
                        homePageModules: tema.homePageModules,
                        goBackToMainMenu,
                        setEditingModuleId,
                        setCurrentSidebarScreen,
                        setActiveScreenKey,
                        setTema,
                        activeScreenKey
                    }
                );
            case 'CoresUnificadas':
                return renderScreenWithOptionalHeader('Cores Unificadas', ColorsScreen, { tema, handleTemaChange, goBackToMainMenu });
            case 'FontesPrincipais':
                return renderScreenWithOptionalHeader('Fontes Principais', FontsScreen, { tema, handleTemaChange, goBackToMainMenu });
            case 'TipoDesigner':
                return renderScreenWithOptionalHeader('Tipo de Designer', DesignerTypeScreen, { tema, handleTemaChange, goBackToMainMenu });
            case 'ListaProdutos':
                return renderScreenWithOptionalHeader('Lista de Produtos', ProductListScreen, { tema, handleTemaChange, goBackToMainMenu });
            case 'DetalhesProduto':
                return renderScreenWithOptionalHeader('Detalhes do Produto', ProductDetailScreen, { tema, handleTemaChange, goBackToMainMenu });
            case 'BarraAnuncio':
                return renderScreenWithOptionalHeader('Barra de Anúncio', AnnouncementBarScreen, { tema, handleTemaChange, goBackToMainMenu });
            case 'CarrinhoCompras':
                return renderScreenWithOptionalHeader('Carrinho de Compras', ShoppingCartScreen, { tema, handleTemaChange, goBackToMainMenu });
            case 'RodapePagina':
                return renderScreenWithOptionalHeader('Rodapé da Página', FooterScreen, { tema, handleTemaChange, handleNestedTemaChange, goBackToMainMenu });
            case 'AdvancedCssEditor':
                return renderScreenWithOptionalHeader('CSS Avançado', AdvancedCssScreen, { tema, handleTemaChange, goBackToMainMenu });
            default:
                return renderScreenWithOptionalHeader(
                    'Tela de Configuração Não Encontrada',
                    () => <p style={{ fontFamily: 'Poppins, sans-serif' }}>O tópico '{currentSidebarScreen}' não possui uma tela de configuração associada ou o módulo não foi encontrado.</p>,
                    {},
                    true,
                    goBackToMainMenu,
                    'Voltar ao Menu Principal'
                );
        }
    };

    return (
        <aside style={{
            minWidth: '380px',
            maxWidth: '420px',
            backgroundColor: '#fff',
            boxSizing: 'border-box',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            fontFamily: 'Poppins, sans-serif',
            overflowX: 'hidden',
        }}>
            {/* Cabeçalho fixo */}
            <div style={{
                background: '#ffffff',
                padding: '15px',
                borderBottom: '1px solid #eee',
                flexShrink: 0,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Personalização</h2>
            </div>

            {/* Conteúdo com rolagem */}
            <div style={{
                flexGrow: 1,
                minHeight: 0, // ESSENCIAL pra rolagem funcionar
                overflowY: 'auto',
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}>
                {renderScreenContent()}
            </div>

            {/* Rodapé fixo */}
            <div style={{
                padding: '15px',
                borderTop: '1px solid #eee',
                backgroundColor: '#fff',
                display: 'flex',
                gap: '8px',
                justifyContent: 'space-between',
                flexShrink: 0,
                boxSizing: 'border-box',
            }}>
                <button
                    onClick={() => { console.log("Salvar como rascunho", tema); alert("Tema salvo como rascunho! (Simulado)"); }}
                    style={{
                        flex: 1,
                        background: '#6c757d',
                        color: '#fff',
                        border: 'none',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 'normal',
                        fontFamily: 'Poppins, sans-serif'
                    }}
                >
                    Rascunho
                </button>
                <button
                    onClick={() => saveTheme(tema)}
                    style={{
                        flex: 1,
                        background: '#007bff',
                        color: '#fff',
                        border: 'none',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        fontFamily: 'Poppins, sans-serif'
                    }}
                >
                    Publicar
                </button>
            </div>
        </aside>
    );
}
