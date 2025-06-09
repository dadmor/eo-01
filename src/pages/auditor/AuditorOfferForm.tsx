// src/pages/auditor/AuditorOfferForm.tsx
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Card, Button, LoadingSpinner, Alert } from "../../components/ui/basic";
import { FormField, FormInput, FormTextarea } from "../../components/ui/form";
import { FileCheck, DollarSign, Calendar } from "lucide-react";
import { auditorApi, AuditorOfferData, AuditRequestData } from "./api/auditors";
import { useAuth } from "../../hooks/useAuth";

interface FormData {
  request_id: string;
  price: string;
  duration_days: string;
  description: string;
}

export const AuditorOfferForm: React.FC = () => {
  // All hooks must be called unconditionally
  const { user, delegatedUser } = useAuth();
  const currentUser = delegatedUser || user;
  const auditorId = currentUser?.id;

  const [searchParams] = useSearchParams();
  const presetRequestId = searchParams.get("requestId") || "";

  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>({
    request_id: presetRequestId,
    price: "",
    duration_days: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (presetRequestId) {
      setFormData(fd => ({ ...fd, request_id: presetRequestId }));
    }
  }, [presetRequestId]);

  const requestsQuery = useQuery({
    queryKey: ["audit-requests"],
    queryFn: auditorApi.getAuditRequests,
  });

  const offersQuery = useQuery({
    queryKey: ["auditor-offers", auditorId],
    queryFn: () => auditorApi.getAuditorOffers(),
    enabled: !!auditorId,
  });

  const createOfferMutation = useMutation({
    mutationFn: (data: Partial<AuditorOfferData>) => auditorApi.createAuditorOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auditor-offers'] });
      setFormData({ request_id: presetRequestId, price: "", duration_days: "", description: "" });
      setErrors({});
    },
    onError: err => {
      if ((err as any)?.code === "23505") {
        setErrors({ request_id: "Oferta na to zlecenie już istnieje." });
      }
    },
  });

  // Now that hooks are set up, handle conditional UI
  if (!currentUser || !auditorId) {
    return (
      <div className="p-6">
        <Alert
          type="error"
          title="Błąd autoryzacji"
          message="Zaloguj się ponownie, aby składać oferty."
        />
      </div>
    );
  }

  const { data: auditRequests = [], isLoading: loadingReq, error: reqError } = requestsQuery;
  const { data: existingOffers = [], isLoading: loadingOff, error: offError } = offersQuery;

  if (loadingReq || loadingOff) {
    return (
      <div className="p-6 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (reqError || offError) {
    return (
      <div className="p-6">
        <Alert type="error" title="Błąd" message="Nie można pobrać danych." />
      </div>
    );
  }

  // Compute available requests for selection
  const availableRequests = auditRequests.filter(
    r => r.beneficiary_id !== auditorId &&
         !existingOffers.some(o => o.request_id === r.id)
  );

  if (!presetRequestId && availableRequests.length === 0) {
    return (
      <div className="p-6">
        <Alert
          type="info"
          title="Brak zleceń"
          message="Brak dostępnych zleceń audytu."
        />
      </div>
    );
  }

  // Handlers and validation
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(fd => ({ ...fd, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.request_id) newErrors.request_id = "Wybierz zlecenie audytu.";
    const priceNum = Number(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Podaj cenę większą niż 0.";
    }
    const daysNum = Number(formData.duration_days);
    if (!formData.duration_days || isNaN(daysNum) || daysNum <= 0 || !Number.isInteger(daysNum)) {
      newErrors.duration_days = "Podaj liczbę dni większą niż 0.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    createOfferMutation.mutate({
      request_id: formData.request_id,
      auditor_id: auditorId,
      price: Number(formData.price),
      duration_days: Number(formData.duration_days),
      description: formData.description.trim() || undefined,
      status: "pending",
    });
  };

  const selectedRequest = auditRequests.find(r => r.id === formData.request_id);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Nowa Oferta Audytu</h1>
      {createOfferMutation.isError && (
        <Alert type="error" title="Błąd" message="Nie udało się złożyć oferty." />
      )}
      {createOfferMutation.isSuccess && (
        <Alert type="success" title="Sukces" message="Oferta została złożona." />
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <FormField label="Zlecenie audytu" error={errors.request_id} required>
          {presetRequestId && selectedRequest ? (
            <Card className="p-4">
              <p><strong>Miasto:</strong> {selectedRequest.city || "–"}</p>
              <p><strong>Adres:</strong> {selectedRequest.street_address || "–"}</p>
              <input type="hidden" name="request_id" value={selectedRequest.id} />
            </Card>
          ) : (
            <select
              name="request_id"
              value={formData.request_id}
              onChange={e => handleChange('request_id', e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Wybierz zlecenie...</option>
              {availableRequests.map(r => (
                <option key={r.id} value={r.id}>
                  {r.city || '–'} – {r.street_address || '–'}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Cena (PLN)" error={errors.price} required>
            <FormInput
              type="number"
              name="price"
              value={formData.price}
              onChange={e => handleChange('price', e.target.value)}
              placeholder="np. 2500"
              min="1"
              step="0.01"
              icon={<DollarSign className="w-4 h-4" />}
            />
          </FormField>

          <FormField label="Czas realizacji (dni)" error={errors.duration_days} required>
            <FormInput
              type="number"
              name="duration_days"
              value={formData.duration_days}
              onChange={e => handleChange('duration_days', e.target.value)}
              placeholder="np. 14"
              min="1"
              step="1"
              icon={<Calendar className="w-4 h-4" />}
            />
          </FormField>
        </div>

        <FormField label="Uwagi (opcjonalne)">
          <FormTextarea
            name="description"
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
            rows={4}
            placeholder="Opis..."
          />
        </FormField>

        <div className="flex gap-4">
          <Button type="submit" variant="primary" disabled={createOfferMutation.isPending} className="flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            {createOfferMutation.isPending ? 'Wysyłanie...' : 'Złóż ofertę'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData({ request_id: presetRequestId, price: '', duration_days: '', description: '' })}
            disabled={createOfferMutation.isPending}
          >
            Anuluj
          </Button>
        </div>
      </form>
    </div>
  );
};
