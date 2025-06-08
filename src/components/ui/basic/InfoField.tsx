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
  