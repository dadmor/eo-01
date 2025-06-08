import React from 'react';
import { Plus, Download, Settings, User } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'outline', 
  size = 'md', 
  onClick,
  className = "",
  icon,
  fullWidth = false,
  disabled = false
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500 shadow-sm",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500 shadow-sm",
    ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2"
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {children}
    </button>
  );
};

// Demo
export default function ButtonDemo() {
  const [loading, setLoading] = React.useState(false);
  
  const handleAction = (action: string) => {
    console.log(`Action: ${action}`);
    if (action === 'download') {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-slate-900">Button Component</h1>
        
        {/* Variants */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Warianty</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" onClick={() => handleAction('primary')}>
              Primary
            </Button>
            <Button variant="outline" onClick={() => handleAction('outline')}>
              Outline
            </Button>
            <Button variant="ghost" onClick={() => handleAction('ghost')}>
              Ghost
            </Button>
            <Button variant="danger" onClick={() => handleAction('danger')}>
              Danger
            </Button>
          </div>
        </div>

        {/* Sizes */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Rozmiary</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
        </div>

        {/* With Icons */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Z ikonami</h2>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="primary" 
              icon={<Plus className="w-4 h-4" />}
              onClick={() => handleAction('add')}
            >
              Dodaj nowy
            </Button>
            <Button 
              variant="outline" 
              icon={<Download className="w-4 h-4" />}
              onClick={() => handleAction('download')}
              disabled={loading}
            >
              {loading ? 'Pobieranie...' : 'Pobierz'}
            </Button>
            <Button 
              variant="ghost" 
              icon={<Settings className="w-4 h-4" />}
              onClick={() => handleAction('settings')}
            >
              Ustawienia
            </Button>
            <Button 
              variant="outline" 
              icon={<User className="w-4 h-4" />}
              size="sm"
              onClick={() => handleAction('profile')}
            >
              Profil
            </Button>
          </div>
        </div>

        {/* Full Width */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Pełna szerokość</h2>
          <div className="space-y-3">
            <Button 
              variant="primary" 
              fullWidth
              icon={<Plus className="w-4 h-4" />}
              onClick={() => handleAction('full-primary')}
            >
              Primary Full Width
            </Button>
            <Button 
              variant="outline" 
              fullWidth
              onClick={() => handleAction('full-outline')}
            >
              Outline Full Width
            </Button>
          </div>
        </div>

        {/* States */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Stany</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Normal</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="outline">Normal</Button>
            <Button variant="outline" disabled>Disabled</Button>
          </div>
        </div>

      </div>
    </div>
  );
}