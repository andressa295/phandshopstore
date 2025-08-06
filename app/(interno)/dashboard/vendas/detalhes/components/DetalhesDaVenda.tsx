'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useParams } from 'next/navigation';
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

// Interfaces ajustadas para corresponderem ao nosso esquema de banco de dados
interface ItemVendido {
    id: string;
    nome_produto: string;
    quantidade: number;
    preco_unitario: number;
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
    telefone: string | null;
    documento: string | null;
}

interface DetalhesVendaProp {
    id: string;
    created_at: string;
    // CORREÇÃO: Ajustando a interface para o tipo de união correto
    status: 'pendente' | 'pago' | 'cancelado' | 'enviado' | 'entregue' | 'separando' | 'confeccao' | 'fabricacao' | 'arquivado';
    valor_total: number;
    metodo_pagamento: string;
    cliente: ClienteVenda | null;
    endereco_entrega: Endereco | null;
    itens_venda: ItemVendido[];
    observacoes_cliente?: string | null;
    observacoes_internas?: string | null;
    tracking_link?: string | null;
    tracking_codigo?: string | null;
    transportadora?: string | null;
    data_envio?: string | null;
}

const getStatusDisplayName = (status: DetalhesVendaProp['status']): string => {
    switch (status) {
        case 'pendente': return 'Pendente';
        case 'pago': return 'Pago';
        case 'cancelado': return 'Cancelado';
        case 'enviado': return 'Enviada';
        case 'entregue': return 'Entregue';
        case 'separando': return 'Separando Pedido';
        case 'confeccao': return 'Em Confecção';
        case 'fabricacao': return 'Em Fabricação';
        case 'arquivado': return 'Arquivado';
        default: return status;
    }
};

// Funções utilitárias de validação
const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string) => /^\d{10,11}$/.test(phone.replace(/\D/g, ''));
const validateDocument = (doc: string) => doc.replace(/\D/g, '').length >= 11;

