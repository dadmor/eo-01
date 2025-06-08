// ------ src/pages/auditor/AuditorPortfolio.tsx ------
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  Button, 
  LoadingSpinner, 
  Alert 
} from '../../components/ui/basic';
import { 
  FormField, 
  FormInput, 
  FormTextarea 
} from '../../components/ui/form';

import { User, Award, FileText, Plus, Edit, Trash2 } from 'lucide-react';
import { auditorApi, AuditorPortfolioData } from './api/auditors';

export const AuditorPortfolio: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AuditorPortfolioData | null>(null);
  const [formData, setFormData] = useState({
    name_or_company: '',
    certificate_data: '',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const queryClient = useQueryClient();

  const {
    data: portfolioItems = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['auditor-portfolios'],
    queryFn: auditorApi.getAuditorPortfolios,
  });

  const createPortfolioMutation = useMutation({
    mutationFn: (portfolioData: Partial<AuditorPortfolioData>) => 
      auditorApi.createAuditorPortfolio(portfolioData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auditor-portfolios'] });
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating portfolio item:', error);
    }
  });

  const updatePortfolioMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AuditorPortfolioData> }) => 
      auditorApi.updateAuditorPortfolio(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auditor-portfolios'] });
      resetForm();
    },
    onError: (error) => {
      console.error('Error updating portfolio item:', error);
    }
  });

  const deletePortfolioMutation = useMutation({
    mutationFn: (id: string) => auditorApi.deleteAuditorPortfolio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auditor-portfolios'] });
    },
    onError: (error) => {
      console.error('Error deleting portfolio item:', error);
    }
  });

  const resetForm = () => {
    setFormData({
      name_or_company: '',
      certificate_data: '',
      description: ''
    });
    setErrors({});
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name_or_company.trim()) {
      newErrors.name_or_company = 'Nazwa lub firma jest wymagana';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Opis jest wymagany';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const portfolioData = {
      name_or_company: formData.name_or_company.trim(),
      certificate_data: formData.certificate_data.trim(),
      description: formData.description.trim()
    };

    if (editingItem) {
      updatePortfolioMutation.mutate({ id: editingItem.id, data: portfolioData });
    } else {
      createPortfolioMutation.mutate(portfolioData);
    }
  };

  const handleEdit = (item: AuditorPortfolioData) => {
    setEditingItem(item);
    setFormData({
      name_or_company: item.name_or_company || '',
      certificate_data: item.certificate_data || '',
      description: item.description || ''
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten element portfolio?')) {
      deletePortfolioMutation.mutate(id);
    }
  };

  const isPending = createPortfolioMutation.isPending || updatePortfolioMutation.isPending;
  const hasError = createPortfolioMutation.isError || updatePortfolioMutation.isError;

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
          <h1 className="text-3xl font-bold text-slate-900">Portfolio Audytora</h1>
          <p className="text-slate-600 mt-1">Zarządzaj swoim doświadczeniem i certyfikatami</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Dodaj pozycję
        </Button>
      </div>

      {hasError && (
        <Alert
          type="error"
          title="Błąd"
          message="Nie udało się zapisać zmian. Spróbuj ponownie."
        />
      )}

      {(createPortfolioMutation.isSuccess || updatePortfolioMutation.isSuccess) && (
        <Alert
          type="success"
          title="Sukces"
          message={editingItem ? "Portfolio zostało zaktualizowane!" : "Nowa pozycja została dodana do portfolio!"}
        />
      )}

      {/* Form */}
      {isFormOpen && (
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingItem ? 'Edytuj pozycję' : 'Dodaj nową pozycję'}
              </h2>
              <Button variant="outline" onClick={resetForm}>
                Anuluj
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                label="Nazwa lub firma"
                error={errors.name_or_company}
                required
              >
                <FormInput
                  value={formData.name_or_company}
                  onChange={(e) => handleInputChange('name_or_company', e.target.value)}
                  placeholder="np. Certyfikowany Audytor Energetyczny"
                  icon={<User className="w-4 h-4" />}
                />
              </FormField>

              <FormField
                label="Certyfikaty i uprawnienia"
                error={errors.certificate_data}
              >
                <FormTextarea
                  value={formData.certificate_data}
                  onChange={(e) => handleInputChange('certificate_data', e.target.value)}
                  placeholder="Opisz swoje certyfikaty, uprawnienia, licencje..."
                  rows={3}
                />
              </FormField>

              <FormField
                label="Opis doświadczenia"
                error={errors.description}
                required
              >
                <FormTextarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Opisz swoje doświadczenie, realizowane projekty, specjalizacje..."
                  rows={4}
                />
              </FormField>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isPending}
                  className="flex items-center gap-2"
                >
                  {isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : editingItem ? (
                    <Edit className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isPending ? 'Zapisywanie...' : editingItem ? 'Zaktualizuj' : 'Dodaj pozycję'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={resetForm}
                >
                  Anuluj
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* Portfolio Items */}
      <div className="grid grid-cols-1 gap-6">
        {portfolioItems.map((item) => (
          <Card key={item.id}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-slate-500" />
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.name_or_company}
                    </h3>
                  </div>
                  
                  {item.certificate_data && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">Certyfikaty:</span>
                      </div>
                      <p className="text-slate-600 text-sm pl-6">
                        {item.certificate_data}
                      </p>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">Opis:</span>
                    </div>
                    <p className="text-slate-600 text-sm pl-6">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletePortfolioMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-slate-500">
                Dodano: {new Date(item.created_at).toLocaleDateString('pl')}
                {item.updated_at && item.updated_at !== item.created_at && (
                  <span className="ml-2">
                    • Zaktualizowano: {new Date(item.updated_at).toLocaleDateString('pl')}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {portfolioItems.length === 0 && !isFormOpen && (
        <Card>
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Brak pozycji w portfolio
            </h3>
            <p className="text-slate-600 mb-4">
              Dodaj swoje doświadczenie, certyfikaty i kompetencje.
            </p>
            <Button 
              variant="primary" 
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Dodaj pierwszą pozycję
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};