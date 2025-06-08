// src/components/ui/base/BaseGrid.tsx
import React from 'react';

interface BaseGridProps {
  children: React.ReactNode;
  colsMobile?: number;
  colsDesktop?: number;
  gap?: string;
}

export const BaseGrid: React.FC<BaseGridProps> = ({
  children,
  colsMobile = 1,
  colsDesktop = 3,
  gap = 'gap-6'
}) => (
  <div className={`grid ${gap} grid-cols-${colsMobile} md:grid-cols-${colsDesktop}`}>
    {children}
  </div>
);
