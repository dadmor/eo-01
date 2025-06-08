// src/pages/contractor/ContractorPortfolio.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  Button, 
  LoadingSpinner, 
  Alert,
  InfoField 
} from '../../components/ui/basic';


import { Building, MapPin, FileText, Edit, Save, X } from 'lucide-react';
import { contractorApi, ContractorPortfolioData } from './api/contractors';

export const ContractorPortfolio: React.FC = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ContractorPortfolioData>>({});

  // TODO: Get contractor ID from auth context
  const contractorId = 'current-contractor-id';

  const {
    data: portfolio,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['contractor-portfolio', contractorId],
    queryFn: () => contractorApi.getPortfolio(contractorId),
  });

  const { mutate: updatePortfolio, isPending: isUpdating } = useMutation({
    mutationFn: (data: Partial<ContractorPortfolioData>) => {
      if (portfolio?.id) {
        return contractorApi.updatePortfolio(portfolio.id, data);
      } else {
        return contractorApi.createPortfolio({
          contractor_id: contractorId,
          company_name: data.company_name!,
          nip: data.nip!,
          company_address: data.company_address!,
          description: data.description!,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-portfolio'] });
      setIsEditing(false);
    },
  });

  const handleEdit = () => {
    setFormData({
      company_name: portfolio?.company_name || '',
      nip: portfolio?.nip || '',
      company_address: portfolio?.company_address || '',
      description: portfolio?.description || '',
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updatePortfolio(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert
          type="error"
          title="Błąd ładowania"
          message="Nie udało się załadować portfolio"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Portfolio Wykonawcy</h1>
          <p className="text-slate-600 mt-1">Zarządzaj informacjami o swojej firmie</p>
        </div>
        {!isEditing && (
          <Button 
            variant="primary" 
            onClick={handleEdit}
            icon={<Edit className="w-4 h-4" />}
          >
            Edytuj
          </Button>
        )}
      </div>

      {/* Company Information */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Informacje o firmie</h2>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nazwa firmy
                </label>
                <input
                  type="text"
                  value={formData.company_name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Wprowadź nazwę firmy..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  NIP
                </label>
                <input
                  type="text"
                  value={formData.nip || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, nip: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="XXX-XXX-XX-XX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Adres firmy
                </label>
                <input
                  type="text"
                  value={formData.company_address || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_address: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Wprowadź adres firmy..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Opis firmy
                </label>
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                  placeholder="Opisz swoją firmę i specjalizację..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={isUpdating}
                  icon={<Save className="w-4 h-4" />}
                >
                  {isUpdating ? 'Zapisywanie...' : 'Zapisz'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  icon={<X className="w-4 h-4" />}
                >
                  Anuluj
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField
                label="Nazwa firmy"
                value={portfolio?.company_name || 'Nie podano'}
              />
              <InfoField
                label="NIP"
                value={portfolio?.nip || 'Nie podano'}
              />
              <InfoField
                label="Adres firmy"
                value={portfolio?.company_address || 'Nie podano'}
              />
              <div className="md:col-span-2">
                <InfoField
                  label="Opis firmy"
                  value={portfolio?.description || 'Nie podano'}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Gallery Section */}
      {portfolio?.contractor_gallery && portfolio.contractor_gallery.length > 0 && (
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Galeria prac</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.contractor_gallery.map((item) => (
                <div key={item.id} className="bg-slate-50 rounded-lg p-4">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.description || 'Zdjęcie z realizacji'}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                  ) : (
                    <div className="w-full h-32 bg-slate-200 rounded-md flex items-center justify-center mb-2">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                  {item.description && (
                    <p className="text-sm text-slate-600">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!portfolio && (
        <Card>
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Utwórz swoje portfolio
            </h3>
            <p className="text-slate-600 mb-4">
              Dodaj informacje o swojej firmie, aby zwiększyć zaufanie klientów.
            </p>
            <Button 
              variant="primary" 
              onClick={handleEdit}
              icon={<Edit className="w-4 h-4" />}
            >
              Rozpocznij
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};