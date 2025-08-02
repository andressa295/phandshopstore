'use client';
import React, { useState, useEffect, useCallback } from 'react';
import './DetalhesDaVenda.css';

import Modal from './Modal';
import ConfirmModal from './ConfirmModal';
import Toast from './Toast';

import { FaWhatsapp } from "react-icons/fa";

const IconeEditar = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#820AD1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px', cursor: 'pointer', verticalAlign: 'middle' }}>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
);

const IconeRemover = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '5px', cursor: 'pointer', verticalAlign: 'middle' }}>
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

const IconeAdicionar = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '5px', cursor: 'pointer', verticalAlign: 'middle' }}>
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const IconeEnvio = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '5px', verticalAlign: 'middle' }}>
        <path d="M12 2L2 7l10 5 10-5L12 2z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
    </svg>
);

interface ItemVendido {
    idProduto: string;
    nomeProduto: string;
    skuProduto: string;
    quantidade: number;
    precoUnitario: number;
    variantes?: string;
    imagemUrl?: string;
}

interface Endereco {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento?: string;
}

interface ClienteVenda {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    cpfCnpj: string;
}

interface HistoricoStatusVenda {
    status: string;
    dataHora: string;
    observacao?: string;
}

interface DetalhesVenda {
    id: string;
    dataHoraVenda: string;
    statusAtual: string;
    totalVenda: number;
    formaPagamento: string;
    cliente: ClienteVenda;
    enderecoEntrega: Endereco;
    enderecoCobranca?: Endereco;
    itens: ItemVendido[];
    observacoesCliente?: string;
    observacoesInternas?: string;
    trackingLink?: string;
    trackingCode?: string;
    transportadora?: string;
    dataEnvio?: string;
    historicoStatus: HistoricoStatusVenda[];
}

interface ItemPedidoProp {
    id: string;
    produto_id: string;
    quantidade: number;
    preco_unitario: number;
    nome_produto: { nome: string } | null;
}

interface VendaDetalheProp {
    id: string;
    created_at: string;
    cliente_id: string;
    cliente: { id: string; nome: string; email: string; telefone: string | null; cpfCnpj: string | null; } | null;
    status: string;
    valor_total: number;
    endereco_ent: string | null;
    observacoes_c: string | null;
    observacoes_i: string | null;
    tracking_link: string | null;
    tracking_cod: string | null;
    transportador: string | null;
    data_envio: string | null;
    items_pedido: ItemPedidoProp[];
}

const mockProdutosDisponiveis = [
    { id: 'PROD001', nome: 'Camiseta Algodão Orgânico', sku: 'CAM001AZM', preco: 79.90, variantes: 'Azul, M', imagemUrl: '/assets/camiseta_azul.jpg' },
    { id: 'PROD002', nome: 'Calça Jeans Skinny', sku: 'CAL002PT40', preco: 150.00, variantes: 'Preta, 40', imagemUrl: '/assets/calca_preta.jpg' },
    { id: 'PROD003', nome: 'Meia Esportiva', sku: 'MEI003BR', preco: 10.00, imagemUrl: '/assets/meia_branca.jpg' },
    { id: 'PROD004', nome: 'Cinto de Couro', sku: 'CINTO001PT', preco: 80.00, imagemUrl: '/assets/cinto_couro.jpg' },
];

const getStatusDisplayName = (status: string): string => {
    switch (status) {
        case 'concluida': return 'Concluída';
        case 'pendente': return 'Pendente';
        case 'cancelada': return 'Cancelada';
        case 'em_processamento': return 'Em Processamento';
        case 'enviada': return 'Enviada';
        case 'entregue': return 'Entregue';
        case 'separando': return 'Separando Pedido';
        case 'confeccao': return 'Em Confecção';
        case 'fabricacao': return 'Em Fabricação';
        case 'arquivado': return 'Arquivado';
        default: return status;
    }
};

