// src/components/ui/filters/SelectFilter.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface Option {
  value: string;
  label: string;
}

interface SelectFilterProps {
  /** List of options to render */
  options: Option[];
  /** Controlled value; string for single, string[] for multiple */
  value: string | string[];
  /** Change handler receives new selected value(s) */
  onChange?: (value: string | string[]) => void;
  /** Placeholder when no selection */
  placeholder?: string;
  /** Allow multiple selection */
  multiple?: boolean;
  /** Input name attribute */
  name?: string;
  /** Additional wrapper class names */
  className?: string;
}

const SelectFilter: React.FC<SelectFilterProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Wybierz...',
  multiple = false,
  name,
  className = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selected = Array.from(e.target.selectedOptions).map(o => o.value);
      onChange?.(selected);
    } else {
      onChange?.(e.target.value);
    }
  };

  if (multiple) {
    return (
      <div className={`relative ${className}`}>        
        <select
          name={name}
          multiple
          value={Array.isArray(value) ? value : []}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent min-h-[2.5rem] max-h-32"
          size={Math.min(options.length, 6)}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute top-2 right-2 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
        {Array.isArray(value) && value.length > 0 && (
          <div className="mt-1 text-xs text-slate-600">
            Wybrano: {value.length} {value.length === 1 ? 'element' : 'elementów'}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>      
      <select
        name={name}
        value={typeof value === 'string' ? value : ''}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none pr-10"
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none">
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
};

export default SelectFilter;
