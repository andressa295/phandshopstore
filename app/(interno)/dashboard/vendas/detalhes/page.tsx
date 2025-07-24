'use client';
import React, { useState, useEffect, useCallback } from 'react';
import './components/DetalhesDaVenda.css'; 

// Importa os componentes Modal, ConfirmModal e Toast dos arquivos SEPARADOS
import Modal from './components/Modal'; 
import ConfirmModal from './components/ConfirmModal'; 
import Toast from './components/Toast'; // Importa o componente Toast do arquivo separado

// Importa o ícone FaWhatsapp da biblioteca react-icons/fa
import { FaWhatsapp } from "react-icons/fa"; 

// --- Ícones (SVGs inline para outros ícones) ---
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


// --- Interfaces para Tipagem ---

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
  telefone: string; // Telefone pode ser string vazia se não houver
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
  statusAtual: 'concluida' | 'pendente' | 'cancelada' | 'em_processamento' | 'enviada' | 'entregue' | 'separando' | 'confeccao' | 'fabricacao' | 'arquivado';
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

// --- Dados Mock (Simulando uma Venda Completa para Teste) ---
const mockDetalhesVenda: DetalhesVenda = {
  id: '1001', // Importante: Este ID deve corresponder a um ID da mockVendas da lista
  dataHoraVenda: '2025-06-21 14:30',
  statusAtual: 'em_processamento', // Simular um status que permite envio
  totalVenda: 250.00,
  formaPagamento: 'PIX',
  cliente: {
    id: 'CLI005',
    nome: 'Ana Paula Silva',
    email: 'anapaula.s@email.com',
    telefone: '11987654321', // Telefone formatado para WhatsApp
    cpfCnpj: '123.456.789-00',
  },
  enderecoEntrega: {
    rua: 'Rua das Flores',
    numero: '123',
    complemento: 'Apto 101',
    bairro: 'Jardim Primavera',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
  },
  itens: [
    { idProduto: 'PROD001', nomeProduto: 'Camiseta Algodão Orgânico', skuProduto: 'CAM001AZM', quantidade: 1, precoUnitario: 79.90, variantes: 'Azul, M', imagemUrl: '/assets/camiseta_azul.jpg' },
    { idProduto: 'PROD002', nomeProduto: 'Calça Jeans Skinny', skuProduto: 'CAL002PT40', quantidade: 1, precoUnitario: 150.00, variantes: 'Preta, 40', imagemUrl: '/assets/calca_preta.jpg' },
    { idProduto: 'PROD003', nomeProduto: 'Meia Esportiva', skuProduto: 'MEI003BR', quantidade: 2, precoUnitario: 10.00, imagemUrl: '/assets/meia_branca.jpg' },
  ],
  observacoesCliente: 'Gostaria que fosse entregue após as 14h, se possível.',
  observacoesInternas: 'Cliente VIP, oferecer desconto na próxima compra.',
  trackingLink: '',
  trackingCode: '',
  transportadora: '',
  dataEnvio: '',
  historicoStatus: [
    { status: 'pendente', dataHora: '2025-06-21 14:30' },
    { status: 'em_processamento', dataHora: '2025-06-21 15:00' },
  ],
};

// Mock de produtos disponíveis para a edição da venda (adicionar/remover itens)
const mockProdutosDisponiveis = [
    { id: 'PROD001', nome: 'Camiseta Algodão Orgânico', sku: 'CAM001AZM', preco: 79.90, variantes: 'Azul, M', imagemUrl: '/assets/camiseta_azul.jpg' },
    { id: 'PROD002', nome: 'Calça Jeans Skinny', sku: 'CAL002PT40', preco: 150.00, variantes: 'Preta, 40', imagemUrl: '/assets/calca_preta.jpg' },
    { id: 'PROD003', nome: 'Meia Esportiva', sku: 'MEI003BR', preco: 10.00, imagemUrl: '/assets/meia_branca.jpg' },
    { id: 'PROD004', nome: 'Cinto de Couro', sku: 'CINTO001PT', preco: 80.00, imagemUrl: '/assets/cinto_couro.jpg' },
];


// Função auxiliar para obter o nome de exibição do status
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

