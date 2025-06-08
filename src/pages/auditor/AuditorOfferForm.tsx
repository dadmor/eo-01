// src/pages/auditor/AuditorOfferForm.tsx
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  Button, 
  LoadingSpinner, 
  Alert 
} from '../../components/ui/basic';
import { 
  FormField, 
  FormInput, 
  FormTextarea,
  SelectFilter,
  type Option 
} from '../../components/ui/form';

import { FileCheck, DollarSign, Calendar } from 'lucide-react';
import { auditorApi, AuditorOfferData } from './api/auditors';

interface FormData {
  request_id: string;
  price: string;
  duration_days: string;
  description: string;
}

interface AuditRequest {
  id: string;
  city?: string;
  street_address?: string;
}

export const AuditorOfferForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    request_id: '',
    price: '',
    duration_days: '',
    description: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const {
    data: auditRequests = [],
    isLoading: requestsLoading,
    error: requestsError
  } = useQuery<AuditRequest[]>({
    queryKey: ['audit-requests'],
    queryFn: auditorApi.getAuditRequests,
  });

  const createOfferMutation = useMutation({
    mutationFn: (offerData: Partial<AuditorOfferData>) => auditorApi.createAuditorOffer(offerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auditor-offers'] });
      // Reset form after successful submission
      setFormData({
        request_id: '',
        price: '',
        duration_days: '',
        description: ''
      });
      setErrors({});
    },
    onError: (error) => {
      console.error('Error creating offer:', error);
      // Optionally set specific error messages based on the error
    }
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.request_id.trim()) {
      newErrors.request_id = 'Wybierz zlecenie audytu';
    }

    const price = Number(formData.price);
    if (!formData.price.trim() || isNaN(price) || price <= 0) {
      newErrors.price = 'Podaj prawidłową cenę (większą od 0)';
    }

    const duration = Number(formData.duration_days);
    if (!formData.duration_days.trim() || isNaN(duration) || duration <= 0 || !Number.isInteger(duration)) {
      newErrors.duration_days = 'Podaj prawidłową liczbę dni (liczba całkowita większa od 0)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const offerData: Partial<AuditorOfferData> = {
      request_id: formData.request_id,
      price: Number(formData.price),
      duration_days: Number(formData.duration_days),
      description: formData.description.trim() || undefined, // Only include if not empty
      status: 'pending'
    };

    createOfferMutation.mutate(offerData);
  };

  const handleClearForm = () => {
    setFormData({
      request_id: '',
      price: '',
      duration_days: '',
      description: ''
    });
    setErrors({});
  };

  // Transform audit requests to options for SelectFilter
  const requestOptions: Option[] = auditRequests.map(request => ({
    value: request.id,
    label: `${request.city || 'Nie podano miasta'} - ${request.street_address || 'Adres do uzgodnienia'}`
  }));

  if (requestsLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (requestsError) {
    return (
      <div className="p-6">
        <Alert
          type="error"
          title="Błąd ładowania"
          message="Nie udało się załadować zleceń audytu. Spróbuj odświeżyć stronę."
        />
      </div>
    );
  }

  if (auditRequests.length === 0) {
    return (
      <div className="p-6">
        <Alert
          type="info"
          title="Brak dostępnych zleceń"
          message="Obecnie nie ma dostępnych zleceń audytu do złożenia oferty."
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Nowa Oferta Audytu</h1>
        <p className="text-slate-600 mt-1">Złóż ofertę na wykonanie audytu</p>
      </div>

      {/* Error Alert */}
      {createOfferMutation.isError && (
        <Alert
          type="error"
          title="Błąd"
          message="Nie udało się złożyć oferty. Spróbuj ponownie."
        />
      )}

      {/* Success Alert */}
      {createOfferMutation.isSuccess && (
        <Alert
          type="success"
          title="Sukces"
          message="Oferta została złożona pomyślnie!"
        />
      )}

      <Card>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Request Selection */}
            <FormField
              label="Wybierz zlecenie audytu"
              error={errors.request_id}
              required
            >
              <SelectFilter
                options={requestOptions}
                value={formData.request_id}
                onChange={(value) => handleInputChange('request_id', value as string)}
                placeholder="Wybierz zlecenie..."
                name="request_id"
              />
            </FormField>

            {/* Price and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Cena (PLN)"
                error={errors.price}
                required
              >
                <FormInput
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="np. 2500"
                  min="1"
                  step="0.01"
                  icon={<DollarSign className="w-4 h-4" />}
                />
              </FormField>

              <FormField
                label="Czas realizacji (dni)"
                error={errors.duration_days}
                required
              >
                <FormInput
                  type="number"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={(e) => handleInputChange('duration_days', e.target.value)}
                  placeholder="np. 14"
                  min="1"
                  step="1"
                  icon={<Calendar className="w-4 h-4" />}
                />
              </FormField>
            </div>

            {/* Description */}
            <FormField
              label="Dodatkowe informacje (opcjonalne)"
            >
              <FormTextarea
                name="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Opisz swoje doświadczenie, metodologię audytu, certyfikaty..."
                rows={4}
                maxLength={1000}
              />
              {formData.description && (
                <div className="text-xs text-slate-500 mt-1">
                  {formData.description.length}/1000 znaków
                </div>
              )}
            </FormField>

            {/* Form Actions */}
            <div className="flex gap-4">
              <Button 
                type="submit" 
                variant="primary"
                disabled={createOfferMutation.isPending}
                className="flex items-center gap-2"
              >
                {createOfferMutation.isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <FileCheck className="w-4 h-4" />
                )}
                {createOfferMutation.isPending ? 'Wysyłanie...' : 'Złóż ofertę'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={handleClearForm}
                disabled={createOfferMutation.isPending}
              >
                Wyczyść
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};