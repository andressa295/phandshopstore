// app\(editorpainel)\personalizar\components\Sidebar.tsx
'use client'; 

import React, { useState, ReactNode, Fragment, isValidElement, useEffect } from 'react'; 
import { 
    FaChevronDown, FaChevronUp, FaArrowLeft, 
    FaBars, FaEye, 
    FaHome, FaChartBar, FaBoxOpen, FaUsers, FaTags, FaBullhorn, FaShoppingCart, FaStore, FaStar,
    FaShippingFast, FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaSyncAlt, 
    FaShieldAlt, FaWhatsapp, FaTag 
} from 'react-icons/fa';
// IMPORTAÇÕES DE ÍCONES PARA renderIconFromString e uso geral
import { MdSettings, MdCloudUpload, MdImage, MdViewCarousel, MdFormatSize, MdLink, MdStar as MdStarIcon, MdMessage, MdMail, MdShare, MdSettingsApplications, MdCode, MdPalette, MdMenu, MdContactMail, MdRssFeed, MdPayment } from 'react-icons/md'; 

import { useEditor, CoresTema, TipografiaTema, Tema, HomePageModule } from './EditorContext';

import ProductSectionConfig from './module-configs/ProductSectionConfig';
import CategoryGridConfig from './module-configs/CategoryGridConfig'; // <-- NOVO: Importe o componente de configuração de grade de categorias

// --- Lista de Fontes Seguras para Web ---
const webSafeFonts = [
    'Poppins, sans-serif', // <-- ADICIONADA AQUI (e você pode adicionar mais do Google Fonts)
    'Arial, sans-serif',
    'Verdana, sans-serif',
    'Helvetica, sans-serif',
    'Times New Roman, serif',
    'Courier New, monospace',
    'Lucida Console, monospace',
    'Impact, sans-serif',
    'Palatino Linotype, Book Antiqua, Palatino, serif',
    'Trebuchet MS, Helvetica, sans-serif',
    'Roboto, sans-serif',
    'Open Sans, sans-serif', 
    'Lato, sans-serif',
    'Montserrat, sans-serif',
];

// Array para gerar as opções de tamanho de fonte de 10px a 18px (DECLARADA APENAS UMA VEZ AQUI)
const fontSizeOptions = Array.from({ length: 9 }, (_, i) => 10 + i);

type PersonalizacaoMenuChild = {
    label: string;
    screenKey: string; 
};

type PersonalizacaoMenuItem = {
    icon?: React.ReactNode; 
    label: string;
    screenKey?: string; 
    children?: PersonalizacaoMenuChild[]; 
};

const personalizacaoMenuItems: PersonalizacaoMenuItem[] = [
    { 
        icon: <MdPalette />, label: 'Cores', screenKey: 'CoresUnificadas' 
    },
    { 
        icon: <MdFormatSize />, label: 'Fontes', screenKey: 'FontesPrincipais' 
    },
    { 
        icon: <FaHome />, label: 'Página inicial', screenKey: 'HomePageModulesList' 
    },
    { 
        icon: <MdSettingsApplications />, label: 'Tipo de Designer', screenKey: 'TipoDesigner' 
    },
    { 
        icon: <FaBullhorn />, label: 'Barra de Anúncio', screenKey: 'BarraAnuncio' 
    },
    { 
        icon: <FaBoxOpen />, label: 'Lista de Produtos', screenKey: 'ListaProdutos' 
    },
    { 
        icon: <FaStore />, label: 'Detalhe do Produto', screenKey: 'DetalheProduto' 
    },
    { 
        icon: <FaShoppingCart />, label: 'Carrinho de Compras', screenKey: 'CarrinhoCompras' 
    },
    { 
        icon: <MdSettingsApplications />, label: 'Rodapé da Página', screenKey: 'RodapePagina' 
    },
    { 
        icon: <MdCode />, label: 'Edição de CSS Avançada', screenKey: 'AdvancedCssEditor' 
    },
];

interface SidebarProps {
    activeScreenKey: string; 
    setActiveScreenKey: (key: string) => void; 
}

