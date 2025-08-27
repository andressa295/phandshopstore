// app/(painel)/personalizar/components/editor/sections/FooterSection.tsx
'use client';

import React, { useRef, useCallback } from 'react';
import { ThemeConfig, FooterConfig, ThemeUpdateFn } from '../../../types';
import { v4 as uuidv4 } from 'uuid';
import styles from './FooterSection.module.css';
import { useTheme } from '../../../context/ThemeContext';
import { MdAdd, MdClose } from 'react-icons/md';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaLinkedin, FaPinterest, FaTiktok } from 'react-icons/fa';

// Mapeamento de plataformas para seus nomes de exibição e ícones
const socialMediaOptions = [
  { platform: 'facebook', name: 'Facebook', icon: <FaFacebook size={18} /> },
  { platform: 'instagram', name: 'Instagram', icon: <FaInstagram size={18} /> },
  { platform: 'x', name: 'X (Twitter)', icon: <FaTwitter size={18} /> },
  { platform: 'youtube', name: 'YouTube', icon: <FaYoutube size={18} /> },
  { platform: 'linkedin', name: 'LinkedIn', icon: <FaLinkedin size={18} /> },
  { platform: 'pinterest', name: 'Pinterest', icon: <FaPinterest size={18} /> },
  { platform: 'tiktok', name: 'TikTok', icon: <FaTiktok size={18} /> },
];

