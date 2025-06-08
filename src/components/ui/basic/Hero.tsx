// src/components/ui/base/Hero.tsx
import React from 'react';

interface HeroProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ title, subtitle, center = false }) => (
  <div className={center ? 'text-center' : ''}>
    <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
    {subtitle && <p className="text-slate-600 mt-1">{subtitle}</p>}
  </div>
);
