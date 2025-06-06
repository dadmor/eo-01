// src/pages/wiseads/Dashboard.tsx
import { useEffect, useState } from "react";
import DatabaseService from "./services/databaseService.js";
import HeroCard from "@/components/ui/HeroCard.js";
import ProgressCard from "@/components/ui/ProgressCard.js";
import StatCard from "@/components/ui/StatCard.js";
import ActionCard from "@/components/ui/ActionCard.js";
import { 

  BulbOutlined, 
  RocketOutlined,
  GlobalOutlined,
  PlayCircleOutlined


} from "@ant-design/icons";
import CampaignWizard from "./components/CampaignWizard.js";


export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showWizard, setShowWizard] = useState(false);
  const isFirstVisit = stats && Object.values(stats).every((v) => v === 0);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await DatabaseService.getStats();
        setStats(data);
        if (
          Object.values(data).every((v) => v === 0) &&
          !localStorage.getItem("wiseads_has_visited")
        ) {
          localStorage.setItem("wiseads_has_visited", "true");
          setShowWizard(true);
        }
      } catch (e: any) {
        setError(e.message || "Błąd ładowania danych");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const currentStep = stats
    ? stats.totalWebsites === 0
      ? 0
      : stats.totalStrategies === 0
      ? 1
      : stats.totalCampaigns === 0
      ? 2
      : 3
    : 0;

  return (
    <div className="min-h-screen  p-6 md:p-12 max-w-6xl mx-auto">
     

      <HeroCard
        isFirstVisit={isFirstVisit}
        onStart={() => setShowWizard(true)}
      />
      <ProgressCard
        currentStep={currentStep}
        isFirstVisit={isFirstVisit}
        onStartWizard={() => setShowWizard(true)}
      />

      {loading && (
        <div className="text-center py-20">Ładowanie dashboard...</div>
      )}

      {!loading && error && (
        <div className="border bg-red-50 text-red-700 rounded-lg mb-8 p-4">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 text-red-600 hover:bg-red-100 px-3 py-1 border rounded"
          >
            Spróbuj ponownie
          </button>
        </div>
      )}

      {!loading && stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Analizy WWW"
              value={stats.totalWebsites}
              prefixIcon={<GlobalOutlined />}
              linkTo="/analyses"
            />
            <StatCard
              title="Strategie"
              value={stats.totalStrategies}
              prefixIcon={<BulbOutlined />}
              linkTo="/strategies"
            />
            <StatCard
              title="Kampanie"
              value={stats.totalCampaigns}
              prefixIcon={<RocketOutlined />}
              linkTo="/campaigns"
            />
            <StatCard
              title="Aktywne"
              value={stats.activeCampaigns}
              suffixText={`/${stats.totalCampaigns}`}
              prefixIcon={<PlayCircleOutlined />}
              note={`${stats.draftCampaigns} szkiców`}
              linkTo="/campaigns"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Analiza WWW", "Strategia", "Kampania"].map((step, i) => (
              <ActionCard
                key={step}
                title={`Krok ${i + 1}: ${step}`}
                description={`Utwórz ${step}`}
                icon={
                  [<GlobalOutlined />, <BulbOutlined />, <RocketOutlined />][i]
                }
                to={
                  [
                    "/analyses/create",
                    "/strategies/create",
                    "/campaigns/create",
                  ][i]
                }
                active={currentStep === i}
                disabled={currentStep !== i}
              />
            ))}
          </div>
        </>
      )}

{showWizard && (
  <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-start pt-10 pb-10">
    <div className="bg-white rounded-2xl max-w-3xl w-full mx-4 max-h-[95vh] overflow-hidden">
      {/* Header z przyciskiem zamknij - nie przewija się */}
      <div className="flex justify-end p-4 border-b border-gray-100">
        <button
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setShowWizard(false)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Scrollable content z custom scrollbar */}
      <div className="overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
        <CampaignWizard
          onClose={() => setShowWizard(false)}
          onComplete={() => window.location.reload()}
        />
      </div>
    </div>
  </div>
)}
    </div>
  );
};
