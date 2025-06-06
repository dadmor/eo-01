// src/pages/wiseads/components/campaign-steps/StepThree.tsx

import { Alert } from "@/components/ui/campaign/Alert.js";
import { FormField } from "@/components/ui/campaign/FormField.js";
import { Input } from "@/components/ui/campaign/Input.js";
import { StepCard } from "@/components/ui/campaign/StepCard.js";
import { StepContainer } from "@/components/ui/campaign/StepContainer.js";
import { StepNavigation } from "@/components/ui/campaign/StepNavigation.js";
import { SiteData } from "../LLMAnalyzer.js";



interface StepThreeProps {
  siteData: SiteData;
  editedIndustry: string;
  onIndustryChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  loading: boolean;
  error: string;
}

const StepThree: React.FC<StepThreeProps> = ({
  siteData,
  editedIndustry,
  onIndustryChange,
  onNext,
  onPrev,
  loading,
  error
}) => {
  return (
    <StepContainer>
      <StepCard
        title="Krok 2: Dostosuj branżę"
        subtitle="Możesz zmienić automatycznie wykrytą branżę, jeśli chcesz"
      >
        <FormField label="Branża">
          <Input
            value={editedIndustry}
            onChange={(e) => onIndustryChange(e.target.value)}
            placeholder="Wprowadź branżę..."
          />
        </FormField>
      </StepCard>
      
      {error && (
        <Alert
          type="warning"
          message={error}
        />
      )}

      <StepNavigation
        onNext={onNext}
        onPrev={onPrev}
        nextLabel="Generuj treści"
        prevLabel="Wstecz"
        loading={loading}
        nextDisabled={loading}
        prevDisabled={loading}
      />
    </StepContainer>
  );
};

export default StepThree;