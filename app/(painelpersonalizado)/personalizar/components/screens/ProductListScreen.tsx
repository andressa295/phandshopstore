import React from 'react';
import CheckboxField from '../ui/CheckboxField';
import SelectField from '../ui/SelectField';
import { Tema } from '../EditorContext';

interface ProductListScreenProps {
  tema: Tema;
  handleTemaChange: (key: keyof Tema, value: any) => void;
  goBackToMainMenu: () => void;
}

const ProductListScreen: React.FC<ProductListScreenProps> = ({
  tema,
  handleTemaChange,
  goBackToMainMenu,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        padding: '0 15px',
        flexGrow: 1,
        overflowY: 'auto',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <button
        onClick={goBackToMainMenu}
        style={{
          background: 'none',
          border: 'none',
          color: '#7C3AED', // Cor roxa da Phandshop, pra destacar
          cursor: 'pointer',
          textAlign: 'left',
          marginBottom: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 'bold',
          fontSize: '1rem',
          fontFamily: 'Poppins, sans-serif',
        }}
        aria-label="Voltar ao menu principal"
      >
        ← Voltar
      </button>

      <div
        style={{
          border: '1px solid #eee',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '0.8rem',
        }}
      >
        <h4
          style={{
            margin: '0 0 10px 0',
            fontSize: '1rem',
            color: '#333',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Quantidade de produtos por linha
        </h4>
        <SelectField
          value={tema.quantidadeProdutosPorLinha ?? ''}
          onChange={(val) => handleTemaChange('quantidadeProdutosPorLinha', val)}
          options={[
            { value: '1_cel_3_comp', label: '1 no celular e 3 no computador' },
            { value: '2_cel_4_comp', label: '2 no celular e 4 no computador' },
          ]}
          label={''}
        />
      </div>

      <div
        style={{
          border: '1px solid #eee',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '0.8rem',
        }}
      >
        <h4
          style={{
            margin: '0 0 10px 0',
            fontSize: '1rem',
            color: '#333',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Compra rápida
        </h4>
        <CheckboxField
          label="Permitir que seus clientes possam agregar produtos ao seu carrinho rapidamente."
          checked={tema.compraRapidaAtiva ?? false}
          onChange={(val) => handleTemaChange('compraRapidaAtiva', val)}
        />
      </div>

      <div
        style={{
          border: '1px solid #eee',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '0.8rem',
        }}
      >
        <h4
          style={{
            margin: '0 0 10px 0',
            fontSize: '1rem',
            color: '#333',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Variações de cor
        </h4>
        <CheckboxField
          label="Mostrar variações de cores na lista de produtos."
          checked={tema.mostrarVariacoesCor ?? false}
          onChange={(val) => handleTemaChange('mostrarVariacoesCor', val)}
        />
      </div>

      <div
        style={{
          border: '1px solid #eee',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '0.8rem',
        }}
      >
        <h4
          style={{
            margin: '0 0 10px 0',
            fontSize: '1rem',
            color: '#333',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Fotos do produto
        </h4>
        <CheckboxField
          label="Mostrar a segunda foto ao passar o mouse."
          checked={tema.mostrarSegundaFotoHover ?? false}
          onChange={(val) => handleTemaChange('mostrarSegundaFotoHover', val)}
        />
        <CheckboxField
          label="Exibir fotos em um Carrossel para cada produto."
          checked={tema.exibirCarrosselFotos ?? false}
          onChange={(val) => handleTemaChange('exibirCarrosselFotos', val)}
        />
        <p
          style={{
            fontSize: '0.75rem',
            color: '#666',
            marginTop: '10px',
          }}
        >
          O Carrossel se aplica somente a listagem de categoria e resultados de pesquisa.
        </p>
      </div>

      <div
        style={{
          border: '1px solid #eee',
          padding: '15px',
          borderRadius: '8px',
        }}
      >
        <h4
          style={{
            margin: '0 0 10px 0',
            fontSize: '1rem',
            color: '#333',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Informações das parcelas
        </h4>
        <CheckboxField
          label="Mostrar parcelas na lista de produtos."
          checked={tema.mostrarParcelasListaProdutos ?? false}
          onChange={(val) => handleTemaChange('mostrarParcelasListaProdutos', val)}
        />
      </div>
    </div>
  );
};

export default ProductListScreen;
