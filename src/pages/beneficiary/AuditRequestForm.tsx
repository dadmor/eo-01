// ===================================================================
// src/pages/beneficiary/AuditRequestForm.tsx
// ===================================================================

import { Hero, Alert, Card, Button, Container, Section } from "@/components/ui/basic";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {  MapPin, Home, Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { beneficiaryApi } from "./api/beneficiaries";
import { useAuth } from "@/hooks/useAuth"; // Dodaj import

export const AuditRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, delegatedUser } = useAuth(); // Pobierz dane użytkownika
  
  // Użyj delegatedUser jeśli istnieje, w przeciwnym razie user
  const currentUser = delegatedUser || user;
  const beneficiaryId = currentUser?.id;

  // Dodaj sprawdzenie czy użytkownik jest zalogowany
  if (!currentUser || !beneficiaryId) {
    return (
      <Container>
        <Alert type="error" title="Błąd" message="Nie można załadować danych użytkownika. Zaloguj się ponownie." />
      </Container>
    );
  }

  const [formData, setFormData] = useState({
    postal_code: '',
    city: '',
    street_address: '',
    phone_number: '',
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const { mutate: createRequest, isPending, error } = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('Sending audit request with data:', { ...data, beneficiary_id: beneficiaryId });
      try {
        const result = await beneficiaryApi.createAuditRequest({ ...data, beneficiary_id: beneficiaryId });
        console.log('Audit request created successfully:', result);
        return result;
      } catch (err) {
        console.error('Error creating audit request:', err);
        throw err;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-requests'] });
      navigate('/beneficiary/my-requests');
    },
    onError: (err) => {
      console.error('Mutation error:', err);
    },
  });

  const validate = () => {
    const e: Partial<typeof formData> = {};
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
      <Hero title="Nowe Zlecenie Audytora" subtitle="Zamów audyt energetyczny" />
      <Section>
        {error && <Alert type="error" title="Błąd" message="Nie udało się utworzyć zlecenia audytu." />}
        
        <Card>
          <form onSubmit={onSubmit} className="p-6 space-y-6">
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

            <div className="flex gap-3 pt-4">
              <Button variant="primary" disabled={isPending} className="flex-1">
                {isPending ? 'Tworzenie…' : 'Zamów audyt'}
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