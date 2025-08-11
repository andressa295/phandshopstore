import React from 'react';
import { HeroSection } from './components/landing/HeroSection';
import { DiferenciaisSection } from './components/landing/DiferenciaisSection';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { TemasSection } from './components/landing/TemasSection';
import { PlanosSection } from './components/landing/PlanosSection';
import { FaqSection } from './components/landing/FaqSection';
import { FormularioEspecialista } from './components/landing/FormularioEspecialista';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <DiferenciaisSection />
      <FeaturesSection />
      <TemasSection />
      <PlanosSection />
      <FaqSection />
      <FormularioEspecialista />
    </main>
  );
}