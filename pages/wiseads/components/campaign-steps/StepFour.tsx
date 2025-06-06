// ===== src/pages/wiseads/components/campaign-steps/StepFour.tsx =====

import { PreviewCard } from "@/components/ui/campaign/PreviewCard.js";
import { StepCard } from "@/components/ui/campaign/StepCard.js";
import { StepContainer } from "@/components/ui/campaign/StepContainer.js";
import { StepNavigation } from "@/components/ui/campaign/StepNavigation.js";


interface CampaignDraft {
  title: string;
  targetAudience: string;
  budgetRecommendation: number;
  notes: string;
}

interface StepFourProps {
  campaignDraft: CampaignDraft;
  onNext: () => void;
  onPrev: () => void;
}

const StepFour: React.FC<StepFourProps> = ({ campaignDraft, onNext, onPrev }) => {
  const previewItems = [
    { label: "Tytuł", value: campaignDraft.title, type: "text" as const },
    { label: "Grupa docelowa", value: campaignDraft.targetAudience, type: "text" as const },
    { label: "Sugerowany budżet", value: campaignDraft.budgetRecommendation, type: "currency" as const },
    { label: "Notatki strategiczne", value: campaignDraft.notes, type: "longtext" as const }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] pb-4">
        <StepContainer>
          <StepCard
            title="Krok 3: Sprawdź wygenerowaną kampanię"
            subtitle="Dane zostały wygenerowane automatycznie przez AI. W następnym kroku będziesz mógł je edytować."
            children=""
          />
          
          <div className="max-h-96 overflow-y-auto">
            <PreviewCard
              title="Podgląd kampanii"
              items={previewItems}
              badge="Wygenerowane przez AI"
            />
          </div>
        </StepContainer>
      </div>

      <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
        <StepNavigation
          onNext={onNext}
          onPrev={onPrev}
          nextLabel="Edytuj kampanię"
          prevLabel="Wstecz"
        />
      </div>
    </div>
  );
};

export default StepFour;
