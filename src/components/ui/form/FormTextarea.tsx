// ------ src/components/ui/form/FormTextarea.tsx ------
import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Show character count */
  showCount?: boolean;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
  showCount = false,
  className = '',
  maxLength,
  value,
  ...props
}) => {
  const baseClasses = "w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-vertical";
  
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="space-y-1">
      <textarea
        className={`${baseClasses} ${className}`}
        value={value}
        maxLength={maxLength}
        {...props}
      />
      {showCount && maxLength && (
        <div className="text-xs text-slate-500 text-right">
          {currentLength}/{maxLength} znaków
        </div>
      )}
    </div>
  );
};

export default FormTextarea;