const DetalhesDaVendaPage: React.FC = () => {
  const [detalhesVenda, setDetalhesVenda] = useState<DetalhesVenda | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCepLoading, setIsCepLoading] = useState(false);

  // Estados para os campos de envio editáveis
  const [editingEnvio, setEditingEnvio] = useState(false);
  const [currentTrackingLink, setCurrentTrackingLink] = useState('');
  const [currentTrackingCode, setCurrentTrackingCode] = useState('');
  const [currentTransportadora, setCurrentTransportadora] = useState('');

  // Estados para controlar a visibilidade dos modais de edição
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [isEnderecoModalOpen, setIsEnderecoModalOpen] = useState(false);
  const [isObsInternasModalOpen, setIsObsInternasModalOpen] = useState(false);
  const [isVendaCompletaModalOpen, setIsVendaCompletaModalOpen] = useState(false);

  // Estado para o Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Estados para o Modal de Confirmação
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{ title: string; message: string; onConfirm: () => void; confirmText?: string; } | null>(null);


  // Função para exibir o Toast
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
      setToast({ message, type });
  }, []);

  // Função para abrir o Modal de Confirmação
  const openConfirmModal = useCallback((title: string, message: string, onConfirm: () => void, confirmText?: string) => {
      setConfirmModalData({ title, message, onConfirm, confirmText });
      setIsConfirmModalOpen(true);
  }, []);


  // --- Funções de Validação de Formulários ---
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10,11}$/.test(phone.replace(/\D/g, '')); // Apenas dígitos, 10 ou 11
  const validateCpfCnpj = (doc: string) => doc.replace(/\D/g, '').length >= 11; // Mínimo de 11 dígitos para validação básica

  // --- Estados e Funções para os dados do Modal de Cliente ---
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

  // --- Estados e Funções para os dados do Modal de Endereço ---
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

  // Lógica para auto-preenchimento de CEP (SIMULAÇÃO SILENCIOSA)
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const cep = e.target.value.replace(/\D/g, '');
      setEditEnderecoCep(cep);

      if (cep.length === 8) {
          setIsCepLoading(true);
          const mockCepDataSuccess = { // Dados mockados para simular SUCESSO
              logradouro: 'Rua Simulado do CEP',
              bairro: 'Bairro Mockado',
              localidade: 'Cidade Fictícia',
              uf: 'SP',
          };
          
          setTimeout(() => { // Simula delay da API
              const data = mockCepDataSuccess; // Sempre simula sucesso para não mostrar erro
              
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

  // --- Estados e Funções para os dados do Modal de Observações Internas ---
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

  // --- Estados e Funções para o Modal de Edição de Venda Completa (Itens da Venda) ---
  const [editItensVenda, setEditItensVenda] = useState<ItemVendido[]>([]);

  const handleEditVendaCompleta = () => {
      if (detalhesVenda) {
          setEditItensVenda([...detalhesVenda.itens]); // Copia os itens atuais
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


  // --- Funções de Ações na Venda (com Modais de Confirmação) ---

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
    const getSaleIdFromUrl = (): string | null => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('id');
    };

    const saleId = getSaleIdFromUrl();

    const loadSaleDetails = async () => {
      if (!saleId) {
        setError('ID da venda não encontrado na URL.');
        setLoading(false);
        window.location.href = '/dashboard/vendas/lista'; 
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (mockDetalhesVenda.id === saleId) {
          setDetalhesVenda(mockDetalhesVenda);
          setCurrentTrackingLink(mockDetalhesVenda.trackingLink || '');
          setCurrentTrackingCode(mockDetalhesVenda.trackingCode || '');
          setCurrentTransportadora(mockDetalhesVenda.transportadora || '');
        } else {
          setError(`Venda com ID "${saleId}" não encontrada.`);
        }

      } catch (err: any) {
        console.error('Erro ao carregar detalhes da venda:', err);
        setError(err.message || 'Não foi possível carregar os detalhes da venda.');
      } finally {
        setLoading(false);
      }
    };

    loadSaleDetails();
  }, [showToast]); 

  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  // Helper para formatar telefone para link WhatsApp (Corrigido para evitar null no href)
  const formatPhoneForWhatsApp = (phone: string | undefined): string | null => {
    if (!phone) return null; 
    const digitsOnly = phone.replace(/\D/g, ''); // Remove tudo que não for dígito
    // Para WhatsApp, o número deve ter o código do país (55 para Brasil) e DDD
    if (digitsOnly.length >= 10 && digitsOnly.length <= 13) { // DDD + 8 ou 9 dígitos, max 13 para incluir código país
      if (digitsOnly.startsWith('55')) { // Já tem código do país
        return `https://wa.me/${digitsOnly}`; 
      }
      return `https://wa.me/55${digitsOnly}`; // Adiciona código do país
    }
    return null; // Retorna null se o número não for válido para WhatsApp
  };


  if (loading && !isCepLoading) return <div className="loading">Carregando detalhes da venda...</div>;
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

      {/* Barra de Controle de Status e Ações */}
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
                    // Confirmação para mudança de status via modal personalizado
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
                            setIsConfirmModalOpen(false); // Fecha o modal de confirmação
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
        {/* Botões de Ação Direta na Barra de Status (Arquivar/Reabrir) */}
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
      </div> {/* Fim da status-action-bar */}


      <div className="venda-details-grid">
        {/* Lado Esquerdo: Itens da Venda e Histórico de Status */}
        <div className="left-column">
             {/* Itens da Venda */}
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
                            <td data-label="Produto:">{item.nomeProduto} {item.variantes ? `(${item.variantes})` : ''}</td>
                            <td data-label="SKU:">{item.skuProduto}</td>
                            <td data-label="Qtd:">{item.quantidade}</td>
                            <td data-label="Preço Unit.:">{formatCurrency(item.precoUnitario)}</td>
                            <td data-label="Subtotal:">{formatCurrency(item.quantidade * item.precoUnitario)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Histórico de Status */}
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

            {/* Observações Internas (com ícone de edição) */}
            <div className="detail-card full-width info-observacoes-internas">
                <h3>Observações Internas <span onClick={() => setIsObsInternasModalOpen(true)}><IconeEditar /></span></h3> {/* Click para abrir modal */}
                <p>{detalhesVenda.observacoesInternas || "Nenhuma observação interna."}</p>
            </div>
        </div> {/* Fim da Left-Column */}

        {/* Lado Direito: Informações do Cliente, Endereço, Envio, Informações da Venda (uma embaixo da outra) */}
        <div className="right-column">
            {/* Informações do Cliente (com ícone de edição e link WhatsApp) */}
            <div className="detail-card info-cliente">
                <h3>Informações do Cliente <span onClick={() => setIsClienteModalOpen(true)}><IconeEditar /></span></h3> {/* Click para abrir modal */}
                <p><strong>Nome:</strong> {detalhesVenda.cliente.nome}</p>
                <p><strong>Email:</strong> {detalhesVenda.cliente.email}</p>
                {/* Condicionalmente renderiza o link WhatsApp se o telefone for válido. CORRIGIDO */}
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

            {/* Endereço de Entrega (com ícone de edição) */}
            <div className="detail-card info-endereco">
                <h3>Endereço de Entrega <span onClick={() => setIsEnderecoModalOpen(true)}><IconeEditar /></span></h3> {/* Click para abrir modal */}
                <p>{detalhesVenda.enderecoEntrega.rua}, {detalhesVenda.enderecoEntrega.numero} {detalhesVenda.enderecoEntrega.complemento}</p>
                <p>{detalhesVenda.enderecoEntrega.bairro}, {detalhesVenda.enderecoEntrega.cidade} - {detalhesVenda.enderecoEntrega.estado}</p>
                <p>CEP: {detalhesVenda.enderecoEntrega.cep}</p>
            </div>

            {/* Informações de Envio/Rastreio (com campos editáveis e link para envio por e-mail) */}
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
            {/* Link de texto para enviar por e-mail */}
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
            
            {/* Botão para iniciar a edição/configurar envio/reenviar */}
            {/* CORRIGIDO: Removido 'detalhesVenda.vendas.' que era o erro de digitação */}
            {(detalhesVenda.statusAtual !== 'enviada' && detalhesVenda.statusAtual !== 'entregue' && detalhesVenda.statusAtual !== 'cancelada' && detalhesVenda.statusAtual !== 'arquivado') && (
                 <button onClick={() => setEditingEnvio(true)} className="send-tracking-button">Configurar e Enviar Rastreamento <IconeEnvio/></button>
            )}
            {detalhesVenda.statusAtual === 'enviada' && (
                <button onClick={() => setEditingEnvio(true)} className="send-tracking-button">Reenviar Rastreamento <IconeEnvio/></button>
            )}
        </>
    )}
