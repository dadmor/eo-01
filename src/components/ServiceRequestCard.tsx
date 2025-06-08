// src/components/ui/base/ServiceRequestCard.tsx
import React from 'react';

import { MapPin, Clock, User } from 'lucide-react';
import { ServiceRequestData } from '@/pages/contractor/api/contractors';
import { Card, Button } from './ui/basic';


interface ServiceRequestCardProps {
  request: ServiceRequestData;
  onOffer: (id: string) => void;
  onDetails: (id: string) => void;
}

const getDisplayName = (user?: ServiceRequestData['users']) => {
  if (!user) return 'Anonimowy';
  const { first_name, last_name, email } = user;
  if (first_name && last_name) return `${first_name} ${last_name}`;
  if (first_name) return first_name;
  if (last_name) return last_name;
  return email.split('@')[0];
};

export const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({
  request,
  onOffer,
  onDetails
}) => (
  <Card>
    <div className="p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {request.title || 'Zlecenie bez tytułu'}
      </h3>
      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
        {request.description || 'Brak opisu'}
      </p>
      <div className="flex-1" />
      <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{request.city || 'Nie podano'}</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>{getDisplayName(request.users)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{new Date(request.created_at).toLocaleDateString('pl')}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-auto">
        <Button
          variant="primary"
          className="flex-1"
          onClick={() => onOffer(request.id)}
        >
          Złóż ofertę
        </Button>
        <Button
          variant="outline"
          onClick={() => onDetails(request.id)}
        >
          Szczegóły
        </Button>
      </div>
    </div>
  </Card>
);
