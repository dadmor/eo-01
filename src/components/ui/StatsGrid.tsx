// src/components/ui/base/StatsGrid.tsx
import React from 'react';
import { StatCard } from './basic/StatCard';

interface StatsGridProps {
  items: Array<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  }>;
  colsMobile?: number;
  colsDesktop?: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  items,
  colsMobile = 1,
  colsDesktop = 3
}) => (
  <div className={`grid gap-6 grid-cols-${colsMobile} md:grid-cols-${colsDesktop}`}>
    {items.map((cfg, i) => (
      <StatCard key={i} {...cfg} />
    ))}
  </div>
);
