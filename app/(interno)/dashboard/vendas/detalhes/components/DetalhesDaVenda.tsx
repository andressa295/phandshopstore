'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './DetalhesDaVenda.css'; // Usando CSS Modules
import Modal from './Modal'; // Assumindo que Modal.tsx existe
import ConfirmModal from './ConfirmModal'; // Assumindo que ConfirmModal.tsx existe
import Toast from './Toast'; // Assumindo que Toast.tsx existe
import { FaWhatsapp } from "react-icons/fa";

// Importa todas as interfaces necessárias do arquivo centralizado de tipos
import type { 
    DetalhesVendaProp, 
    ClienteVenda, 
    Endereco, 
    ToastType, 
    ModalProps, 
    ConfirmModalProps, 
    StatusVenda, // Importado para tipar o status
    ItemVendido // Importado para tipar os itens da venda
} from './types'; 

// Ícones SVG inline, estilo e cursor já embutidos
const IconeEditar = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#820AD1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8, cursor: 'pointer', verticalAlign: 'middle' }}>
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

// Funções utilitárias de validação
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string) => /^\d{10,11}$/.test(phone.replace(/\D/g, ''));
const validateDocument = (doc: string) => doc.replace(/\D/g, '').length >= 11;

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

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

const getStatusDisplayName = (status: DetalhesVendaProp['status']): string => {
    const mapStatus: Record<DetalhesVendaProp['status'], string> = {
        pendente: 'Pendente',
        pago: 'Pago',
        cancelado: 'Cancelado',
        enviado: 'Enviada',
        entregue: 'Entregue',
        separando: 'Separando Pedido',
        confeccao: 'Em Confecção',
        fabricacao: 'Em Fabricação',
        arquivado: 'Arquivado',
    };
    return mapStatus[status] || status;
};

