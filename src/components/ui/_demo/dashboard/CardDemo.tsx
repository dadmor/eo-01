import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = "", 
  padding = false 
}) => {
  const paddingClass = padding ? "p-6" : "";
  
  return (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-sm ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

// Demo
export default function CardDemo() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Card Component</h1>
        
        <Card padding className="space-y-4">
          <h2 className="text-lg font-semibold">Basic Card with Padding</h2>
          <p className="text-slate-600">
            To jest podstawowy komponent Card z automatycznym paddingiem.
          </p>
        </Card>
        
        <Card>
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold">Custom Card Layout</h2>
          </div>
          <div className="p-4">
            <p className="text-slate-600">
              Ta karta ma custom layout z headerem i body.
            </p>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card padding>
            <h3 className="font-semibold mb-2">Karta 1</h3>
            <p className="text-sm text-slate-600">Zawartość pierwszej karty</p>
          </Card>
          <Card padding>
            <h3 className="font-semibold mb-2">Karta 2</h3>
            <p className="text-sm text-slate-600">Zawartość drugiej karty</p>
          </Card>
        </div>
        
      </div>
    </div>
  );
}