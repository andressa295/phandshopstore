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
  // Define uma configuração padrão completa com IDs
  const defaultFooterConfig: FooterConfig = {
    showQuickLinks: true,
    quickLinksTitle: 'Links Rápidos',
    quickLinks: [
      { id: uuidv4(), text: 'Sobre Nós', url: '/sobre' },
      { id: uuidv4(), text: 'Contato', url: '/contato' },
      { id: uuidv4(), text: 'Política de Privacidade', url: '/politica-privacidade' },
    ],
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

  // Inicialização robusta de footerConfig
  // Garante que todos os arrays e objetos têm as propriedades esperadas, incluindo 'id'
  const footerConfig: FooterConfig = {
    ...defaultFooterConfig, // Começa com todos os valores padrão
    ...(config.footer || {}), // Sobrescreve com os valores existentes da config, se houver
    
    // Processa quickLinks para garantir que todos os itens tenham 'id'
    quickLinks: (config.footer?.quickLinks || defaultFooterConfig.quickLinks).map(link => ({
      id: (link as any).id || uuidv4(), // Usa 'id' existente ou gera um novo
      text: link.text,
      url: link.url,
    })),
    
    // Processa socialMediaLinks para garantir que todos os itens tenham 'id'
    socialMediaLinks: (config.footer?.socialMediaLinks || defaultFooterConfig.socialMediaLinks).map(link => ({
      id: (link as any).id || uuidv4(), // Usa 'id' existente ou gera um novo
      platform: link.platform,
      url: link.url,
    })),

    // Processa paymentMethodsImages para garantir que todos os itens tenham 'id' e 'imageUrl'
    paymentMethodsImages: (config.footer?.paymentMethodsImages || defaultFooterConfig.paymentMethodsImages).map(image => {
      // Se o item for uma string (formato antigo), converte para o novo formato de objeto
      if (typeof image === 'string') {
        return { id: uuidv4(), imageUrl: image };
      }
      // Se já for um objeto, garante que tem 'id' ou adiciona um
      return { id: (image as any).id || uuidv4(), imageUrl: image.imageUrl };
    }),
  };

  // Refs para os inputs de cor ocultos
  const footerBgColorInputRef = useRef<HTMLInputElement>(null);
  const footerTextColorInputRef = useRef<HTMLInputElement>(null);

  // Refs para os inputs de upload de imagens de pagamento
  const paymentImageInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (field: keyof FooterConfig, value: any) => { 
    updateConfig({
      footer: {
        ...footerConfig, 
        [field]: value, 
      },
    });
  };

  // Funções de manipulação para Quick Links
  const handleQuickLinkChange = (id: string, field: 'text' | 'url', value: string) => {
    const newLinks = footerConfig.quickLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    );
    handleUpdate('quickLinks', newLinks);
  };

  const handleAddQuickLink = () => {
    handleUpdate('quickLinks', [...footerConfig.quickLinks, { id: uuidv4(), text: '', url: '' }]);
  };

  const handleRemoveQuickLink = (id: string) => {
    const newLinks = footerConfig.quickLinks.filter(link => link.id !== id);
    handleUpdate('quickLinks', newLinks);
  };

  // Funções de manipulação para Social Media Links
  const handleSocialMediaLinkChange = (id: string, field: 'platform' | 'url', value: string) => {
    const newLinks = footerConfig.socialMediaLinks.map(link => 
      link.id === id ? { ...link, [field]: value as any } : link
    );
    handleUpdate('socialMediaLinks', newLinks);
  };

  const handleAddSocialMediaLink = () => {
    handleUpdate('socialMediaLinks', [...footerConfig.socialMediaLinks, { id: uuidv4(), platform: 'instagram', url: '' }]);
  };

  const handleRemoveSocialMediaLink = (id: string) => {
    const newLinks = footerConfig.socialMediaLinks.filter(link => link.id !== id);
    handleUpdate('socialMediaLinks', newLinks);
  };

  // Funções de manipulação para Payment Methods Images
  const handlePaymentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage = { id: uuidv4(), imageUrl: reader.result as string };
        handleUpdate('paymentMethodsImages', [...footerConfig.paymentMethodsImages, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePaymentImage = (id: string) => {
    const newImages = footerConfig.paymentMethodsImages.filter(image => image.id !== id);
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
          ></div>
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
          ></div>
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
            {footerConfig.quickLinks.map((link) => ( 
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
                  {/* Ícone de lixeira */}
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
            {footerConfig.socialMediaLinks.map((link) => ( 
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
                  {/* Ícone de lixeira */}
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

      {/* Exibir Campo de Assinatura de Newsletter */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={footerConfig.showNewsletterSignup}
            onChange={(e) => handleUpdate('showNewsletterSignup', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Campo de Assinatura de Newsletter
        </label>
        {footerConfig.showNewsletterSignup && (
          <div className={styles.nestedInputGroup}>
            <label htmlFor="newsletterTitle" className={styles.inputLabel}>Título da Newsletter:</label>
            <input
              type="text"
              id="newsletterTitle"
              className={styles.textInput}
              value={footerConfig.newsletterTitle}
              onChange={(e) => handleUpdate('newsletterTitle', e.target.value)}
            />
            <label htmlFor="newsletterSubtitle" className={styles.inputLabel}>Subtítulo da Newsletter:</label>
            <textarea
              id="newsletterSubtitle"
              className={styles.textArea}
              value={footerConfig.newsletterSubtitle}
              onChange={(e) => handleUpdate('newsletterSubtitle', e.target.value)}
              rows={2}
            />
          </div>
        )}
      </div>

      {/* Exibir Informações de Contato */}
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

      {/* Exibir Bandeiras de Métodos de Pagamento - AGORA COM UPLOAD */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={footerConfig.showPaymentMethods}
            onChange={(e) => handleUpdate('showPaymentMethods', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Bandeiras de Métodos de Pagamento
        </label>
        {footerConfig.showPaymentMethods && (
          <div className={styles.nestedInputGroup}>
            <h4 className={styles.nestedTitle}>Gerenciar Imagens de Pagamento:</h4>
            <div className={styles.imagePreviewContainer}>
              {/* Mapeia sobre o array de objetos 'image' */}
              {footerConfig.paymentMethodsImages.map((image) => (
                <div key={image.id} className={styles.paymentImageItem}> 
                  <img src={image.imageUrl} alt="Método de Pagamento" className={styles.imagePreviewSmall} />
                  <button
                    type="button"
                    onClick={() => handleRemovePaymentImage(image.id)}
                    className={styles.removeImageButton} 
                  >
                    {/* Ícone de fechar/remover */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.removeImageIcon}>
                      <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 10.5858L9.70711 8.29289C9.31658 7.90237 8.68342 7.90237 8.29289 8.29289C7.90237 8.68342 7.90237 9.31658 8.29289 9.70711L10.5858 12L8.29289 14.2929C7.90237 14.6834 7.90237 15.3166 8.29289 15.7071C8.68342 16.0976 9.31658 16.0976 9.70711 15.7071L12 13.4142L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L13.4142 12L15.7071 9.70711C16.0976 9.31658 16.0976 8.68342 15.7071 8.29289C15.3166 7.90237 14.6834 7.90237 14.2929 8.29289L12 10.5858Z"></path>
                    </svg>
                  </button>
                </div>
              ))}
              <div
                className={styles.logoUploadBox} 
                onClick={() => paymentImageInputRef.current?.click()}
              >
                <span className={styles.logoPlaceholder}>Adicionar Imagem</span>
              </div>
              <input
                ref={paymentImageInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePaymentImageUpload}
              />
            </div>
          </div>
        )}
      </div>

      {/* Exibir Texto de Copyright */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={footerConfig.showCopyright}
            onChange={(e) => handleUpdate('showCopyright', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Texto de Copyright
        </label>
        {footerConfig.showCopyright && (
          <div className={styles.nestedInputGroup}>
            <label htmlFor="copyrightText" className={styles.inputLabel}>Texto de Copyright:</label>
            <input
              type="text"
              id="copyrightText"
              className={styles.textInput}
              value={footerConfig.copyrightText}
              onChange={(e) => handleUpdate('copyrightText', e.target.value)}
              placeholder={`© ${new Date().getFullYear()} Sua Loja. Todos os direitos reservados.`}
            />
          </div>
        )}
      </div>

      {/* Exibir CNPJ */}
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
            <label htmlFor="cnpjText" className={styles.inputLabel}>Número do CNPJ:</label>
            <input
              type="text"
              id="cnpjText"
              className={styles.textInput}
              value={footerConfig.cnpjText}
              onChange={(e) => handleUpdate('cnpjText', e.target.value)}
              placeholder="XX.XXX.XXX/XXXX-XX"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FooterSection;
