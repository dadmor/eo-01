// src/pages/wiseads/components/campaign-steps/StepTwo.tsx

import { StepContainer } from "@/components/ui/campaign/StepContainer.js";
import { SiteData } from "../LLMAnalyzer.js";
import { StepCard } from "@/components/ui/campaign/StepCard.js";
import { Tag } from "@/components/ui/campaign/Tag.js";
import { StepNavigation } from "@/components/ui/campaign/StepNavigation.js";



interface StepTwoProps {
  siteData: SiteData;
  onNext: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ siteData, onNext }) => {
  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] pb-4">
        <StepContainer>
          <StepCard
            title="Krok 1: Przegląd danych ze strony"
            subtitle="Sprawdź automatycznie przeanalizowane informacje z Twojej strony internetowej"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opis strony
                </label>
                <div className="max-h-48 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-gray-800 leading-relaxed">{siteData.description}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Słowa kluczowe
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {siteData.keywords.map((keyword) => (
                    <Tag key={keyword} color="blue">
                      {keyword}
                    </Tag>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sugerowana branża
                </label>
                <p className="text-gray-900 font-medium bg-gray-50 border border-gray-200 rounded-lg p-3">
                  {siteData.industry}
                </p>
              </div>
            </div>
          </StepCard>
        </StepContainer>
      </div>
      
      <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
        <StepNavigation onNext={onNext} nextLabel="Kontynuuj" />
      </div>
    </div>
  );
};

export default StepTwo;