// src/pages/wiseads/components/CampaignWizard.tsx
import  { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { z } from "zod";
import { SiteData } from "./LLMAnalyzer.js";
import DatabaseService from "../services/databaseService.js";
import { ErrorAlert } from "@/components/ui/ErrorAlert.js";
import { SuccessAlert } from "@/components/ui/SuccessAlert.js";
import StepOne from "./campaign-steps/StepOne.js";
import StepTwo from "./campaign-steps/StepTwo.js";
import StepThree from "./campaign-steps/StepThree.js";
import StepFour from "./campaign-steps/StepFour.js";
import StepFive from "./campaign-steps/StepFive.js";
import { ProgressSteps } from "@/components/ui/ProgressSteps.js";

// Schema walidacji dla danych kampanii
const campaignDraftSchema = z.object({
  title: z.string().min(5, "Tytuł musi mieć co najmniej 5 znaków"),
  targetAudience: z.string().min(20, "Opis grupy docelowej musi być szczegółowy"),
  budgetRecommendation: z.number().min(500, "Minimalny budżet to 500 PLN"),
  notes: z.string().min(50, "Notatki muszą być szczegółowe"),
});

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

interface CampaignWizardProps {
  onClose: () => void;
  onComplete: () => void;
}

const CampaignWizard: React.FC<CampaignWizardProps> = ({ onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [editedIndustry, setEditedIndustry] = useState("");
  const [campaignDraft, setCampaignDraft] = useState<CampaignDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [url, setUrl] = useState("");

  const LLM_ENDPOINT = "https://diesel-power-backend.onrender.com/api/chat";

  // Obsługa danych z analizy strony (Krok 1)
  const handleSiteDataFetched = (fetchedUrl: string, data: SiteData) => {
    setSiteData(data);
    setUrl(fetchedUrl);
    setEditedIndustry(data.industry);
    setCurrentStep(1);
  };

  // Przejście do kroku 2 (potwierdzenie danych)
  const handleStepTwoNext = () => {
    setCurrentStep(2);
  };

  // Generowanie kampanii przez AI (Krok 3)
  const generateCampaignContent = async () => {
    if (!siteData) return;

    setLoading(true);
    setError("");

    try {
      const finalIndustry = editedIndustry.trim() || siteData.industry;

      const prompt = `
Jesteś ekspertem od marketingu cyfrowego. Na podstawie poniższych informacji o stronie internetowej, wygeneruj szczegółową strategię marketingową w formacie JSON:

Informacje o stronie:
- URL: ${url}
- Opis: ${siteData.description}
- Słowa kluczowe: ${siteData.keywords.join(", ")}
- Branża: ${finalIndustry}

Wygeneruj JSON w dokładnie tym formacie:
{
  "title": "<kreatywny tytuł kampanii dopasowany do branży>",
  "targetAudience": "<bardzo szczegółowy opis grupy docelowej z demografią, zainteresowaniami, zachowaniami online, lokalizacją>",
  "budgetRecommendation": <liczba - sugerowany budżet miesięczny w PLN>,
  "notes": "<szczegółowe notatki strategiczne zawierające: kanały marketingowe, timing kampanii, propozycje content marketingu, strategię SEO/SEM, social media, email marketing, metryki KPI, plan testów A/B, konkurencję, USP>"
}

Uwagi:
- Tytuł powinien być angażujący i strategiczny
- Grupa docelowa bardzo konkretna (wiek, płeć, wykształcenie, zainteresowania, zachowania)
- Budżet realistyczny dla branży (1000-50000 PLN)
- Notatki bardzo szczegółowe (min. 300 słów) z konkretnymi działaniami
      `.trim();

      const res = await fetch(LLM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      if (!res.ok) {
        throw new Error(`Błąd serwera LLM: ${res.status}`);
      }

      const json = await res.json();
      const rawText = (json.response as string) || "";
      const cleaned = rawText.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, "$1").trim();

      const parsed = JSON.parse(cleaned);
      const result = campaignDraftSchema.safeParse(parsed);

      if (!result.success) {
        throw new Error("Niepoprawny format odpowiedzi AI");
      }

      const draft: CampaignDraft = {
        url,
        description: siteData.description,
        keywords: siteData.keywords,
        industry: finalIndustry,
        title: result.data.title,
        targetAudience: result.data.targetAudience,
        budgetRecommendation: result.data.budgetRecommendation,
        notes: result.data.notes,
      };

      setCampaignDraft(draft);
      setCurrentStep(3);
    } catch (err: any) {
      console.error("Błąd generowania kampanii:", err);
      setError("Nie udało się wygenerować kampanii. Spróbuj ponownie.");
    }
    setLoading(false);
  };

  // Przejście do kroku 4 (edycja)
  const handleStepFourNext = () => {
    setCurrentStep(4);
  };

  // Zapisanie kampanii (Krok 5)
  const handleSaveCampaign = async (values: CampaignDraft) => {
    setLoading(true);
    setError("");

    try {
      // 1. Zapisz analizę WWW
      const analysis = await DatabaseService.createWebsiteAnalysis({
        url: values.url,
        description: values.description,
        keywords: values.keywords,
        industry: values.industry,
      });

      // 2. Zapisz strategię marketingową
      const strategy = await DatabaseService.createMarketingStrategy({
        website_analysis_id: analysis.id,
        title: values.title,
        target_audience: values.targetAudience,
        budget_recommendation: values.budgetRecommendation,
        notes: values.notes,
      });

      // 3. Zapisz kampanię Google Ads
      await DatabaseService.createGoogleAdsCampaign({
        strategy_id: strategy.id,
        name: `${values.title} - Google Ads`,
        status: "draft",
        budget_total: values.budgetRecommendation,
        campaign_type: "search",
        keywords_final: values.keywords,
      });

      setSuccess("Kampania została utworzona pomyślnie!");
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (err: any) {
      console.error("Błąd zapisywania kampanii:", err);
      setError("Nie udało się zapisać kampanii: " + err.message);
    }
    setLoading(false);
  };

  // Przejście do poprzedniego kroku
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const steps = [
    { title: "Analiza WWW", completed: currentStep > 0 },
    { title: "Potwierdzenie", completed: currentStep > 1 },
    { title: "Branża", completed: currentStep > 2 },
    { title: "Podgląd", completed: currentStep > 3 },
    { title: "Finalizacja", completed: currentStep > 4 },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-black mb-20">
            WISE.ADS
          </h2>
          <div className="text-left">
            <div className="text-3xl text-black leading-tight">
              Przeprowadzimy cię przez twoją<br />
              <span className="font-bold">pierwszą kampanię</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <ErrorAlert 
            message={error} 
            onClose={() => setError("")} 
          />
        )}

        {success && (
          <SuccessAlert 
            message={success} 
            onClose={() => setSuccess("")} 
          />
        )}

        {/* Zawartość kroków */}
        <div className="min-h-[400px]">
          {currentStep === 0 && (
            <StepOne onSiteDataFetched={handleSiteDataFetched} />
          )}

          {currentStep === 1 && siteData && (
            <StepTwo siteData={siteData} onNext={handleStepTwoNext} />
          )}

          {currentStep === 2 && siteData && (
            <StepThree
              siteData={siteData}
              editedIndustry={editedIndustry}
              onIndustryChange={setEditedIndustry}
              onNext={generateCampaignContent}
              onPrev={handlePrevStep}
              loading={loading}
              error={error}
            />
          )}

          {currentStep === 3 && campaignDraft && (
            <StepFour
              campaignDraft={campaignDraft}
              onNext={handleStepFourNext}
              onPrev={handlePrevStep}
            />
          )}

          {currentStep === 4 && campaignDraft && (
            <StepFive
              campaignDraft={campaignDraft}
              onSubmit={handleSaveCampaign}
              onPrev={handlePrevStep}
              loading={loading}
            />
          )}
        </div>

        {/* Progress Steps */}
        <ProgressSteps 
          steps={steps}
          currentStep={currentStep}
        />

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CloseOutlined />
            Zamknij kreator
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignWizard;