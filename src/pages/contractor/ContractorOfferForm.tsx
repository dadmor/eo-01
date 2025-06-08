// src/pages/contractor/ContractorOfferForm.tsx
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Section,
  Hero,
  Card,
  Button,
  Alert,
  LoadingState
} from '@/components/ui/basic';
import { DollarSign, FileText } from 'lucide-react';
import { contractorApi, ServiceRequestData } from './api/contractors';

interface OfferFormData {
  request_id: string;
  price: number;
  scope: string;
}

export const ContractorOfferForm: React.FC = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [formData, setFormData] = useState<OfferFormData>({
    request_id: '',
    price: 0,
    scope: '',
  });
  const [errors, setErrors] = useState<Partial<OfferFormData>>({});

  const contractorId = 'current-contractor-id';

  const {
    data: serviceRequests = [],
    isLoading: loadingReq,
    error: reqError
  } = useQuery<ServiceRequestData[]>({
    queryKey: ['service-requests'],
    queryFn: contractorApi.getServiceRequests,
  });

  const { mutate: createOffer, isPending, error: offerError } = useMutation({
    mutationFn: (data: OfferFormData) =>
      contractorApi.createOffer({ ...data, contractor_id: contractorId }),
    onSuccess: () => {
      // Poprawione wywołanie invalidateQueries:
      qc.invalidateQueries({ queryKey: ['contractor-offers'] });
      navigate('/contractor/offers');
    },
  });

  const validate = () => {
    const e: Partial<OfferFormData> = {};
    if (!formData.request_id) e.request_id = 'Wybierz zlecenie';
    if (!formData.price || formData.price <= 0) e.price = 'Podaj poprawną cenę';
    if (!formData.scope.trim()) e.scope = 'Opisz zakres prac';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) createOffer(formData);
  };

  return (
    <Container>
      <Hero title="Nowa Oferta" subtitle="Złóż ofertę na wybrane zlecenie" />
      <Section>
        {offerError && <Alert type="error" title="Błąd" message="Nie udało się złożyć oferty." />}
        {loadingReq ? (
          <LoadingState size="lg" />
        ) : (
          <Card>
            <form onSubmit={onSubmit} className="p-6 space-y-6">
              {/* Wybór zlecenia */}
              <div>
                <label className="block text-sm font-medium mb-2">Zlecenie</label>
                <select
                  value={formData.request_id}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, request_id: e.target.value }));
                    setErrors(prev => ({ ...prev, request_id: undefined }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                    errors.request_id ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Wybierz zlecenie...</option>
                  {serviceRequests.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.title || r.id}
                    </option>
                  ))}
                </select>
                {errors.request_id && <p className="text-red-500 text-sm mt-1">{errors.request_id}</p>}
              </div>

              {/* Cena */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Cena (PLN)
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price === 0 ? '' : formData.price}
                  onChange={e => {
                    const val = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      price: val === '' ? 0 : Number(val)
                    }));
                    setErrors(prev => ({ ...prev, price: undefined }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                    errors.price ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Wprowadź cenę..."
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              {/* Zakres */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Zakres prac
                  </div>
                </label>
                <textarea
                  rows={6}
                  value={formData.scope}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, scope: e.target.value }));
                    setErrors(prev => ({ ...prev, scope: undefined }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 resize-none ${
                    errors.scope ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Opisz zakres prac..."
                />
                {errors.scope && <p className="text-red-500 text-sm mt-1">{errors.scope}</p>}
              </div>

              {/* Akcje */}
              <div className="flex gap-3 pt-4">
                <Button variant="primary" disabled={isPending} className="flex-1">
                  {isPending ? 'Wysyłanie…' : 'Złóż ofertę'}
                </Button>
                <Button variant="outline" onClick={() => navigate('/contractor/marketplace')}>
                  Anuluj
                </Button>
              </div>
            </form>
          </Card>
        )}
      </Section>
    </Container>
  );
};
