// src/components/ui/base/FilterBar.tsx
import React from 'react';

interface FilterBarProps {
  children: React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({ children }) => (
  <div className="bg-white p-6 rounded-lg border border-slate-200 mb-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
  </div>
);
