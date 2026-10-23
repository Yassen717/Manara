'use client';

import React from 'react';
import { Hero } from '@/components/marketing/Hero';
import { NationalStatusStrip } from '@/components/marketing/NationalStatusStrip';
import { ServiceCategoryGrid } from '@/components/marketing/ServiceCategoryGrid';
import { PopularServices } from '@/components/marketing/PopularServices';
import { ResearchProof } from '@/components/marketing/ResearchProof';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { TrustStrip } from '@/components/marketing/TrustStrip';
import { CtaBand } from '@/components/marketing/CtaBand';

export default function HomePage() {
  return (
    <>
      <Hero />
      <NationalStatusStrip />
      <ServiceCategoryGrid />
      <PopularServices />
      <ResearchProof />
      <HowItWorks />
      <TrustStrip />
      <CtaBand />
    </>
  );
}