const DetalhesDaVenda: React.FC<{ venda: DetalhesVendaProp | null }> = ({ venda }) => {
    const supabase = createClientComponentClient();

    // Estados principais
    const [detalhesVenda, setDetalhesVenda] = useState<DetalhesVendaProp | null>(venda);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const [isCepLoading, setIsCepLoading] = useState(false);
    const [editingEnvio, setEditingEnvio] = useState(false);

    const [currentTrackingLink, setCurrentTrackingLink] = useState(venda?.tracking_link ?? '');
    const [currentTrackingCode, setCurrentTrackingCode] = useState(venda?.tracking_codigo ?? '');
    const [currentTransportadora, setCurrentTransportadora] = useState(venda?.transportadora ?? '');
    
    // Estados para os modais de edição
    const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
    const [isEnderecoModalOpen, setIsEnderecoModalOpen] = useState(false);
    const [isObsInternasModalOpen, setIsObsInternasModalOpen] = useState(false);
    
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmModalData, setConfirmModalData] = useState<{
        title: string;
        message: string;
        onConfirm: () => void;
        confirmText?: string;
    } | null>(null);

    // Edição Cliente
    const [editClienteNome, setEditClienteNome] = useState('');
    const [editClienteEmail, setEditClienteEmail] = useState('');
    const [editClienteTelefone, setEditClienteTelefone] = useState('');
    const [editClienteDocumento, setEditClienteDocumento] = useState('');

    // Edição Endereço
    const [editEnderecoRua, setEditEnderecoRua] = useState('');
    const [editEnderecoNumero, setEditEnderecoNumero] = useState('');
    const [editEnderecoComplemento, setEditEnderecoComplemento] = useState('');
    const [editEnderecoBairro, setEditEnderecoBairro] = useState('');
    const [editEnderecoCidade, setEditEnderecoCidade] = useState('');
    const [editEnderecoEstado, setEditEnderecoEstado] = useState('');
    const [editEnderecoCep, setEditEnderecoCep] = useState('');

    // Edição Observações Internas
    const [editObsInternas, setEditObsInternas] = useState('');

    // Atualiza dados iniciais sempre que props.venda mudar
    useEffect(() => {
        if (venda) {
            setDetalhesVenda(venda);
            setCurrentTrackingLink(venda.tracking_link ?? '');
            setCurrentTrackingCode(venda.tracking_codigo ?? '');
            setCurrentTransportadora(venda.transportadora ?? '');
        } else {
            setError('Nenhum dado de venda fornecido.');
        }
    }, [venda]);

    // Toast helper
    const showToast = useCallback((message: string, type: ToastType) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    // Confirm modal helper
    const openConfirmModal = useCallback((
        title: string,
        message: string,
        onConfirm: () => void,
        confirmText?: string
    ) => {
        setConfirmModalData({ title, message, onConfirm, confirmText });
        setIsConfirmModalOpen(true);
    }, []);

    // Edita cliente: abre modal com dados atuais
    const handleEditCliente = () => {
        if (!detalhesVenda?.cliente) return;
        const c = detalhesVenda.cliente;
        setEditClienteNome(c.nome);
        setEditClienteEmail(c.email);
        setEditClienteTelefone(c.telefone ?? '');
        setEditClienteDocumento(c.documento ?? '');
        setIsClienteModalOpen(true);
    };

    // Salva dados do cliente no supabase e estado local
    const handleSaveCliente = async () => {
        if (!editClienteNome.trim() || !editClienteEmail.trim() || !editClienteTelefone.trim()) {
            showToast('Preencha nome, email e telefone do cliente.', 'error');
            return;
        }
        if (!validateEmail(editClienteEmail)) {
            showToast('Email inválido.', 'error');
            return;
        }
        if (editClienteTelefone && !validatePhone(editClienteTelefone)) {
            showToast('Telefone inválido (apenas números, 10 ou 11 dígitos).', 'error');
            return;
        }

        if (!detalhesVenda?.cliente) return;

        setLoading(true);
        const { error } = await supabase
            .from('clientes')
            .update({
                nome: editClienteNome,
                email: editClienteEmail,
                telefone: editClienteTelefone,
                documento: editClienteDocumento,
            })
            .eq('id', detalhesVenda.cliente.id);
        setLoading(false);

        if (error) {
            console.error('Erro ao salvar cliente:', error);
            showToast('Erro ao salvar as informações do cliente.', 'error');
        } else {
            setDetalhesVenda((prev: DetalhesVendaProp | null) => prev ? { // Tipagem explícita para 'prev'
                ...prev,
                cliente: {
                    ...prev.cliente!,
                    nome: editClienteNome,
                    email: editClienteEmail,
                    telefone: editClienteTelefone,
                    documento: editClienteDocumento,
                } as ClienteVenda // Cast para ClienteVenda
            } : null);
            showToast('Informações do cliente salvas!', 'success');
            setIsClienteModalOpen(false);
        }
    };

    // Edita endereço: abre modal com dados atuais
    const handleEditEndereco = () => {
        if (!detalhesVenda?.endereco_entrega) return;
        const e = detalhesVenda.endereco_entrega;
        setEditEnderecoRua(e.rua);
        setEditEnderecoNumero(e.numero);
        setEditEnderecoComplemento(e.complemento ?? '');
        setEditEnderecoBairro(e.bairro);
        setEditEnderecoCidade(e.cidade);
        setEditEnderecoEstado(e.estado);
        setEditEnderecoCep(e.cep);
        setIsEnderecoModalOpen(true);
    };

    // Salva endereço no supabase e estado local
    const handleSaveEndereco = async () => {
        if (!detalhesVenda) return;
        setLoading(true);
        const novoEndereco: Endereco = { // Usando Endereco
            rua: editEnderecoRua,
            numero: editEnderecoNumero,
            complemento: editEnderecoComplemento,
            bairro: editEnderecoBairro,
            cidade: editEnderecoCidade,
            estado: editEnderecoEstado,
            cep: editEnderecoCep,
        };

        const { error } = await supabase
            .from('vendas')
            .update({ endereco_entrega: novoEndereco })
            .eq('id', detalhesVenda.id);
        setLoading(false);

        if (error) {
            console.error('Erro ao salvar endereço:', error);
            showToast('Erro ao salvar o endereço de entrega.', 'error');
        } else {
            setDetalhesVenda((prev: DetalhesVendaProp | null) => prev ? { ...prev, endereco_entrega: novoEndereco } : null); // Tipagem explícita para 'prev'
            showToast('Endereço salvo!', 'success');
            setIsEnderecoModalOpen(false);
        }
    };

    // Busca CEP automático via ViaCEP
    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');
        setEditEnderecoCep(cep);

        if (cep.length === 8) {
            setIsCepLoading(true);
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    setEditEnderecoRua(data.logradouro);
                    setEditEnderecoBairro(data.bairro);
                    setEditEnderecoCidade(data.localidade);
                    setEditEnderecoEstado(data.uf);
                    showToast('CEP preenchido automaticamente!', 'info');
                } else {
                    showToast('CEP não encontrado.', 'error');
                }
            } catch (err) {
                showToast('Erro ao buscar CEP.', 'error');
            } finally {
                setIsCepLoading(false);
            }
        }
    };

    // Editar observações internas
    const handleEditObservacoesInternas = () => {
        setEditObsInternas(detalhesVenda?.observacoes_internas ?? '');
        setIsObsInternasModalOpen(true);
    };

    // Salva observações internas
    const handleSaveObsInternas = async () => {
        if (!detalhesVenda) return;
        setLoading(true);
        const { error } = await supabase
            .from('vendas')
            .update({ observacoes_internas: editObsInternas })
            .eq('id', detalhesVenda.id);
        setLoading(false);

        if (error) {
            console.error('Erro ao salvar observações:', error);
            showToast('Erro ao salvar as observações internas.', 'error');
        } else {
            setDetalhesVenda((prev: DetalhesVendaProp | null) => prev ? { ...prev, observacoes_internas: editObsInternas } : null); // Tipagem explícita para 'prev'
            showToast('Observações internas salvas!', 'success');
            setIsObsInternasModalOpen(false);
        }
    };

    const handleUpdateStatus = useCallback(async (newStatus: StatusVenda) => { // Tipagem explícita para newStatus
        if (!detalhesVenda) return;
        const { error } = await supabase
            .from('vendas')
            .update({ status: newStatus })
            .eq('id', detalhesVenda.id);

        if (error) {
            console.error('Erro ao atualizar status:', error);
            showToast('Erro ao atualizar o status.', 'error');
        } else {
            setDetalhesVenda((prev: DetalhesVendaProp | null) => prev ? { ...prev, status: newStatus } : null); // Tipagem explícita para 'prev'
            showToast(`Status alterado para "${getStatusDisplayName(newStatus)}"!`, 'success');
        }
    }, [detalhesVenda, showToast]);

    const handleConfirmEnviarRastreamento = useCallback(async () => {
        if (!detalhesVenda) return;
        if (!currentTrackingLink && !currentTrackingCode && !currentTransportadora) {
            showToast('Preencha os campos de rastreamento para enviar o e-mail.', 'error');
            return;
        }

        openConfirmModal(
            'Confirmar Envio de Rastreamento',
            'Deseja realmente enviar o e-mail de rastreamento para o cliente e atualizar o status para "Enviada"?',
            async () => {
                const { error } = await supabase
                    .from('vendas')
                    .update({
                        tracking_link: currentTrackingLink,
                        tracking_codigo: currentTrackingCode,
                        transportadora: currentTransportadora,
                        data_envio: new Date().toISOString(),
                        status: 'enviado'
                    })
                    .eq('id', detalhesVenda.id);

                if (error) {
                    console.error('Erro ao enviar rastreamento:', error);
                    showToast('Erro ao enviar rastreamento e atualizar status.', 'error');
                } else {
                    setDetalhesVenda((prev: DetalhesVendaProp | null) => prev ? { // Tipagem explícita para 'prev'
                        ...prev,
                        tracking_link: currentTrackingLink,
                        tracking_codigo: currentTrackingCode,
                        transportadora: currentTransportadora,
                        data_envio: new Date().toISOString(),
                        status: 'enviado' as DetalhesVendaProp['status']
                    } : null);
                    setEditingEnvio(false);
                    showToast('Rastreamento enviado e status atualizado!', 'success');
                }
            }
        );
    }, [detalhesVenda, currentTrackingLink, currentTrackingCode, currentTransportadora, showToast, openConfirmModal]);

    const handleConfirmCancelarVenda = useCallback(() => {
        if (!detalhesVenda) return;
        openConfirmModal(
            'Confirmar Cancelamento',
            `Deseja realmente cancelar a venda #${detalhesVenda.id}? Esta ação não poderá ser desfeita.`,
            () => handleUpdateStatus('cancelado'),
            'Sim, Cancelar'
        );
    }, [detalhesVenda, openConfirmModal, handleUpdateStatus]);

    const handleConfirmArquivarVenda = useCallback(() => {
        if (!detalhesVenda) return;
        openConfirmModal(
            'Confirmar Arquivamento',
            `Deseja realmente arquivar a venda #${detalhesVenda.id}? Ela ficará oculta na lista principal.`,
            () => handleUpdateStatus('arquivado'),
            'Sim, Arquivar'
        );
    }, [detalhesVenda, openConfirmModal, handleUpdateStatus]);

    const handleConfirmReabrirVenda = useCallback(() => {
        if (!detalhesVenda) return;
        openConfirmModal(
            'Confirmar Reabertura',
            `Deseja realmente reabrir a venda #${detalhesVenda.id}? O status será alterado para "Pendente".`,
            () => handleUpdateStatus('pendente'),
            'Sim, Reabrir'
        );
    }, [detalhesVenda, openConfirmModal, handleUpdateStatus]);
    
    // As funções abaixo foram mantidas como placeholders, pois a lógica de edição de itens
    // e busca de produtos não foi implementada com o banco de dados.
    const handleEditVendaCompleta = () => {
      showToast('Funcionalidade de edição completa ainda não implementada com o banco.', 'info');
    };

    const handleRemoveItem = (indexToRemove: number) => {
      showToast('Funcionalidade ainda não implementada.', 'info');
    };

    const handleUpdateItemQuantity = (indexToUpdate: number, newQuantity: number) => {
      showToast('Funcionalidade ainda não implementada.', 'info');
    };

    const handleAddItem = () => {
      showToast('Funcionalidade ainda não implementada.', 'info');
    };
    
    const handleProductSearchForAddItem = (searchTerm: string, itemIndex: number) => {
      showToast('Funcionalidade ainda não implementada.', 'info');
    };

    const handleSaveVendaCompleta = () => {
      showToast('Funcionalidade ainda não implementada.', 'info');
    };
    
    if (!detalhesVenda) return <div className={styles['no-data']}>Nenhum detalhe da venda encontrado.</div>;
    
    return (
        <div className={styles['detalhes-venda-container']}>
            <div className={styles['page-header']}>
                <h1>Detalhes da Venda: #{detalhesVenda.id.substring(0, 8)}</h1>
                <div className={styles['header-actions']}>
                    <button onClick={() => window.history.back()} className={styles['back-button']}>Voltar para Lista</button>
                    <button onClick={handleEditVendaCompleta} className={styles['edit-button']}>Editar Venda Completa</button>
                    <button onClick={handleConfirmCancelarVenda} className={styles['cancel-button']}>Cancelar Venda</button>
                </div>
            </div>
            <div className={styles['status-action-bar']}>
                <div className={styles['current-status-display']}>
                    <strong>Status Atual:</strong>
                    <span className={`${styles['status-badge']} ${styles[detalhesVenda.status]}`}>
                        {getStatusDisplayName(detalhesVenda.status)}
                    </span>
                </div>
                <div className={styles['status-change-control']}>
                    <label htmlFor="select-status-action">Alterar Status:</label>
                    <select
                        id="select-status-action"
                        value={detalhesVenda.status}
                        onChange={(e) => {
                            const newStatus = e.target.value as StatusVenda; // Cast para StatusVenda
                            openConfirmModal(
                                'Confirmar Alteração de Status',
                                `Deseja realmente alterar o status da venda para "${getStatusDisplayName(newStatus)}"?`,
                                () => handleUpdateStatus(newStatus)
                            );
                        }}
                        className={styles['status-select-dropdown']}
                    >
                        <optgroup label="Status do Pedido">
                            <option value="pendente">Pendente</option>
                            <option value="pago">Pago</option>
                            <option value="separando">Separando Pedido</option>
                            <option value="confeccao">Em Confecção</option>
                            <option value="fabricacao">Em Fabricação</option>
                            <option value="enviado">Enviada</option>
                            <option value="entregue">Entregue</option>
                            <option value="cancelado">Cancelada</option>
                            <option value="arquivado">Arquivado</option>
                        </optgroup>
                    </select>
                </div>
                {detalhesVenda.status !== 'arquivado' ? (
                    <button
                        onClick={handleConfirmArquivarVenda}
                        className={styles['archive-button']}>Arquivar Venda
                    </button>
                ) : (
                    <button
                        onClick={handleConfirmReabrirVenda}
                        className={styles['reabrir-button']}>Reabrir Venda
                    </button>
                )}
            </div>
            <div className={styles['venda-details-grid']}>
                <div className={styles['left-column']}>
                    <div className={`${styles['detail-card']} ${styles['full-width']} ${styles['info-itens']}`}>
                        <h3>Itens da Venda</h3>
                        <table className={styles['itens-venda-table']}>
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Qtd</th>
                                    <th>Preço Unit.</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalhesVenda.itens_venda.map((item: ItemVendido, index: number) => ( // Tipagem explícita para item e index
                                    <tr key={item.id}>
                                        <td data-label="Produto:">{item.nome_produto}</td>
                                        <td data-label="Qtd:">{item.quantidade}</td>
                                        <td data-label="Preço Unit.:">{formatCurrency(item.preco_unitario)}</td>
                                        <td data-label="Subtotal:">{formatCurrency(item.quantidade * item.preco_unitario)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={`${styles['detail-card']} ${styles['full-width']} ${styles['info-observacoes-internas']}`}>
                        <h3>Observações Internas <span onClick={handleEditObservacoesInternas}><IconeEditar /></span></h3>
                        <p>{detalhesVenda.observacoes_internas || "Nenhuma observação interna."}</p>
                    </div>
                </div>
                <div className={styles['right-column']}>
                    <div className={`${styles['detail-card']} ${styles['info-cliente']}`}>
                        <h3>Informações do Cliente <span onClick={handleEditCliente}><IconeEditar /></span></h3>
                        <p><strong>Nome:</strong> {detalhesVenda.cliente?.nome || 'Não informado'}</p>
                        <p><strong>Email:</strong> {detalhesVenda.cliente?.email || 'Não informado'}</p>
                        {detalhesVenda.cliente?.telefone && formatPhoneForWhatsApp(detalhesVenda.cliente.telefone) ? (
                            <p className={styles['whatsapp-info-line']}>
                                <a href={formatPhoneForWhatsApp(detalhesVenda.cliente.telefone) as string}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles['whatsapp-link']}>
                                    <FaWhatsapp /> {detalhesVenda.cliente.telefone}
                                </a>
                            </p>
                        ) : (
                            <p><strong>Telefone:</strong> {detalhesVenda.cliente?.telefone || 'Não informado'}</p>
                        )}
                        <p><strong>CPF/CNPJ:</strong> {detalhesVenda.cliente?.documento || 'Não informado'}</p>
                        {detalhesVenda.observacoes_cliente && (
                            <p><strong>Obs. do Cliente:</strong> {detalhesVenda.observacoes_cliente}</p>
                        )}
                    </div>
                    <div className={`${styles['detail-card']} ${styles['info-endereco']}`}>
                        <h3>Endereço de Entrega <span onClick={handleEditEndereco}><IconeEditar /></span></h3>
                        <p>{detalhesVenda.endereco_entrega?.rua || 'Rua não informada'}, {detalhesVenda.endereco_entrega?.numero}</p>
                        <p>{detalhesVenda.endereco_entrega?.bairro}, {detalhesVenda.endereco_entrega?.cidade} - {detalhesVenda.endereco_entrega?.estado}</p>
                        <p>CEP: {detalhesVenda.endereco_entrega?.cep}</p>
                    </div>
                    <div className={`${styles['detail-card']} ${styles['info-envio']}`}>
                        <h3>Informações de Envio {!editingEnvio && <span onClick={() => setEditingEnvio(true)}><IconeEditar /></span>}</h3>
                        {editingEnvio ? (
                            <>
                                <p><strong>Transportadora:</strong> <input type="text" value={currentTransportadora} onChange={(e) => setCurrentTransportadora(e.target.value)} className={styles['edit-input']} placeholder="Nome da Transportadora"/></p>
                                <p><strong>Cód. Rastreio:</strong> <input type="text" value={currentTrackingCode} onChange={(e) => setCurrentTrackingCode(e.target.value)} className={styles['edit-input']} placeholder="Código de Rastreamento"/></p>
                                <p><strong>Link Rastreamento:</strong> <input type="text" value={currentTrackingLink} onChange={(e) => setCurrentTrackingLink(e.target.value)} className={styles['edit-input']} placeholder="Link Completo do Rastreamento"/></p>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleConfirmEnviarRastreamento(); }} className={styles['send-email-text-link']}>
                                    Enviar Rastreamento por E-mail <IconeEnvio/>
                                </a>
                                <button onClick={() => setEditingEnvio(false)} className={styles['cancel-button']}>Cancelar Edição</button>
                            </>
                        ) : (
                            <>
                                {detalhesVenda.transportadora && <p><strong>Transportadora:</strong> {detalhesVenda.transportadora}</p>}
                                {detalhesVenda.tracking_codigo && <p><strong>Cód. Rastreio:</strong> {detalhesVenda.tracking_codigo}</p>}
                                {detalhesVenda.tracking_link ? (
                                    <p><strong>Link Rastreio:</strong> <a href={detalhesVenda.tracking_link as string} target="_blank" rel="noopener noreferrer" className={styles['tracking-link']}>{detalhesVenda.tracking_link}</a></p>
                                ) : (
                                    <p><strong>Link Rastreio:</strong> 'Não informado'</p>
                                )}
                                {detalhesVenda.data_envio && <p><strong>Data de Envio:</strong> {new Date(detalhesVenda.data_envio).toLocaleDateString()}</p>}
                                {(detalhesVenda.status !== 'enviado' && detalhesVenda.status !== 'entregue' && detalhesVenda.status !== 'cancelado' && detalhesVenda.status !== 'arquivado') && (
                                    <button onClick={() => setEditingEnvio(true)} className={styles['send-tracking-button']}>Configurar e Enviar Rastreamento <IconeEnvio/></button>
                                )}
                                {detalhesVenda.status === 'enviado' && (
                                    <button onClick={() => setEditingEnvio(true)} className={styles['send-tracking-button']}>Reenviar Rastreamento <IconeEnvio/></button>
                                )}
                            </>
                        )}
                    </div>
                    <div className={`${styles['detail-card']} ${styles['info-venda']}`}>
                        <h3>Informações da Venda</h3>
                        <p><strong>ID da Venda:</strong> {detalhesVenda.id.substring(0, 8)}...</p>
                        <p><strong>Data/Hora da Venda:</strong> {new Date(detalhesVenda.created_at).toLocaleString('pt-BR')}</p>
                        <p>
                            <strong>Status Atual:</strong>
                            <span className={`${styles['status-badge']} ${styles[detalhesVenda.status]}`}>
                                {getStatusDisplayName(detalhesVenda.status)}
                            </span>
                        </p>
                        <p><strong>Total da Venda:</strong> {formatCurrency(detalhesVenda.valor_total)}</p>
                        <p><strong>Forma de Pagamento:</strong> {detalhesVenda.metodo_pagamento || 'Não informado'}</p>
                    </div>
                </div>
            </div>
            {/* Modals de Edição */}
            <Modal isOpen={isClienteModalOpen} onClose={() => setIsClienteModalOpen(false)} title="Editar Informações do Cliente" onSave={handleSaveCliente}>
                <label>Nome:</label>
                <input type="text" value={editClienteNome} onChange={(e) => setEditClienteNome(e.target.value)} />
                <label>Email:</label>
                <input type="email" value={editClienteEmail} onChange={(e) => setEditClienteEmail(e.target.value)} />
                <label>Telefone:</label>
                <input type="tel" value={editClienteTelefone} onChange={(e) => setEditClienteTelefone(e.target.value)} />
                <label>CPF/CNPJ:</label>
                <input type="text" value={editClienteDocumento} onChange={(e) => setEditClienteDocumento(e.target.value)} />
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
                {isCepLoading && editEnderecoCep.length === 8 && <p className={styles['loading-message']}>Buscando CEP...</p>}
            </Modal>
            <Modal isOpen={isObsInternasModalOpen} onClose={() => setIsObsInternasModalOpen(false)} title="Editar Observações Internas" onSave={handleSaveObsInternas}>
                <label>Observações:</label>
                <textarea value={editObsInternas} onChange={(e) => setEditObsInternas(e.target.value)} rows={5}></textarea>
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
