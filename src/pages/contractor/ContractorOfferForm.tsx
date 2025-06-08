// src/pages/contractor/ContractorOfferForm.tsx
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Alert 
} from '../../components/ui/basic';

import { DollarSign, FileText, ArrowLeft } from 'lucide-react';
import { contractorApi } from './api/contractors';

interface OfferFormData {
  request_id: string;
  price: number;
  scope: string;
}

export const ContractorOfferForm: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<OfferFormData>({
    request_id: '',
    price: 0,
    scope: '',
  });

  const [errors, setErrors] = useState<Partial<OfferFormData>>({});

  // TODO: Get contractor ID from auth context
  const contractorId = 'current-contractor-id';

  const { mutate: createOffer, isPending, error } = useMutation({
    mutationFn: (data: OfferFormData) => contractorApi.createOffer({
      ...data,
      contractor_id: contractorId,
      status: 'pending',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-offers'] });
      navigate('/contractor/offers');
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<OfferFormData> = {};

    if (!formData.request_id) {
      newErrors.request_id = 'Wybierz zlecenie';
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Podaj poprawną cenę';
    }
    if (!formData.scope.trim()) {
      newErrors.scope = 'Opisz zakres prac';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      createOffer(formData);
    }
  };

  const handleInputChange = (field: keyof OfferFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/contractor/marketplace')}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Powrót
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nowa Oferta</h1>
          <p className="text-slate-600 mt-1">Złóż ofertę na wybrane zlecenie</p>
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          title="Błąd"
          message="Nie udało się złożyć oferty. Spróbuj ponownie."
        />
      )}

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Request Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Zlecenie
            </label>
            <select
              value={formData.request_id}
              onChange={(e) => handleInputChange('request_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                errors.request_id ? 'border-red-500' : 'border-slate-300'
              }`}
            >
              <option value="">Wybierz zlecenie...</option>
              {/* TODO: Load available service requests */}
              <option value="example-1">Przykładowe zlecenie 1</option>
              <option value="example-2">Przykładowe zlecenie 2</option>
            </select>
            {errors.request_id && (
              <p className="text-red-500 text-sm mt-1">{errors.request_id}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Cena (PLN)
              </div>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price || ''}
              onChange={(e) => handleInputChange('price', Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                errors.price ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Wprowadź cenę..."
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          {/* Scope */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Zakres prac
              </div>
            </label>
            <textarea
              rows={6}
              value={formData.scope}
              onChange={(e) => handleInputChange('scope', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none ${
                errors.scope ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Opisz szczegółowo zakres planowanych prac..."
            />
            {errors.scope && (
              <p className="text-red-500 text-sm mt-1">{errors.scope}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isPending}
              className="flex-1"
            >
              {isPending ? 'Wysyłanie...' : 'Złóż ofertę'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/contractor/marketplace')}
            >
              Anuluj
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};