// src/components/ui/base/SectionHeader.tsx
import React from 'react';
import { Button } from '../basic/Button';
import { Hero } from './Hero';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  actionVariant?: 'primary' | 'outline' | 'secondary' | 'ghost';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  actionIcon,
  actionVariant = 'primary'
}) => (
  <div className="flex justify-between items-center mb-4">
    <Hero title={title} subtitle={subtitle} />
    {actionLabel && onAction && (
      <Button variant={actionVariant} icon={actionIcon} onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);
