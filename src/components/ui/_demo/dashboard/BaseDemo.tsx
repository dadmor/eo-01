import { Plus, Zap, User, FileText, BarChart3, Clock } from "lucide-react";
import { useState } from "react";
import { ActionCard, StatCard, InfoField, LoadingSpinner } from "../../basic";
import { Alert } from "./AlertDemo";
import { Avatar } from "./AvatarDemo";
import { Button } from "./ButtonDemo";
import { Card } from "./CardDemo";


// Demo Component showing usage
export default function UIKitDemo() {
  const [showError, setShowError] =useState(false);
  
  return (
    <div className="min-h-screen p-6 bg-slate-50">
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