const FooterSection: React.FC = () => {
  const { config, updateConfig } = useTheme();

  const defaultFooterConfig: FooterConfig = {
    showMenu: false, // Nova propriedade para o menu principal
    showSocialMediaIcons: true,
    socialMediaTitle: 'Siga-nos',
    socialMediaLinks: [
      { id: uuidv4(), platform: 'instagram', url: 'https://instagram.com/sua_loja' },
      { id: uuidv4(), platform: 'facebook', url: 'https://facebook.com/sua_loja' },
    ],
    showNewsletterSignup: true,
    newsletterTitle: 'Receba Novidades',
    newsletterSubtitle: 'Inscreva-se e receba ofertas exclusivas!',
    privacyPolicyLink: '/politica-de-privacidade',
    showContactInfo: true,
    contactAddress: 'Rua Exemplo, 123 - Cidade, Estado, CEP',
    contactPhone: '(XX) XXXX-XXXX',
    contactEmail: 'contato@sua_loja.com',
    showPaymentMethods: true,
    paymentMethodsImages: [],
    showShippingMethods: true,
    shippingMethodsImages: [],
    showCopyright: true,
    copyrightText: `© ${new Date().getFullYear()} Sua Loja. Todos os direitos reservados.`,
    showCnpj: false,
    cnpjText: 'CNPJ: XX.XXX.XXX/XXXX-XX',
    footerBackgroundColor: '#343a40',
    footerTextColor: '#ffffff',
  };

  const footerConfig = config.footer || defaultFooterConfig;

  const handleUpdate = useCallback((field: keyof FooterConfig, value: any) => {
    updateConfig({
      footer: {
        ...footerConfig,
        [field]: value,
      },
    });
  }, [updateConfig, footerConfig]);

  const handleSocialMediaLinkChange = useCallback((id: string, field: 'platform' | 'url', value: string) => {
    const newLinks = (footerConfig.socialMediaLinks || []).map(link =>
      link.id === id ? { ...link, [field]: value as any } : link
    );
    handleUpdate('socialMediaLinks', newLinks);
  }, [footerConfig.socialMediaLinks, handleUpdate]);

  const handleAddSocialMediaLink = useCallback(() => {
    handleUpdate('socialMediaLinks', [...(footerConfig.socialMediaLinks || []), { id: uuidv4(), platform: 'instagram', url: '' }]);
  }, [footerConfig.socialMediaLinks, handleUpdate]);

  const handleRemoveSocialMediaLink = useCallback((id: string) => {
    const newLinks = (footerConfig.socialMediaLinks || []).filter(link => link.id !== id);
    handleUpdate('socialMediaLinks', newLinks);
  }, [footerConfig.socialMediaLinks, handleUpdate]);

  const paymentMethodsList = [
    { id: 'visa', imageUrl: 'https://via.placeholder.com/60x40?text=Visa' },
    { id: 'mastercard', imageUrl: 'https://via.placeholder.com/60x40?text=Mastercard' },
    { id: 'boleto', imageUrl: 'https://via.placeholder.com/60x40?text=Boleto' },
    { id: 'pix', imageUrl: 'https://via.placeholder.com/60x40?text=Pix' },
  ];
  
  const shippingMethodsList = [
    { id: 'correios', imageUrl: 'https://via.placeholder.com/60x40?text=Correios' },
    { id: 'sedex', imageUrl: 'https://via.placeholder.com/60x40?text=Sedex' },
    { id: 'jadlog', imageUrl: 'https://via.placeholder.com/60x40?text=Jadlog' },
  ];
  
  const handleTogglePaymentMethod = useCallback((imageId: string, isChecked: boolean) => {
    if (isChecked) {
      const newImage = paymentMethodsList.find(img => img.id === imageId);
      if (newImage) {
        handleUpdate('paymentMethodsImages', [...(footerConfig.paymentMethodsImages || []), { id: newImage.id, imageUrl: newImage.imageUrl }]);
      }
    } else {
      handleUpdate('paymentMethodsImages', (footerConfig.paymentMethodsImages || []).filter(img => img.id !== imageId));
    }
  }, [footerConfig.paymentMethodsImages, handleUpdate]);

  const handleToggleShippingMethod = useCallback((imageId: string, isChecked: boolean) => {
    if (isChecked) {
      const newImage = shippingMethodsList.find(img => img.id === imageId);
      if (newImage) {
        handleUpdate('shippingMethodsImages', [...(footerConfig.shippingMethodsImages || []), { id: newImage.id, imageUrl: newImage.imageUrl }]);
      }
    } else {
      handleUpdate('shippingMethodsImages', (footerConfig.shippingMethodsImages || []).filter(img => img.id !== imageId));
    }
  }, [footerConfig.shippingMethodsImages, handleUpdate]);

  const footerBgColorInputRef = useRef<HTMLInputElement>(null);
  const footerTextColorInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.sectionBlock}>
      <h3 className={styles.sectionTitle}>Rodapé da Página</h3>
      <p className={styles.sectionDescription}>
        Ajuste o conteúdo e o estilo do rodapé da sua loja.
      </p>

      {/* Cores */}
      <div className={styles.nestedInputGroup}>
        <h4 className={styles.nestedTitle}>Cores do Rodapé</h4>
        <div className={styles.inputGroup}>
          <label htmlFor="footerBackgroundColor" className={styles.inputLabel}>Cor de Fundo:</label>
          <div className={styles.colorSwatchContainer}>
            <div
              className={styles.colorSwatch}
              style={{ backgroundColor: footerConfig.footerBackgroundColor ?? '#343a40' }}
              onClick={() => footerBgColorInputRef.current?.click()}
            />
            <input
              ref={footerBgColorInputRef}
              type="color"
              id="footerBackgroundColor"
              className={styles.hiddenColorInput}
              value={footerConfig.footerBackgroundColor ?? '#343a40'}
              onChange={(e) => handleUpdate('footerBackgroundColor', e.target.value)}
            />
          </div>
          <p className={styles.fieldDescription}>Cor de fundo do rodapé.</p>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="footerTextColor" className={styles.inputLabel}>Cor do Texto:</label>
          <div className={styles.colorSwatchContainer}>
            <div
              className={styles.colorSwatch}
              style={{ backgroundColor: footerConfig.footerTextColor ?? '#ffffff' }}
              onClick={() => footerTextColorInputRef.current?.click()}
            />
            <input
              ref={footerTextColorInputRef}
              type="color"
              id="footerTextColor"
              className={styles.hiddenColorInput}
              value={footerConfig.footerTextColor ?? '#ffffff'}
              onChange={(e) => handleUpdate('footerTextColor', e.target.value)}
            />
          </div>
          <p className={styles.fieldDescription}>Cor do texto, links e ícones do rodapé.</p>
        </div>
      </div>
      
      {/* Exibir Menu Principal no Rodapé */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={footerConfig.showMenu ?? false}
            onChange={(e) => handleUpdate('showMenu', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Menu Principal no Rodapé
        </label>
      </div>

      {/* Exibir Ícones de Redes Sociais */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={footerConfig.showSocialMediaIcons ?? false}
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
              value={footerConfig.socialMediaTitle ?? ''}
              onChange={(e) => handleUpdate('socialMediaTitle', e.target.value)}
              placeholder="Ex: Siga-nos"
            />
            <p className={styles.fieldDescription}>O título exibido acima dos ícones de redes sociais.</p>

            <h4 className={styles.nestedSubtitle}>Redes:</h4>
            {(footerConfig.socialMediaLinks || []).map((link) => (
              <div key={link.id} className={styles.arrayItem}>
                {/* Ícone agora renderizado diretamente no select, com CSS para alinhar */}
                <div className={styles.socialSelectWrapper}>
                  <span className={styles.socialSelectIcon}>
                    {socialMediaOptions.find(opt => opt.platform === link.platform)?.icon}
                  </span>
                  <select
                    value={link.platform ?? 'instagram'}
                    onChange={(e) => handleSocialMediaLinkChange(link.id, 'platform', e.target.value)}
                    className={styles.selectInput}
                  >
                    {socialMediaOptions.map(option => (
                      <option key={option.platform} value={option.platform}>
                        {/* Texto da opção */}
                        {option.name} 
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="URL do Perfil"
                  value={link.url ?? ''}
                  onChange={(e) => handleSocialMediaLinkChange(link.id, 'url', e.target.value)}
                  className={styles.textInput}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSocialMediaLink(link.id)}
                  className={styles.removeButton}
                  title="Remover rede social"
                >
                  <MdClose size={20} /> {/* Aumentado o tamanho do ícone do X para visibilidade */}
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddSocialMediaLink} className={styles.addButton}>
              <MdAdd size={18} /> Rede Social
            </button>
          </div>
        )}
      </div>

      {/* Exibir Imagens de Métodos de Pagamento e Envio */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={footerConfig.showPaymentMethods ?? false}
            onChange={(e) => handleUpdate('showPaymentMethods', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Métodos de Pagamento
        </label>
        {footerConfig.showPaymentMethods && (
          <div className={styles.nestedInputGroup}>
            <h4 className={styles.nestedSubtitle}>Métodos de Pagamento:</h4>
            <div className={styles.paymentMethodsList}>
              {paymentMethodsList.map((image) => (
                <div key={image.id} className={styles.paymentMethodItem}>
                  <img src={image.imageUrl} alt={image.id} className={styles.paymentMethodImage} />
                </div>
              ))}
            </div>
            <p className={styles.fieldDescription}>As imagens dos métodos de pagamento são padrões da plataforma.</p>
          </div>
        )}
      </div>
      
      {/* Exibir Métodos de Envio */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={footerConfig.showShippingMethods ?? false}
            onChange={(e) => handleUpdate('showShippingMethods', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Métodos de Envio
        </label>
        {footerConfig.showShippingMethods && (
          <div className={styles.nestedInputGroup}>
            <h4 className={styles.nestedSubtitle}>Métodos de Envio:</h4>
            <div className={styles.paymentMethodsList}>
              {shippingMethodsList.map((image) => (
                <div key={image.id} className={styles.paymentMethodItem}>
                  <img src={image.imageUrl} alt={image.id} className={styles.paymentMethodImage} />
                </div>
              ))}
            </div>
            <p className={styles.fieldDescription}>As imagens dos métodos de envio são padrões da plataforma.</p>
          </div>
        )}
      </div>

      {/* Informações de Contato */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={footerConfig.showContactInfo ?? false}
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
              value={footerConfig.contactAddress ?? ''}
              onChange={(e) => handleUpdate('contactAddress', e.target.value)}
              placeholder="Rua Exemplo, 123"
            />
            <label htmlFor="contactPhone" className={styles.inputLabel}>Telefone:</label>
            <input
              type="text"
              id="contactPhone"
              className={styles.textInput}
              value={footerConfig.contactPhone ?? ''}
              onChange={(e) => handleUpdate('contactPhone', e.target.value)}
              placeholder="(XX) XXXX-XXXX"
            />
            <label htmlFor="contactEmail" className={styles.inputLabel}>E-mail:</label>
            <input
              type="email"
              id="contactEmail"
              className={styles.textInput}
              value={footerConfig.contactEmail ?? ''}
              onChange={(e) => handleUpdate('contactEmail', e.target.value)}
              placeholder="contato@sua_loja.com"
            />
          </div>
        )}
      </div>

      {/* Copyright */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={footerConfig.showCopyright ?? false}
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
              value={footerConfig.copyrightText ?? ''}
              onChange={(e) => handleUpdate('copyrightText', e.target.value)}
              placeholder={`© ${new Date().getFullYear()} Sua Loja.`}
            />
            <p className={styles.fieldDescription}>O texto de direitos autorais exibido no rodapé.</p>
          </div>
        )}
      </div>

      {/* CNPJ */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={footerConfig.showCnpj ?? false}
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
              value={footerConfig.cnpjText ?? ''}
              onChange={(e) => handleUpdate('cnpjText', e.target.value)}
              placeholder="CNPJ: XX.XXX.XXX/XXXX-XX"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FooterSection;