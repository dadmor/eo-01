import React from 'react';
import { User, Zap, Clock, BarChart3, Plus, FileText, Settings, Users, Database, AlertCircle } from 'lucide-react';

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'outline', 
  size = 'md', 
  onClick,
  className = "",
  icon,
  fullWidth = false
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500",
    ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-500"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  const iconGap = icon ? "gap-2" : "";
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${iconGap} ${className}`}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
};

// Avatar Component
interface AvatarProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className = "" }) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg", 
    lg: "w-16 h-16 text-2xl"
  };
  
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  
  return (
    <div className={`bg-slate-900 text-white rounded-full flex items-center justify-center font-semibold ${sizes[size]} ${className}`}>
      {initial}
    </div>
  );
};

// LoadingSpinner Component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = "" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };
  
  return (
    <div className={`border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin ${sizes[size]} ${className}`}></div>
  );
};

// Alert Component
interface AlertProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ 
  type = 'info', 
  title, 
  message, 
  onRetry,
  className = ""
}) => {
  const variants = {
    error: {
      container: "border-red-200 bg-red-50",
      icon: "bg-red-100 text-red-600",
      title: "text-red-800",
      message: "text-red-600"
    },
    success: {
      container: "border-green-200 bg-green-50", 
      icon: "bg-green-100 text-green-600",
      title: "text-green-800",
      message: "text-green-600"
    },
    warning: {
      container: "border-yellow-200 bg-yellow-50",
      icon: "bg-yellow-100 text-yellow-600", 
      title: "text-yellow-800",
      message: "text-yellow-600"
    },
    info: {
      container: "border-blue-200 bg-blue-50",
      icon: "bg-blue-100 text-blue-600",
      title: "text-blue-800", 
      message: "text-blue-600"
    }
  };
  
  const variant = variants[type];
  
  return (
    <Card className={`${variant.container} ${className}`}>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${variant.icon}`}>
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold ${variant.title}`}>{title}</h3>
            <p className={`text-sm mt-1 ${variant.message}`}>{message}</p>
          </div>
        </div>
        {onRetry && (
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={onRetry}>
              Spróbuj ponownie
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

// InfoField Component
interface InfoFieldProps {
  label: string;
  value: string;
  className?: string;
}

export const InfoField: React.FC<InfoFieldProps> = ({ label, value, className = "" }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="text-slate-900 font-mono text-sm bg-slate-50 px-3 py-2 rounded border">
        {value}
      </div>
    </div>
  );
};

// StatCard Component
interface StatCardProps {
  icon: React.ReactNode;
  title: string; 
  value: string | number;
  subtitle?: string;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  title, 
  value, 
  subtitle,
  color = 'blue' 
}) => {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600", 
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600"
  };
  
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
            {icon}
          </div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>
        
        <div className="text-center space-y-2">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${colors[color]} bg-opacity-20`}>
            <span className={`text-2xl font-bold ${colors[color].split(' ')[1]}`}>{value}</span>
          </div>
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );
};

// ActionCard Component  
interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  actions: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'outline';
    icon?: React.ReactNode;
  }>;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
}

export const ActionCard: React.FC<ActionCardProps> = ({ 
  icon, 
  title, 
  actions,
  color = 'blue' 
}) => {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600", 
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600"
  };
  
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
            {icon}
          </div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>
        
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              onClick={action.onClick}
              fullWidth
              icon={action.icon}
              className="justify-start"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

// Demo Component showing usage
export default function UIKitDemo() {
  const [showError, setShowError] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">UI Kit Components</h1>
          <p className="text-slate-600">Reusable components extracted from dashboard</p>
        </div>

        {/* Buttons */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>With Icon</Button>
            <Button variant="outline" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
        </Card>

        {/* Cards with different content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <ActionCard
            icon={<Zap className="w-5 h-5" />}
            title="Szybkie akcje"
            color="blue"
            actions={[
              { label: "Mój profil", onClick: () => console.log("Profile"), icon: <User className="w-4 h-4" /> },
              { label: "Nowe zgłoszenie", onClick: () => console.log("New ticket"), variant: "primary", icon: <Plus className="w-4 h-4" /> },
              { label: "Moje zgłoszenia", onClick: () => console.log("My tickets"), icon: <FileText className="w-4 h-4" /> }
            ]}
          />

          <StatCard
            icon={<BarChart3 className="w-5 h-5" />}
            title="Statystyki"
            value={42}
            subtitle="Otwarte zgłoszenia"
            color="purple"
          />

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Ostatnia aktywność</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar name="Jan Kowalski" size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Jan Kowalski</p>
                  <p className="text-xs text-slate-500">5 minut temu</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert
              type="error"
              title="Wystąpił błąd"
              message="Nie udało się załadować danych"
              onRetry={() => setShowError(false)}
            />
            <Alert
              type="success"
              title="Sukces"
              message="Operacja zakończona pomyślnie"
            />
          </div>
        </div>

        {/* Info Fields */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Info Fields</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoField
              label="Email"
              value="jan.kowalski@example.com"
            />
            <InfoField
              label="ID użytkownika"
              value="user_123"
            />
          </div>
        </Card>

        {/* Loading States */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Loading Spinners</h2>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <LoadingSpinner size="sm" />
              <p className="text-sm mt-2">Small</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size="md" />
              <p className="text-sm mt-2">Medium</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="text-sm mt-2">Large</p>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}