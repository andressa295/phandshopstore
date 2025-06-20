import React from 'react';
import CheckboxField from '../ui/CheckboxField';
import TextField from '../ui/TextField';
import { Tema } from '../EditorContext';

interface ShoppingCartScreenProps {
  tema: Tema;
  handleTemaChange: (key: keyof Tema, value: any) => void;
  // goBackToMainMenu removido porque não vai mais usar
}

const ShoppingCartScreen: React.FC<ShoppingCartScreenProps> = ({
  tema,
  handleTemaChange,
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
          }}
        >
          Mostrar botão "Ver mais produtos"
        </h4>
        <CheckboxField
          label="Mostrar o botão 'Ver mais produtos' no carrinho de compras."
          checked={tema.carrinho_mostrarBotaoVerMaisProdutos ?? false}
          onChange={(val) =>
            handleTemaChange('carrinho_mostrarBotaoVerMaisProdutos', val)
          }
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
            margin: '0 0 5px 0',
            fontSize: '1rem',
            color: '#333',
          }}
        >
          Valor mínimo de compra
        </h4>
        <p
          style={{
            fontSize: '0.75rem',
            color: '#666',
            marginBottom: '10px',
          }}
        >
          Qual o valor mínimo que seus clientes devem gastar?
          <span style={{ fontSize: '0.7rem', color: '#888' }}>
            {' '}
            Preencha somente se for loja do tipo atacado.
          </span>
        </p>
        <TextField
          type="number"
          label=""
          value={tema.carrinho_valorMinimoCompra ?? 0}
          onChange={(val) =>
            handleTemaChange('carrinho_valorMinimoCompra', parseFloat(val || '0'))
          }
          placeholder="0.00"
          description="Insira apenas números (ex: 50.00)."
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
          }}
        >
          Carrinho de compra rápida
        </h4>
        <CheckboxField
          label="Permitir que seus clientes adicionem produtos sem precisar ir a outra página."
          checked={tema.carrinho_compraRapidaAtiva ?? false}
          onChange={(val) => handleTemaChange('carrinho_compraRapidaAtiva', val)}
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
          }}
        >
          Recomendações de produtos
        </h4>
        <CheckboxField
          label="Sugerir produtos complementares ao adicionar o carrinho de compra rápida."
          checked={tema.carrinho_sugerirProdutosComplementares ?? false}
          onChange={(val) =>
            handleTemaChange('carrinho_sugerirProdutosComplementares', val)
          }
        />
      </div>

      <div
        style={{
          border: '1px solid #eee',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '1.5rem',
        }}
      >
        <h4
          style={{
            margin: '0 0 10px 0',
            fontSize: '1rem',
            color: '#333',
          }}
        >
          Formas de entrega
        </h4>
        <CheckboxField
          label="Mostrar a calculadora de frete"
          checked={tema.carrinho_mostrarCalculadoraFrete ?? false}
          onChange={(val) => handleTemaChange('carrinho_mostrarCalculadoraFrete', val)}
        />
        <CheckboxField
          label="Mostrar lojas físicas no carrinho"
          checked={tema.carrinho_mostrarLojasFisicas ?? false}
          onChange={(val) => handleTemaChange('carrinho_mostrarLojasFisicas', val)}
        />
      </div>
    </div>
  );
};

export default ShoppingCartScreen;
