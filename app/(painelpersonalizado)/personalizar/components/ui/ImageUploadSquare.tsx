// app/(painelpersonalizado)/personalizar/components/ui/ImageUploadSquare.tsx
'use client';

import React, { useRef, useState } from 'react';
import { FaUpload, FaTimes } from 'react-icons/fa';

interface ImageUploadSquareProps {
  onImageUpload: (imageUrl: string | null) => void;
  currentImageUrl: string | null | undefined;
  label?: string;
  recommendation?: string;
  shape?: 'square' | 'landscape_banner' | 'portrait_banner'; // Adicionada prop 'shape'
}

const ImageUploadSquare: React.FC<ImageUploadSquareProps> = ({ onImageUpload, currentImageUrl, label, recommendation, shape = 'square' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  let width = '120px';
  let height = '120px';
  let placeholderText = 'Clique para fazer upload';

  if (shape === 'landscape_banner') {
    width = '180px'; // Mais largo para banners
    height = '100px';
    placeholderText = 'Upload Banner (Retangular)';
  } else if (shape === 'portrait_banner') {
    width = '100px'; // Mais alto para banners verticais
    height = '180px';
    placeholderText = 'Upload Banner (Vertical)';
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>{label}</label>}
      <div
        onClick={handleDivClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: width,
          height: height,
          border: `2px dashed ${isHovered ? '#007bff' : '#ccc'}`,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          backgroundColor: isHovered ? '#e6f7ff' : '#f9f9f9',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.2s ease-in-out',
          boxSizing: 'border-box',
        }}
      >
        {currentImageUrl ? (
          <>
            <img
              src={currentImageUrl}
              alt="Pré-visualização"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '6px',
                pointerEvents: 'none'
              }}
              onError={(e) => (e.currentTarget.src = `https://placehold.co/${width.replace('px','')}}x${height.replace('px','')}}/eee/aaa?text=Erro`)}
            />
            <button
              onClick={handleRemoveImage}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: 'rgba(255, 0, 0, 0.7)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '0.8rem',
                zIndex: 10,
              }}
              title="Remover imagem"
            >
              <FaTimes />
            </button>
          </>
        ) : (
          <>
            <FaUpload size={24} color="#888" />
            <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: '#555', textAlign: 'center' }}>{placeholderText}</p>
          </>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*"
        />
      </div>
      {recommendation && <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '5px', fontFamily: 'Poppins, sans-serif' }}>{recommendation}</p>}
    </div>
  );
};

export default ImageUploadSquare;