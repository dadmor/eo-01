// ===================================================================
// src/pages/beneficiary/ServiceRequestForm.tsx
// ===================================================================

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Section,
  Hero,
  Card,
  Button,
  Alert,
} from '@/components/ui/basic';
import { Home, MapPin, Phone, FileText } from 'lucide-react';
import { beneficiaryApi } from './api/beneficiaries';


interface ServiceRequestFormData {
  postal_code: string;
  city: string;
  street_address: string;
  phone_number: string;
  heat_source?: 'pompa_ciepla' | 'piec_pellet' | 'piec_zgazowujacy';
  windows_count?: number;
  doors_count?: number;
  wall_insulation_m2?: number;
  attic_insulation_m2?: number;
}

export const ServiceRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const beneficiaryId = 'current-beneficiary-id'; // TODO: get from auth

  const [formData, setFormData] = useState<ServiceRequestFormData>({
    postal_code: '',
    city: '',
    street_address: '',
    phone_number: '',
    heat_source: undefined,
    windows_count: undefined,
    doors_count: undefined,
    wall_insulation_m2: undefined,
    attic_insulation_m2: undefined,
  });

  const [errors, setErrors] = useState<Partial<ServiceRequestFormData>>({});

  const { mutate: createRequest, isPending, error } = useMutation({
    mutationFn: (data: ServiceRequestFormData) =>
      beneficiaryApi.createServiceRequest({ ...data, beneficiary_id: beneficiaryId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['service-requests'] });
      navigate('/beneficiary/my-requests');
    },
  });

  const validate = () => {
    const e: Partial<ServiceRequestFormData> = {};
    if (!formData.postal_code.trim()) e.postal_code = 'Kod pocztowy jest wymagany';
    if (!formData.city.trim()) e.city = 'Miasto jest wymagane';
    if (!formData.street_address.trim()) e.street_address = 'Adres jest wymagany';
    if (!formData.phone_number.trim()) e.phone_number = 'Telefon jest wymagany';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) createRequest(formData);
  };

  return (
    <Container>
      <Hero title="Nowe Zlecenie Wykonawcy" subtitle="Utwórz zlecenie dla wykonawców" />
      <Section>
        {error && <Alert type="error" title="Błąd" message="Nie udało się utworzyć zlecenia." />}
        
        <Card>
          <form onSubmit={onSubmit} className="p-6 space-y-6">
            {/* Dane adresowe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Kod pocztowy
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, postal_code: e.target.value }));
                    setErrors(prev => ({ ...prev, postal_code: undefined }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                    errors.postal_code ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="XX-XXX"
                />
                {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Miasto</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, city: e.target.value }));
                    setErrors(prev => ({ ...prev, city: undefined }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                    errors.city ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Nazwa miasta"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" /> Adres
                </div>
              </label>
              <input
                type="text"
                value={formData.street_address}
                onChange={e => {
                  setFormData(prev => ({ ...prev, street_address: e.target.value }));
                  setErrors(prev => ({ ...prev, street_address: undefined }));
                }}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                  errors.street_address ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Ulica i numer domu"
              />
              {errors.street_address && <p className="text-red-500 text-sm mt-1">{errors.street_address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Telefon
                </div>
              </label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={e => {
                  setFormData(prev => ({ ...prev, phone_number: e.target.value }));
                  setErrors(prev => ({ ...prev, phone_number: undefined }));
                }}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                  errors.phone_number ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="XXX XXX XXX"
              />
              {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
            </div>

            {/* Opcjonalne parametry techniczne */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Parametry techniczne (opcjonalne)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Źródło ciepła</label>
                  <select
                    value={formData.heat_source || ''}
                    onChange={e => setFormData(prev => ({ 
                      ...prev, 
                      heat_source: e.target.value as any || undefined 
                    }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2"
                  >
                    <option value="">Wybierz...</option>
                    <option value="pompa_ciepla">Pompa ciepła</option>
                    <option value="piec_pellet">Piec na pellet</option>
                    <option value="piec_zgazowujacy">Piec zgazowujący</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Liczba okien</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.windows_count || ''}
                    onChange={e => setFormData(prev => ({ 
                      ...prev, 
                      windows_count: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Liczba drzwi</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.doors_count || ''}
                    onChange={e => setFormData(prev => ({ 
                      ...prev, 
                      doors_count: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Izolacja ścian (m²)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.wall_insulation_m2 || ''}
                    onChange={e => setFormData(prev => ({ 
                      ...prev, 
                      wall_insulation_m2: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Izolacja poddasza (m²)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.attic_insulation_m2 || ''}
                    onChange={e => setFormData(prev => ({ 
                      ...prev, 
                      attic_insulation_m2: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Akcje */}
            <div className="flex gap-3 pt-4">
              <Button variant="primary" disabled={isPending} className="flex-1">
                {isPending ? 'Tworzenie…' : 'Utwórz zlecenie'}
              </Button>
              <Button variant="outline" onClick={() => navigate('/beneficiary/my-requests')}>
                Anuluj
              </Button>
            </div>
          </form>
        </Card>
      </Section>
    </Container>
  );
};