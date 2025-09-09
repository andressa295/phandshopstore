import React from 'react';
import { HeroSection } from './components/landing/HeroSection';
import { DiferenciaisSection } from './components/landing/DiferenciaisSection';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { TemasSection } from './components/landing/TemasSection';
import { PlanosSection } from './components/landing/PlanosSection';
import { FaqSection } from './components/landing/FaqSection';
import { TestimonialsSection } from './components/landing/TestimonialsSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <DiferenciaisSection />
      <TemasSection />
      <FeaturesSection />
      
      <PlanosSection />
      <FaqSection />
      <TestimonialsSection />
    </main>
  );
}