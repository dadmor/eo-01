// src/pages/wiseads/WebsiteAnalysesList.tsx - refaktoryzacja z komponentami UI
import  { useEffect, useState } from "react";
import { message } from "antd";

import { 
  GlobalOutlined, 

  PlusOutlined,

} from "@ant-design/icons";
import { AnalysisCard } from "@/components/ui/website/AnalysisCard.js";
import { EmptyState } from "@/components/ui/website/EmptyState.js";
import { LoadingState } from "@/components/ui/website/LoadingState.js";
import { PageContainer } from "@/components/ui/website/PageContainer.js";
import { StatsGrid } from "@/components/ui/website/StatsGrid.js";

import DatabaseService from "./services/databaseService.js";
import { WebsiteAnalysis } from "./types/database.js";
import { PageHeader } from "@/components/ui/website/PageHeader.js";
import { CreateButton } from "@/components/ui/website/CreateButton.js";


// Import nowych komponentów UI


interface WebsiteWithStats extends WebsiteAnalysis {
  strategies_count: number;
  campaigns_count: number;
}

const WebsiteAnalysesList: React.FC = () => {
  const [data, setData] = useState<WebsiteWithStats[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAnalyses = async () => {
    setLoading(true);
    try {
      const analyses = await DatabaseService.getAllWebsiteAnalyses();
      
      // Dodaj statystyki dla każdej analizy
      const analysesWithStats = await Promise.all(
        analyses.map(async (analysis) => {
          const strategies = await DatabaseService.getStrategiesByWebsite(analysis.id);
          const allCampaigns = await Promise.all(
            strategies.map(strategy => DatabaseService.getCampaignsByStrategy(strategy.id))
          );
          const campaignsCount = allCampaigns.reduce((acc, campaigns) => acc + campaigns.length, 0);
          
          return {
            ...analysis,
            strategies_count: strategies.length,
            campaigns_count: campaignsCount,
          };
        })
      );
      
      setData(analysesWithStats);
    } catch (error: any) {
      message.error("Błąd pobierania analiz: " + error.message);
      console.error("Błąd:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const deleteAnalysis = async (analysisId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    try {
      await DatabaseService.deleteWebsiteAnalysis(analysisId);
      message.success("Analiza została usunięta");
      fetchAnalyses();
    } catch (error: any) {
      message.error("Błąd usuwania analizy: " + error.message);
    }
  };

  const handleCardClick = (analysisId: string) => {
    // Przekierowanie do szczegółów analizy
    window.location.href = `/analyses/${analysisId}`;
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState message="Ładowanie analiz..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        title="Analizy stron WWW"
        description="Zarządzaj analizami stron internetowych i twórz dla nich strategie marketingowe"
        icon={<GlobalOutlined />}
        action={
          <CreateButton
            to="/analyses/create"
            icon={<PlusOutlined />}
          >
            Nowa analiza
          </CreateButton>
        }
      />

      {/* Main Content */}
      {data.length === 0 ? (
        <EmptyState
          icon={<GlobalOutlined />}
          title="Brak analiz stron WWW"
          description="Zacznij od stworzenia pierwszej analizy strony internetowej. Analiza pomoże Ci zrozumieć Twoją stronę i stworzyć skuteczne strategie marketingowe."
          actionText="Utwórz pierwszą analizę"
          actionTo="/analyses/create"
        />
      ) : (
        <div>
          {/* Statistics Summary */}
          <StatsGrid
            totalAnalyses={data.length}
            totalStrategies={data.reduce((acc, item) => acc + item.strategies_count, 0)}
            totalCampaigns={data.reduce((acc, item) => acc + item.campaigns_count, 0)}
          />

          {/* Analyses List */}
          <div>
            {data.map((analysis) => (
              <AnalysisCard
                key={analysis.id}
                id={analysis.id}
                url={analysis.url}
                description={analysis.description}
                industry={analysis.industry}
                createdAt={analysis.created_at}
                keywords={analysis.keywords}
                strategiesCount={analysis.strategies_count}
                campaignsCount={analysis.campaigns_count}
                onDelete={deleteAnalysis}
                onClick={handleCardClick}
              />
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default WebsiteAnalysesList;