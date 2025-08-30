'use client';

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import { TextImageModuleData } from '../../../../(painel)/personalizar/types';

interface StaticPageProps {
 
  data: TextImageModuleData;
}

const StaticPage: React.FC<StaticPageProps> = ({ data }) => {
  const { config } = useTheme();

  if (!data || !data.isActive) {
    return null;
  }

  const contactInfo = config.footer?.showContactInfo ? {
    email: config.footer.contactEmail,
    phone: config.footer.contactPhone,
    address: config.footer.contactAddress,
  } : null;

  return (
    <div className="ph-static-page">
      <h1 className="ph-static-page-title">{data.title}</h1>
      <div className="ph-static-page-content" dangerouslySetInnerHTML={{ __html: data.text || '' }} />

      {contactInfo && (
        <div className="ph-contact-info-section">
          <h2 className="ph-contact-info-title">Entre em Contato</h2>
          {contactInfo.email && (
            <p className="ph-contact-item">
              <Mail size={20} className="ph-contact-icon" />
              Email: <a href={`mailto:${contactInfo.email}`} className="ph-contact-link">{contactInfo.email}</a>
            </p>
          )}
          {contactInfo.phone && (
            <p className="ph-contact-item">
              <Phone size={20} className="ph-contact-icon" />
              Telefone: <a href={`tel:${contactInfo.phone.replace(/\D/g, '')}`} className="ph-contact-link">{contactInfo.phone}</a>
            </p>
          )}
          {contactInfo.address && (
            <p className="ph-contact-item">
              <MapPin size={20} className="ph-contact-icon" />
              Endereço: {contactInfo.address}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StaticPage;
