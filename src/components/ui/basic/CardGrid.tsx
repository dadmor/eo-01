// src/components/ui/base/CardGrid.tsx
import React from 'react';
import { BaseGrid } from './BaseGrid';

interface CardGridProps {
  children: React.ReactNode;
}

export const CardGrid: React.FC<CardGridProps> = ({ children }) => (
  <BaseGrid colsMobile={1} colsDesktop={2} gap="gap-6">
    {children}
  </BaseGrid>
);
