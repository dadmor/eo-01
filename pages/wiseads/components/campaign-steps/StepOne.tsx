// src/pages/wiseads/components/campaign-steps/StepOne.tsx

import { StepContainer } from "@/components/ui/campaign/StepContainer.js";
import LLMAnalyzer, { SiteData } from "../LLMAnalyzer.js";


interface StepOneProps {
  onSiteDataFetched: (url: string, data: SiteData) => void;
}

const StepOne: React.FC<StepOneProps> = ({ onSiteDataFetched }) => {
  return (
    <StepContainer>
      <LLMAnalyzer onFetched={onSiteDataFetched} />
    </StepContainer>
  );
};

export default StepOne;