const transformData = (data: VendaDetalheProp): DetalhesVenda => {
    const clienteData = data.cliente || { id: '', nome: 'Cliente Não Informado', email: '', telefone: '', cpfCnpj: '' };

    const enderecoData: Endereco = {
        rua: data.endereco_ent?.split(',')[0]?.trim() || 'Rua não informada',
        numero: data.endereco_ent?.split(',')[1]?.trim().split(' - ')[0]?.trim() || '',
        complemento: data.endereco_ent?.split(' - ')[1]?.trim() || '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
    };

    const itensData = data.items_pedido.map(item => ({
        idProduto: item.produto_id,
        nomeProduto: item.nome_produto?.nome || 'Produto Sem Nome',
        skuProduto: '',
        quantidade: item.quantidade,
        precoUnitario: item.preco_unitario,
        variantes: '',
        imagemUrl: '',
    }));

    let statusAtual = data.status as DetalhesVenda['statusAtual'];
    if (statusAtual === 'pago') statusAtual = 'concluida';
    if (statusAtual === 'pendente') statusAtual = 'pendente';
    if (statusAtual === 'cancelado') statusAtual = 'cancelada';
    if (statusAtual === 'enviado') statusAtual = 'enviada';
    if (statusAtual === 'em_transporte') statusAtual = 'enviada';
    if (statusAtual === 'entregue') statusAtual = 'entregue';

    return {
        id: data.id,
        dataHoraVenda: new Date(data.created_at).toLocaleString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        statusAtual: statusAtual,
        totalVenda: data.valor_total,
        formaPagamento: 'PIX',
        cliente: clienteData as ClienteVenda,
        enderecoEntrega: enderecoData,
        itens: itensData,
        observacoesCliente: data.observacoes_c || '',
        observacoesInternas: data.observacoes_i || '',
        trackingLink: data.tracking_link || '',
        trackingCode: data.tracking_cod || '',
        transportadora: data.transportador || '',
        dataEnvio: data.data_envio || '',
        historicoStatus: [{ status: statusAtual, dataHora: new Date(data.created_at).toLocaleString('pt-BR'), observacao: 'Criado' }],
    };
};

