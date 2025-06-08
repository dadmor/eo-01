interface FormFieldProps {
  /** Label text */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Whether field is required */
  required?: boolean;
  /** Help text */
  help?: string;
  /** Additional wrapper class names */
  className?: string;
  /** Form field content */
  children: React.ReactNode;
}
const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  help,
  className = "",
  children,
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {children}

      {error && <div className="text-sm text-red-600">{error}</div>}

      {help && !error && <div className="text-sm text-slate-500">{help}</div>}
    </div>
  );
};

export default FormField;
