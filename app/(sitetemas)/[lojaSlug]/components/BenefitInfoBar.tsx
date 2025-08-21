'use client';
import React from 'react';
// Importa APENAS os ícones específicos que serão usados
import { 
    CreditCard, 
    Truck, 
    Gift, 
    ShieldCheck, 
    MessageSquareText, // Para WhatsApp/Mensagem
    Package,           // Para Caixa/Entrega diferenciada
    AlertCircle,       // Para Alerta
    QrCode,            // Para Pix (comum em QR codes)
    Receipt            // Para Boleto
} from 'lucide-react'; 

// REMOVIDO: import '../styles/benefit-infobar.css'; // O estilo virá do tema ativo

// Mapeamento de nomes de ícones para componentes Lucide
// ATENÇÃO: Os nomes das chaves aqui DEVEM ser exatamente iguais aos nomes dos componentes Lucide React (PascalCase).
const iconMap: { [key: string]: React.ElementType } = {
    CreditCard: CreditCard,
    Truck: Truck,
    Gift: Gift,
    ShieldCheck: ShieldCheck, // Exemplo de ícone para "Segurança"
    MessageSquareText: MessageSquareText, // Para WhatsApp/Mensagem
    Package: Package,           // Para Caixa/Entrega diferenciada
    AlertCircle: AlertCircle,   // Para Alerta
    QrCode: QrCode,             // Para Pix
    Receipt: Receipt            // Para Boleto
    // Adicione mais mapeamentos conforme necessário para outros ícones que o lojista possa escolher
};

interface InfoBarItem {
    id: string;
    // O nome do ícone agora é uma string que corresponde a um nome de ícone do Lucide
    // Garanta que os dados vindo do Supabase/API usem esses nomes em PascalCase.
    icone: keyof typeof iconMap; 
    titulo: string;
    descricao: string;
}

interface BenefitInfoBarProps {
    items: InfoBarItem[];
}

const BenefitInfoBar: React.FC<BenefitInfoBarProps> = ({ items }) => {
    if (!items || items.length === 0) {
        return null; // Não renderiza se não houver itens
    }

    // --- LOGS DE DEPURAÇÃO ---
    console.log("BenefitInfoBar: Itens recebidos:", items);
    // --- FIM DOS LOGS DE DEPURAÇÃO ---

    return (
        <div className="ph-info-bar-container">
            <div className="ph-info-bar-grid">
                {items.map(item => {
                    const IconComponent = iconMap[item.icone]; // Pega o componente do ícone pelo nome

                    // --- LOGS DE DEPURAÇÃO POR ITEM ---
                    console.log(`  Item ID: ${item.id}`);
                    console.log(`    Nome do Ícone (item.icone): "${item.icone}"`);
                    console.log(`    Componente do Ícone Resolvido (IconComponent):`, IconComponent);
                    // --- FIM DOS LOGS DE DEPURAÇÃO POR ITEM ---

                    return (
                        <div key={item.id} className="ph-info-bar-item">
                            {IconComponent ? ( // Verifica se IconComponent é válido antes de renderizar
                                <IconComponent size={32} className="ph-info-bar-icon" /> // Renderiza o ícone
                            ) : (
                                // Fallback visual caso o ícone não seja encontrado
                                <span className="ph-info-bar-icon-fallback" style={{ fontSize: '2rem', color: 'red', fontWeight: 'bold' }}>?</span>
                            )}
                            <div>
                                <h3 className="ph-info-bar-title">{item.titulo}</h3>
                                <p className="ph-info-bar-description">{item.descricao}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BenefitInfoBar;