const DetalhesDaVenda: React.FC<{ venda: DetalhesVendaProp | null }> = ({ venda }) => {
    const supabase = createClientComponentClient();
    const [detalhesVenda, setDetalhesVenda] = useState<DetalhesVendaProp | null>(venda);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const [isCepLoading, setIsCepLoading] = useState(false);
    const [editingEnvio, setEditingEnvio] = useState(false);
    const [currentTrackingLink, setCurrentTrackingLink] = useState(venda?.tracking_link || '');
    const [currentTrackingCode, setCurrentTrackingCode] = useState(venda?.tracking_codigo || '');
    const [currentTransportadora, setCurrentTransportadora] = useState(venda?.transportadora || '');
    
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
    
    // Estados para os modais de edição
    const [editClienteNome, setEditClienteNome] = useState('');
    const [editClienteEmail, setEditClienteEmail] = useState('');
    const [editClienteTelefone, setEditClienteTelefone] = useState('');
    const [editClienteDocumento, setEditClienteDocumento] = useState('');
    
    const [editEnderecoRua, setEditEnderecoRua] = useState('');
    const [editEnderecoNumero, setEditEnderecoNumero] = useState('');
    const [editEnderecoComplemento, setEditEnderecoComplemento] = useState('');
    const [editEnderecoBairro, setEditEnderecoBairro] = useState('');
    const [editEnderecoCidade, setEditEnderecoCidade] = useState('');
    const [editEnderecoEstado, setEditEnderecoEstado] = useState('');
    const [editEnderecoCep, setEditEnderecoCep] = useState('');
    
    const [editObsInternas, setEditObsInternas] = useState('');
    
    useEffect(() => {
        if (venda) {
            setDetalhesVenda(venda);
            setCurrentTrackingLink(venda.tracking_link || '');
            setCurrentTrackingCode(venda.tracking_codigo || '');
            setCurrentTransportadora(venda.transportadora || '');
        } else {
            setError('Nenhum dado de venda fornecido.');
        }
    }, [venda]);


    // Funções de edição
    const handleEditCliente = () => {
        if (detalhesVenda && detalhesVenda.cliente) {
            setEditClienteNome(detalhesVenda.cliente.nome);
            setEditClienteEmail(detalhesVenda.cliente.email);
            setEditClienteTelefone(detalhesVenda.cliente.telefone || '');
            setEditClienteDocumento(detalhesVenda.cliente.documento || '');
        }
        setIsClienteModalOpen(true);
    };

    const handleSaveCliente = async () => {
        if (!editClienteNome || !editClienteEmail || !editClienteTelefone) {
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
        
        if (detalhesVenda && detalhesVenda.cliente) {
            const { error } = await supabase
                .from('clientes')
                .update({ 
                    nome: editClienteNome,
                    email: editClienteEmail,
                    telefone: editClienteTelefone,
                    documento: editClienteDocumento
                })
                .eq('id', detalhesVenda.cliente.id);
            
            if (error) {
                console.error('Erro ao salvar cliente:', error);
                showToast('Erro ao salvar as informações do cliente.', 'error');
            } else {
                setDetalhesVenda(prev => prev ? { 
                    ...prev, 
                    cliente: {
                        ...prev.cliente,
                        nome: editClienteNome,
                        email: editClienteEmail,
                        telefone: editClienteTelefone,
                        documento: editClienteDocumento
                    } as ClienteVenda
                } : null);
                showToast('Informações do cliente salvas!', 'success');
                setIsClienteModalOpen(false);
            }
        }
    };
    
    const handleEditEndereco = () => {
        if (detalhesVenda && detalhesVenda.endereco_entrega) {
            setEditEnderecoRua(detalhesVenda.endereco_entrega.rua);
            setEditEnderecoNumero(detalhesVenda.endereco_entrega.numero);
            setEditEnderecoComplemento(detalhesVenda.endereco_entrega.complemento || '');
            setEditEnderecoBairro(detalhesVenda.endereco_entrega.bairro);
            setEditEnderecoCidade(detalhesVenda.endereco_entrega.cidade);
            setEditEnderecoEstado(detalhesVenda.endereco_entrega.estado);
            setEditEnderecoCep(detalhesVenda.endereco_entrega.cep);
        }
        setIsEnderecoModalOpen(true);
    };

    const handleSaveEndereco = async () => {
        if (!detalhesVenda) return;
        const novoEndereco: Endereco = {
            rua: editEnderecoRua,
            numero: editEnderecoNumero,
            bairro: editEnderecoBairro,
            cidade: editEnderecoCidade,
            estado: editEnderecoEstado,
            cep: editEnderecoCep,
            complemento: editEnderecoComplemento
        };
        
        const { error } = await supabase
            .from('vendas')
            .update({ endereco_entrega: novoEndereco })
            .eq('id', detalhesVenda.id);
        
        if (error) {
            console.error('Erro ao salvar endereço:', error);
            showToast('Erro ao salvar o endereço de entrega.', 'error');
        } else {
            setDetalhesVenda(prev => prev ? { ...prev, endereco_entrega: novoEndereco } : null);
            showToast('Endereço salvo!', 'success');
            setIsEnderecoModalOpen(false);
        }
    };

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');
        setEditEnderecoCep(cep);
        if (cep.length === 8) {
            setIsCepLoading(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
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
            }
            setIsCepLoading(false);
        }
    };
    
    const handleEditObservacoesInternas = () => {
        if (detalhesVenda) {
            setEditObsInternas(detalhesVenda.observacoes_internas || '');
        }
        setIsObsInternasModalOpen(true);
    };

    const handleSaveObsInternas = async () => {
        if (!detalhesVenda) return;
        const { error } = await supabase
            .from('vendas')
            .update({ observacoes_internas: editObsInternas })
            .eq('id', detalhesVenda.id);
        
        if (error) {
            console.error('Erro ao salvar observações:', error);
            showToast('Erro ao salvar as observações internas.', 'error');
        } else {
            setDetalhesVenda(prev => prev ? { ...prev, observacoes_internas: editObsInternas } : null);
            showToast('Observações internas salvas!', 'success');
            setIsObsInternasModalOpen(false);
        }
    };

    const handleUpdateStatus = useCallback(async (newStatus: string) => {
        if (!detalhesVenda) return;
        const { error } = await supabase
            .from('vendas')
            .update({ status: newStatus })
            .eq('id', detalhesVenda.id);

        if (error) {
            console.error('Erro ao atualizar status:', error);
            showToast('Erro ao atualizar o status.', 'error');
        } else {
            setDetalhesVenda(prev => prev ? { ...prev, status: newStatus as DetalhesVendaProp['status'] } : null);
            showToast(`Status alterado para "${getStatusDisplayName(newStatus as DetalhesVendaProp['status'])}"!`, 'success');
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
                    setDetalhesVenda(prev => prev ? {
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
    
    const [editItensVenda, setEditItensVenda] = useState<ItemVendido[]>([]);

    const handleEditVendaCompleta = () => {
      // CORREÇÃO: Usar showToast no lugar de alert
      showToast('Funcionalidade de edição completa ainda não implementada com o banco.', 'info');
    };

    const handleRemoveItem = (indexToRemove: number) => {
      // CORREÇÃO: Usar showToast no lugar de alert
      showToast('Funcionalidade ainda não implementada.', 'info');
    };

    const handleUpdateItemQuantity = (indexToUpdate: number, newQuantity: number) => {
      // CORREÇÃO: Usar showToast no lugar de alert
      showToast('Funcionalidade ainda não implementada.', 'info');
    };

    const handleAddItem = () => {
      // CORREÇÃO: Usar showToast no lugar de alert
      showToast('Funcionalidade ainda não implementada.', 'info');
    };
    
    const handleProductSearchForAddItem = (searchTerm: string, itemIndex: number) => {
      // CORREÇÃO: Usar showToast no lugar de alert
      showToast('Funcionalidade ainda não implementada.', 'info');
    };

    const handleSaveVendaCompleta = () => {
      // CORREÇÃO: Usar showToast no lugar de alert
      showToast('Funcionalidade ainda não implementada.', 'info');
    };

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
    
    if (!detalhesVenda) return <div className="no-data">Nenhum detalhe da venda encontrado.</div>;
    
    return (
        <div className="detalhes-venda-container">
            <div className="page-header">
                <h1>Detalhes da Venda: #{detalhesVenda.id.substring(0, 8)}</h1>
                <div className="header-actions">
                    <button onClick={() => window.history.back()} className="back-button">Voltar para Lista</button>
                    <button onClick={handleEditVendaCompleta} className="edit-button">Editar Venda Completa</button>
                    <button onClick={handleConfirmCancelarVenda} className="cancel-button">Cancelar Venda</button>
                </div>
            </div>
            <div className="status-action-bar">
                <div className="current-status-display">
                    <strong>Status Atual:</strong>
                    <span className={`status-badge ${detalhesVenda.status}`}>
                        {getStatusDisplayName(detalhesVenda.status)}
                    </span>
                </div>
                <div className="status-change-control">
                    <label htmlFor="select-status-action">Alterar Status:</label>
                    <select
                        id="select-status-action"
                        value={detalhesVenda.status}
                        onChange={(e) => {
                            const newStatus = e.target.value;
                            openConfirmModal(
                                'Confirmar Alteração de Status',
                                `Deseja realmente alterar o status da venda para "${getStatusDisplayName(newStatus as DetalhesVendaProp['status'])}"?`,
                                () => handleUpdateStatus(newStatus)
                            );
                        }}
                        className="status-select-dropdown"
                    >
                        <optgroup label="Status do Pedido">
                            <option value="pendente">Pendente</option>
                            <option value="pago">Pago</option>
                            <option value="separando">Separando Pedido</option>
                            <option value="em_confeccao">Em Confecção</option>
                            <option value="em_fabricacao">Em Fabricação</option>
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
                                    <th>Produto</th>
                                    <th>Qtd</th>
                                    <th>Preço Unit.</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalhesVenda.itens_venda.map((item, index) => (
                                    <tr key={index}>
                                        <td data-label="Produto:">{item.nome_produto}</td>
                                        <td data-label="Qtd:">{item.quantidade}</td>
                                        <td data-label="Preço Unit.:">{formatCurrency(item.preco_unitario)}</td>
                                        <td data-label="Subtotal:">{formatCurrency(item.quantidade * item.preco_unitario)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="detail-card full-width info-observacoes-internas">
                        <h3>Observações Internas <span onClick={handleEditObservacoesInternas}><IconeEditar /></span></h3>
                        <p>{detalhesVenda.observacoes_internas || "Nenhuma observação interna."}</p>
                    </div>
                </div>
                <div className="right-column">
                    <div className="detail-card info-cliente">
                        <h3>Informações do Cliente <span onClick={handleEditCliente}><IconeEditar /></span></h3>
                        <p><strong>Nome:</strong> {detalhesVenda.cliente?.nome || 'Não informado'}</p>
                        <p><strong>Email:</strong> {detalhesVenda.cliente?.email || 'Não informado'}</p>
                        {detalhesVenda.cliente?.telefone && formatPhoneForWhatsApp(detalhesVenda.cliente.telefone) ? (
                            <p className="whatsapp-info-line">
                                <a href={formatPhoneForWhatsApp(detalhesVenda.cliente.telefone) as string}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="whatsapp-link">
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
                    <div className="detail-card info-endereco">
                        <h3>Endereço de Entrega <span onClick={handleEditEndereco}><IconeEditar /></span></h3>
                        <p>{detalhesVenda.endereco_entrega?.rua || 'Rua não informada'}, {detalhesVenda.endereco_entrega?.numero}</p>
                        <p>{detalhesVenda.endereco_entrega?.bairro}, {detalhesVenda.endereco_entrega?.cidade} - {detalhesVenda.endereco_entrega?.estado}</p>
                        <p>CEP: {detalhesVenda.endereco_entrega?.cep}</p>
                    </div>
                    <div className="detail-card info-envio">
                        <h3>Informações de Envio {!editingEnvio && <span onClick={() => setEditingEnvio(true)}><IconeEditar /></span>}</h3>
                        {editingEnvio ? (
                            <>
                                <p><strong>Transportadora:</strong> <input type="text" value={currentTransportadora} onChange={(e) => setCurrentTransportadora(e.target.value)} className="edit-input" placeholder="Nome da Transportadora"/></p>
                                <p><strong>Cód. Rastreio:</strong> <input type="text" value={currentTrackingCode} onChange={(e) => setCurrentTrackingCode(e.target.value)} className="edit-input" placeholder="Código de Rastreamento"/></p>
                                <p><strong>Link Rastreamento:</strong> <input type="text" value={currentTrackingLink} onChange={(e) => setCurrentTrackingLink(e.target.value)} className="edit-input" placeholder="Link Completo do Rastreamento"/></p>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleConfirmEnviarRastreamento(); }} className="send-email-text-link">
                                    Enviar Rastreamento por E-mail <IconeEnvio/>
                                </a>
                                <button onClick={() => setEditingEnvio(false)} className="cancel-button">Cancelar Edição</button>
                            </>
                        ) : (
                            <>
                                {detalhesVenda.transportadora && <p><strong>Transportadora:</strong> {detalhesVenda.transportadora}</p>}
                                {detalhesVenda.tracking_codigo && <p><strong>Cód. Rastreio:</strong> {detalhesVenda.tracking_codigo}</p>}
                                {detalhesVenda.tracking_link ? (
                                    <p><strong>Link Rastreio:</strong> <a href={detalhesVenda.tracking_link as string} target="_blank" rel="noopener noreferrer" className="tracking-link">{detalhesVenda.tracking_link}</a></p>
                                ) : (
                                    <p><strong>Link Rastreio:</strong> 'Não informado'</p>
                                )}
                                {detalhesVenda.data_envio && <p><strong>Data de Envio:</strong> {new Date(detalhesVenda.data_envio).toLocaleDateString()}</p>}
                                {(detalhesVenda.status !== 'enviado' && detalhesVenda.status !== 'entregue' && detalhesVenda.status !== 'cancelado' && detalhesVenda.status !== 'arquivado') && (
                                    <button onClick={() => setEditingEnvio(true)} className="send-tracking-button">Configurar e Enviar Rastreamento <IconeEnvio/></button>
                                )}
                                {detalhesVenda.status === 'enviado' && (
                                    <button onClick={() => setEditingEnvio(true)} className="send-tracking-button">Reenviar Rastreamento <IconeEnvio/></button>
                                )}
                            </>
                        )}
                    </div>
                    <div className="detail-card info-venda">
                        <h3>Informações da Venda</h3>
                        <p><strong>ID da Venda:</strong> {detalhesVenda.id.substring(0, 8)}...</p>
                        <p><strong>Data/Hora da Venda:</strong> {new Date(detalhesVenda.created_at).toLocaleString('pt-BR')}</p>
                        <p>
                            <strong>Status Atual:</strong>
                            <span className={`status-badge ${detalhesVenda.status}`}>
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
                {isCepLoading && editEnderecoCep.length === 8 && <p className="loading-message">Buscando CEP...</p>}
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
