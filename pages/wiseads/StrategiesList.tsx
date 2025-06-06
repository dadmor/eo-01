// src/pages/wiseads/StrategiesList.tsx - zaawansowana wersja z filtrami
import{ useEffect, useState, useMemo } from "react";
import { message } from "antd";
import { BulbOutlined, GlobalOutlined, PlusOutlined } from '@ant-design/icons';
import { StrategyWithWebsite } from "./types/database.js";
import DatabaseService from "./services/databaseService.js";
import { StrategyCard } from "@/components/ui/strategies/StrategyCard.js";
import { PageContainer } from "@/components/ui/website/PageContainer.js";
import { LoadingState } from "@/components/ui/website/LoadingState.js";
import { PageHeader } from "@/components/ui/website/PageHeader.js";
import { CreateButton } from "@/components/ui/website/CreateButton.js";
import { EmptyState } from "@/components/ui/website/EmptyState.js";
import { StrategiesStatsGrid } from "@/components/ui/strategies/StrategiesStatsGrid.js";
import { StrategyFilters } from "@/components/ui/strategies/Filters.js";
import { StrategyViewToggle } from "@/components/ui/strategies/StrategyViewToggle.js";
import { SectionTitle } from "@/components/ui/website/SectionTitle.js";
import { StrategyTable } from "@/components/ui/strategies/StrategyTable.js";




interface StrategyWithStats extends StrategyWithWebsite {
  campaigns_count: number;
  active_campaigns: number;
}

type ViewMode = 'cards' | 'table';

const StrategiesList: React.FC = () => {
  const [data, setData] = useState<StrategyWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  const fetchStrategies = async () => {
    setLoading(true);
    try {
      // Pobierz wszystkie strategie z analizami WWW
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
      
      // Dodaj statystyki kampanii dla każdej strategii
      const strategiesWithStats = await Promise.all(
        allStrategies.map(async (strategy) => {
          const campaigns = await DatabaseService.getCampaignsByStrategy(strategy.id);
          const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
          
          return {
            ...strategy,
            campaigns_count: campaigns.length,
            active_campaigns: activeCampaigns,
          };
        })
      );
      
      // Sortuj według daty utworzenia
      strategiesWithStats.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setData(strategiesWithStats);
    } catch (error: any) {
      message.error("Błąd pobierania strategii: " + error.message);
      console.error("Błąd:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  const deleteStrategy = async (strategyId: string) => {
    try {
      await DatabaseService.deleteMarketingStrategy(strategyId);
      message.success("Strategia została usunięta");
      fetchStrategies();
    } catch (error: any) {
      message.error("Błąd usuwania strategii: " + error.message);
    }
  };

  // Filtrowanie danych
  const filteredData = useMemo(() => {
    return data.filter(strategy => {
      const matchesSearch = strategy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           strategy.website_analysis.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           strategy.target_audience.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesIndustry = !selectedIndustry || 
                             (strategy.industry_override || strategy.website_analysis.industry) === selectedIndustry;
      
      return matchesSearch && matchesIndustry;
    });
  }, [data, searchTerm, selectedIndustry]);

  // Unikalne branże dla filtra
  const industries = useMemo(() => {
    const industrySet = new Set<string>();
    data.forEach(strategy => {
      const industry = strategy.industry_override || strategy.website_analysis.industry;
      industrySet.add(industry);
    });
    return Array.from(industrySet).sort();
  }, [data]);

  // Statystyki
  const stats = useMemo(() => {
    const totalCampaigns = filteredData.reduce((acc, item) => acc + item.campaigns_count, 0);
    const activeCampaigns = filteredData.reduce((acc, item) => acc + item.active_campaigns, 0);
    
    return {
      totalStrategies: filteredData.length,
      totalCampaigns,
      activeCampaigns
    };
  }, [filteredData]);

  const handleCardClick = (strategyId: string) => {
    // Opcjonalne przekierowanie do szczegółów strategii
    // window.location.href = `/strategies/${strategyId}`;
  };

  const renderStrategyCard = (strategy: StrategyWithStats) => (
    <StrategyCard
      key={strategy.id}
      id={strategy.id}
      title={strategy.title}
      websiteUrl={strategy.website_analysis.url}
      websiteDescription={strategy.website_analysis.description}
      industry={strategy.website_analysis.industry}
      industryOverride={strategy.industry_override}
      targetAudience={strategy.target_audience}
      budgetRecommendation={strategy.budget_recommendation}
      campaignsCount={strategy.campaigns_count}
      activeCampaigns={strategy.active_campaigns}
      createdAt={strategy.created_at}
      notes={strategy.notes}
      onDelete={deleteStrategy}
      onClick={handleCardClick}
    />
  );

  if (loading) {
    return (
      <PageContainer>
        <LoadingState message="Ładowanie strategii..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Strategie marketingowe"
        description="Zarządzaj strategiami i twórz dla nich kampanie reklamowe"
        icon={<BulbOutlined />}
        action={
          <div className="flex gap-3">
            <CreateButton
              to="/analyses"
              icon={<GlobalOutlined />}
            >
              Analizy WWW
            </CreateButton>
            <CreateButton
              to="/strategies/create"
              icon={<PlusOutlined />}
            >
              Nowa strategia
            </CreateButton>
          </div>
        }
      />

      {data.length === 0 ? (
        <EmptyState
          icon={<BulbOutlined />}
          title="Brak strategii marketingowych"
          description="Zacznij od stworzenia pierwszej strategii marketingowej na podstawie analizy strony WWW. Strategia pomoże Ci zaplanować skuteczne kampanie reklamowe."
          actionText="Utwórz pierwszą strategię"
          actionTo="/strategies/create"
        />
      ) : (
        <div className="space-y-8">
          {/* Statystyki */}
          <StrategiesStatsGrid
            totalStrategies={stats.totalStrategies}
            totalCampaigns={stats.totalCampaigns}
            activeCampaigns={stats.activeCampaigns}
          />

          {/* Filtry i przełącznik widoku */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
            <div className="flex-1 w-full">
              <StrategyFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedIndustry={selectedIndustry}
                onIndustryChange={setSelectedIndustry}
                industries={industries}
              />
            </div>
            <StrategyViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>

          {/* Lista/Tabela strategii */}
          <div>
            <SectionTitle 
              icon={<BulbOutlined />}
              subtitle={`${filteredData.length} z ${data.length} strategii${searchTerm || selectedIndustry ? ' (przefiltrowane)' : ''}`}
            >
              Lista strategii
            </SectionTitle>
            
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <BulbOutlined className="text-6xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Brak strategii pasujących do filtrów
                </h3>
                <p className="text-gray-500 mb-4">
                  Spróbuj zmienić kryteria wyszukiwania lub wyczyścić filtry
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    Wyczyść wyszukiwanie
                  </button>
                  <button
                    onClick={() => setSelectedIndustry('')}
                    className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    Wyczyść filtry
                  </button>
                </div>
              </div>
            ) : (
              <>
                {viewMode === 'cards' ? (
                  <div className="space-y-4">
                    {filteredData.map(renderStrategyCard)}
                  </div>
                ) : (
                  <StrategyTable
                    data={filteredData}
                    onDelete={deleteStrategy}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default StrategiesList;