// src/components/ui/filters/SearchFilter.tsx
import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchFilterProps {
  /** Current input value */
  value: string;
  /** Change handler receives new string value */
  onChange?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether show clear button when value non-empty */
  clearable?: boolean;
  /** Input name attribute */
  name?: string;
  /** Additional wrapper class names */
  className?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  value,
  onChange,
  placeholder = 'Szukaj...',
  clearable = true,
  name,
  className = ''
}) => (
  <div className={`relative ${className}`}>  
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    <input
      type="text"
      name={name}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="pl-10 pr-10 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent w-full"
    />
    {clearable && value && (
      <button
        type="button"
        onClick={() => onChange?.("")}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-slate-600"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

export default SearchFilter;
