// src/pages/wiseads/StrategyDetail.tsx
import  { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeftOutlined, 
  PlusOutlined, 
  EditOutlined, 
  GlobalOutlined, 
  RocketOutlined,
  TagsOutlined,
  CalendarOutlined,
  DollarOutlined,
  TeamOutlined,
  FileTextOutlined,
  LinkOutlined
} from "@ant-design/icons";
import { GoogleAdsCampaign, StrategyWithWebsite } from "./types/database.js";
import { ActionButton } from "@/components/ui/website/ActionButton.js";
import { IndustryTag } from "@/components/ui/website/IndustryTag.js";
import { LoadingState } from "@/components/ui/website/LoadingState.js";
import { MainCard } from "@/components/ui/website/MainCard.js";
import { MetadataItem } from "@/components/ui/website/MetadataItem.js";
import { PageContainer } from "@/components/ui/website/PageContainer.js";
import { SectionTitle } from "@/components/ui/website/SectionTitle.js";
import DatabaseService from "./services/databaseService.js";


const StrategyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [strategy, setStrategy] = useState<StrategyWithWebsite | null>(null);
  const [campaigns, setCampaigns] = useState<GoogleAdsCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Pobierz strategię
      const strategyData = await DatabaseService.getMarketingStrategy(id);
      if (!strategyData) {
        setError("Nie znaleziono strategii");
        return;
      }
      setStrategy(strategyData);

      // Pobierz kampanie
      const campaignsData = await DatabaseService.getCampaignsByStrategy(id);
      setCampaigns(campaignsData);
      
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
      day: 'numeric'
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

  const getCampaignTypeText = (type: string): string => {
    switch (type) {
      case 'search': return 'Wyszukiwanie';
      case 'display': return 'Sieć reklamowa';
      case 'shopping': return 'Shopping';
      case 'video': return 'Video';
      case 'app': return 'Aplikacje';
      default: return type;
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState message="Ładowanie strategii..." />
      </PageContainer>
    );
  }

  if (error || !strategy) {
    return (
      <PageContainer>
        <MainCard>
          <div className="p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">
              <FileTextOutlined />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Błąd</h3>
            <p className="text-gray-600 mb-6">{error || "Nie znaleziono strategii"}</p>
            <ActionButton
              variant="primary"
              onClick={() => navigate("/strategies")}
            >
              Powrót do strategii
            </ActionButton>
          </div>
        </MainCard>
      </PageContainer>
    );
  }

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget_total || 0), 0);

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Header z nawigacją */}
        <div>
          <button
            onClick={() => navigate("/strategies")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeftOutlined />
            Powrót do strategii
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                {strategy.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-500">
                <CalendarOutlined />
                <span>Strategia marketingowa • {formatDate(strategy.created_at)}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <ActionButton
                variant="primary"
                icon={<PlusOutlined />}
                to={`/campaigns/create/${strategy.id}`}
              >
                Nowa kampania
              </ActionButton>
              <ActionButton
                variant="secondary"
                icon={<EditOutlined />}
                to={`/strategies/${strategy.id}/edit`}
              >
                Edytuj strategię
              </ActionButton>
            </div>
          </div>
        </div>

        {/* Podstawowe informacje */}
        <MainCard>
          <div className="p-6">
            <SectionTitle icon={<FileTextOutlined />}>
              Podstawowe informacje
            </SectionTitle>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branża</label>
                <div className="flex items-center gap-2">
                  <IndustryTag>
                    {strategy.industry_override || strategy.website_analysis.industry}
                  </IndustryTag>
                  {strategy.industry_override && (
                    <span className="text-sm text-gray-500">
                      (nadpisana z: {strategy.website_analysis.industry})
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sugerowany budżet</label>
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <DollarOutlined />
                  {formatCurrency(strategy.budget_recommendation)}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status kampanii</label>
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                    {activeCampaigns} aktywnych
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                    {campaigns.length} wszystkich
                  </span>
                  <span className="text-gray-600 text-sm">
                    Całkowity budżet: {formatCurrency(totalBudget)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </MainCard>

        {/* Powiązana strona WWW */}
        <MainCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <SectionTitle icon={<GlobalOutlined />}>
                Powiązana analiza WWW
              </SectionTitle>
              <Link 
                to={`/analyses/${strategy.website_analysis.id}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Zobacz szczegóły →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <a 
                  href={strategy.website_analysis.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                >
                  <LinkOutlined />
                  {strategy.website_analysis.url}
                </a>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data analizy</label>
                <MetadataItem icon={<CalendarOutlined />}>
                  {formatDate(strategy.website_analysis.created_at)}
                </MetadataItem>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
                <p className="text-gray-600 leading-relaxed">
                  {strategy.website_analysis.description}
                </p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TagsOutlined className="mr-1" />
                  Słowa kluczowe
                </label>
                <div className="flex flex-wrap gap-2">
                  {strategy.website_analysis.keywords.map((keyword, index) => (
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

        {/* Grupa docelowa */}
        <MainCard>
          <div className="p-6">
            <SectionTitle icon={<TeamOutlined />}>
              Grupa docelowa
            </SectionTitle>
            <p className="text-gray-600 leading-relaxed">
              {strategy.target_audience}
            </p>
          </div>
        </MainCard>

        {/* Notatki strategiczne */}
        <MainCard>
          <div className="p-6">
            <SectionTitle icon={<FileTextOutlined />}>
              Notatki strategiczne
            </SectionTitle>
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {strategy.notes}
            </div>
          </div>
        </MainCard>

        {/* Kampanie */}
        <MainCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <SectionTitle icon={<RocketOutlined />}>
                Kampanie Google Ads ({campaigns.length})
              </SectionTitle>
              <ActionButton
                variant="primary"
                icon={<PlusOutlined />}
                to={`/campaigns/create/${strategy.id}`}
                size="sm"
              >
                Nowa kampania
              </ActionButton>
            </div>
            
            {campaigns.length === 0 ? (
              <div className="text-center py-16">
                <RocketOutlined className="text-6xl text-gray-300 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Brak kampanii
                </h3>
                <p className="text-gray-600 mb-6">
                  Utwórz pierwszą kampanię dla tej strategii
                </p>
                <ActionButton
                  variant="primary"
                  icon={<PlusOutlined />}
                  to={`/campaigns/create/${strategy.id}`}
                >
                  Utwórz kampanię
                </ActionButton>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Nazwa kampanii</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Typ</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Budżet całkowity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Budżet dzienny</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Data utworzenia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Link 
                            to={`/campaigns/${campaign.id}/edit`}
                            className="font-medium text-blue-600 hover:text-blue-700"
                          >
                            {campaign.name}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {getCampaignTypeText(campaign.campaign_type)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                            {getStatusText(campaign.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {campaign.budget_total ? formatCurrency(campaign.budget_total) : 'Nie ustawiono'}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {campaign.budget_daily ? formatCurrency(campaign.budget_daily) : 'Nie ustawiono'}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {formatDate(campaign.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </MainCard>
      </div>
    </PageContainer>
  );
};

export default StrategyDetail;