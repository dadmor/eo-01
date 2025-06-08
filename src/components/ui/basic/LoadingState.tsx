// src/components/ui/base/LoadingState.tsx
import React from 'react';
import { LoadingSpinner } from '../basic/LoadingSpinner';

interface LoadingStateProps {
  /** czy pokazywać spinner (domyślnie true) */
  loading?: boolean;
  /** rozmiar spinnera */
  size?: 'sm' | 'md' | 'lg';
  /** zawartość do wyrenderowania, gdy nie ładuje */
  children?: React.ReactNode;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  loading = true,
  size = 'md',
  children = null
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[20rem]">
        <LoadingSpinner size={size} />
      </div>
    );
  }
  return <>{children}</>;
};
