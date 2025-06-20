// app/(painelpersonalizado)/personalizar/components/module-configs/InfoModuleConfig.tsx
'use client';
import React from 'react';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import TextField from '../ui/TextField';
import TextareaField from '../ui/TextareaField';
import SelectField from '../ui/SelectField';
import ImageUploadSquare from '../ui/ImageUploadSquare';
import { HomePageModule, Tema, InfoItem } from '../EditorContext'; 

// Importe todos os ícones que você quer que o cliente possa escolher
import { 
    FaShieldAlt, FaExchangeAlt, FaTruck, FaMoneyBillWave, FaCreditCard, FaTags, FaWhatsapp, FaRing 
} from 'react-icons/fa'; 
import { MdImage, MdViewCarousel, MdMail, MdSettingsApplications, MdMessage } from 'react-icons/md';


// Mapeamento de ícones (consistente com Preview.tsx). Definido aqui para InfoModuleConfig usar.
const infoIconMap = {
    MdImage: 'Ícone de Imagem', 
    MdViewCarousel: 'Ícone de Carrossel',
    MdMail: 'Ícone de E-mail',
    MdSettingsApplications: 'Ícone de Configurações',
    MdMessage: 'Ícone de Mensagem',
    FaStar: 'Estrela', 
    FaBoxOpen: 'Caixa Aberta', 

    // Ícones para o módulo de Info (com rótulos amigáveis)
    seguranca: 'Cadeado (Segurança)',
    trocasDevolucoes: 'Setas (Trocas/Devoluções)',
    entregas: 'Caminhão (Entregas)',
    dinheiro: 'Onda de Dinheiro (Dinheiro)',
    cartaoCredito: 'Cartão de Crédito',
    promocoes: 'Tags de Desconto (Promoções)',
    whatsapp: 'WhatsApp',
    // ANEL SOLITÁRIO REMOVIDO AQUI DO MAPA (como solicitado):
    // anelSolitario: 'Anel Solitário', 
    imagemPropria: 'Imagem Própria (Upload)', 
};

interface InfoModuleConfigProps {
    module: HomePageModule;
    goBackFromModuleConfig: () => void;
    handleModuleConfigChange: (moduleId: string, newConfig: Partial<HomePageModule['config']>) => void;
    tema: Tema;
    handleTemaChange: (key: keyof Tema, value: any) => void;
}

const InfoModuleConfig: React.FC<InfoModuleConfigProps> = ({ 
    module, 
    goBackFromModuleConfig, 
    handleModuleConfigChange, 
    tema, 
    handleTemaChange 
}) => {

    const currentInfoItems: InfoItem[] = (module.config?.infoItems as InfoItem[]) || [{
        id: `info_item_${Date.now()}`,
        iconType: 'seguranca', 
        title: 'Pagamento Seguro',
        description: 'Transações seguras com criptografia de ponta.',
        isVisible: true,
    }];

    // Gerar as opções do SelectField a partir do infoIconMap
    const iconOptions = Object.entries(infoIconMap).map(([value, label]) => ({
        value: value,
        label: label,
    }));
    
    // Removida a lógica condicional que adicionava "Anel Solitário" aqui
    // Adicionar opção de Imagem Própria (garantir que esteja sempre no início ou onde desejar)
    if (!iconOptions.some(opt => opt.value === 'imagemPropria')) {
        iconOptions.unshift({ value: 'imagemPropria', label: 'Imagem Própria (Upload)' });
    }


    const handleAddInfoItem = () => {
        const newItem: InfoItem = {
            id: `info_item_${Date.now()}`,
            iconType: 'seguranca', 
            title: 'Nova Informação',
            description: 'Breve descrição sobre a informação.',
            isVisible: true,
        };
        handleModuleConfigChange(module.id, { infoItems: [...currentInfoItems, newItem] });
    };

    const handleRemoveInfoItem = (idToRemove: string) => {
        const updatedItems = currentInfoItems.filter(item => item.id !== idToRemove);
        handleModuleConfigChange(module.id, { infoItems: updatedItems });
    };

    const handleInfoItemChange = (id: string, key: keyof InfoItem, value: any) => {
        const updatedItems = currentInfoItems.map(item =>
            item.id === id ? { ...item, [key]: value } : item
        );
        handleModuleConfigChange(module.id, { infoItems: updatedItems });
    };

    const handleImageUpload = (itemId: string) => (imageUrl: string | null) => {
        handleInfoItemChange(itemId, 'imageUrl', imageUrl);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}>
            <button onClick={goBackFromModuleConfig} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                <FaArrowLeft size={14} /> Voltar aos Módulos da Página Inicial
            </button>
            <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Configurar Informações: {module.fullLabel || module.label}</h3>
            <p style={{ fontSize: '0.85rem', color: '#777', fontFamily: 'Poppins, sans-serif' }}>
                Adicione e personalize informações importantes da loja (ex: formas de pagamento, segurança, entregas).
            </p>

            <TextField
                label="Título da Seção:"
                value={module.config?.title ?? ''}
                onChange={(val) => handleModuleConfigChange(module.id, { title: val })}
                placeholder="Título da seção de informações"
            />

            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Itens de Informação ({currentInfoItems.length} no total)</h4>
                
                {currentInfoItems.map((item, index) => (
                    <div key={item.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px', marginBottom: '15px', backgroundColor: '#fdfdfd', position: 'relative' }}>
                        <h5 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>Item #{index + 1}</h5>
                        
                        {currentInfoItems.length > 1 && (
                            <button
                                onClick={() => handleRemoveInfoItem(item.id)}
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
                                title="Remover este item"
                            >
                                <FaTrash size={12} />
                            </button>
                        )}

                        <TextField
                            label="Título do Item:"
                            value={item.title ?? ''}
                            onChange={(val) => handleInfoItemChange(item.id, 'title', val)}
                            placeholder="Título da informação (ex: Pagamento Seguro)"
                        />
                        <TextareaField
                            label="Descrição do Item:"
                            value={item.description ?? ''}
                            onChange={(val) => handleInfoItemChange(item.id, 'description', val)}
                            placeholder="Breve descrição da informação (ex: Transações seguras com criptografia)."
                            minHeight="38px"
                            maxHeight="80px"
                        />
                        <TextField
                            label="Link do Item (opcional):"
                            type="url"
                            value={item.link ?? ''}
                            onChange={(val) => handleInfoItemChange(item.id, 'link', val)}
                            placeholder="https://sua-loja.com/seguranca"
                        />

                        <SelectField
                            label="Tipo de Ícone:"
                            value={item.iconType}
                            onChange={(val) => handleInfoItemChange(item.id, 'iconType', val as InfoItem['iconType'])}
                            options={iconOptions}
                            description="Escolha um ícone pré-definido ou faça upload de uma imagem própria."
                        />

                        {item.iconType === 'imagemPropria' && (
                            <ImageUploadSquare
                                label="Upload Ícone Próprio:"
                                onImageUpload={handleImageUpload(item.id)}
                                currentImageUrl={item.imageUrl}
                                recommendation="Tamanho recomendado: 50x50px."
                                shape="square"
                            />
                        )}
                    </div>
                ))}

                <button
                    onClick={handleAddInfoItem}
                    style={{
                        background: '#28a745',
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
                    <FaPlus size={14} /> Adicionar Nova Informação
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

export default InfoModuleConfig;