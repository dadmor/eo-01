// src/pages/contractor/ContractorPortfolio.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Section,
  Hero,
  Card,
  Button,
  Alert,
  LoadingState,
  InfoField
} from '@/components/ui/basic';
import { Building, FileText, Edit, Save, X } from 'lucide-react';
import { contractorApi, ContractorPortfolioData } from './api/contractors';

export const ContractorPortfolio: React.FC = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<ContractorPortfolioData>>({});
  const contractorId = 'current-contractor-id';

  const {
    data: port,
    isLoading,
    error,
    refetch
  } = useQuery<ContractorPortfolioData | null>({
    queryKey: ['contractor-portfolio', contractorId],
    queryFn: () => contractorApi.getPortfolio(contractorId),
  });

  const { mutate: save, isPending } = useMutation({
    mutationFn: (data: Partial<ContractorPortfolioData>) =>
      port?.id
        ? contractorApi.updatePortfolio(port.id, data)
        : contractorApi.createPortfolio({ contractor_id: contractorId, ...(data as any) }),
    onSuccess: () => {
      // Poprawione wywołanie invalidateQueries:
      qc.invalidateQueries({ queryKey: ['contractor-portfolio'] });
      setEditing(false);
    },
  });

  if (isLoading) return <LoadingState size="lg" />;
  if (error) {
    return (
      <Container>
        <Section>
          <Alert
            type="error"
            title="Błąd"
            message="Nie udało się załadować portfolio."
            onRetry={() => refetch()}
          />
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Hero title="Portfolio Wykonawcy" subtitle="Zarządzaj informacjami o firmie" />
      <Section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Informacje o firmie</h2>
          {!editing && (
            <Button
              variant="primary"
              icon={<Edit />}
              onClick={() => {
                setForm({
                  company_name: port?.company_name,
                  nip: port?.nip,
                  company_address: port?.company_address,
                  description: port?.description,
                });
                setEditing(true);
              }}
            >
              Edytuj
            </Button>
          )}
        </div>

        <Card>
          <div className="p-6">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Nazwa firmy</label>
                  <input
                    type="text"
                    value={form.company_name || ''}
                    onChange={e => setForm(prev => ({ ...prev, company_name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">NIP</label>
                  <input
                    type="text"
                    value={form.nip || ''}
                    onChange={e => setForm(prev => ({ ...prev, nip: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Adres firmy</label>
                  <input
                    type="text"
                    value={form.company_address || ''}
                    onChange={e => setForm(prev => ({ ...prev, company_address: e.target.value }))}
                    className="w-full px-3 py-2	border rounded-md focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Opis firmy</label>
                  <textarea
                    rows={4}
                    value={form.description || ''}
                    onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="primary" icon={<Save />} disabled={isPending} onClick={() => save(form)}>
                    {isPending ? 'Zapisywanie…' : 'Zapisz'}
                  </Button>
                  <Button variant="outline" icon={<X />} onClick={() => setEditing(false)}>
                    Anuluj
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Nazwa firmy" value={port?.company_name || '–'} />
                <InfoField label="NIP" value={port?.nip || '–'} />
                <InfoField label="Adres firmy" value={port?.company_address || '–'} />
                <div className="md:col-span-2">
                  <InfoField label="Opis firmy" value={port?.description || '–'} />
                </div>
              </div>
            )}
          </div>
        </Card>

        {port?.contractor_gallery?.length ? (
          <Section>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold">Galeria prac</h2>
            </div>
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {port.contractor_gallery.map(item => (
                  <div key={item.id} className="bg-slate-50 rounded-lg p-4">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.description}
                        className="w-full h-32 object-cover rounded-md mb-2"
                      />
                    ) : (
                      <div className="w-full h-32 bg-slate-200 rounded-md flex items-center justify-center mb-2">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                    {item.description && <p className="text-sm text-slate-600">{item.description}</p>}
                  </div>
                ))}
              </div>
            </Card>
          </Section>
        ) : null}
      </Section>
    </Container>
  );
};