</div>
            {/* Informações da Venda (último card na coluna direita) */}
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
        </div> {/* Fim da Right-Column */}

      </div>

      {/* --- Modais de Edição (Renderizados SEMPRE e controlados por classe CSS) --- */}
      {/* Modal de Edição de Informações do Cliente */}
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

      {/* Modal de Edição de Endereço de Entrega */}
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

      {/* Modal de Edição de Observações Internas */}
      <Modal isOpen={isObsInternasModalOpen} onClose={() => setIsObsInternasModalOpen(false)} title="Editar Observações Internas" onSave={handleSaveObsInternas}>
          <label>Observações:</label>
          <textarea value={editObsInternas} onChange={(e) => setEditObsInternas(e.target.value)} rows={5}></textarea>
      </Modal>

      {/* Modal de Edição de Venda Completa (Itens da Venda) */}
      <Modal isOpen={isVendaCompletaModalOpen} onClose={() => setIsVendaCompletaModalOpen(false)} title="Editar Venda Completa" onSave={handleSaveVendaCompleta} saveButtonText="Salvar Alterações na Venda">
          <h3>Itens da Venda</h3>
          <div className="modal-itens-list">
              {editItensVenda.map((item, index) => (
                  <div key={index} className="modal-item-row">
                      <div className="modal-item-info">
                          <img src={item.imagemUrl || '/assets/placeholder.jpg'} alt={item.nomeProduto} className="modal-item-thumbnail" />
                          <div>
                              <p><strong>Produto:</strong> {item.nomeProduto} {item.variantes && `(${item.variantes})`}</p>
                              <p><strong>SKU:</strong> {item.skuProduto}</p>
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
          
          {/* Campo de busca para adicionar novo item ao catálogo */}
          <div className="modal-add-product-search">
              <label>Buscar e Adicionar Produto:</label>
              <input 
                  type="text" 
                  placeholder="Nome ou SKU do produto" 
                  onBlur={(e) => handleProductSearchForAddItem(e.target.value, editItensVenda.length)} // Adiciona no final
                  className="edit-input"
              />
              <p className="hint-text">Digite o nome/SKU e clique fora para buscar (simulação)</p>
          </div>

      </Modal>

      {/* --- Toast de Notificação --- */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* --- Modal de Confirmação --- */}
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

export default DetalhesDaVendaPage;