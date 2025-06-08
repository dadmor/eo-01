import { Button } from "./Button";
import { Card } from "./Card";

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
  