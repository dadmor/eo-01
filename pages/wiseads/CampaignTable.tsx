// src/pages/CampaignTable.tsx
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";
import { createClient } from "@pankod/refine-supabase";
import {
  RocketOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  RightOutlined,
  GlobalOutlined,
  BulbOutlined,
  TagsOutlined,
  DollarOutlined,
  TeamOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { PageContainer } from "@/components/ui/website/PageContainer.js";
import { LoadingState } from "@/components/ui/website/LoadingState.js";
import { CreateButton } from "@/components/ui/website/CreateButton.js";
import { MainCard } from "@/components/ui/website/MainCard.js";
import { ActionButton } from "@/components/ui/website/ActionButton.js";
import { IndustryTag } from "@/components/ui/website/IndustryTag.js";
import { SectionTitle } from "@/components/ui/website/SectionTitle.js";


const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

interface WebsiteAnalysis {
  id: string;
  url: string;
  description: string;
  keywords: string[];
  industry: string;
  created_at: string;
}

interface MarketingStrategy {
  id: string;
  website_analysis_id: string;
  title: string;
  target_audience: string;
  budget_recommendation: number;
  notes: string;
  industry_override?: string;
  created_at: string;
}

interface GoogleAdsCampaign {
  id: string;
  strategy_id: string;
  name: string;
  status: "draft" | "active" | "paused" | "completed";
  budget_daily?: number;
  budget_total?: number;
  start_date?: string;
  end_date?: string;
  campaign_type: "search" | "display" | "shopping" | "video" | "app";
  target_locations?: string[];
  keywords_final?: string[];
  created_at: string;
}

interface CampaignWithRelations extends GoogleAdsCampaign {
  strategy: MarketingStrategy & {
    website_analysis: WebsiteAnalysis;
  };
}

const CampaignTable: React.FC = () => {
  const [data, setData] = useState<CampaignWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchCampaigns = async () => {
    setLoading(true);

    try {
      const { data: campaigns, error } = await supabaseClient
        .from("google_ads_campaigns")
        .select(
          `
          *,
          strategy:marketing_strategies(
            *,
            website_analysis:website_analyses(*)
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        message.error("Błąd pobierania kampanii: " + error.message);
        console.error("Błąd pobierania kampanii:", error);
      } else {
        setData(campaigns || []);
      }
    } catch (error) {
      message.error("Wystąpił błąd podczas pobierania kampanii");
      console.error("Błąd:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "paused":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "active":
        return "Aktywna";
      case "paused":
        return "Wstrzymana";
      case "completed":
        return "Zakończona";
      case "draft":
        return "Szkic";
      default:
        return status;
    }
  };

  const getCampaignTypeText = (type: string): string => {
    switch (type) {
      case "search":
        return "Wyszukiwanie";
      case "display":
        return "Sieć reklamowa";
      case "shopping":
        return "Shopping";
      case "video":
        return "Video";
      case "app":
        return "Aplikacje";
      default:
        return type;
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    try {
      const { error } = await supabaseClient
        .from("google_ads_campaigns")
        .delete()
        .eq("id", campaignId);

      if (error) {
        message.error("Nie udało się usunąć kampanii: " + error.message);
      } else {
        message.success("Kampania została usunięta");
        fetchCampaigns();
      }
    } catch (error) {
      message.error("Wystąpił błąd podczas usuwania kampanii");
      console.error("Błąd usuwania:", error);
    }
  };

  const toggleRowExpanded = (campaignId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(campaignId)) {
      newExpanded.delete(campaignId);
    } else {
      newExpanded.add(campaignId);
    }
    setExpandedRows(newExpanded);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(data.length / pageSize);

  if (loading) {
    return (
      <PageContainer>
        <LoadingState message="Ładowanie kampanii..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-4 tracking-tight">
              <RocketOutlined />
              Kampanie Google Ads
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              Zarządzaj swoimi kampaniami reklamowymi
            </p>
          </div>
          <CreateButton to="/campaigns/create" icon={<PlusOutlined />}>
            Nowa kampania
          </CreateButton>
        </div>

        {/* Tabela kampanii */}
        <MainCard>
          {data.length === 0 ? (
            <div className="text-center py-16 px-6">
              <RocketOutlined className="text-6xl text-gray-300 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Brak kampanii
              </h3>
              <p className="text-gray-600 mb-6">
                Utwórz pierwszą kampanię reklamową aby rozpocząć
              </p>
              <ActionButton
                variant="primary"
                icon={<PlusOutlined />}
                to="/campaigns/create"
              >
                Utwórz kampanię
              </ActionButton>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 w-8"></th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 min-w-[250px]">
                      Nazwa kampanii
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Typ
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Budżet całkowity
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Branża
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Data utworzenia
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((campaign) => (
                    <Fragment key={campaign.id}>
                      {/* Główny wiersz */}
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <button
                            onClick={() => toggleRowExpanded(campaign.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {expandedRows.has(campaign.id) ? (
                              <DownOutlined />
                            ) : (
                              <RightOutlined />
                            )}
                          </button>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900 mb-1">
                              {campaign.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {campaign.strategy.website_analysis.url}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              campaign.status
                            )}`}
                          >
                            {getStatusText(campaign.status)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {getCampaignTypeText(campaign.campaign_type)}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {campaign.budget_total
                            ? formatCurrency(campaign.budget_total)
                            : "Nie ustawiono"}
                        </td>
                        <td className="py-4 px-4">
                          <IndustryTag>
                            {campaign.strategy.industry_override ||
                              campaign.strategy.website_analysis.industry}
                          </IndustryTag>
                        </td>
                        <td className="py-4 px-4 text-gray-500">
                          {formatDate(campaign.created_at)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Link to={`/campaigns/edit/${campaign.id}`}>
                              <button className="text-blue-600 hover:text-blue-700 p-1">
                                <EditOutlined />
                              </button>
                            </Link>
                            <button
                              onClick={() => deleteCampaign(campaign.id)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <DeleteOutlined />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Rozwinięty wiersz */}
                      {expandedRows.has(campaign.id) && (
                        <tr>
                          <td colSpan={8} className="py-0 px-4">
                            <div className="bg-gray-50 rounded-lg p-6 my-2">
                              <div className="space-y-6">
                                {/* Analiza strony WWW */}
                                <div>
                                  <SectionTitle
                                    icon={<GlobalOutlined />}
                                    className="mb-4"
                                  >
                                    Analiza strony WWW
                                  </SectionTitle>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        URL
                                      </label>
                                      <a
                                        href={
                                          campaign.strategy.website_analysis.url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                                      >
                                        <LinkOutlined />
                                        {campaign.strategy.website_analysis.url}
                                      </a>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Branża
                                      </label>
                                      <IndustryTag>
                                        {campaign.strategy.industry_override ||
                                          campaign.strategy.website_analysis
                                            .industry}
                                      </IndustryTag>
                                    </div>
                                    <div className="md:col-span-2">
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Opis
                                      </label>
                                      <p className="text-gray-600 text-sm leading-relaxed">
                                        {
                                          campaign.strategy.website_analysis
                                            .description
                                        }
                                      </p>
                                    </div>
                                    <div className="md:col-span-2">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <TagsOutlined className="mr-1" />
                                        Słowa kluczowe
                                      </label>
                                      <div className="flex flex-wrap gap-1">
                                        {campaign.strategy.website_analysis.keywords.map(
                                          (keyword, index) => (
                                            <span
                                              key={index}
                                              className="bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-2 py-1 text-xs font-medium"
                                            >
                                              {keyword}
                                            </span>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Strategia marketingowa */}
                                <div>
                                  <SectionTitle
                                    icon={<BulbOutlined />}
                                    className="mb-4"
                                  >
                                    Strategia marketingowa
                                  </SectionTitle>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <TeamOutlined className="mr-1" />
                                        Grupa docelowa
                                      </label>
                                      <p className="text-gray-600 text-sm leading-relaxed">
                                        {campaign.strategy.target_audience}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Notatki strategiczne
                                      </label>
                                      <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-auto bg-white p-3 rounded border">
                                        {campaign.strategy.notes}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Szczegóły kampanii */}
                                <div>
                                  <SectionTitle
                                    icon={<RocketOutlined />}
                                    className="mb-4"
                                  >
                                    Szczegóły kampanii
                                  </SectionTitle>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Typ kampanii
                                      </label>
                                      <span className="text-gray-600 text-sm">
                                        {getCampaignTypeText(
                                          campaign.campaign_type
                                        )}
                                      </span>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <DollarOutlined className="mr-1" />
                                        Budżet dzienny
                                      </label>
                                      <span className="text-gray-600 text-sm">
                                        {campaign.budget_daily
                                          ? formatCurrency(
                                              campaign.budget_daily
                                            )
                                          : "Nie ustawiono"}
                                      </span>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Data rozpoczęcia
                                      </label>
                                      <span className="text-gray-600 text-sm">
                                        {campaign.start_date
                                          ? formatDate(campaign.start_date)
                                          : "Nie ustawiono"}
                                      </span>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Data zakończenia
                                      </label>
                                      <span className="text-gray-600 text-sm">
                                        {campaign.end_date
                                          ? formatDate(campaign.end_date)
                                          : "Nie ustawiono"}
                                      </span>
                                    </div>
                                    {campaign.target_locations?.length && (
                                      <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Lokalizacje docelowe
                                        </label>
                                        <span className="text-gray-600 text-sm">
                                          {campaign.target_locations.join(", ")}
                                        </span>
                                      </div>
                                    )}
                                    {campaign.keywords_final?.length && (
                                      <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                          <TagsOutlined className="mr-1" />
                                          Finalne słowa kluczowe
                                        </label>
                                        <div className="flex flex-wrap gap-1">
                                          {campaign.keywords_final.map(
                                            (keyword, index) => (
                                              <span
                                                key={index}
                                                className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-2 py-1 text-xs font-medium"
                                              >
                                                {keyword}
                                              </span>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginacja */}
          {data.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {(currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, data.length)} z {data.length}{" "}
                kampanii
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Poprzednia
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-600">
                    {currentPage} z {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Następna
                  </button>
                </div>
              </div>
            </div>
          )}
        </MainCard>
      </div>
    </PageContainer>
  );
};

export default CampaignTable;