export default function Sidebar({ activeScreenKey, setActiveScreenKey }: SidebarProps) {
    const { tema, setTema, saveTheme } = useEditor(); 
    
    // homePageModules agora vem do tema do contexto
    const homePageModules = tema.homePageModules;
    
    const [currentSidebarScreen, setCurrentSidebarScreen] = useState<string>('mainMenu'); 
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({}); 

    // Funções de atualização para o tema (tipadas e imutáveis corretamente)
    const handleColorChange = (key: keyof CoresTema, value: string) => {
        setTema((prevTema: Tema) => ({ 
            ...prevTema,
            cores: {
                ...prevTema.cores, 
                [key]: value
            }
        }));
    };

    const handleTipografiaChange = (key: keyof TipografiaTema, value: string) => {
        setTema((prevTema: Tema) => ({ 
            ...prevTema,
            tipografia: {
                ...prevTema.tipografia,
                [key]: value
            }
        }));
    };

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

    // handleModuleConfigChange para atualizar a configuração de um MÓDULO da homePageModules
    // AGORA ATUALIZA O TEMA DIRETAMENTE
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

    // toggleModuleVisibility agora atualiza o Tema
    const toggleModuleVisibility = (moduleId: string) => {
        setTema((prevTema: Tema) => ({
            ...prevTema,
            homePageModules: prevTema.homePageModules.map((module: HomePageModule) =>
                module.id === moduleId ? { ...module, isVisible: !module.isVisible } : module
            )
        }));
    };

    // ColorPickerField - Sem alterações
    const ColorPickerField: React.FC<{
        label: string;
        description: string;
        value: string;
        themeKey: keyof Tema | keyof CoresTema; 
        isCoreThemeColor?: boolean; 
    }> = ({ label, description, value, themeKey, isCoreThemeColor = false }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            if (isCoreThemeColor) {
                handleColorChange(themeKey as keyof CoresTema, newValue);
            } else {
                handleTemaChange(themeKey as keyof Tema, newValue);
            }
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

    const infoIconMap: Record<string, ReactNode> = {
        seguranca: <FaShieldAlt size={16} />, 
        trocasDevolucoes: <FaSyncAlt size={16} />,
        entregas: <FaShippingFast size={16} />,
        dinheiro: <FaMoneyBillWave size={16} />,
        cartaoCredito: <FaCreditCard size={16} />,
        promocoes: <FaTag size={16} />, 
        whatsapp: <FaWhatsapp size={16} />, 
        imagemPropria: null 
    };

    const applyAdvancedCss = () => {
        let styleTag = document.getElementById('advanced-css-style') as HTMLStyleElement;
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'advanced-css-style';
            document.head.appendChild(styleTag);
        }
        styleTag.textContent = tema.advancedCss || '';
    };

    // Função auxiliar para mapear strings de ícones para componentes React.ReactNode (para HomePageModule.icon)
    const renderIconFromString = (iconString: string, size: number = 14, color?: string): React.ReactNode => {
    const style = { fontSize: size, color: color };
    switch (iconString) {
        case 'MdImage': return <MdImage style={style} />;
        case 'FaStar': return <FaStar style={style} />;
        case 'MdViewCarousel': return <MdViewCarousel style={style} />;
        case 'FaBoxOpen': return <FaBoxOpen style={style} />; // Atenção: Confirme se quer FaBoxOpen ou FaBox
        case 'MdMail': return <MdMail style={style} />;
        case 'MdSettingsApplications': return <MdSettingsApplications style={style} />;
        case 'MdMessage': return <MdMessage style={style} />;
        // Adicione aqui outros ícones que você referenciou em HomePageModule['icon']
        default: return null; 
    }
};

    // Renderiza a tela de configuração de um Módulo específico (interna na sidebar)
    const renderModuleConfigScreen = (module: HomePageModule) => {
        const commonModuleConfigProps = {
            module,
            tema,
            setTema,
            handleTemaChange,
            handleModuleConfigChange,
            goBackFromModuleConfig,
        };

        switch (module.type) {
            case 'product_section':
                return <ProductSectionConfig {...commonModuleConfigProps} />;
            case 'category_grid': // NOVO CASE PARA CATEGORY_GRID
                return <CategoryGridConfig {...commonModuleConfigProps} />;
            case 'banner':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px' }}>
                        <button onClick={goBackFromModuleConfig} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                            <FaArrowLeft size={14} /> Voltar aos Módulos da Página Inicial
                        </button>
                        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Configurar Banners: {module.fullLabel || module.label}</h3>
                        <p style={{ fontSize: '0.85rem', color: '#777', fontFamily: 'Poppins, sans-serif' }}>
                            Controles específicos para Banners (upload de imagem, link, etc.)
                        </p>
                        {/* Campos de configuração para Banners */}
                        <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Título do Banner:</label>
                        <input
                            type="text"
                            value={module.config?.title || ''}
                            onChange={(e) => handleModuleConfigChange(module.id, { title: e.target.value })}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', marginBottom: '10px' }}
                            placeholder="Título do seu banner"
                        />
                        <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>URL do Banner Desktop:</label>
                        <input
                            type="text"
                            value={tema.bannerDesktopUrl || ''} 
                            onChange={(e) => handleTemaChange('bannerDesktopUrl', e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', marginBottom: '10px' }}
                            placeholder="https://sua-loja.com/banner-desktop.jpg"
                        />
                         <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>URL do Banner Mobile:</label>
                        <input
                            type="text"
                            value={tema.bannerMobileUrl || ''}
                            onChange={(e) => handleTemaChange('bannerMobileUrl', e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', marginBottom: '10px' }}
                            placeholder="https://sua-loja.com/banner-mobile.jpg"
                        />
                         <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Link do Banner:</label>
                        <input
                            type="text"
                            value={tema.bannerLink || ''}
                            onChange={(e) => handleTemaChange('bannerLink', e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', marginBottom: '10px' }}
                            placeholder="https://sua-loja.com/promocao"
                        />
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
                                marginTop: 'auto',
                                fontFamily: 'Poppins, sans-serif' 
                            }}
                        >
                            Voltar
                        </button>
                    </div>
                );
            case 'text':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px' }}>
                        <button onClick={goBackFromModuleConfig} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                            <FaArrowLeft size={14} /> Voltar aos Módulos da Página Inicial
                        </button>
                        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Configurar Texto: {module.fullLabel || module.label}</h3>
                        <p style={{ fontSize: '0.85rem', color: '#777', fontFamily: 'Poppins, sans-serif' }}>
                            Controles para Módulo de Texto (editor de texto, etc.)
                        </p>
                        {/* Campos de configuração para Texto */}
                        <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Título da Seção:</label>
                        <input
                            type="text"
                            value={module.config?.title || ''}
                            onChange={(e) => handleModuleConfigChange(module.id, { title: e.target.value })}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', marginBottom: '10px' }}
                            placeholder="Título da sua seção de texto"
                        />
                         <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Conteúdo do Texto:</label>
                        <textarea
                            value={module.config?.text || ''} 
                            onChange={(e) => handleModuleConfigChange(module.id, { text: e.target.value })}
                            style={{ width: '100%', height: '100px', minHeight: '50px', maxHeight: '200px', resize: 'vertical', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }}
                            placeholder="Seu texto de boas vindas ou institucional."
                        />
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
                                marginTop: 'auto',
                                fontFamily: 'Poppins, sans-serif' 
                            }}
                        >
                            Voltar
                        </button>
                    </div>
                );
            case 'social':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px' }}>
                        <button onClick={goBackFromModuleConfig} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                            <FaArrowLeft size={14} /> Voltar aos Módulos da Página Inicial
                        </button>
                        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Configurar Social: {module.fullLabel || module.label}</h3>
                        <p style={{ fontSize: '0.85rem', color: '#777', fontFamily: 'Poppins, sans-serif' }}>
                            Configurações de Redes Sociais (integração Instagram API).
                        </p>
                        {/* Campos de configuração para Social */}
                        <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Link do Instagram:</label>
                        <input
                            type="text"
                            value={tema.redesSociaisLinks?.instagram || ''}
                            onChange={(e) => handleNestedTemaChange('redesSociaisLinks', 'instagram', e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', marginBottom: '10px' }}
                            placeholder="https://instagram.com/sua_loja"
                        />
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
                                marginTop: 'auto',
                                fontFamily: 'Poppins, sans-serif' 
                            }}
                        >
                            Voltar
                        </button>
                    </div>
                );
            case 'newsletter':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px' }}>
                        <button onClick={goBackFromModuleConfig} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                            <FaArrowLeft size={14} /> Voltar aos Módulos da Página Inicial
                        </button>
                        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Configurar Newsletter: {module.fullLabel || module.label}</h3>
                        <p style={{ fontSize: '0.85rem', color: '#777', fontFamily: 'Poppins, sans-serif' }}>
                            Controles para Módulo de Newsletter (texto de chamada, integração).
                        </p>
                        {/* Campos de configuração para Newsletter */}
                        <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Texto de Chamada:</label>
                        <textarea
                            value={tema.newsletterTexto || ''}
                            onChange={(e) => handleTemaChange('newsletterTexto', e.target.value)}
                            style={{ width: '100%', height: '80px', minHeight: '50px', maxHeight: '150px', resize: 'vertical', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', marginBottom: '10px' }}
                            placeholder="Receba nossas novidades e promoções!"
                        />
                         <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Placeholder do Campo de Email:</label>
                        <input
                            type="text"
                            value={tema.newsletterPlaceholder || ''}
                            onChange={(e) => handleTemaChange('newsletterPlaceholder', e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', marginBottom: '10px' }}
                            placeholder="Digite seu e-mail aqui"
                        />
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
                                marginTop: 'auto',
                                fontFamily: 'Poppins, sans-serif' 
                            }}
                        >
                            Voltar
                        </button>
                    </div>
                );
            case 'info':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px' }}>
                        <button onClick={goBackFromModuleConfig} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                            <FaArrowLeft size={14} /> Voltar aos Módulos da Página Inicial
                        </button>
                        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Configurar Informações: {module.fullLabel || module.label}</h3>
                        <p style={{ fontSize: '0.85rem', color: '#777', fontFamily: 'Poppins, sans-serif' }}>
                            Informações e Módulos Diversos (texto, links, imagens).
                        </p>
                        {/* Campos de configuração para Info */}
                        <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Título da Seção:</label>
                        <input
                            type="text"
                            value={module.config?.title || ''} 
                            onChange={(e) => handleModuleConfigChange(module.id, { title: e.target.value })}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', marginBottom: '10px' }}
                            placeholder="Título da seção de informações"
                        />
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
                                marginTop: 'auto',
                                fontFamily: 'Poppins, sans-serif' 
                            }}
                        >
                            Voltar
                        </button>
                    </div>
                );
            default: // Módulo desconhecido ou sem tela de configuração específica
                const currentModule = homePageModules.find((m: HomePageModule) => m.id === currentSidebarScreen);
                if (currentModule) {
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px' }}> 
                            <button onClick={goBackFromModuleConfig} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                                <FaArrowLeft size={14} /> Voltar aos Módulos da Página Inicial
                            </button>
                            <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Configurar: {currentModule.fullLabel || currentModule.label}</h3>
                            <p style={{ fontFamily: 'Poppins, sans-serif' }}>Este tipo de módulo ({currentModule.type}) ainda não possui uma tela de configuração detalhada.</p>
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
                                    marginTop: 'auto',
                                    fontFamily: 'Poppins, sans-serif' 
                                }}
                            >
                                Voltar
                            </button>
                        </div>
                    );
                }
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}> 
                        <button onClick={goBackToMainMenu} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                            <FaArrowLeft size={14} /> Voltar ao Menu Principal
                        </button>
                        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Tela de Configuração Não Encontrada</h3>
                        <p style={{ fontFamily: 'Poppins, sans-serif' }}>O tópico '{currentSidebarScreen}' não possui uma tela de configuração associada.</p> 
                        <button 
                            onClick={goBackToMainMenu}
                            style={{ 
                                background: '#007bff', 
                                color: '#fff', 
                                border: 'none', 
                                padding: '1rem', 
                                borderRadius: '5px', 
                                cursor: 'pointer', 
                                fontSize: '0.9rem', 
                                fontWeight: 'bold',
                                marginTop: 'auto',
                                fontFamily: 'Poppins, sans-serif' 
                            }}
                        >
                            Voltar ao Menu Principal
                        </button>
                    </div>
                );
        }
    };

    const fontSizeOptions = Array.from({ length: 9 }, (_, i) => 10 + i); 

    const renderMainContent = () => {
        if (editingModuleId) {
            const module = homePageModules.find((m: HomePageModule) => m.id === editingModuleId);
            if (module) {
                return renderModuleConfigScreen(module);
            }
        }

        switch (currentSidebarScreen) {
            case 'mainMenu':
                return (
                    <div style={{ padding: '15px', flexGrow: 1, overflowY: 'auto' }}>
                        <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#a0a0a0', fontFamily: 'Poppins, sans-serif' }}>IMAGEM DA SUA MARCA</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {personalizacaoMenuItems.map((item) => (
                                <li key={item.label} style={{ marginBottom: '8px' }}>
                                    {item.children ? (
                                        <Fragment>
                                            <div
                                                onClick={() => setOpenMenus((prev: Record<string, boolean>) => ({ ...prev, [item.label]: !prev[item.label] }))}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    fontWeight: 500,
                                                    color: '#333',
                                                    fontSize: '15px',
                                                    userSelect: 'none',
                                                    padding: '8px 10px',
                                                    cursor: 'pointer',
                                                    background: (activeScreenKey === item.screenKey) ? '#f0f0f0' : 'transparent',
                                                    borderRadius: '4px',
                                                    fontFamily: 'Poppins, sans-serif'
                                                }}
                                                aria-expanded={!!openMenus[item.label]}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        setOpenMenus((prev: Record<string, boolean>) => ({ ...prev, [item.label]: !prev[item.label] }));
                                                    }
                                                }}
                                            >
                                                {item.icon}
                                                <span>{item.label}</span>
                                                {openMenus[item.label]
                                                    ? <FaChevronUp size={12} style={{ marginLeft: 'auto' }} />
                                                    : <FaChevronDown size={12} style={{ marginLeft: 'auto' }} />}
                                            </div>
                                            {openMenus[item.label] && (
                                                <ul style={{ marginTop: '4px', paddingLeft: '0', listStyle: 'none' }}>
                                                    {item.children.map((child) => (
                                                        <li key={child.label} style={{ padding: '4px 0', fontSize: '14px' }}>
                                                            <div onClick={() => navigateToScreen(child.screenKey)}
                                                                style={{
                                                                    color: '#666',
                                                                    textDecoration: 'none',
                                                                    cursor: 'pointer',
                                                                    background: (activeScreenKey === child.screenKey) ? '#f0f0f0' : 'transparent',
                                                                    borderRadius: '4px',
                                                                    padding: '4px 10px',
                                                                    fontFamily: 'Poppins, sans-serif'
                                                                }}>
                                                                {child.label}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </Fragment>
                                    ) : (
                                        <div
                                            onClick={() => item.screenKey && navigateToScreen(item.screenKey)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                fontWeight: 500,
                                                color: '#333',
                                                fontSize: '15px',
                                                userSelect: 'none',
                                                padding: '8px 10px',
                                                cursor: 'pointer',
                                                background: (activeScreenKey === item.screenKey) ? '#f0f0f0' : 'transparent',
                                                borderRadius: '4px',
                                                fontFamily: 'Poppins, sans-serif'
                                            }}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                );

            case 'HomePageModulesList':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}>
                        <button onClick={goBackToMainMenu} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                            <FaArrowLeft size={14} /> Voltar ao Menu Principal
                        </button>
                        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Módulos da Página Inicial</h3>
                        <p style={{ fontSize: '0.75rem', color: '#777', lineHeight: '1.4', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>
                            Arraste e solte para reordenar (funcionalidade em desenvolvimento).
                            <br />
                            Clique no <FaEye size={10} style={{ verticalAlign: 'middle' }} /> para alternar visibilidade.
                            <br />
                            Clique no módulo para editar.
                        </p>

                        <div style={{ marginBottom: '0.8rem' }}>
                            <button
                                onClick={() => {
                                    // Adicionar novo módulo de produto
                                    const newProductSection: HomePageModule = {
                                        id: `produtos_personalizado_${Date.now()}`,
                                        label: `Nova Seção de Produtos`,
                                        fullLabel: `Nova Seção Personalizada de Produtos`,
                                        icon: 'FaBoxOpen', // Ícone como string
                                        type: 'product_section',
                                        isVisible: true,
                                        config: { title: 'Nova Seção de Produtos', layout: 'grid', productIds: [] }
                                    };
                                    setTema(prevTema => ({
                                        ...prevTema,
                                        homePageModules: [...prevTema.homePageModules, newProductSection]
                                    }));
                                    setEditingModuleId(newProductSection.id);
                                    setCurrentSidebarScreen(newProductSection.id);
                                    setActiveScreenKey(newProductSection.id);
                                }}
                                style={{
                                    background: '#28a745',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '0.75rem 1.2rem',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 'normal',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    maxWidth: 'fit-content',
                                    fontFamily: 'Poppins, sans-serif',
                                    marginRight: '10px' // Espaçamento entre botões
                                }}
                            >
                                <FaBoxOpen size={14} /> Add Seção de Produtos
                            </button>
                            <button
                                onClick={() => {
                                    // Adicionar novo módulo de categoria
                                    const newCategoryGrid: HomePageModule = {
                                        id: `categorias_personalizado_${Date.now()}`,
                                        label: `Nova Seção de Categorias`,
                                        fullLabel: `Nova Seção Personalizada de Categorias`,
                                        icon: 'MdViewCarousel', // Ícone como string
                                        type: 'category_grid',
                                        isVisible: true,
                                        config: { title: 'Nossas Categorias', categoryImages: [] }
                                    };
                                    setTema(prevTema => ({
                                        ...prevTema,
                                        homePageModules: [...prevTema.homePageModules, newCategoryGrid]
                                    }));
                                    setEditingModuleId(newCategoryGrid.id);
                                    setCurrentSidebarScreen(newCategoryGrid.id);
                                    setActiveScreenKey(newCategoryGrid.id);
                                }}
                                style={{
                                    background: '#007bff', 
                                    color: '#fff',
                                    border: 'none',
                                    padding: '0.75rem 1.2rem',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 'normal',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    maxWidth: 'fit-content',
                                    fontFamily: 'Poppins, sans-serif'
                                }}
                            >
                                <MdViewCarousel size={14} /> Add Seção de Categorias
                            </button>
                        </div>

                        <ul style={{ listStyle: 'none', padding: '0', margin: 0 }}>
                            {homePageModules.map((module: HomePageModule) => (
                                <li key={module.id} style={{ marginBottom: '8px' }}>
                                    <div
                                        onClick={() => {
                                            setEditingModuleId(module.id);
                                            setCurrentSidebarScreen(module.id);
                                            setActiveScreenKey(module.id);
                                        }}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px 10px',
                                            background: activeScreenKey === module.id ? '#e9ecef' : '#f8f8f8',
                                            borderRadius: '4px',
                                            border: '1px solid #ddd',
                                            cursor: 'pointer',
                                            minHeight: '40px'
                                        }}
                                        title={module.fullLabel || module.label}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1, fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif' }}>
                                            <FaBars size={14} style={{ color: '#aaa', cursor: 'grab', flexShrink: 0 }} />
                                            {renderIconFromString(module.icon, 14, '#333')} {/* Renderiza ícone a partir da string */}
                                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{module.label}</span>
                                        </span>
                                        <FaEye
                                            size={14}
                                            style={{ color: module.isVisible ? '#007bff' : '#ccc', cursor: 'pointer', flexShrink: 0 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleModuleVisibility(module.id);
                                            }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                );

            case 'CoresUnificadas':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}>
                        <button onClick={goBackToMainMenu} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                            <FaArrowLeft size={14} /> Voltar ao Menu Principal
                        </button>
                        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Cores da Marca e Elementos</h3>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Cores Principais da Marca</h4>
                            <ColorPickerField
                                label="Cor principal"
                                description="Aparece nos botões, no preço do produto e nos textos do rodapé."
                                value={tema.cores.primaria}
                                themeKey="primaria"
                                isCoreThemeColor={true}
                            />
                            <ColorPickerField
                                label="Cor secundária"
                                description="Aparece na barra de anúncio."
                                value={tema.cores.secundaria}
                                themeKey="secundaria"
                                isCoreThemeColor={true}
                            />
                            <ColorPickerField
                                label="Cor de destaque"
                                description="Aparece nas promoções e nas mensagens de desconto, frete grátis e parcelamento sem juros."
                                value={tema.cores.destaque}
                                themeKey="destaque"
                                isCoreThemeColor={true}
                            />
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Cores de Elementos Específicos</h4>
                            <ColorPickerField
                                label="Fundo do Cabeçalho"
                                description=""
                                value={tema.cores.headerBg}
                                themeKey="headerBg"
                                isCoreThemeColor={true}
                            />
                            <ColorPickerField
                                label="Cor do Texto do Cabeçalho"
                                description=""
                                value={tema.cores.headerText}
                                themeKey="headerText"
                                isCoreThemeColor={true}
                            />
                            <ColorPickerField
                                label="Fundo do Rodapé"
                                description=""
                                value={tema.cores.footerBg}
                                themeKey="footerBg"
                                isCoreThemeColor={true}
                            />
                            <ColorPickerField
                                label="Cor do Texto do Rodapé"
                                description=""
                                value={tema.cores.footerText}
                                themeKey="footerText"
                                isCoreThemeColor={true}
                            />
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Cores de contraste</h4>
                            <ColorPickerField
                                label="Cor de fundo"
                                description="" 
                                value={tema.cores.fundo}
                                themeKey="fundo"
                                isCoreThemeColor={true}
                            />
                            <ColorPickerField
                                label="Cor dos textos"
                                description="" 
                                value={tema.cores.texto}
                                themeKey="texto"
                                isCoreThemeColor={true}
                            />
                            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '-0.5rem', fontFamily: 'Poppins, sans-serif' }}>
                                Para facilitar a leitura, certifique-se de que as cores contrastem entre si.
                            </p>
                        </div>
                    </div>
                );

            case 'FontesPrincipais':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}>
                        <button onClick={goBackToMainMenu} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                            <FaArrowLeft size={14} /> Voltar ao Menu Principal
                        </button>
                        
                        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Fontes</h3> 

                        {/* Fonte do Título */}
                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}> 
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Fonte de Título</h4>
                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Família da Fonte:</label> 
                            <select value={tema.tipografia.titulo} onChange={(e) => handleTipografiaChange('titulo', e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', marginBottom: '10px', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }} > 
                                {webSafeFonts.map((font: string) => <option key={font} value={font}>{font}</option>)} 
                            </select>
                            
                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Peso da Fonte:</label> 
                            <select value={tema.tipografia.tituloPeso} onChange={(e) => handleTipografiaChange('tituloPeso', e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', marginBottom: '10px', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }} > 
                                <option value="normal">Normal</option>
                                <option value="bold">Negrito</option>
                            </select>

                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Tamanho da Fonte:</label> 
                            <select 
                                value={tema.tipografia.tituloTamanho} 
                                onChange={(e) => handleTipografiaChange('tituloTamanho', e.target.value)} 
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }} 
                            > 
                                {fontSizeOptions.map(size => (
                                    <option key={`title-${size}px`} value={`${size}px`}>{size}px</option>
                                ))}
                            </select>
                            <p style={{ fontFamily: tema.tipografia.titulo, fontWeight: tema.tipografia.tituloPeso, fontSize: tema.tipografia.tituloTamanho, marginTop: '15px', borderTop: '1px dashed #eee', paddingTop: '10px' }}>Exemplo de Título</p>
                        </div>

                        {/* Textos da Página */}
                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Textos da Página</h4>
                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Família da Fonte:</label> 
                            <select value={tema.tipografia.texto} onChange={(e) => handleTipografiaChange('texto', e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', marginBottom: '10px', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }} > 
                                {webSafeFonts.map((font: string) => <option key={font} value={font}>{font}</option>)} 
                            </select>
                            
                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Peso da Fonte:</label> 
                            <select value={tema.tipografia.textoPeso} onChange={(e) => handleTipografiaChange('textoPeso', e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', marginBottom: '10px', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }} > 
                                <option value="normal">Normal</option>
                                <option value="bold">Negrito</option>
                            </select>

                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Tamanho da Fonte:</label> 
                            <select 
                                value={tema.tipografia.textoTamanho} 
                                onChange={(e) => handleTipografiaChange('textoTamanho', e.target.value)} 
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }} 
                            > 
                                {fontSizeOptions.map(size => (
                                    <option key={`text-${size}px`} value={`${size}px`}>{size}px</option>
                                ))}
                            </select>
                            <p style={{ fontFamily: tema.tipografia.texto, fontWeight: tema.tipografia.textoPeso, fontSize: tema.tipografia.textoTamanho, marginTop: '15px', borderTop: '1px dashed #eee', paddingTop: '10px' }}>Exemplo de texto normal para o seu site.</p>
                        </div>
                    </div>
                );

            case 'TipoDesigner': 
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}>
                        <button onClick={goBackToMainMenu} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                            <FaArrowLeft size={14} /> Voltar ao Menu Principal
                        </button>
                        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Tipo de Designer</h3>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Logo</h4>
                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Tamanho do logo:</label>
                            <select 
                                value={tema.tamanhoLogo} 
                                onChange={(e) => handleTemaChange('tamanhoLogo', e.target.value)} 
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', marginBottom: '10px', fontFamily: 'Poppins, sans-serif', height: '38px', fontSize: '0.85rem' }}
                            >
                                <option value="pequeno">Pequeno</option>
                                <option value="medio">Médio</option>
                                <option value="grande">Grande</option>
                            </select>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Cabeçalho em celulares</h4>
                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Posição do logo:</label>
                            <select 
                                value={tema.posicaoLogoMobile} 
                                onChange={(e) => handleTemaChange('posicaoLogoMobile', e.target.value)} 
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', marginBottom: '10px', fontFamily: 'Poppins, sans-serif', height: '38px', fontSize: '0.85rem' }}
                            >
                                <option value="esquerda">Esquerda</option>
                                <option value="centralizado">Centralizado</option>
                            </select>
                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Estilo do cabeçalho:</label>
                            <select 
                                value={tema.estiloCabecalhoMobile} 
                                onChange={(e) => handleTemaChange('estiloCabecalhoMobile', e.target.value)} 
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', height: '38px', fontSize: '0.85rem' }}
                            >
                                <option value="menuBuscadorCarrinho">Menu, buscador e carrinho</option>
                                <option value="barraHorizontalCategorias">Barra horizontal de categorias</option>
                                <option value="barraPesquisaGrande">Barra de pesquisa grande</option>
                            </select>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Cabeçalho para computador</h4>
                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Posição do logo:</label>
                            <select 
                                value={tema.posicaoLogoDesktop} 
                                onChange={(e) => handleTemaChange('posicaoLogoDesktop', e.target.value)} 
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', marginBottom: '10px', fontFamily: 'Poppins, sans-serif', height: '38px', fontSize: '0.85rem' }}
                            >
                                <option value="esquerda">Esquerda</option>
                                <option value="centralizado">Centralizado</option>
                            </select>
                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Tamanho dos ícones:</label>
                            <select 
                                value={tema.estiloIconesDesktop} 
                                onChange={(e) => handleTemaChange('estiloIconesDesktop', e.target.value)} 
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', height: '38px', fontSize: '0.85rem' }}
                            >
                                <option value="pequeno">Pequeno</option>
                                <option value="grande">Grande</option>
                            </select>
                            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '10px', fontFamily: 'Poppins, sans-serif' }}>
                                Aplica-se a ícones de ajuda, conta e carrinho.
                            </p>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Borda</h4>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem', fontFamily: 'Poppins, sans-serif' }}>
                                Define a aparência geral das bordas, principalmente em fotos e banners.
                            </p>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.usarBordasArredondadas} 
                                    onChange={(e) => handleTemaChange('usarBordasArredondadas', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                />
                                Usar bordas arredondadas
                            </label>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Formatos dos botões</h4>
                            <select 
                                value={tema.formatoBotoes} 
                                onChange={(e) => handleTemaChange('formatoBotoes', e.target.value)} 
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', height: '38px', fontSize: '0.85rem' }}
                            >
                                <option value="quadrado">Quadrado</option>
                                <option value="oval">Oval</option>
                                <option value="redondo">Redondo</option> {/* <-- ADICIONADO AQUI */}
                            </select>
                        </div>
                    </div>
                );

            case 'ListaProdutos': 
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}> 
                        <button onClick={goBackToMainMenu} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                            <FaArrowLeft size={14} /> Voltar ao Menu Principal
                        </button>
                        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Lista de Produtos</h3>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Quantidade de produtos por linha</h4>
                            <select 
                                value={tema.quantidadeProdutosPorLinha} 
                                onChange={(e) => handleTemaChange('quantidadeProdutosPorLinha', e.target.value)} 
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', height: '38px', fontSize: '0.85rem' }}
                            >
                                <option value="1_cel_3_comp">1 no celular e 3 no computador</option>
                                <option value="2_cel_4_comp">2 no celular e 4 no computador</option>
                            </select>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Compra rápida</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.compraRapidaAtiva} 
                                    onChange={(e) => handleTemaChange('compraRapidaAtiva', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                />
                                Permitir que seus clientes possam agregar produtos ao seu carrinho rapidamente.
                            </label>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Variações de cor</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.mostrarVariacoesCor} 
                                    onChange={(e) => handleTemaChange('mostrarVariacoesCor', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                />
                                Mostrar variações de cores na lista de produtos.
                            </label>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Fotos do produto</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.mostrarSegundaFotoHover} 
                                    onChange={(e) => handleTemaChange('mostrarSegundaFotoHover', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                />
                                Mostrar a segunda foto ao passar o mouse.
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.exibirCarrosselFotos} 
                                    onChange={(e) => handleTemaChange('exibirCarrosselFotos', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                />
                                Exibir fotos em um Carrossel para cada produto.
                            </label>
                            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '10px', fontFamily: 'Poppins, sans-serif' }}>
                                O Carrossel se aplica somente a listagem de categoria e resultados de pesquisa.
                            </p>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Informações das parcelas</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.mostrarParcelasListaProdutos} 
                                    onChange={(e) => handleTemaChange('mostrarParcelasListaProdutos', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                />
                                Mostrar parcelas na lista de produtos.
                            </label>
                        </div>
                    </div>
                );

            case 'BarraAnuncio': 
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}> 
                        <button onClick={goBackToMainMenu} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                            <FaArrowLeft size={14} /> Voltar ao Menu Principal
                        </button>
                        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Barra de Anúncio</h3>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#555', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}> 
                            <input 
                                type="checkbox" 
                                checked={tema.mostrarBarraAnuncio} 
                                onChange={(e) => handleTemaChange('mostrarBarraAnuncio', e.target.checked)} 
                                style={{ width: '16px', height: '16px', flexShrink: 0 }}
                            />
                            Mostrar barra de anúncio
                        </label>

                        {tema.mostrarBarraAnuncio && (
                            <Fragment>
                                <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Mensagem:</label> 
                                <textarea 
                                    value={tema.mensagemBarraAnuncio} 
                                    onChange={(e) => handleTemaChange('mensagemBarraAnuncio', e.target.value)} 
                                    style={{ 
                                        width: '100%', 
                                        height: '38px', 
                                        minHeight: '38px', 
                                        maxHeight: '80px', 
                                        resize: 'vertical', 
                                        padding: '8px', 
                                        borderRadius: '4px', 
                                        border: '1px solid #ccc', 
                                        marginBottom: '0.8rem', 
                                        fontFamily: 'Poppins, sans-serif', 
                                        fontSize: '0.85rem', 
                                        lineHeight: 'normal',
                                        boxSizing: 'border-box'
                                    }}
                                    placeholder="Digite sua mensagem de anúncio..."
                                ></textarea>

                                <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Link opcional:</label> 
                                <input 
                                    type="text" 
                                    value={tema.linkBarraAnuncio} 
                                    onChange={(e) => handleTemaChange('linkBarraAnuncio', e.target.value)} 
                                    style={{ 
                                        padding: '8px', 
                                        borderRadius: '4px', 
                                        border: '1px solid #ccc', 
                                        width: '100%',
                                        fontFamily: 'Poppins, sans-serif', 
                                        fontSize: '0.85rem', 
                                        height: '38px',
                                        boxSizing: 'border-box'
                                    }}
                                    placeholder="Ex: https://sua-loja.com/promocao"
                                />
                            </Fragment>
                        )}
                    </div>
                );

            case 'CarrinhoCompras': 
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}> 
                        <button onClick={goBackToMainMenu} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                            <FaArrowLeft size={14} /> Voltar ao Menu Principal
                        </button>
                        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Carrinho de Compras</h3>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Mostrar botão "Ver mais produtos"</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.carrinho_mostrarBotaoVerMaisProdutos} 
                                    onChange={(e) => handleTemaChange('carrinho_mostrarBotaoVerMaisProdutos', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                />
                                Mostrar o botão "Ver mais produtos" no carrinho de compras.
                            </label>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Valor mínimo de compra</h4>
                            <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '10px', fontFamily: 'Poppins, sans-serif' }}>
                                Qual o valor mínimo que seus clientes devem gastar? 
                                <span style={{ fontSize: '0.7rem', color: '#888' }}> Preencha somente se for loja do tipo atacado.</span>
                            </p>
                            <input 
                                type="number" 
                                value={tema.carrinho_valorMinimoCompra} 
                                onChange={(e) => handleTemaChange('carrinho_valorMinimoCompra', parseFloat(e.target.value))} 
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', height: '38px', boxSizing: 'border-box' }} 
                                placeholder="0.00"
                            />
                            <p style={{ margin: '5px 0 0 0', fontSize: '0.75rem', color: '#888', fontFamily: 'Poppins, sans-serif' }}>Insira apenas números (ex: 50.00).</p>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Carrinho de compra rápida</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.carrinho_compraRapidaAtiva} 
                                    onChange={(e) => handleTemaChange('carrinho_compraRapidaAtiva', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                />
                                Permitir que seus clientes adicionem produtos sem precisar ir a outra página.
                            </label>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Recomendações de produtos</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.carrinho_sugerirProdutosComplementares} 
                                    onChange={(e) => handleTemaChange('carrinho_sugerirProdutosComplementares', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                />
                                Sugerir produtos complementares ao adicionar o carrinho de compra rápida.
                            </label>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '1.5rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Formas de entrega</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.carrinho_mostrarCalculadoraFrete} 
                                    onChange={(e) => handleTemaChange('carrinho_mostrarCalculadoraFrete', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }} 
                                />
                                Mostrar a calculadora de frete
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.carrinho_mostrarLojasFisicas} 
                                    onChange={(e) => handleTemaChange('carrinho_mostrarLojasFisicas', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                />
                                Mostrar lojas físicas no carrinho
                            </label>
                        </div>
                    </div>
                );

            case 'RodapePagina': 
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}> 
                        <button onClick={goBackToMainMenu} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                            <FaArrowLeft size={14} /> Voltar ao Menu Principal
                        </button>
                        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Rodapé da Página</h3>

                        {/* Cores */}
                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Cores</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', marginBottom: '1rem', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.rodape_usarCoresPersonalizadas} 
                                    onChange={(e) => handleTemaChange('rodape_usarCoresPersonalizadas', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                />
                                Usar estas cores para o rodapé da página
                            </label>

                            {tema.rodape_usarCoresPersonalizadas && (
                                <Fragment>
                                    <ColorPickerField
                                        label="Cor de fundo"
                                        description=""
                                        value={tema.rodape_fundo || '#000000'}
                                        themeKey="rodape_fundo" 
                                    />
                                    <ColorPickerField
                                        label="Cor de texto e ícones"
                                        description=""
                                        value={tema.rodape_textoIcones || '#000000'}
                                        themeKey="rodape_textoIcones" 
                                    />
                                </Fragment>
                            )}
                        </div>

                        {/* Menu Inicial */}
                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Menu Inicial</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.rodape_exibirMenu} 
                                    onChange={(e) => handleTemaChange('rodape_exibirMenu', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                />
                                Exibir menu
                            </label>
                        </div>

                        {/* Dados de Contato */}
                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Dados de contato</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.rodape_mostrarDadosContato} 
                                    onChange={(e) => handleTemaChange('rodape_mostrarDadosContato', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                />
                                Mostrar os dados de contato
                            </label>
                            {tema.rodape_mostrarDadosContato && (
                                <Fragment>
                                    <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Título:</label>
                                    <input 
                                        type="text" 
                                        value={tema.rodape_tituloDadosContato} 
                                        onChange={(e) => handleTemaChange('rodape_tituloDadosContato', e.target.value)} 
                                        style={{ 
                                            padding: '8px', 
                                            borderRadius: '4px', 
                                            border: '1px solid #ccc', 
                                            width: '100%', 
                                            marginBottom: '10px',
                                            height: '38px', 
                                            boxSizing: 'border-box',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '0.85rem' 
                                        }}
                                        placeholder="Entre em contato"
                                    />
                                </Fragment>
                            )}
                        </div>

                        {/* Redes Sociais */}
                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Redes sociais</h4>
                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Título:</label>
                            <input 
                                type="text" 
                                value={tema.rodape_tituloRedesSociais} 
                                onChange={(e) => handleTemaChange('rodape_tituloRedesSociais', e.target.value)} 
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', height: '38px', boxSizing: 'border-box' }} 
                                placeholder="Permaneça conectado"
                            />
                        </div>

                        {/* Meio de Envio */}
                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Meio de envio</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.rodape_mostrarOpcoesFrete} 
                                    onChange={(e) => handleTemaChange('rodape_mostrarOpcoesFrete', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                />
                                Mostrar as opções de frete na sua loja.
                            </label>
                        </div>

                        {/* Meio de Pagamento */}
                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Meio de pagamento</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.rodape_mostrarOpcoesPagamento} 
                                    onChange={(e) => handleTemaChange('rodape_mostrarOpcoesPagamento', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }}
                                />
                                Mostrar as opções de pagamento na sua loja.
                            </label>
                        </div>

                        {/* Selos Personalizados no Rodapé */}
                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '1.5rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Selos personalizados no rodapé</h4>
                            <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '1rem', fontFamily: 'Poppins, sans-serif' }}>
                                Você pode adicionar selos de duas formas: incluindo uma imagem ou adicionando um código HTML/JavaScript.
                            </p>
                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Upload da imagem do selo:</label>
                            <input 
                                type="file" 
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const reader = new FileReader();
                                        reader.onload = (uploadEvent) => {
                                            handleTemaChange('rodape_seloImagemUrl', uploadEvent.target?.result as string);
                                        };
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }} 
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', marginBottom: '5px', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', height: '38px', boxSizing: 'border-box' }}
                            />
                            <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '1rem', fontFamily: 'Poppins, sans-serif' }}>Tamanho recomendado: 24px x 24px.</p>
                            {tema.rodape_seloImagemUrl && (
                                <img 
                                    src={tema.rodape_seloImagemUrl} 
                                    alt="Selo Personalizado" 
                                    style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', border: '1px dashed #eee', marginBottom: '1rem' }}
                                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100/ccc/fff?text=Erro')}
                                />
                            )}

                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Código HTML ou JavaScript para o selo:</label>
                            <textarea 
                                value={tema.rodape_seloHtmlCode} 
                                onChange={(e) => handleTemaChange('rodape_seloHtmlCode', e.target.value)} 
                                style={{ width: '100%', height: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', minHeight: '38px', maxHeight: '150px', resize: 'vertical', boxSizing: 'border-box' }}
                                placeholder=""
                            ></textarea>
                        </div>
                    </div>
                );

            case 'AdvancedCssEditor':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}> 
                        <button onClick={goBackToMainMenu} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                            <FaArrowLeft size={14} /> Voltar ao Menu Principal
                        </button>
                        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Edição de CSS Avançada</h3>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem', fontFamily: 'Poppins, sans-serif' }}>Para web designers:</p>

                        <textarea
                            value={tema.advancedCss}
                            onChange={(e) => handleTemaChange('advancedCss', e.target.value)}
                            style={{
                                width: '100%',
                                height: '250px',
                                background: '#1e1e1e',
                                color: '#d4d4d4',
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #333',
                                resize: 'vertical',
                                boxSizing: 'border-box'
                            }}
                            placeholder="/* Insira seu CSS personalizado aqui */"
                        ></textarea>
                        <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.5rem', fontFamily: 'Poppins, sans-serif' }}>
                            Os comentários que você inclui não serão salvos.
                        </p>
                        <button
                            onClick={applyAdvancedCss}
                            style={{
                                background: '#adb5bd',
                                color: '#fff',
                                border: 'none',
                                padding: '0.6rem 0.8rem',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: 'normal',
                                fontFamily: 'Poppins, sans-serif',
                                marginTop: '1rem',
                                maxWidth: 'fit-content',
                                alignSelf: 'flex-end'
                            }}
                        >
                            Testar CSS
                        </button>
                    </div>
                );
            case 'DetalheProduto': 
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}> 
                        <button onClick={goBackToMainMenu} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                            <FaArrowLeft size={14} /> Voltar ao Menu Principal
                        </button>
                        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Detalhe do Produto</h3>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Forma de entrega</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.detalhesProduto_mostrarCalculadoraFrete} 
                                    onChange={(e) => handleTemaChange('detalhesProduto_mostrarCalculadoraFrete', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }} 
                                />
                                Mostrar a calculadora de frete
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.detalhesProduto_mostrarLojasFisicas} 
                                    onChange={(e) => handleTemaChange('detalhesProduto_mostrarLojasFisicas', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }} 
                                />
                                Mostrar lojas físicas na página de produto
                            </label>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Informações das parcelas</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.detalhesProduto_mostrarParcelas} 
                                    onChange={(e) => handleTemaChange('detalhesProduto_mostrarParcelas', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }} 
                                />
                                Mostrar parcelas na página de produtos
                            </label>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Preço promocional</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.detalhesProduto_mostrarEconomiaPromocional} 
                                    onChange={(e) => handleTemaChange('detalhesProduto_mostrarEconomiaPromocional', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }} 
                                />
                                Mostrar o valor que se economiza no produto com preço promocional.
                            </label>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px', fontFamily: 'Poppins, sans-serif' }}> 
                                Não se aplica se o preço com desconto por meio de pagamento estiver visível.
                            </p>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Desconto por meio de pagamento</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.detalhesProduto_descontoPagamentoVisivel} 
                                    onChange={(e) => handleTemaChange('detalhesProduto_descontoPagamentoVisivel', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }} 
                                />
                                Mostrar o preço com maior desconto na lista, no detalhe do produto e carrinho de compra.
                            </label>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Variações do produto</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.detalhesProduto_variacoesBotao} 
                                    onChange={(e) => handleTemaChange('detalhesProduto_variacoesBotao', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }} 
                                />
                                Mostrar como botões variações de cor para selecionar.
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.detalhesProduto_variacaoCorFotoBotao} 
                                    onChange={(e) => handleTemaChange('detalhesProduto_variacaoCorFotoBotao', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }} 
                                />
                                Mostrar a foto da variação de cor como botão.
                            </label>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Guia de medida</h4>
                            <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '10px', fontFamily: 'Poppins, sans-serif' }}>
                                Quando houver um produto com variações de tamanho, você pode incluir um guia de medidas na sua loja. Basta criar uma página e inserir o link aqui.
                            </p>
                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Link da página:</label> 
                            <input 
                                type="text" 
                                value={tema.detalhesProduto_linkGuiaMedida} 
                                onChange={(e) => handleTemaChange('detalhesProduto_linkGuiaMedida', e.target.value)} 
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', height: '38px', boxSizing: 'border-box' }} 
                                placeholder="https://sua-loja.com/guia-de-medidas"
                            />
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Estoque</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.detalhesProduto_mostrarEstoque} 
                                    onChange={(e) => handleTemaChange('detalhesProduto_mostrarEstoque', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }} 
                                />
                                Mostrar estoque disponível
                            </label>
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Últimas unidades no estoque</h4>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                                <input 
                                    type="checkbox" 
                                    checked={tema.detalhesProduto_mostrarUltimasUnidades} 
                                    onChange={(e) => handleTemaChange('detalhesProduto_mostrarUltimasUnidades', e.target.checked)} 
                                    style={{ width: '16px', height: '16px', flexShrink: 0 }} 
                                />
                                Mostrar uma mensagem para incentivar a compra quando restarem poucas unidades.
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '1rem' }}> 
                                <span style={{ fontSize: '0.85rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>Mostrar quando estiver com menos de</span> 
                                <input 
                                    type="number" 
                                    value={tema.detalhesProduto_limiteUltimasUnidades} 
                                    onChange={(e) => handleTemaChange('detalhesProduto_limiteUltimasUnidades', parseInt(e.target.value))} 
                                    style={{ width: '100%', maxWidth: '100px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc', textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', height: '32px', boxSizing: 'border-box' }} 
                                />
                                <p style={{ margin: '0', fontSize: '0.75rem', color: '#888', fontFamily: 'Poppins, sans-serif' }}>Insira apenas números</p> 
                            </div>
                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Mensagem quando está uma unidade em estoque:</label>
                            <input 
                                type="text" 
                                value={tema.detalhesProduto_mensagemUltimaUnidade} 
                                onChange={(e) => handleTemaChange('detalhesProduto_mensagemUltimaUnidade', e.target.value)} 
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', height: '38px', boxSizing: 'border-box' }} 
                                placeholder="Atenção: Última peça!"
                            />
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Produtos relacionados</h4>
                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Título para produtos alternativos:</label> 
                            <input 
                                type="text" 
                                value={tema.detalhesProduto_tituloProdutosRelacionados} 
                                onChange={(e) => handleTemaChange('detalhesProduto_tituloProdutosRelacionados', e.target.value)} 
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', height: '38px', boxSizing: 'border-box' }} 
                                placeholder="Produtos Similares"
                            />
                        </div>

                        <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '1.5rem' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Produtos complementares</h4>
                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Título para produtos complementares:</label> 
                            <input 
                                type="text" 
                                value={tema.detalhesProduto_tituloProdutosComplementares} 
                                onChange={(e) => handleTemaChange('detalhesProduto_tituloProdutosComplementares', e.target.value)} 
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', height: '38px', boxSizing: 'border-box' }} 
                                placeholder="Compre com este produto"
                            />
                        </div>

                        <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#333', paddingLeft: '5px', fontFamily: 'Poppins, sans-serif' }}>Informações sobre a compra</h4> 
                        <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '1rem', paddingLeft: '5px', marginTop: '0', fontFamily: 'Poppins, sans-serif' }}>
                            Informações abaixo do formulário de produto onde se concretiza uma compra. Por exemplo: alterações e devoluções, políticas de cancelamento ou informações sobre entrega.
                        </p>

                        {[1, 2, 3].map((num) => {
                            const mostrarKey = `detalhesProduto_infoCompra_mostrar${num}` as keyof Tema;
                            const tipoIconeKey = `detalhesProduto_infoCompra_tipoIcone${num}` as keyof Tema;
                            const uploadIconeKey = `detalhesProduto_infoCompra_uploadIcone${num}` as keyof Tema;
                            const tituloKey = `detalhesProduto_infoCompra_titulo${num}` as keyof Tema; 
                            const descricaoKey = `detalhesProduto_infoCompra_descricao${num}` as keyof Tema; 

                            return (
                                <div key={num} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Informação {num} sobre a compra</h4>
                                    
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#555', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={tema[mostrarKey] as boolean} 
                                            onChange={(e) => handleTemaChange(mostrarKey, e.target.checked)} 
                                            style={{ width: '16px', height: '16px', flexShrink: 0 }} 
                                        />
                                        Mostrar informação
                                    </label>

                                    {tema[mostrarKey] && (
                                        <Fragment>
                                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Título:</label>
                                            <input 
                                                type="text" 
                                                value={tema[tituloKey] as string} 
                                                onChange={(e) => handleTemaChange(tituloKey, e.target.value)} 
                                                style={{ 
                                                    padding: '8px', 
                                                    borderRadius: '4px', 
                                                    border: '1px solid #ccc', 
                                                    width: '100%', 
                                                    marginBottom: '10px',
                                                    height: '38px', 
                                                    boxSizing: 'border-box',
                                                    fontFamily: 'Poppins, sans-serif',
                                                    fontSize: '0.85rem' 
                                                }}
                                                placeholder="Ex: Pagamento Seguro"
                                            />

                                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Descrição:</label>
                                            <textarea 
                                                value={tema[descricaoKey] as string} 
                                                onChange={(e) => handleTemaChange(descricaoKey, e.target.value)} 
                                                style={{ 
                                                    padding: '8px', 
                                                    borderRadius: '4px', 
                                                    border: '1px solid #ccc', 
                                                    width: '100%', 
                                                    marginBottom: '10px',
                                                    minHeight: '38px', 
                                                    maxHeight: '80px', 
                                                    resize: 'vertical',
                                                    boxSizing: 'border-box',
                                                    fontFamily: 'Poppins, sans-serif',
                                                    fontSize: '0.85rem' 
                                                }}
                                                placeholder="Ex: Aceitamos todos os cartões de crédito."
                                            ></textarea>


                                            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Ícone:</label>
                                            <select 
                                                value={tema[tipoIconeKey] as string} 
                                                onChange={(e) => handleTemaChange(tipoIconeKey, e.target.value)} 
                                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', marginBottom: '10px', fontFamily: 'Poppins, sans-serif', height: '38px', fontSize: '0.85rem' }} 
                                            >
                                                <option value="imagemPropria">Imagem própria</option>
                                                <option value="seguranca">Ícone de segurança</option>
                                                <option value="trocasDevolucoes">Ícone de trocas e devoluções</option>
                                                <option value="entregas">Ícone de entregas</option>
                                                <option value="dinheiro">Ícone de dinheiro</option>
                                                <option value="cartaoCredito">Ícone de cartão de crédito</option>
                                                <option value="promocoes">Ícone de promoções</option>
                                                <option value="whatsapp">Ícone de WhatsApp</option>
                                            </select>

                                            {(tema[tipoIconeKey] === 'imagemPropria') ? (
                                                <Fragment>
                                                    <label style={{ fontSize: '0.75rem', color: '#666', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Upload da imagem própria (50px por 50px):</label> 
                                                    <input 
                                                        type="file" 
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                const reader = new FileReader();
                                                                reader.onload = (uploadEvent) => {
                                                                    handleTemaChange(uploadIconeKey, uploadEvent.target?.result as string);
                                                                };
                                                                reader.readAsDataURL(e.target.files[0]);
                                                            }
                                                        }} 
                                                        style={{ 
                                                            padding: '8px', 
                                                            borderRadius: '4px', 
                                                            border: '1px solid #ccc', 
                                                            width: '100%', 
                                                            marginBottom: '10px',
                                                            fontFamily: 'Poppins, sans-serif', 
                                                            fontSize: '0.85rem', 
                                                            height: '38px', 
                                                            boxSizing: 'border-box'
                                                        }}
                                                    />
                                                    {tema[uploadIconeKey] && (
                                                        <img 
                                                            src={tema[uploadIconeKey] as string} 
                                                            alt="Pré-visualização do ícone" 
                                                            style={{ width: '50px', height: '50px', objectFit: 'contain', border: '1px dashed #eee' }}
                                                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/50x50/ccc/fff?text=Erro')}
                                                        />
                                                    )}
                                                </Fragment>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                                                    <span style={{ fontSize: '0.85rem', color: '#666', fontFamily: 'Poppins, sans-serif' }}>Ícone selecionado:</span>
                                                    {infoIconMap[tema[tipoIconeKey] as string]} 
                                                </div>
                                            )}
                                        </Fragment>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            default: // Módulo desconhecido ou sem tela de configuração específica
                const currentModule = homePageModules.find((m: HomePageModule) => m.id === currentSidebarScreen);
                if (currentModule) {
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px' }}> 
                            <button onClick={goBackFromModuleConfig} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                                <FaArrowLeft size={14} /> Voltar aos Módulos da Página Inicial
                            </button>
                            <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Configurar: {currentModule.fullLabel || currentModule.label}</h3>
                            <p style={{ fontFamily: 'Poppins, sans-serif' }}>Este tipo de módulo ({currentModule.type}) ainda não possui uma tela de configuração detalhada.</p>
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
                                    marginTop: 'auto',
                                    fontFamily: 'Poppins, sans-serif' 
                                }}
                            >
                                Voltar
                            </button>
                        </div>
                    );
                }
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}> 
                        <button onClick={goBackToMainMenu} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                            <FaArrowLeft size={14} /> Voltar ao Menu Principal
                        </button>
                        <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Tela de Configuração Não Encontrada</h3>
                        <p style={{ fontFamily: 'Poppins, sans-serif' }}>O tópico '{currentSidebarScreen}' não possui uma tela de configuração associada.</p> 
                        <button 
                            onClick={goBackToMainMenu}
                            style={{ 
                                background: '#007bff', 
                                color: '#fff', 
                                border: 'none', 
                                padding: '1rem', 
                                borderRadius: '5px', 
                                cursor: 'pointer', 
                                fontSize: '0.9rem', 
                                fontWeight: 'bold',
                                marginTop: 'auto',
                                fontFamily: 'Poppins, sans-serif' 
                            }}
                        >
                            Voltar ao Menu Principal
                        </button>
                    </div>
                );
        }
    };

    return (
        <aside style={{ 
            width: '320px', 
            backgroundColor: '#fff', 
            borderRight: '1px solid #eee', 
            padding: '0', 
            boxSizing: 'border-box',
            height: '100%',
            display: 'flex', 
            flexDirection: 'column', 
            flexShrink: 0,
            fontFamily: 'Poppins, sans-serif' 
        }}>
            {renderMainContent()}

            <div style={{ padding: '0.8rem 15px', borderTop: '1px solid #eee', marginTop: 'auto', display: 'flex', gap: '8px', justifyContent: 'space-between', flexShrink: 0 }}> 
                <button
                    onClick={() => { console.log("Salvar como rascunho", tema); /* saveTheme(tema); */ alert("Tema salvo como rascunho! (Simulado)"); }}
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
                        background: tema.cores.primaria, 
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