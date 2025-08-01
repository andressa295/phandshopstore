'use client';

import React from 'react';
import { ThemeConfig, ThemeUpdateFn } from '../../../types';
import styles from './CartSection.module.css'; 

interface Props {
  config: ThemeConfig;
  updateConfig: ThemeUpdateFn;
}

const CartSection: React.FC<Props> = ({ config, updateConfig }) => {
  const cartConfig = config.cart || {
    enableWholesaleMinOrder: false,
    minWholesaleOrderValue: null,
    showShippingEstimator: true,
    showCouponField: true,
    showCartNotes: false,
    checkoutButtonText: 'Finalizar Compra',
    showCrossSellProducts: true,
    crossSellTitle: 'Produtos que você também pode gostar',
  };

  const handleUpdate = (field: keyof typeof cartConfig, value: any) => {
    updateConfig({
      cart: {
        ...cartConfig,
        [field]: value,
      },
    });
  };

  return (
    <div className={styles.sectionBlock}>
      <h3 className={styles.sectionTitle}> Carrinho de Compras</h3>
      <p className={styles.sectionDescription}>
        Personalize a experiência do carrinho, desde o pedido mínimo até opções de checkout.
      </p>

      {/* 1. Pedido Mínimo para Atacado */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={cartConfig.enableWholesaleMinOrder}
            onChange={(e) => handleUpdate('enableWholesaleMinOrder', e.target.checked)}
            className={styles.checkboxInput}
          />
          Ativar Pedido Mínimo para Atacado
        </label>
        {cartConfig.enableWholesaleMinOrder && (
          <div className={styles.nestedInputGroup}> {/* Nova classe para o input aninhado */}
            <label htmlFor="minWholesaleOrderValue" className={styles.inputLabel}>Valor Mínimo (R$):</label>
            <input
              type="number"
              id="minWholesaleOrderValue"
              className={styles.textInput}
              value={cartConfig.minWholesaleOrderValue || ''}
              onChange={(e) => handleUpdate('minWholesaleOrderValue', parseFloat(e.target.value) || null)}
              placeholder="Ex: 500.00"
              min="0"
            />
          </div>
        )}
        <p className={styles.fieldDescription}>
          Se ativado, o cliente só poderá finalizar a compra se o valor total do carrinho atingir o mínimo estipulado.
        </p>
      </div>

      {/* 2. Opções de Checkout e Funcionalidades */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={cartConfig.showShippingEstimator}
            onChange={(e) => handleUpdate('showShippingEstimator', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Estimador de Frete no Carrinho
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={cartConfig.showCouponField}
            onChange={(e) => handleUpdate('showCouponField', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Campo para Cupom de Desconto
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={cartConfig.showCartNotes}
            onChange={(e) => handleUpdate('showCartNotes', e.target.checked)}
            className={styles.checkboxInput}
          />
          Habilitar Campo para Notas do Cliente
        </label>
      </div>

      {/* 3. Texto do Botão de Finalizar Compra */}
      <div className={styles.inputGroup}>
        <label htmlFor="checkoutButtonText" className={styles.inputLabel}>Texto do Botão "Finalizar Compra":</label>
        <input
          type="text"
          id="checkoutButtonText"
          className={styles.textInput}
          value={cartConfig.checkoutButtonText}
          onChange={(e) => handleUpdate('checkoutButtonText', e.target.value)}
          placeholder="Ex: Ir para o Pagamento"
        />
      </div>

      {/* 4. Produtos de Cross-Sell/Up-Sell no Carrinho */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={cartConfig.showCrossSellProducts}
            onChange={(e) => handleUpdate('showCrossSellProducts', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Produtos Relacionados/Complementares no Carrinho
        </label>
        {cartConfig.showCrossSellProducts && (
          <div className={styles.nestedInputGroup}> {/* Nova classe para o input aninhado */}
            <label htmlFor="crossSellTitle" className={styles.inputLabel}>Título da Seção de Complementares:</label>
            <input
              type="text"
              id="crossSellTitle"
              className={styles.textInput}
              value={cartConfig.crossSellTitle}
              onChange={(e) => handleUpdate('crossSellTitle', e.target.value)}
              placeholder="Ex: Que tal adicionar..."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSection;