import React from 'react';
import { HeroSection } from './components/landing/HeroSection';
import { DiferenciaisSection } from './components/landing/DiferenciaisSection';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { TemasSection } from './components/landing/TemasSection';
import { DepoimentosSection } from './components/landing/DepoimentosSection';
import { PlanosSection } from './components/landing/PlanosSection';
import { FaqSection } from './components/landing/FaqSection';
import { SuporteSection } from './components/landing/SuporteSection';
import { FormularioEspecialista } from './components/landing/FormularioEspecialista';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <DiferenciaisSection />
      <FeaturesSection />
      <TemasSection />
      <DepoimentosSection />
      <PlanosSection />
      <FaqSection />
      <SuporteSection />
      <FormularioEspecialista />
    </main>
  );
}