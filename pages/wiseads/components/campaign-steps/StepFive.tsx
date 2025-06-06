
// ===== src/pages/wiseads/components/campaign-steps/StepFive.tsx =====


import { FormField } from "@/components/ui/campaign/FormField.js";
import { Input } from "@/components/ui/campaign/Input.js";
import { StepCard } from "@/components/ui/campaign/StepCard.js";
import { StepContainer } from "@/components/ui/campaign/StepContainer.js";
import { StepNavigation } from "@/components/ui/campaign/StepNavigation.js";
import { Textarea } from "@/components/ui/campaign/Textarea.js";
import { useState } from "react";

interface CampaignDraft {
  url: string;
  description: string;
  keywords: string[];
  industry: string;
  title: string;
  targetAudience: string;
  budgetRecommendation: number;
  notes: string;
}

interface StepFiveProps {
  campaignDraft: CampaignDraft;
  onSubmit: (values: CampaignDraft) => void;
  onPrev: () => void;
  loading: boolean;
}

const StepFive: React.FC<StepFiveProps> = ({ campaignDraft, onSubmit, onPrev, loading }) => {
  const [formData, setFormData] = useState(campaignDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Tytuł kampanii jest wymagany";
    }
    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = "Grupa docelowa jest wymagana";
    }
    if (!formData.budgetRecommendation || formData.budgetRecommendation < 500) {
      newErrors.budgetRecommendation = "Budżet musi być co najmniej 500 PLN";
    }
    if (!formData.notes.trim()) {
      newErrors.notes = "Notatki strategiczne są wymagane";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof CampaignDraft, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] pb-4">
        <StepContainer>
          <StepCard
            title="Krok 4: Edytuj dane kampanii"
            subtitle="Dostosuj wygenerowane dane według swoich potrzeb"
          >
            <div className="space-y-6">
              <FormField 
                label="Tytuł kampanii" 
                required 
                error={errors.title}
              >
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  error={!!errors.title}
                  placeholder="Wprowadź tytuł kampanii"
                />
              </FormField>

              <FormField 
                label="Grupa docelowa" 
                required 
                error={errors.targetAudience}
              >
                <Textarea
                  value={formData.targetAudience}
                  onChange={(e) => handleChange('targetAudience', e.target.value)}
                  error={!!errors.targetAudience}
                  placeholder="Opisz grupę docelową"
                  rows={3}
                  className="max-h-32 resize-none"
                />
              </FormField>

              <FormField 
                label="Sugerowany budżet (PLN)" 
                required 
                error={errors.budgetRecommendation}
              >
                <Input
                  type="number"
                  value={formData.budgetRecommendation}
                  onChange={(e) => handleChange('budgetRecommendation', parseInt(e.target.value) || 0)}
                  error={!!errors.budgetRecommendation}
                  placeholder="Minimum 500 PLN"
                  min={500}
                />
              </FormField>

              <FormField 
                label="Notatki strategiczne" 
                required 
                error={errors.notes}
              >
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  error={!!errors.notes}
                  placeholder="Dodaj notatki strategiczne"
                  rows={6}
                  className="max-h-48 resize-none"
                />
              </FormField>
            </div>
          </StepCard>
        </StepContainer>
      </div>

      <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
        <StepNavigation
          onNext={handleSubmit}
          onPrev={onPrev}
          nextLabel="Zapisz kampanię"
          prevLabel="Wstecz"
          loading={loading}
          nextDisabled={loading}
          prevDisabled={loading}
        />
      </div>
    </div>
  );
};

export default StepFive;