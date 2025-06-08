// src/components/ui/base/Section.tsx
import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  bg?: string; // np. 'bg-gray-50'
}

export const Section: React.FC<SectionProps> = ({ children, bg = '' }) => (
  <section className={`py-6 ${bg}`}>{children}</section>
);
