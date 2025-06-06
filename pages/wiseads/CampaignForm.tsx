// src/pages/wiseads/CampaignForm.tsx - 3-step wizard with improved UI
import React, { useState, useEffect } from "react";
import { ConfigProvider, Space, Select, Form, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined, CheckCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { FormField } from "@/components/ui/campaign/FormField.js";
import { PreviewCard } from "@/components/ui/campaign/PreviewCard.js";
import { StepCard } from "@/components/ui/campaign/StepCard.js";
import { StepNavigation } from "@/components/ui/campaign/StepNavigation.js";
import { LoadingState } from "@/components/ui/website/LoadingState.js";
import { PageContainer } from "@/components/ui/website/PageContainer.js";
import { StepContainer } from "@/components/ui/campaign/StepContainer.js";

import DatabaseService from "./services/databaseService.js";
import { StrategyWithWebsite, GoogleAdsCampaignInsert } from "./types/database.js";
import { CreateButton } from "@/components/ui/website/CreateButton.js";
import { Alert } from "@/components/ui/campaign/Alert.js";
import { PageHeader } from "@/components/ui/website/PageHeader.js";
import { Input } from "@/components/ui/campaign/Input.js";

const { Option } = Select;

interface CampaignFormData {
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget_daily?: number;
  budget_total?: number;
  campaign_type: 'search' | 'display' | 'shopping' | 'video' | 'app';
  target_locations?: string[];
  keywords_final?: string[];
}

// Step Indicator Component
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, title: "Strategia", description: "Wybierz bazową strategię" },
    { number: 2, title: "Podstawy", description: "Nazwa i typ kampanii" },
    { number: 3, title: "Szczegóły", description: "Budżet i targeting" }
  ];

  return (
    <div className="w-full mb-12">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              {/* Step Circle */}
              <div className={`
                relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                ${currentStep >= step.number 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-gray-100 text-gray-400'
                }
              `}>
                {currentStep > step.number ? (
                  <CheckCircleOutlined className="text-lg" />
                ) : (
                  step.number
                )}
                
                {/* Pulse animation for current step */}
                {currentStep === step.number && (
                  <div className="absolute -inset-1 bg-blue-600 rounded-full animate-pulse opacity-30"></div>
                )}
              </div>
              
              {/* Step Labels */}
              <div className="mt-3 text-center">
                <div className={`text-sm font-semibold ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1 max-w-24">
                  {step.description}
                </div>
              </div>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`
                w-20 h-0.5 mx-4 mt-6 transition-all duration-300
                ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'}
              `} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Strategy Selection Component
const StrategySelectionStep: React.FC<{
  strategies: StrategyWithWebsite[];
  selectedStrategyId: string;
  onStrategyChange: (id: string) => void;
  onNext: () => void;
  loading: boolean;
}> = ({ strategies, selectedStrategyId, onStrategyChange, onNext, loading }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <StepContainer>
      <StepCard 
        title="Wybierz strategię marketingową"
        subtitle="Wybierz strategię, na której będzie oparta kampania"
      >
        <div className="space-y-4">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              onClick={() => onStrategyChange(strategy.id)}
              className={`
                relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group
                ${selectedStrategyId === strategy.id 
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg scale-[1.01]' 
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50 hover:shadow-md'
                }
              `}
            >
              {/* Selection indicator */}
              <div className="absolute top-6 right-6">
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                  ${selectedStrategyId === strategy.id 
                    ? 'border-blue-500 bg-blue-500 shadow-lg' 
                    : 'border-gray-300 group-hover:border-blue-400'
                  }
                `}>
                  {selectedStrategyId === strategy.id && (
                    <CheckCircleOutlined className="text-white text-sm" />
                  )}
                </div>
              </div>

              {/* Strategy content */}
              <div className="pr-12">
                <h3 className="font-bold text-gray-900 text-xl mb-3 leading-tight">
                  {strategy.title}
                </h3>
                
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    <span className="font-medium">{strategy.website_analysis.url}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    <span className="font-bold text-blue-700">{formatCurrency(strategy.budget_recommendation)}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                  {strategy.target_audience}
                </p>

                {/* Keywords preview */}
                {strategy.website_analysis.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {strategy.website_analysis.keywords.slice(0, 4).map((keyword, index) => (
                      <span 
                        key={index}
                        className="inline-block px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs rounded-lg font-medium shadow-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                    {strategy.website_analysis.keywords.length > 4 && (
                      <span className="inline-block px-3 py-1.5 bg-gray-100 text-gray-500 text-xs rounded-lg font-medium">
                        +{strategy.website_analysis.keywords.length - 4} więcej
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {strategies.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">Brak dostępnych strategii</h3>
              <p className="text-gray-400">Utwórz najpierw strategię marketingową</p>
            </div>
          )}
        </div>

        <StepNavigation
          onNext={onNext}
          nextDisabled={!selectedStrategyId || loading}
          loading={loading}
          nextLabel="Przejdź do podstaw"
        />
      </StepCard>
    </StepContainer>
  );
};

// Basic Info Step Component - OGRANICZONE OPCJE
const BasicInfoStep: React.FC<{
  form: any;
  onNext: () => void;
  onPrev: () => void;
  loading: boolean;
}> = ({ form, onNext, onPrev, loading }) => {
  // Dodaj lokalne stany do śledzenia wartości
  const [selectedCampaignType, setSelectedCampaignType] = useState(form.getFieldValue('campaign_type') || '');
  const [selectedStatus, setSelectedStatus] = useState(form.getFieldValue('status') || 'draft');
  const [campaignName, setCampaignName] = useState(form.getFieldValue('name') || '');

  // Sprawdź czy formularz jest prawidłowy
  const isFormValid = campaignName && selectedCampaignType && selectedStatus;

  // Funkcje obsługi kliknięć
  const handleCampaignTypeSelect = (type: string) => {
    setSelectedCampaignType(type);
    form.setFieldsValue({ campaign_type: type });
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    form.setFieldsValue({ status: status });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCampaignName(value);
    form.setFieldsValue({ name: value });
  };

  return (
    <StepContainer>
      <StepCard 
        title="Podstawowe informacje"
        subtitle="Ustaw nazwę, typ i status kampanii"
      >
        <div className="space-y-8">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Nazwa kampanii <span className="text-red-500">*</span>
            </label>
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Wprowadź nazwę kampanii" }]}
              style={{ margin: 0 }}
            >
              <Input 
                placeholder="Np. Kampania wyszukiwania - Jesień 2025"
                className="h-12 text-base"
                value={campaignName}
                onChange={handleNameChange}
              />
            </Form.Item>
          </div>

          {/* Campaign Type - OGRANICZONE OPCJE */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4">
              Typ kampanii <span className="text-red-500">*</span>
            </label>
            <Form.Item
              name="campaign_type"
              rules={[{ required: true, message: "Wybierz typ kampanii" }]}
              style={{ margin: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'search', label: 'Kampania wyszukiwania', icon: '🔍', desc: 'Reklamy w wynikach wyszukiwania Google' },
                  { value: 'display', label: 'Sieć reklamowa Google', icon: '🖼️', desc: 'Reklamy bannerowe na stronach partnerskich' }
                ].map((type) => (
                  <div
                    key={type.value}
                    onClick={() => handleCampaignTypeSelect(type.value)}
                    className={`
                      p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 group
                      ${selectedCampaignType === type.value 
                        ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.01]' 
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{type.icon}</div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-base">{type.label}</div>
                        <div className="text-sm text-gray-600 mt-1 leading-relaxed">{type.desc}</div>
                      </div>
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                        ${selectedCampaignType === type.value 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300 group-hover:border-gray-400'
                        }
                      `}>
                        {selectedCampaignType === type.value && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Form.Item>
          </div>

          {/* Campaign Status - OGRANICZONE OPCJE */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4">
              Status kampanii <span className="text-red-500">*</span>
            </label>
            <Form.Item
              name="status"
              rules={[{ required: true, message: "Wybierz status" }]}
              style={{ margin: 0 }}
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'draft', label: 'Szkic', icon: '📝', color: 'gray', desc: 'W przygotowaniu' },
                  { value: 'active', label: 'Aktywna', icon: '🟢', color: 'green', desc: 'Kampania działa' }
                ].map((status) => (
                  <div
                    key={status.value}
                    onClick={() => handleStatusSelect(status.value)}
                    className={`
                      p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center
                      ${selectedStatus === status.value 
                        ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]' 
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className="text-2xl mb-2">{status.icon}</div>
                    <div className="font-bold text-gray-900 text-sm mb-1">{status.label}</div>
                    <div className="text-xs text-gray-600">{status.desc}</div>
                  </div>
                ))}
              </div>
            </Form.Item>
          </div>
        </div>

        <StepNavigation
          onNext={onNext}
          onPrev={onPrev}
          nextDisabled={!isFormValid || loading}
          loading={loading}
          nextLabel="Przejdź do szczegółów"
          prevLabel="Wróć do strategii"
        />
      </StepCard>
    </StepContainer>
  );
};

// Details Step Component - POPRAWIONE FORMATOWANIE
const DetailsStep: React.FC<{
  form: any;
  strategy: StrategyWithWebsite;
  onSubmit: () => void;
  onPrev: () => void;
  loading: boolean;
  isEditing: boolean;
}> = ({ form, strategy, onSubmit, onPrev, loading, isEditing }) => {
  const [formValues, setFormValues] = useState({
    budget_daily: form.getFieldValue('budget_daily'),
    budget_total: form.getFieldValue('budget_total'),
    keywords_final: form.getFieldValue('keywords_final') || [],
    target_locations: form.getFieldValue('target_locations') || []
  });

  const handleFormChange = (field: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
    form.setFieldsValue({ [field]: value });
  };

  const handleSubmitClick = async () => {
    try {
      await form.validateFields();
      onSubmit();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Details Form */}
        <div className="lg:col-span-2">
          <StepContainer>
            <StepCard 
              title="Szczegóły kampanii"
              subtitle="Ustaw budżet, lokalizacje i słowa kluczowe"
            >
              <div className="space-y-8">
                {/* Budget Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Budżet dzienny (PLN)
                    </label>
                    <Form.Item name="budget_daily" style={{ margin: 0 }}>
                      <Input
                        type="number"
                        min={0}
                        step={10}
                        placeholder="Opcjonalnie"
                        className="h-12 text-base"
                        value={formValues.budget_daily}
                        onChange={(e) => handleFormChange('budget_daily', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </Form.Item>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Budżet całkowity (PLN)
                    </label>
                    <Form.Item name="budget_total" style={{ margin: 0 }}>
                      <Input
                        type="number"
                        min={0}
                        step={100}
                        placeholder="Budżet całkowity"
                        className="h-12 text-base"
                        value={formValues.budget_total}
                        onChange={(e) => handleFormChange('budget_total', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </Form.Item>
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Słowa kluczowe
                  </label>
                  <Form.Item name="keywords_final" style={{ margin: 0 }}>
                    <Select
                      mode="tags"
                      size="large"
                      placeholder="Dodaj słowa kluczowe..."
                      className="w-full"
                      style={{ minHeight: '48px' }}
                      tokenSeparators={[',']}
                      value={formValues.keywords_final}
                      onChange={(value) => handleFormChange('keywords_final', value)}
                    >
                      {strategy.website_analysis.keywords.map(keyword => (
                        <Option key={keyword} value={keyword}>{keyword}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                {/* Target Locations - POPRAWIONY LAYOUT */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Lokalizacje docelowe
                  </label>
                  <Form.Item name="target_locations" style={{ margin: 0 }}>
                    <Select
                      mode="tags"
                      size="large"
                      placeholder="Dodaj lokalizacje..."
                      className="w-full"
                      style={{ minHeight: '48px' }}
                      tokenSeparators={[',']}
                      value={formValues.target_locations}
                      onChange={(value) => handleFormChange('target_locations', value)}
                      dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                    >
                      <Option value="Polska">🇵🇱 Polska</Option>
                      <Option value="Warszawa">📍 Warszawa</Option>
                      <Option value="Kraków">📍 Kraków</Option>
                      <Option value="Gdańsk">📍 Gdańsk</Option>
                      <Option value="Wrocław">📍 Wrocław</Option>
                      <Option value="Poznań">📍 Poznań</Option>
                      <Option value="Łódź">📍 Łódź</Option>
                      <Option value="Szczecin">📍 Szczecin</Option>
                      <Option value="Katowice">📍 Katowice</Option>
                      <Option value="Bydgoszcz">📍 Bydgoszcz</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>

              <StepNavigation
                onNext={handleSubmitClick}
                onPrev={onPrev}
                loading={loading}
                nextLabel={isEditing ? "Zapisz zmiany" : "Utwórz kampanię"}
                prevLabel="Wróć do podstaw"
              />
            </StepCard>
          </StepContainer>
        </div>

        {/* Strategy Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <PreviewCard
              title="Bazowa strategia"
              badge="Wybrana"
              items={[
                { label: "Strategia", value: strategy.title },
                { label: "Strona WWW", value: strategy.website_analysis.url },
                { label: "Sugerowany budżet", value: strategy.budget_recommendation, type: 'currency' },
                { label: "Grupa docelowa", value: strategy.target_audience, type: 'longtext' }
              ]}
            />

            {/* Current form preview */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Podgląd kampanii</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nazwa:</span>
                  <span className="font-medium text-gray-900">{form.getFieldValue('name') || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Typ:</span>
                  <span className="font-medium text-gray-900">
                    {form.getFieldValue('campaign_type') === 'search' ? 'Wyszukiwanie' : 
                     form.getFieldValue('campaign_type') === 'display' ? 'Display' : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-gray-900">
                    {form.getFieldValue('status') === 'draft' ? 'Szkic' : 
                     form.getFieldValue('status') === 'active' ? 'Aktywna' : '-'}
                  </span>
                </div>
                {formValues.budget_total && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budżet:</span>
                    <span className="font-medium text-gray-900">{formValues.budget_total} PLN</span>
                  </div>
                )}
                {formValues.target_locations && formValues.target_locations.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lokalizacje:</span>
                    <span className="font-medium text-gray-900">{formValues.target_locations.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CampaignForm: React.FC = () => {
  const navigate = useNavigate();
  const { strategyId, id: campaignId } = useParams();
  const [form] = Form.useForm();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [strategy, setStrategy] = useState<StrategyWithWebsite | null>(null);
  const [strategies, setStrategies] = useState<StrategyWithWebsite[]>([]);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>(strategyId || "");
  const [loading, setLoading] = useState(false);
  const [loadingStrategies, setLoadingStrategies] = useState(false);
  const [error, setError] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  // Load strategy if passed in URL
  const loadStrategy = async (id: string) => {
    try {
      const strategyData = await DatabaseService.getMarketingStrategy(id);
      if (strategyData) {
        setStrategy(strategyData);
      }
    } catch (error: any) {
      console.error("Error loading strategy:", error);
      setError("Nie można załadować strategii");
    }
  };

  // Load all strategies if creating new campaign without selected strategy
  const loadAllStrategies = async () => {
    setLoadingStrategies(true);
    try {
      const websites = await DatabaseService.getAllWebsiteAnalyses();
      const allStrategies: StrategyWithWebsite[] = [];
      
      for (const website of websites) {
        const strategies = await DatabaseService.getStrategiesByWebsite(website.id);
        strategies.forEach(strategy => {
          allStrategies.push({
            ...strategy,
            website_analysis: website
          });
        });
      }
      
      setStrategies(allStrategies);
    } catch (error: any) {
      console.error("Error loading strategies:", error);
      setError("Nie można załadować strategii");
    }
    setLoadingStrategies(false);
  };

  // Load campaign data for editing
  const loadCampaign = async (id: string) => {
    try {
      setIsEditing(true);
      const campaignData = await DatabaseService.getGoogleAdsCampaign(id);
      if (campaignData) {
        setStrategy(campaignData.strategy);
        setSelectedStrategyId(campaignData.strategy_id);
        setCurrentStep(2); // Skip strategy selection for editing
        
        form.setFieldsValue({
          name: campaignData.name,
          status: campaignData.status,
          budget_daily: campaignData.budget_daily,
          budget_total: campaignData.budget_total,
          campaign_type: campaignData.campaign_type,
          target_locations: campaignData.target_locations || [],
          keywords_final: campaignData.keywords_final || [],
        });
      }
    } catch (error: any) {
      console.error("Error loading campaign:", error);
      setError("Nie można załadować kampanii");
    }
  };

  useEffect(() => {
    if (campaignId) {
      loadCampaign(campaignId);
    } else if (strategyId) {
      loadStrategy(strategyId);
      setCurrentStep(2); // Skip strategy selection
    } else {
      loadAllStrategies();
    }
  }, [strategyId, campaignId]);

  // DODANY USEEFFECT - ustawia domyślne wartości po załadowaniu strategii
  useEffect(() => {
    if (strategy && !isEditing) {
      form.setFieldsValue({
        status: 'draft',
        campaign_type: 'search',
        budget_total: strategy.budget_recommendation,
        keywords_final: strategy.website_analysis?.keywords || [],
      });
    }
  }, [strategy, form, isEditing]);

  const handleStrategyChange = async (newStrategyId: string) => {
    setSelectedStrategyId(newStrategyId);
    await loadStrategy(newStrategyId);
  };

  // POPRAWIONA FUNKCJA SUBMIT
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (!selectedStrategyId) {
        setError("Wybierz strategię");
        return;
      }
  
      setLoading(true);
      setError("");
  
      const campaignData: GoogleAdsCampaignInsert = {
        strategy_id: selectedStrategyId,
        name: values.name,
        status: values.status,
        budget_daily: values.budget_daily,
        budget_total: values.budget_total,
        campaign_type: values.campaign_type,
        target_locations: values.target_locations,
        keywords_final: values.keywords_final,
      };
  
      let resultCampaignId: string;
  
      if (isEditing && campaignId) {
        // Edycja istniejącej kampanii
        await DatabaseService.updateGoogleAdsCampaign(campaignId, campaignData);
        resultCampaignId = campaignId;
      } else {
        // Tworzenie nowej kampanii
        const newCampaign = await DatabaseService.createGoogleAdsCampaign(campaignData);
        resultCampaignId = newCampaign.id;
      }
  
      // Jeśli kampania jest aktywna, obsłuż aktywację
      if (values.status === 'active') {
        try {
          await DatabaseService.activateCampaign(resultCampaignId, {
            daily_budget: values.budget_daily,
            total_budget: values.budget_total,
            keywords: values.keywords_final,
            target_locations: values.target_locations
          });
  
          console.log('Kampania została aktywowana');
        } catch (contentError) {
          console.error('Błąd podczas aktywacji kampanii:', contentError);
          setError("Kampania została utworzona, ale wystąpił błąd podczas aktywacji");
        }
      }
  
      navigate("/campaigns");
    } catch (error: any) {
      console.error('Error submitting campaign:', error);
      setError(error.message || "Wystąpił błąd podczas zapisywania kampanii");
    }
    setLoading(false);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loadingStrategies) {
    return (
      <PageContainer>
        <LoadingState message="Ładowanie strategii..." />
      </PageContainer>
    );
  }

  return (
    <ConfigProvider>
      <PageContainer>
        <div className="space-y-8">
          {/* Header */}
          <PageHeader
            title={isEditing ? "Edytuj kampanię" : "Nowa kampania"}
            description={isEditing ? "Edytuj parametry istniejącej kampanii" : "Utwórz nową kampanię Google Ads"}
            icon={null}
            action={
              <CreateButton
                to=""
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
              >
                Powrót
              </CreateButton>
            }
          />

          {error && (
            <Alert 
              type="error" 
              message={error} 
              onClose={() => setError("")}
            />
          )}

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} totalSteps={3} />

          {/* Form Container */}
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              status: 'draft',
              campaign_type: 'search',
              budget_total: strategy?.budget_recommendation,
              keywords_final: strategy?.website_analysis?.keywords,
            }}
          >
            {/* Step 1: Strategy Selection */}
            {currentStep === 1 && !isEditing && (
              <StrategySelectionStep
                strategies={strategies}
                selectedStrategyId={selectedStrategyId}
                onStrategyChange={handleStrategyChange}
                onNext={nextStep}
                loading={loading}
              />
            )}

            {/* Step 2: Basic Information */}
            {currentStep === 2 && strategy && (
              <BasicInfoStep
                form={form}
                onNext={nextStep}
                onPrev={isEditing ? undefined : prevStep}
                loading={loading}
              />
            )}

            {/* Step 3: Details */}
            {currentStep === 3 && strategy && (
              <DetailsStep
                form={form}
                strategy={strategy}
                onSubmit={handleSubmit}
                onPrev={prevStep}
                loading={loading}
                isEditing={isEditing}
              />
            )}
          </Form>
        </div>
      </PageContainer>
    </ConfigProvider>
  );
};

export default CampaignForm;