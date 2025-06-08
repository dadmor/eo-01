// src/components/ui/base/Container.tsx
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => (
  <div className="max-w-6xl mx-auto px-6">{children}</div>
);
