// src/components/ui/base/ErrorState.tsx
import React from 'react';
import { Alert } from '../basic/Alert';

interface ErrorStateProps {
  /** czy jest błąd */
  error?: any;
  /** tytuł komunikatu */
  title?: string;
  /** treść komunikatu */
  message?: string;
  /** callback do ponownej próby */
  onRetry: () => void;
  /** zawartość, gdy nie ma błędu */
  children?: React.ReactNode;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error = false,
  title = 'Wystąpił błąd',
  message = 'Spróbuj ponownie.',
  onRetry,
  children = null
}) => {
  if (error) {
    return <Alert type="error" title={title} message={message} onRetry={onRetry} />;
  }
  return <>{children}</>;
};
