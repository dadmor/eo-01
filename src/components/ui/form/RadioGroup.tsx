import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
  layout?: "vertical" | "horizontal" | "grid";
}

const RadioGroup: React.FC<RadioGroupProps> = ({ 
  options, 
  value, 
  onChange, 
  name,
  className = "",
  layout = "vertical"
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const layoutClasses = {
    vertical: "flex flex-col gap-2",
    horizontal: "flex flex-wrap gap-4",
    grid: "grid grid-cols-2 gap-2"
  };

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={handleChange}
            className="border-slate-300 text-slate-900 focus:ring-slate-500"
          />
          <span className="text-sm text-slate-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;