const DetalhesDaVenda: React.FC<{ venda: VendaDetalheProp | null }> = ({ venda }) => {
    const [detalhesVenda, setDetalhesVenda] = useState<DetalhesVenda | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isCepLoading, setIsCepLoading] = useState(false);

    const [editingEnvio, setEditingEnvio] = useState(false);
    const [currentTrackingLink, setCurrentTrackingLink] = useState('');
    const [currentTrackingCode, setCurrentTrackingCode] = useState('');
    const [currentTransportadora, setCurrentTransportadora] = useState('');

    const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
    const [isEnderecoModalOpen, setIsEnderecoModalOpen] = useState(false);
    const [isObsInternasModalOpen, setIsObsInternasModalOpen] = useState(false);
    const [isVendaCompletaModalOpen, setIsVendaCompletaModalOpen] = useState(false);

    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmModalData, setConfirmModalData] = useState<{ title: string; message: string; onConfirm: () => void; confirmText?: string; } | null>(null);


    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type });
    }, []);

    const openConfirmModal = useCallback((title: string, message: string, onConfirm: () => void, confirmText?: string) => {
        setConfirmModalData({ title, message, onConfirm, confirmText });
        setIsConfirmModalOpen(true);
    }, []);


    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone: string) => /^\d{10,11}$/.test(phone.replace(/\D/g, ''));
    const validateCpfCnpj = (doc: string) => doc.replace(/\D/g, '').length >= 11;

    const [editClienteNome, setEditClienteNome] = useState('');
    const [editClienteEmail, setEditClienteEmail] = useState('');
    const [editClienteTelefone, setEditClienteTelefone] = useState('');
    const [editClienteCpfCnpj, setEditClienteCpfCnpj] = useState('');

    const handleEditCliente = () => {
        if (detalhesVenda) {
            setEditClienteNome(detalhesVenda.cliente.nome);
            setEditClienteEmail(detalhesVenda.cliente.email);
            setEditClienteTelefone(detalhesVenda.cliente.telefone);
            setEditClienteCpfCnpj(detalhesVenda.cliente.cpfCnpj);
        }
        setIsClienteModalOpen(true);
    };
    const handleSaveCliente = () => {
        if (!editClienteNome || !editClienteEmail || !editClienteTelefone) {
            showToast('Preencha nome, email e telefone do cliente.', 'error');
            return;
        }
        if (!validateEmail(editClienteEmail)) {
            showToast('Email inválido.', 'error');
            return;
        }
        if (!validatePhone(editClienteTelefone)) {
            showToast('Telefone inválido (apenas números, 10 ou 11 dígitos).', 'error');
            return;
        }
        if (editClienteCpfCnpj && !validateCpfCnpj(editClienteCpfCnpj)) {
            showToast('CPF/CNPJ inválido (mínimo 11 dígitos).', 'error');
            return;
        }

        if (detalhesVenda) {
            setDetalhesVenda(prev => prev ? {
                ...prev,
                cliente: {
                    ...prev.cliente,
                    nome: editClienteNome,
                    email: editClienteEmail,
                    telefone: editClienteTelefone,
                    cpfCnpj: editClienteCpfCnpj
                }
            } : null);
            showToast('Informações do cliente salvas!', 'success');
        }
        setIsClienteModalOpen(false);
    };

    const [editEnderecoRua, setEditEnderecoRua] = useState('');
    const [editEnderecoNumero, setEditEnderecoNumero] = useState('');
    const [editEnderecoComplemento, setEditEnderecoComplemento] = useState('');
    const [editEnderecoBairro, setEditEnderecoBairro] = useState('');
    const [editEnderecoCidade, setEditEnderecoCidade] = useState('');
    const [editEnderecoEstado, setEditEnderecoEstado] = useState('');
    const [editEnderecoCep, setEditEnderecoCep] = useState('');

    const handleEditEndereco = () => {
        if (detalhesVenda) {
            setEditEnderecoRua(detalhesVenda.enderecoEntrega.rua);
            setEditEnderecoNumero(detalhesVenda.enderecoEntrega.numero);
            setEditEnderecoComplemento(detalhesVenda.enderecoEntrega.complemento || '');
            setEditEnderecoBairro(detalhesVenda.enderecoEntrega.bairro);
            setEditEnderecoCidade(detalhesVenda.enderecoEntrega.cidade);
            setEditEnderecoEstado(detalhesVenda.enderecoEntrega.estado);
            setEditEnderecoCep(detalhesVenda.enderecoEntrega.cep);
        }
        setIsEnderecoModalOpen(true);
    };
    const handleSaveEndereco = () => {
        if (!editEnderecoRua || !editEnderecoNumero || !editEnderecoBairro || !editEnderecoCidade || !editEnderecoEstado || !editEnderecoCep) {
            showToast('Preencha todos os campos obrigatórios do endereço.', 'error');
            return;
        }
        if (editEnderecoCep.replace(/\D/g, '').length !== 8) {
            showToast('CEP deve ter 8 dígitos.', 'error');
            return;
        }
        if (detalhesVenda) {
            setDetalhesVenda(prev => prev ? {
                ...prev,
                enderecoEntrega: {
                    ...prev.enderecoEntrega,
                    rua: editEnderecoRua,
                    numero: editEnderecoNumero,
                    complemento: editEnderecoComplemento,
                    bairro: editEnderecoBairro,
                    cidade: editEnderecoCidade,
                    estado: editEnderecoEstado,
                    cep: editEnderecoCep
                }
            } : null);
            showToast('Endereço salvo!', 'success');
        }
        setIsEnderecoModalOpen(false);
    };

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');
        setEditEnderecoCep(cep);

        if (cep.length === 8) {
            setIsCepLoading(true);
            const mockCepDataSuccess = {
                logradouro: 'Rua Simulado do CEP',
                bairro: 'Bairro Mockado',
                localidade: 'Cidade Fictícia',
                uf: 'SP',
            };
            setTimeout(() => {
                const data = mockCepDataSuccess;
                if (data && data.logradouro) {
                    setEditEnderecoRua(data.logradouro);
                    setEditEnderecoBairro(data.bairro);
                    setEditEnderecoCidade(data.localidade);
                    setEditEnderecoEstado(data.uf);
                    showToast('CEP preenchido automaticamente!', 'info');
                } else {
                    setEditEnderecoRua('');
                    setEditEnderecoBairro('');
                    setEditEnderecoCidade('');
                    setEditEnderecoEstado('');
                    showToast('CEP não encontrado ou inválido.', 'error');
                }
                setIsCepLoading(false);
            }, 1000);
        } else {
            setIsCepLoading(false);
        }
    };

    const [editObsInternas, setEditObsInternas] = useState('');

    const handleEditObservacoesInternas = () => {
        if (detalhesVenda) {
            setEditObsInternas(detalhesVenda.observacoesInternas || '');
        }
        setIsObsInternasModalOpen(true);
    };
    const handleSaveObsInternas = () => {
        if (detalhesVenda) {
            setDetalhesVenda(prev => prev ? { ...prev, observacoesInternas: editObsInternas } : null);
            showToast('Observações internas salvas!', 'success');
        }
        setIsObsInternasModalOpen(false);
    };

    const [editItensVenda, setEditItensVenda] = useState<ItemVendido[]>([]);

    const handleEditVendaCompleta = () => {
        if (detalhesVenda) {
            setEditItensVenda([...detalhesVenda.itens]);
        }
        setIsVendaCompletaModalOpen(true);
    };

    const handleRemoveItem = (indexToRemove: number) => {
        setEditItensVenda(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleUpdateItemQuantity = (indexToUpdate: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            showToast('Quantidade deve ser pelo menos 1.', 'error');
            return;
        }
        setEditItensVenda(prev => prev.map((item, index) =>
            index === indexToUpdate ? { ...item, quantidade: newQuantity } : item
        ));
    };

    const handleAddItem = () => {
        setEditItensVenda(prev => [...prev, { idProduto: '', nomeProduto: '', skuProduto: '', quantidade: 1, precoUnitario: 0, variantes: '', imagemUrl: '' }]);
    };

    const handleProductSearchForAddItem = (searchTerm: string, itemIndex: number) => {
        const foundProduct = mockProdutosDisponiveis.find(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
        if (foundProduct) {
            setEditItensVenda(prev => prev.map((item, index) =>
                index === itemIndex ? {
                    ...item,
                    idProduto: foundProduct.id,
                    nomeProduto: foundProduct.nome,
                    skuProduto: foundProduct.sku,
                    precoUnitario: foundProduct.preco,
                    variantes: foundProduct.variantes,
                    imagemUrl: foundProduct.imagemUrl
                } : item
            ));
            showToast(`Produto "${foundProduct.nome}" adicionado/encontrado!`, 'success');
        } else {
            showToast(`Produto "${searchTerm}" não encontrado no catálogo.`, 'error');
        }
    };

    const handleSaveVendaCompleta = () => {
        if (editItensVenda.some(item => !item.idProduto || !item.nomeProduto || item.quantidade <= 0 || item.precoUnitario <= 0)) {
            showToast('Todos os itens devem ter produto, nome, quantidade (>0) e preço (>0).', 'error');
            return;
        }
        if (detalhesVenda) {
            setDetalhesVenda(prev => prev ? { ...prev, itens: editItensVenda } : null);
            showToast('Venda completa salva!', 'success');
        }
        setIsVendaCompletaModalOpen(false);
    };

    const handleConfirmEnviarRastreamento = useCallback(() => {
        if (!detalhesVenda) return;
        if (!currentTrackingLink && !currentTrackingCode && !currentTransportadora) {
            showToast('Preencha os campos de rastreamento para enviar o e-mail.', 'error');
            return;
        }
        openConfirmModal(
            'Confirmar Envio de Rastreamento',
            'Deseja realmente enviar o e-mail de rastreamento para o cliente e atualizar o status para "Enviada"?',
            () => {
                console.log('ENVIANDO RASTREAMENTO:', { id: detalhesVenda.id, link: currentTrackingLink, code: currentTrackingCode, transportadora: currentTransportadora });
                setDetalhesVenda(prev => {
                    if (!prev) return null;
                    const newHistory = [...prev.historicoStatus];
                    const dataAtual = new Date().toLocaleString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
                    if (prev.statusAtual !== 'enviada') {
                        newHistory.push({ status: 'enviada', dataHora: dataAtual, observacao: 'E-mail de rastreamento enviado.' });
                    } else {
                        newHistory.push({ status: 'enviada', dataHora: dataAtual, observacao: 'E-mail de rastreamento reenviado.' });
                    }
                    return { ...prev, trackingLink: currentTrackingLink, trackingCode: currentTrackingCode, transportadora: currentTransportadora, dataEnvio: dataAtual, statusAtual: 'enviada', historicoStatus: newHistory };
                });
                setEditingEnvio(false);
                showToast('Rastreamento enviado e status atualizado!', 'success');
                setIsConfirmModalOpen(false);
            }
        );
    }, [detalhesVenda, currentTrackingLink, currentTrackingCode, currentTransportadora, showToast, openConfirmModal]);


    const handleConfirmCancelarVenda = useCallback(() => {
        if (!detalhesVenda) return;
        openConfirmModal(
            'Confirmar Cancelamento',
            `Deseja realmente cancelar a venda #${detalhesVenda.id}? Esta ação não poderá ser desfeita.`,
            () => {
                console.log(`Cancelando venda #${detalhesVenda.id}`);
                setDetalhesVenda(prev => {
                    if (!prev) return null;
                    const newHistory = [...prev.historicoStatus, { status: 'cancelada', dataHora: new Date().toLocaleString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }), observacao: 'Venda cancelada pelo lojista' }];
                    return { ...prev, statusAtual: 'cancelada', historicoStatus: newHistory };
                });
                showToast('Venda cancelada com sucesso!', 'success');
                setIsConfirmModalOpen(false);
            },
            'Sim, Cancelar'
        );
    }, [detalhesVenda, showToast, openConfirmModal]);

    const handleConfirmArquivarVenda = useCallback(() => {
        if (!detalhesVenda) return;
        openConfirmModal(
            'Confirmar Arquivamento',
            `Deseja realmente arquivar a venda #${detalhesVenda.id}? Ela ficará oculta na lista principal.`,
            () => {
                console.log(`Arquivando venda #${detalhesVenda.id}`);
                setDetalhesVenda(prev => {
                    if (!prev) return null;
                    const newHistory = [...prev.historicoStatus, { status: 'arquivado', dataHora: new Date().toLocaleString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }), observacao: 'Venda arquivada pelo lojista' }];
                    return { ...prev, statusAtual: 'arquivado', historicoStatus: newHistory };
                });
                showToast('Venda arquivada com sucesso!', 'success');
                setIsConfirmModalOpen(false);
            },
            'Sim, Arquivar'
        );
    }, [detalhesVenda, showToast, openConfirmModal]);

    const handleConfirmReabrirVenda = useCallback(() => {
        if (!detalhesVenda) return;
        openConfirmModal(
            'Confirmar Reabertura',
            `Deseja realmente reabrir a venda #${detalhesVenda.id}? O status será alterado para "Pendente".`,
            () => {
                console.log(`Reabrindo venda #${detalhesVenda.id}`);
                setDetalhesVenda(prev => {
                    if (!prev) return null;
                    const newHistory = [...prev.historicoStatus, { status: 'pendente', dataHora: new Date().toLocaleString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }), observacao: 'Venda reaberta pelo lojista' }];
                    return { ...prev, statusAtual: 'pendente', historicoStatus: newHistory };
                });
                showToast('Venda reaberta com sucesso!', 'success');
                setIsConfirmModalOpen(false);
            },
            'Sim, Reabrir'
        );
    }, [detalhesVenda, showToast, openConfirmModal]);


    useEffect(() => {
        if (venda) {
            const dadosFormatados = transformData(venda);
            setDetalhesVenda(dadosFormatados);
            setCurrentTrackingLink(dadosFormatados.trackingLink || '');
            setCurrentTrackingCode(dadosFormatados.trackingCode || '');
            setCurrentTransportadora(dadosFormatados.transportadora || '');
            setLoading(false);
        } else {
            setError('Nenhum dado de venda fornecido.');
            setLoading(false);
        }
    }, [venda]);


    const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

    const formatPhoneForWhatsApp = (phone: string | undefined): string | null => {
        if (!phone) return null;
        const digitsOnly = phone.replace(/\D/g, '');
        if (digitsOnly.length >= 10 && digitsOnly.length <= 13) {
            if (digitsOnly.startsWith('55')) {
                return `https://wa.me/${digitsOnly}`;
            }
            return `https://wa.me/55${digitsOnly}`;
        }
        return null;
    };


    if (loading) return <div className="loading">Carregando detalhes da venda...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!detalhesVenda) return <div className="no-data">Nenhum detalhe da venda encontrado.</div>;

    return (
        <div className="detalhes-venda-container">
            <div className="page-header">
                <h1>Detalhes da Venda: #{detalhesVenda.id}</h1>
                <div className="header-actions">
                    <button onClick={() => window.history.back()} className="back-button">Voltar para Lista</button>
                    <button onClick={handleEditVendaCompleta} className="edit-button">Editar Venda Completa</button>
                    <button onClick={handleConfirmCancelarVenda} className="cancel-button">Cancelar Venda</button>
                </div>
            </div>

            <div className="status-action-bar">
                <div className="current-status-display">
                    <strong>Status Atual:</strong>
                    <span className={`status-badge ${detalhesVenda.statusAtual}`}>
                        {getStatusDisplayName(detalhesVenda.statusAtual)}
                    </span>
                </div>
                <div className="status-change-control">
                    <label htmlFor="select-status-action">Alterar Status:</label>
                    <select
                        id="select-status-action"
                        value={detalhesVenda.statusAtual}
                        onChange={(e) => {
                            const newStatus = e.target.value as DetalhesVenda['statusAtual'];
                            openConfirmModal(
                                'Confirmar Alteração de Status',
                                `Deseja realmente alterar o status da venda para "${getStatusDisplayName(newStatus)}"?`,
                                () => {
                                    setDetalhesVenda(prev => {
                                        if (!prev) return null;
                                        const newHistory = [...prev.historicoStatus, { status: newStatus, dataHora: new Date().toLocaleString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }), observacao: 'Alterado via seleção rápida' }];
                                        return { ...prev, statusAtual: newStatus, historicoStatus: newHistory };
                                    });
                                    showToast('Status atualizado!', 'success');
                                    setIsConfirmModalOpen(false);
                                }
                            );
                        }}
                        className="status-select-dropdown"
                    >
                        <optgroup label="Status do Pedido">
                            <option value="em_processamento">Em Processamento</option>
                            <option value="separando">Separando Pedido</option>
                            <option value="confeccao">Em Confecção</option>
                            <option value="fabricacao">Em Fabricação</option>
                            <option value="enviada">Enviada</option>
                            <option value="entregue">Entregue</option>
                            <option value="concluida">Concluída</option>
                            <option value="pendente">Pendente</option>
                            <option value="cancelada">Cancelada</option>
                        </optgroup>
                    </select>
                </div>
                {detalhesVenda.statusAtual !== 'arquivado' ? (
                    <button
                        onClick={handleConfirmArquivarVenda}
                        className="archive-button">Arquivar Venda
                    </button>
                ) : (
                    <button
                        onClick={handleConfirmReabrirVenda}
                        className="reabrir-button">Reabrir Venda
                    </button>
                )}
            </div>

            <div className="venda-details-grid">
                <div className="left-column">
                    <div className="detail-card full-width info-itens">
                        <h3>Itens da Venda</h3>
                        <table className="itens-venda-table">
                            <thead>
                                <tr>
                                    <th>Imagem</th>
                                    <th>Produto</th>
                                    <th>SKU</th>
                                    <th>Qtd</th>
                                    <th>Preço Unit.</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalhesVenda.itens.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            {item.imagemUrl && (
                                                <img src={item.imagemUrl} alt={item.nomeProduto} className="product-item-thumbnail" />
                                            )}
                                            {!item.imagemUrl && <div className="no-image-placeholder">Sem Imagem</div>}
                                        </td>
                                        <td data-label="Produto:">
                                            <p>{item.nomeProduto} {item.variantes && `(${item.variantes})`}</p>
                                        </td>
                                        <td data-label="SKU:">
                                            <p><strong>SKU:</strong> {item.skuProduto}</p>
                                        </td>
                                        <td data-label="Qtd:">{item.quantidade}</td>
                                        <td data-label="Preço Unit.:">{formatCurrency(item.precoUnitario)}</td>
                                        <td data-label="Subtotal:">{formatCurrency(item.quantidade * item.precoUnitario)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="detail-card full-width info-historico">
                        <h3>Histórico de Status</h3>
                        <ul className="status-history-list">
                            {detalhesVenda.historicoStatus.map((hist, index) => (
                                <li key={index}>
                                    <strong>{getStatusDisplayName(hist.status)}</strong> em {hist.dataHora}
                                    {hist.observacao && ` - ${hist.observacao}`}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="detail-card full-width info-observacoes-internas">
                        <h3>Observações Internas <span onClick={() => setIsObsInternasModalOpen(true)}><IconeEditar /></span></h3>
                        <p>{detalhesVenda.observacoesInternas || "Nenhuma observação interna."}</p>
                    </div>
                </div>

                <div className="right-column">
                    <div className="detail-card info-cliente">
                        <h3>Informações do Cliente <span onClick={() => setIsClienteModalOpen(true)}><IconeEditar /></span></h3>
                        <p><strong>Nome:</strong> {detalhesVenda.cliente.nome}</p>
                        <p><strong>Email:</strong> {detalhesVenda.cliente.email}</p>
                        {detalhesVenda.cliente.telefone && formatPhoneForWhatsApp(detalhesVenda.cliente.telefone) ? (
                            <p className="whatsapp-info-line">
                                <a href={formatPhoneForWhatsApp(detalhesVenda.cliente.telefone) as string}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="whatsapp-link">
                                    <FaWhatsapp /> {detalhesVenda.cliente.telefone}
                                </a>
                            </p>
                        ) : (
                            <p><strong>Telefone:</strong> {detalhesVenda.cliente.telefone || 'Não informado'}</p>
                        )}
                        <p><strong>CPF/CNPJ:</strong> {detalhesVenda.cliente.cpfCnpj}</p>
                        {detalhesVenda.observacoesCliente && (
                            <p><strong>Obs. do Cliente:</strong> {detalhesVenda.observacoesCliente}</p>
                        )}
                    </div>

                    <div className="detail-card info-endereco">
                        <h3>Endereço de Entrega <span onClick={() => setIsEnderecoModalOpen(true)}><IconeEditar /></span></h3>
                        <p>{detalhesVenda.enderecoEntrega.rua}, {detalhesVenda.enderecoEntrega.numero} {detalhesVenda.enderecoEntrega.complemento}</p>
                        <p>{detalhesVenda.enderecoEntrega.bairro}, {detalhesVenda.enderecoEntrega.cidade} - {detalhesVenda.enderecoEntrega.estado}</p>
                        <p>CEP: {detalhesVenda.enderecoEntrega.cep}</p>
                    </div>

                    <div className="detail-card info-envio">
                        <h3>Informações de Envio { !editingEnvio && <span onClick={() => setEditingEnvio(true)}><IconeEditar /></span> }</h3>
                        {editingEnvio ? (
                            <>
                                <p>
                                    <strong>Transportadora:</strong> <input type="text" value={currentTransportadora} onChange={(e) => setCurrentTransportadora(e.target.value)} className="edit-input" placeholder="Nome da Transportadora"/>
                                </p>
                                <p>
                                    <strong>Cód. Rastreio:</strong> <input type="text" value={currentTrackingCode} onChange={(e) => setCurrentTrackingCode(e.target.value)} className="edit-input" placeholder="Código de Rastreamento"/>
                                </p>
                                <p>
                                    <strong>Link Rastreamento:</strong> <input type="text" value={currentTrackingLink} onChange={(e) => setCurrentTrackingLink(e.target.value)} className="edit-input" placeholder="Link Completo do Rastreamento"/>
                                </p>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleConfirmEnviarRastreamento(); }} className="send-email-text-link">
                                    Enviar Rastreamento por E-mail <IconeEnvio/>
                                </a>
                                <button onClick={() => setEditingEnvio(false)} className="cancel-button">Cancelar Edição</button>
                            </>
                        ) : (
                            <>
                                {detalhesVenda.transportadora && <p><strong>Transportadora:</strong> {detalhesVenda.transportadora}</p>}
                                {detalhesVenda.trackingCode && <p><strong>Cód. Rastreio:</strong> {detalhesVenda.trackingCode}</p>}
                                {detalhesVenda.trackingLink ? (
                                    <p><strong>Link Rastreio:</strong> <a href={detalhesVenda.trackingLink as string} target="_blank" rel="noopener noreferrer" className="tracking-link">{detalhesVenda.trackingLink}</a></p>
                                ) : (
                                    <p><strong>Link Rastreio:</strong> 'Não informado'</p>
                                )}
                                {detalhesVenda.dataEnvio && <p><strong>Data de Envio:</strong> {detalhesVenda.dataEnvio}</p>}
                                {(detalhesVenda.statusAtual !== 'enviada' && detalhesVenda.statusAtual !== 'entregue' && detalhesVenda.statusAtual !== 'cancelada' && detalhesVenda.statusAtual !== 'arquivado') && (
                                     <button onClick={() => setEditingEnvio(true)} className="send-tracking-button">Configurar e Enviar Rastreamento <IconeEnvio/></button>
                                )}
                                {detalhesVenda.statusAtual === 'enviada' && (
                                    <button onClick={() => setEditingEnvio(true)} className="send-tracking-button">Reenviar Rastreamento <IconeEnvio/></button>
                                )}
                            </>
                        )}
                    </div>
                    <div className="detail-card info-venda">
                        <h3>Informações da Venda</h3>
                        <p><strong>ID da Venda:</strong> {detalhesVenda.id}</p>
                        <p><strong>Data/Hora da Venda:</strong> {detalhesVenda.dataHoraVenda}</p>
                        <p>
                            <strong>Status Atual:</strong>
                            <span className={`status-badge ${detalhesVenda.statusAtual}`}>
                                {getStatusDisplayName(detalhesVenda.statusAtual)}
                            </span>
                        </p>
                        <p><strong>Total da Venda:</strong> {formatCurrency(detalhesVenda.totalVenda)}</p>
                        <p><strong>Forma de Pagamento:</strong> {detalhesVenda.formaPagamento}</p>
                    </div>
                </div>
            </div>

            <Modal isOpen={isClienteModalOpen} onClose={() => setIsClienteModalOpen(false)} title="Editar Informações do Cliente" onSave={handleSaveCliente}>
                <label>Nome:</label>
                <input type="text" value={editClienteNome} onChange={(e) => setEditClienteNome(e.target.value)} />

                <label>Email:</label>
                <input type="email" value={editClienteEmail} onChange={(e) => setEditClienteEmail(e.target.value)} />

                <label>Telefone:</label>
                <input type="tel" value={editClienteTelefone} onChange={(e) => setEditClienteTelefone(e.target.value)} />

                <label>CPF/CNPJ:</label>
                <input type="text" value={editClienteCpfCnpj} onChange={(e) => setEditClienteCpfCnpj(e.target.value)} />
            </Modal>

            <Modal isOpen={isEnderecoModalOpen} onClose={() => setIsEnderecoModalOpen(false)} title="Editar Endereço de Entrega" onSave={handleSaveEndereco}>
                <label>CEP:</label>
                <input type="text" value={editEnderecoCep} onChange={handleCepChange} placeholder="Ex: 01234567" />

                <label>Rua:</label>
                <input type="text" value={editEnderecoRua} onChange={(e) => setEditEnderecoRua(e.target.value)} />

                <label>Número:</label>
                <input type="text" value={editEnderecoNumero} onChange={(e) => setEditEnderecoNumero(e.target.value)} />

                <label>Complemento:</label>
                <input type="text" value={editEnderecoComplemento} onChange={(e) => setEditEnderecoComplemento(e.target.value)} />

                <label>Bairro:</label>
                <input type="text" value={editEnderecoBairro} onChange={(e) => setEditEnderecoBairro(e.target.value)} />

                <label>Cidade:</label>
                <input type="text" value={editEnderecoCidade} onChange={(e) => setEditEnderecoCidade(e.target.value)} />

                <label>Estado (UF):</label>
                <input type="text" value={editEnderecoEstado} onChange={(e) => setEditEnderecoEstado(e.target.value)} maxLength={2} />
                {isCepLoading && editEnderecoCep.length === 8 && <p className="loading-message">Buscando CEP...</p>}
            </Modal>

            <Modal isOpen={isObsInternasModalOpen} onClose={() => setIsObsInternasModalOpen(false)} title="Editar Observações Internas" onSave={handleSaveObsInternas}>
                <label>Observações:</label>
                <textarea value={editObsInternas} onChange={(e) => setEditObsInternas(e.target.value)} rows={5}></textarea>
            </Modal>

            <Modal isOpen={isVendaCompletaModalOpen} onClose={() => setIsVendaCompletaModalOpen(false)} title="Editar Venda Completa" onSave={handleSaveVendaCompleta} saveButtonText="Salvar Alterações na Venda">
                <h3>Itens da Venda</h3>
                <div className="modal-itens-list">
                    {editItensVenda.map((item, index) => (
                        <div key={index} className="modal-item-row">
                            <div className="modal-item-info">
                                <img src={item.imagemUrl || '/assets/placeholder.jpg'} alt={item.nomeProduto} className="modal-item-thumbnail" />
                                <div>
                                    <p><strong>Produto:</strong> {item.nomeProduto} {item.variantes && `(${item.variantes})`}</p>
                                </div>
                            </div>
                            <div className="modal-item-controls">
                                <label>Qtd:</label>
                                <input
                                    type="number"
                                    value={item.quantidade}
                                    onChange={(e) => handleUpdateItemQuantity(index, parseInt(e.target.value))}
                                    min="1"
                                    className="modal-qty-input"
                                />
                                <button onClick={() => handleRemoveItem(index)} className="modal-remove-item-button"><IconeRemover /></button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={handleAddItem} className="modal-add-item-button"><IconeAdicionar /> Adicionar Item</button>

                <div className="modal-add-product-search">
                    <label>Buscar e Adicionar Produto:</label>
                    <input
                        type="text"
                        placeholder="Nome ou SKU do produto"
                        onBlur={(e) => handleProductSearchForAddItem(e.target.value, editItensVenda.length)}
                        className="edit-input"
                    />
                    <p className="hint-text">Digite o nome/SKU e clique fora para buscar (simulação)</p>
                </div>

            </Modal>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {confirmModalData && (
                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={confirmModalData.onConfirm}
                    title={confirmModalData.title}
                    message={confirmModalData.message}
                    confirmText={confirmModalData.confirmText}
                />
            )}

        </div>
    );
};

export default DetalhesDaVenda;