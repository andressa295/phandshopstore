'use client';

import React, { useRef } from 'react';
import { ThemeConfig, ThemeUpdateFn, FooterConfig } from '../../../types'; 
import { v4 as uuidv4 } from 'uuid'; 
import styles from './FooterSection.module.css'; 

interface Props {
  config: ThemeConfig;
  updateConfig: ThemeUpdateFn;
}

const FooterSection: React.FC<Props> = ({ config, updateConfig }) => {
  const defaultFooterConfig: FooterConfig = {
    showQuickLinks: true,
    quickLinks: [
      { id: uuidv4(), text: 'Sobre Nós', url: '/sobre' },
      { id: uuidv4(), text: 'Contato', url: '/contato' },
      { id: uuidv4(), text: 'Política de Privacidade', url: '/politica-privacidade' },
    ],
    quickLinksTitle: 'Links Rápidos',
    showSocialMediaIcons: true,
    socialMediaTitle: 'Siga-nos',
    socialMediaLinks: [
      { id: uuidv4(), platform: 'instagram', url: 'https://instagram.com/sua_loja' },
      { id: uuidv4(), platform: 'facebook', url: 'https://facebook.com/sua_loja' },
    ],
    showNewsletterSignup: true,
    newsletterTitle: 'Receba Novidades',
    newsletterSubtitle: 'Inscreva-se e receba ofertas exclusivas!',
    showContactInfo: true,
    contactAddress: 'Rua Exemplo, 123 - Cidade, Estado, CEP',
    contactPhone: '(XX) XXXX-XXXX',
    contactEmail: 'contato@sua_loja.com',
    showPaymentMethods: true,
    paymentMethodsImages: [], 
    showCopyright: true,
    copyrightText: `© ${new Date().getFullYear()} Sua Loja. Todos os direitos reservados.`,
    showCnpj: false,
    cnpjText: 'CNPJ: XX.XXX.XXX/XXXX-XX',
    footerBackgroundColor: '#343a40',
    footerTextColor: '#ffffff',
  };

  const footerConfig: FooterConfig = {
    ...defaultFooterConfig,
    ...(config.footer || {}),

    quickLinks: (config.footer?.quickLinks ?? defaultFooterConfig.quickLinks ?? []).map(link => ({
      id: (link as any).id || uuidv4(),
      text: link.text,
      url: link.url,
    })),

    socialMediaLinks: (config.footer?.socialMediaLinks ?? defaultFooterConfig.socialMediaLinks ?? []).map(link => ({
      id: (link as any).id || uuidv4(),
      platform: link.platform,
      url: link.url,
    })),

    paymentMethodsImages: (config.footer?.paymentMethodsImages ?? defaultFooterConfig.paymentMethodsImages ?? []).map(image => {
      if (typeof image === 'string') {
        return { id: uuidv4(), imageUrl: image };
      }
      return { id: (image as any).id || uuidv4(), imageUrl: image.imageUrl };
    }),
  };

  const footerBgColorInputRef = useRef<HTMLInputElement>(null);
  const footerTextColorInputRef = useRef<HTMLInputElement>(null);
  const paymentImageInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (field: keyof FooterConfig, value: any) => {
    updateConfig({
      footer: {
        ...footerConfig,
        [field]: value,
      },
    });
  };

  // Definindo variáveis locais para garantir que não sejam undefined
  const quickLinks = footerConfig.quickLinks ?? [];
  const socialMediaLinks = footerConfig.socialMediaLinks ?? [];
  const paymentMethodsImages = footerConfig.paymentMethodsImages ?? [];

  // Funções para Quick Links
  const handleQuickLinkChange = (id: string, field: 'text' | 'url', value: string) => {
    const newLinks = quickLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    );
    handleUpdate('quickLinks', newLinks);
  };

  const handleAddQuickLink = () => {
    handleUpdate('quickLinks', [...quickLinks, { id: uuidv4(), text: '', url: '' }]);
  };

  const handleRemoveQuickLink = (id: string) => {
    const newLinks = quickLinks.filter(link => link.id !== id);
    handleUpdate('quickLinks', newLinks);
  };

  // Funções para Social Media Links
  const handleSocialMediaLinkChange = (id: string, field: 'platform' | 'url', value: string) => {
    const newLinks = socialMediaLinks.map(link =>
      link.id === id ? { ...link, [field]: value as any } : link
    );
    handleUpdate('socialMediaLinks', newLinks);
  };

  const handleAddSocialMediaLink = () => {
    handleUpdate('socialMediaLinks', [...socialMediaLinks, { id: uuidv4(), platform: 'instagram', url: '' }]);
  };

  const handleRemoveSocialMediaLink = (id: string) => {
    const newLinks = socialMediaLinks.filter(link => link.id !== id);
    handleUpdate('socialMediaLinks', newLinks);
  };

  // Funções para Payment Methods Images
  const handlePaymentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage = { id: uuidv4(), imageUrl: reader.result as string };
        handleUpdate('paymentMethodsImages', [...paymentMethodsImages, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePaymentImage = (id: string) => {
    const newImages = paymentMethodsImages.filter(image => image.id !== id);
    handleUpdate('paymentMethodsImages', newImages);
  };

  return (
    <div className={styles.sectionBlock}>
      <h3 className={styles.sectionTitle}>Configurações do Rodapé da Página</h3>
      <p className={styles.sectionDescription}>
        Ajuste o conteúdo e o estilo do rodapé da sua loja.
      </p>

      {/* Cor de Fundo do Rodapé */}
      <div className={styles.inputGroup}>
        <label htmlFor="footerBackgroundColor" className={styles.inputLabel}>Cor de Fundo do Rodapé:</label>
        <div className={styles.colorSwatchContainer}>
          <div
            className={styles.colorSwatch}
            style={{ backgroundColor: footerConfig.footerBackgroundColor }}
            onClick={() => footerBgColorInputRef.current?.click()}
          />
          <input
            ref={footerBgColorInputRef}
            type="color"
            id="footerBackgroundColor"
            className={styles.hiddenColorInput}
            value={footerConfig.footerBackgroundColor}
            onChange={(e) => handleUpdate('footerBackgroundColor', e.target.value)}
          />
        </div>
      </div>

      {/* Cor do Texto do Rodapé */}
      <div className={styles.inputGroup}>
        <label htmlFor="footerTextColor" className={styles.inputLabel}>Cor do Texto do Rodapé:</label>
        <div className={styles.colorSwatchContainer}>
          <div
            className={styles.colorSwatch}
            style={{ backgroundColor: footerConfig.footerTextColor }}
            onClick={() => footerTextColorInputRef.current?.click()}
          />
          <input
            ref={footerTextColorInputRef}
            type="color"
            id="footerTextColor"
            className={styles.hiddenColorInput}
            value={footerConfig.footerTextColor}
            onChange={(e) => handleUpdate('footerTextColor', e.target.value)}
          />
        </div>
      </div>

      {/* Exibir Links Rápidos */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={footerConfig.showQuickLinks}
            onChange={(e) => handleUpdate('showQuickLinks', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Links Rápidos
        </label>
        {footerConfig.showQuickLinks && (
          <div className={styles.nestedInputGroup}>
            <label htmlFor="quickLinksTitle" className={styles.inputLabel}>Título dos Links Rápidos:</label>
            <input
              type="text"
              id="quickLinksTitle"
              className={styles.textInput}
              value={footerConfig.quickLinksTitle}
              onChange={(e) => handleUpdate('quickLinksTitle', e.target.value)}
            />
            <h4 className={styles.nestedTitle}>Gerenciar Links:</h4>
            {quickLinks.map((link) => (
              <div key={link.id} className={styles.arrayItem}>
                <input
                  type="text"
                  placeholder="Texto do Link"
                  value={link.text}
                  onChange={(e) => handleQuickLinkChange(link.id, 'text', e.target.value)}
                  className={styles.textInput}
                />
                <input
                  type="text"
                  placeholder="URL do Link"
                  value={link.url}
                  onChange={(e) => handleQuickLinkChange(link.id, 'url', e.target.value)}
                  className={styles.textInput}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveQuickLink(link.id)}
                  className={styles.removeButton}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.removeIcon}>
                    <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V4C7 3.44772 7.44772 3 8 3H16C16.5523 3 17 3.44772 17 4V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 5V6H15V5H9Z"></path>
                  </svg>
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddQuickLink} className={styles.addButton}>
              Adicionar Link Rápido
            </button>
          </div>
        )}
      </div>

      {/* Exibir Ícones de Redes Sociais */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={footerConfig.showSocialMediaIcons}
            onChange={(e) => handleUpdate('showSocialMediaIcons', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Ícones de Redes Sociais
        </label>
        {footerConfig.showSocialMediaIcons && (
          <div className={styles.nestedInputGroup}>
            <label htmlFor="socialMediaTitle" className={styles.inputLabel}>Título da Seção de Redes Sociais:</label>
            <input
              type="text"
              id="socialMediaTitle"
              className={styles.textInput}
              value={footerConfig.socialMediaTitle}
              onChange={(e) => handleUpdate('socialMediaTitle', e.target.value)}
            />
            <h4 className={styles.nestedTitle}>Gerenciar Redes:</h4>
            {socialMediaLinks.map((link) => (
              <div key={link.id} className={styles.arrayItem}>
                <select
                  value={link.platform}
                  onChange={(e) => handleSocialMediaLinkChange(link.id, 'platform', e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="x">X (Twitter)</option>
                  <option value="youtube">YouTube</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="pinterest">Pinterest</option>
                  <option value="tiktok">TikTok</option>
                </select>
                <input
                  type="text"
                  placeholder="URL da Rede Social"
                  value={link.url}
                  onChange={(e) => handleSocialMediaLinkChange(link.id, 'url', e.target.value)}
                  className={styles.textInput}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSocialMediaLink(link.id)}
                  className={styles.removeButton}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.removeIcon}>
                    <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V4C7 3.44772 7.44772 3 8 3H16C16.5523 3 17 3.44772 17 4V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 5V6H15V5H9Z"></path>
                  </svg>
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddSocialMediaLink} className={styles.addButton}>
              Adicionar Rede Social
            </button>
          </div>
        )}
      </div>

      {/* Exibir Imagens de Métodos de Pagamento */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={footerConfig.showPaymentMethods}
            onChange={(e) => handleUpdate('showPaymentMethods', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Métodos de Pagamento
        </label>
        {footerConfig.showPaymentMethods && (
          <div className={styles.nestedInputGroup}>
            <label htmlFor="paymentMethodsUpload" className={styles.inputLabel}>Adicionar Imagem de Método de Pagamento:</label>
            <input
              type="file"
              id="paymentMethodsUpload"
              accept="image/*"
              ref={paymentImageInputRef}
              onChange={handlePaymentImageUpload}
              className={styles.fileInput}
            />
            <div className={styles.paymentMethodsList}>
              {paymentMethodsImages.map((image) => (
                <div key={image.id} className={styles.paymentMethodItem}>
                  <img src={image.imageUrl} alt="Método de Pagamento" className={styles.paymentMethodImage} />
                  <button
                    type="button"
                    onClick={() => handleRemovePaymentImage(image.id)}
                    className={styles.removeButton}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Informações de Contato */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={footerConfig.showContactInfo}
            onChange={(e) => handleUpdate('showContactInfo', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Informações de Contato
        </label>
        {footerConfig.showContactInfo && (
          <div className={styles.nestedInputGroup}>
            <label htmlFor="contactAddress" className={styles.inputLabel}>Endereço:</label>
            <input
              type="text"
              id="contactAddress"
              className={styles.textInput}
              value={footerConfig.contactAddress}
              onChange={(e) => handleUpdate('contactAddress', e.target.value)}
            />
            <label htmlFor="contactPhone" className={styles.inputLabel}>Telefone:</label>
            <input
              type="text"
              id="contactPhone"
              className={styles.textInput}
              value={footerConfig.contactPhone}
              onChange={(e) => handleUpdate('contactPhone', e.target.value)}
            />
            <label htmlFor="contactEmail" className={styles.inputLabel}>E-mail:</label>
            <input
              type="email"
              id="contactEmail"
              className={styles.textInput}
              value={footerConfig.contactEmail}
              onChange={(e) => handleUpdate('contactEmail', e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Newsletter */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={footerConfig.showNewsletterSignup}
            onChange={(e) => handleUpdate('showNewsletterSignup', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Cadastro de Newsletter
        </label>
        {footerConfig.showNewsletterSignup && (
          <div className={styles.nestedInputGroup}>
            <label htmlFor="newsletterTitle" className={styles.inputLabel}>Título:</label>
            <input
              type="text"
              id="newsletterTitle"
              className={styles.textInput}
              value={footerConfig.newsletterTitle}
              onChange={(e) => handleUpdate('newsletterTitle', e.target.value)}
            />
            <label htmlFor="newsletterSubtitle" className={styles.inputLabel}>Subtítulo:</label>
            <input
              type="text"
              id="newsletterSubtitle"
              className={styles.textInput}
              value={footerConfig.newsletterSubtitle}
              onChange={(e) => handleUpdate('newsletterSubtitle', e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Copyright */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={footerConfig.showCopyright}
            onChange={(e) => handleUpdate('showCopyright', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Copyright
        </label>
        {footerConfig.showCopyright && (
          <div className={styles.nestedInputGroup}>
            <label htmlFor="copyrightText" className={styles.inputLabel}>Texto do Copyright:</label>
            <input
              type="text"
              id="copyrightText"
              className={styles.textInput}
              value={footerConfig.copyrightText}
              onChange={(e) => handleUpdate('copyrightText', e.target.value)}
            />
          </div>
        )}
      </div>

      {/* CNPJ */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={footerConfig.showCnpj}
            onChange={(e) => handleUpdate('showCnpj', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir CNPJ
        </label>
        {footerConfig.showCnpj && (
          <div className={styles.nestedInputGroup}>
            <label htmlFor="cnpjText" className={styles.inputLabel}>Texto do CNPJ:</label>
            <input
              type="text"
              id="cnpjText"
              className={styles.textInput}
              value={footerConfig.cnpjText}
              onChange={(e) => handleUpdate('cnpjText', e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FooterSection;
