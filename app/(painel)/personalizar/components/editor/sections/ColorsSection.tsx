'use client';

import React from 'react';
import styles from './ColorsSection.module.css';
import { ThemeConfig, ThemeUpdateFn } from '../../../types'; // Importa os tipos corretos

// Define a interface para as props da seção de cores
interface ColorsSectionProps {
  config: ThemeConfig; // Agora tipado corretamente
  updateConfig: ThemeUpdateFn; // Agora tipado corretamente
}

// Define a interface para as props do componente de entrada de cor
interface ColorInputProps {
  label: string;
  // A chave de configuração pode ser uma chave direta de ThemeConfig ou uma chave de sub-objeto
  // Usamos string aqui para flexibilidade, mas o onChange garantirá a tipagem
  configPath: string; // Ex: 'primaryColor', 'headerBackgroundColor', 'footer.footerBackgroundColor'
  description: string;
  value: string;
  onChange: (path: string, value: string) => void; // Passa o caminho completo
}

const ColorInput: React.FC<ColorInputProps> = ({ label, configPath, description, value, onChange }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={styles.colorOption}>
      <div className={styles.colorSwatchContainer}>
        <div
          className={styles.colorSwatch}
          style={{ backgroundColor: value }}
          onClick={handleClick}
          title={`Clique para selecionar a ${label}`}
        ></div>
        <input
          type="color"
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(configPath, e.target.value)} // Passa o caminho e o valor
          className={styles.hiddenColorInput}
        />
      </div>
      <div className={styles.colorDetails}>
        <label htmlFor={configPath} className={styles.colorLabel}> {/* Usar configPath como id */}
          {label}
        </label>
        <p className={styles.colorDescription}>{description}</p>
      </div>
    </div>
  );
};


const ColorsSection: React.FC<ColorsSectionProps> = ({ config, updateConfig }) => {

  // Função genérica para atualizar configurações aninhadas
  const handleUpdate = (path: string, value: string) => {
    // Ex: 'primaryColor' -> { primaryColor: value }
    // Ex: 'footer.footerBackgroundColor' -> { footer: { footerBackgroundColor: value } }

    // Cria um objeto de update parcial que imita a estrutura do config
    const update: Partial<ThemeConfig> = {};
    const pathParts = path.split('.');

    let currentLevel: any = update;
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      if (i === pathParts.length - 1) { // Última parte do caminho
        currentLevel[part] = value;
      } else { // Partes intermediárias do caminho
        currentLevel[part] = currentLevel[part] || {};
        currentLevel = currentLevel[part];
      }
    }
    updateConfig(update);
  };

  // Função para obter o valor de forma segura, lidando com aninhamento e undefined
  const getSafeColor = (path: string): string => {
    const pathParts = path.split('.');
    let currentValue: any = config;

    for (const part of pathParts) {
      if (currentValue && typeof currentValue === 'object' && part in currentValue) {
        currentValue = currentValue[part];
      } else {
        return '#000000'; // Fallback se o caminho não for encontrado ou valor for undefined/null
      }
    }
    return typeof currentValue === 'string' ? currentValue : '#000000';
  };

  return (
    <div className={styles.colorsSection}>
      <h3 className={styles.sectionTitle}>Cores do Tema</h3>

      <ColorInput
        label="Cor Principal"
        configPath="primaryColor"
        description="Cor de destaque usada em botões, links e elementos interativos."
        value={getSafeColor('primaryColor')}
        onChange={handleUpdate}
      />

      <ColorInput
        label="Cor Secundária"
        configPath="secondaryColor"
        description="Cor complementar usada para detalhes, ícones ou elementos menos proeminentes."
        value={getSafeColor('secondaryColor')}
        onChange={handleUpdate}
      />

      <ColorInput
        label="Cor do Texto Geral" // Renomeado para maior clareza
        configPath="textColor" // Propriedade geral para cor de texto
        description="Cor principal para o texto do corpo, parágrafos e descrições gerais do site."
        value={getSafeColor('textColor')}
        onChange={handleUpdate}
      />

      {/* Cores do Cabeçalho */}
      <ColorInput
        label="Fundo do Cabeçalho"
        configPath="headerBackgroundColor" // Nome correto da propriedade
        description="Cor de fundo da barra superior (cabeçalho) da loja."
        value={getSafeColor('headerBackgroundColor')}
        onChange={handleUpdate}
      />
      <ColorInput
        label="Texto do Cabeçalho"
        configPath="headerTextColor" // Nome correto da propriedade
        description="Cor do texto e ícones no cabeçalho da loja."
        value={getSafeColor('headerTextColor')}
        onChange={handleUpdate}
      />

      {/* Cores do Rodapé */}
      <ColorInput
        label="Fundo do Rodapé"
        configPath="footer.footerBackgroundColor" // Caminho aninhado
        description="Cor de fundo da barra inferior (rodapé) da loja."
        value={getSafeColor('footer.footerBackgroundColor')}
        onChange={handleUpdate}
      />
      <ColorInput
        label="Texto do Rodapé"
        configPath="footer.footerTextColor" // Caminho aninhado
        description="Cor do texto e links no rodapé da loja."
        value={getSafeColor('footer.footerTextColor')}
        onChange={handleUpdate}
      />

      {/* Cor do Scrollbar Personalizado (se você tiver um input para ele) */}
      <ColorInput
        label="Cor da Barra de Rolagem"
        configPath="design.scrollbarColor" // Caminho aninhado
        description="Cor do indicador da barra de rolagem personalizada (se ativada)."
        value={getSafeColor('design.scrollbarColor')}
        onChange={handleUpdate}
      />

       {/* Exemplo de cor do botão de adicionar ao carrinho na lista de produtos */}
       <ColorInput
        label="Cor do Botão Comprar (Lista)"
        configPath="productList.addToCartButtonColor" // Caminho aninhado
        description="Cor de fundo do botão 'Adicionar ao Carrinho' exibido nas listas de produtos."
        value={getSafeColor('productList.addToCartButtonColor')}
        onChange={handleUpdate}
      />

    </div>
  );
};

export default ColorsSection;