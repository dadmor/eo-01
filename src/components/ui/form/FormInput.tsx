// ------ src/components/ui/form/FormInput.tsx ------
import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Icon to display on the left side */
  icon?: React.ReactNode;
  /** Additional wrapper class names */
  wrapperClassName?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  icon,
  wrapperClassName = '',
  className = '',
  ...props
}) => {
  const baseClasses = "w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent";
  const withIconClasses = icon ? "pl-10" : "";
  
  if (icon) {
    return (
      <div className={`relative ${wrapperClassName}`}>
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
          {icon}
        </div>
        <input
          className={`${baseClasses} ${withIconClasses} ${className}`}
          {...props}
        />
      </div>
    );
  }

  return (
    <input
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
};

export default FormInput;
