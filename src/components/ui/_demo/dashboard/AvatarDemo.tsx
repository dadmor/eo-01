import React from 'react';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export const Avatar: React.FC<AvatarProps> = ({ 
  name, 
  src,
  size = 'md', 
  className = "",
  onClick,
  status
}) => {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg", 
    lg: "w-16 h-16 text-2xl",
    xl: "w-20 h-20 text-3xl"
  };
  
  const statusSizes = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4", 
    xl: "w-5 h-5"
  };
  
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
    busy: "bg-red-500"
  };
  
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  const isClickable = onClick !== undefined;
  const baseClasses = `relative inline-flex items-center justify-center font-semibold rounded-full ${isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`;
  
  return (
    <div 
      className={`${baseClasses} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {src ? (
        <img 
          src={src} 
          alt={name || 'Avatar'} 
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className={`w-full h-full bg-slate-900 text-white rounded-full flex items-center justify-center ${sizes[size]}`}>
          {initial}
        </div>
      )}
      
      {status && (
        <div className={`absolute -bottom-0.5 -right-0.5 ${statusSizes[size]} ${statusColors[status]} rounded-full border-2 border-white`}></div>
      )}
    </div>
  );
};

// Demo
export default function AvatarDemo() {
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
  
  const users = [
    { name: "Jan Kowalski", status: "online" as const },
    { name: "Anna Nowak", status: "away" as const },
    { name: "Piotr Wiśniewski", status: "busy" as const },
    { name: "Maria Kowalczyk", status: "offline" as const },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-slate-900">Avatar Component</h1>
        
        {/* Sizes */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Rozmiary</h2>
          <div className="flex items-end gap-4">
            <div className="text-center space-y-2">
              <Avatar name="Jan Kowalski" size="xs" />
              <p className="text-xs text-slate-600">XS</p>
            </div>
            <div className="text-center space-y-2">
              <Avatar name="Jan Kowalski" size="sm" />
              <p className="text-xs text-slate-600">SM</p>
            </div>
            <div className="text-center space-y-2">
              <Avatar name="Jan Kowalski" size="md" />
              <p className="text-xs text-slate-600">MD</p>
            </div>
            <div className="text-center space-y-2">
              <Avatar name="Jan Kowalski" size="lg" />
              <p className="text-xs text-slate-600">LG</p>
            </div>
            <div className="text-center space-y-2">
              <Avatar name="Jan Kowalski" size="xl" />
              <p className="text-xs text-slate-600">XL</p>
            </div>
          </div>
        </div>

        {/* With Status */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Ze statusem</h2>
          <div className="flex flex-wrap gap-6">
            <div className="text-center space-y-2">
              <Avatar name="Jan Kowalski" status="online" />
              <p className="text-sm text-slate-600">Online</p>
            </div>
            <div className="text-center space-y-2">
              <Avatar name="Anna Nowak" status="away" />
              <p className="text-sm text-slate-600">Away</p>
            </div>
            <div className="text-center space-y-2">
              <Avatar name="Piotr Wiśniewski" status="busy" />
              <p className="text-sm text-slate-600">Busy</p>
            </div>
            <div className="text-center space-y-2">
              <Avatar name="Maria Kowalczyk" status="offline" />
              <p className="text-sm text-slate-600">Offline</p>
            </div>
          </div>
        </div>

        {/* Interactive */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Interaktywne</h2>
          <p className="text-sm text-slate-600 mb-4">Kliknij na avatar, żeby go wybrać:</p>
          <div className="flex flex-wrap gap-4">
            {users.map((user, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border transition-colors ${
                  selectedUser === user.name 
                    ? 'border-slate-900 bg-slate-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-center space-y-2">
                  <Avatar 
                    name={user.name} 
                    status={user.status}
                    onClick={() => setSelectedUser(user.name)}
                  />
                  <p className="text-sm font-medium">{user.name}</p>
                </div>
              </div>
            ))}
          </div>
          {selectedUser && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-700">Wybrany użytkownik: <strong>{selectedUser}</strong></p>
            </div>
          )}
        </div>

        {/* Different Initials */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Różne inicjały</h2>
          <div className="flex flex-wrap gap-4">
            <Avatar name="Aleksandra Kowalska" />
            <Avatar name="Bartosz Nowak" />
            <Avatar name="Cecylia Wiśniewska" />
            <Avatar name="Damian Kowalczyk" />
            <Avatar name="Ewelina Jankowska" />
            <Avatar name="Filip Kowalczyk" />
            <Avatar name="Gabriela Nowak" />
            <Avatar name="Hubert Wójcik" />
            <Avatar /> {/* No name - shows "?" */}
          </div>
        </div>

        {/* In Lists */}
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">W listach</h2>
          <div className="space-y-3">
            {users.map((user, index) => (
              <div key={index} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg">
                <Avatar name={user.name} status={user.status} size="sm" />
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-slate-500 capitalize">{user.status}</p>
                </div>
                <div className="text-xs text-slate-400">
                  {index === 0 && "5 min temu"}
                  {index === 1 && "1 godz temu"}
                  {index === 2 && "Wczoraj"}
                  {index === 3 && "3 dni temu"}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}