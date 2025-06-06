// src/pages/wiseads/WebsiteAnalysisDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeftOutlined, 
  PlusOutlined, 
  BulbOutlined, 
  RocketOutlined,
  GlobalOutlined,
  TagsOutlined,
  CalendarOutlined,
  LinkOutlined,
  DollarOutlined,
  TeamOutlined,

} from "@ant-design/icons";
import { ActionButton } from "@/components/ui/website/ActionButton.js";
import { IndustryTag } from "@/components/ui/website/IndustryTag.js";
import { LoadingState } from "@/components/ui/website/LoadingState.js";
import { MainCard } from "@/components/ui/website/MainCard.js";
import { MetadataItem } from "@/components/ui/website/MetadataItem.js";
import { PageContainer } from "@/components/ui/website/PageContainer.js";
import { SectionTitle } from "@/components/ui/website/SectionTitle.js";
import DatabaseService from "./services/databaseService.js";
import { MarketingStrategy, GoogleAdsCampaign, WebsiteAnalysis } from "./types/database.js";



interface StrategyWithCampaigns extends MarketingStrategy {
  campaigns: GoogleAdsCampaign[];
}

const WebsiteAnalysisDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [strategies, setStrategies] = useState<StrategyWithCampaigns[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Pobierz analizę
      const analysisData = await DatabaseService.getWebsiteAnalysis(id);
      if (!analysisData) {
        setError("Nie znaleziono analizy");
        setLoading(false);
        return;
      }
      setAnalysis(analysisData);

      // Pobierz strategie z kampaniami
      const strategiesData = await DatabaseService.getStrategiesByWebsite(id);
      const strategiesWithCampaigns = await Promise.all(
        strategiesData.map(async (strategy) => {
          const campaigns = await DatabaseService.getCampaignsByStrategy(strategy.id);
          return {
            ...strategy,
            campaigns,
          };
        })
      );
      
      setStrategies(strategiesWithCampaigns);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active': return 'Aktywna';
      case 'paused': return 'Wstrzymana';
      case 'completed': return 'Zakończona';
      case 'draft': return 'Szkic';
      default: return status;
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState message="Ładowanie analizy..." />
      </PageContainer>
    );
  }

  if (error || !analysis) {
    return (
      <PageContainer>
        <MainCard>
          <div className="p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">
              <GlobalOutlined />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Błąd</h3>
            <p className="text-gray-600 mb-6">{error || "Nie znaleziono analizy"}</p>
            <ActionButton
              variant="primary"
              onClick={() => navigate("/analyses")}
            >
              Powrót do listy
            </ActionButton>
          </div>
        </MainCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer >
      <div className="space-y-8">
        {/* Header z nawigacją */}
        <div>
          <button
            onClick={() => navigate("/analyses")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeftOutlined />
            Powrót do analiz
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight flex items-center gap-4">
            <GlobalOutlined />
            Szczegóły analizy WWW
          </h1>
        </div>

        {/* Podstawowe informacje o stronie */}
        <MainCard>
          <div className="p-6">
            <SectionTitle icon={<GlobalOutlined />}>
              Informacje o stronie
            </SectionTitle>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <a 
                  href={analysis.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                >
                  <LinkOutlined />
                  {analysis.url}
                </a>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branża</label>
                <IndustryTag>{analysis.industry}</IndustryTag>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Data analizy</label>
                <MetadataItem icon={<CalendarOutlined />}>
                  {formatDate(analysis.created_at)}
                </MetadataItem>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
                <p className="text-gray-600 leading-relaxed">
                  {analysis.description}
                </p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TagsOutlined className="mr-1" />
                  Słowa kluczowe
                </label>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-2 py-1 text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MainCard>

        {/* Strategie */}
        <MainCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <SectionTitle icon={<BulbOutlined />}>
                Strategie marketingowe ({strategies.length})
              </SectionTitle>
              <ActionButton
                variant="primary"
                icon={<PlusOutlined />}
                to={`/strategies/create/${analysis.id}`}
                size="sm"
              >
                Nowa strategia
              </ActionButton>
            </div>
            
            {strategies.length === 0 ? (
              <div className="text-center py-16">
                <BulbOutlined className="text-6xl text-gray-300 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Brak strategii
                </h3>
                <p className="text-gray-600 mb-6">
                  Utwórz pierwszą strategię marketingową dla tej analizy
                </p>
                <ActionButton
                  variant="primary"
                  icon={<PlusOutlined />}
                  to={`/strategies/create/${analysis.id}`}
                >
                  Utwórz strategię
                </ActionButton>
              </div>
            ) : (
              <div className="space-y-6">
                {strategies.map((strategy) => (
                  <div 
                    key={strategy.id}
                    className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden"
                  >
                    {/* Header strategii */}
                    <div className="bg-white border-b border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <Link 
                            to={`/strategies/${strategy.id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {strategy.title}
                          </Link>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarOutlined />
                            <span className="font-medium">{formatCurrency(strategy.budget_recommendation)}</span>
                          </div>
                          <ActionButton
                            variant="primary"
                            icon={<PlusOutlined />}
                            to={`/campaigns/create/${strategy.id}`}
                            size="sm"
                          >
                            Nowa kampania
                          </ActionButton>
                        </div>
                      </div>
                    </div>
                    
                    {/* Treść strategii */}
                    <div className="p-4 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TeamOutlined className="text-gray-500" />
                          <span className="font-medium text-gray-700">Grupa docelowa:</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed pl-6">
                          {strategy.target_audience}
                        </p>
                      </div>
                      
                      {strategy.industry_override && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <TagsOutlined className="text-gray-500" />
                            <span className="font-medium text-gray-700">Branża (nadpisana):</span>
                          </div>
                          <div className="pl-6">
                            <span className="bg-orange-100 text-orange-800 border border-orange-200 rounded-lg px-3 py-1 text-sm font-medium">
                              {strategy.industry_override}
                            </span>
                          </div>
                        </div>
                      )}

                      {strategy.campaigns.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <RocketOutlined className="text-gray-500" />
                            <span className="font-medium text-gray-700">
                              Kampanie ({strategy.campaigns.length}):
                            </span>
                          </div>
                          <div className="pl-6 overflow-x-auto">
                            <table className="w-full bg-white rounded-lg border border-gray-200">
                              <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Nazwa kampanii</th>
                                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Status</th>
                                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Budżet</th>
                                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Data utworzenia</th>
                                </tr>
                              </thead>
                              <tbody>
                                {strategy.campaigns.map((campaign) => (
                                  <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-2 px-3 text-sm text-gray-900">
                                      {campaign.name}
                                    </td>
                                    <td className="py-2 px-3">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                                        {getStatusText(campaign.status)}
                                      </span>
                                    </td>
                                    <td className="py-2 px-3 text-sm text-gray-600">
                                      {campaign.budget_total ? formatCurrency(campaign.budget_total) : 'Nie ustawiono'}
                                    </td>
                                    <td className="py-2 px-3 text-sm text-gray-500">
                                      {formatDate(campaign.created_at)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </MainCard>
      </div>
    </PageContainer>
  );
};

export default WebsiteAnalysisDetail;