// src/types/database.ts

export interface WebsiteAnalysis {
    id: string;
    url: string;
    description: string;
    keywords: string[];
    industry: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface MarketingStrategy {
    id: string;
    website_analysis_id: string;
    title: string;
    target_audience: string;
    budget_recommendation: number;
    notes: string;
    industry_override?: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface GoogleAdsCampaign {
    id: string;
    strategy_id: string;
    name: string;
    status: 'draft' | 'active' | 'paused' | 'completed';
    budget_daily?: number;
    budget_total?: number;
    start_date?: string;
    end_date?: string;
    campaign_type: 'search' | 'display' | 'shopping' | 'video' | 'app';
    target_locations?: string[];
    ad_groups?: any; // JSON structure for ad groups
    keywords_final?: string[];
    created_at: string;
    updated_at: string;
  }
  
  // Typ dla joinów z relacjami
  export interface CampaignWithRelations extends GoogleAdsCampaign {
    strategy: MarketingStrategy & {
      website_analysis: WebsiteAnalysis;
    };
  }
  
  export interface StrategyWithWebsite extends MarketingStrategy {
    website_analysis: WebsiteAnalysis;
  }
  
  // Typy dla insertu (bez automatycznych pól)
  export interface WebsiteAnalysisInsert {
    url: string;
    description: string;
    keywords: string[];
    industry: string;
  }
  
  export interface MarketingStrategyInsert {
    website_analysis_id: string;
    title: string;
    target_audience: string;
    budget_recommendation: number;
    notes: string;
    industry_override?: string;
  }
  
  export interface GoogleAdsCampaignInsert {
    strategy_id: string;
    name: string;
    status?: 'draft' | 'active' | 'paused' | 'completed';
    budget_daily?: number;
    budget_total?: number;
    start_date?: string;
    end_date?: string;
    campaign_type?: 'search' | 'display' | 'shopping' | 'video' | 'app';
    target_locations?: string[];
    ad_groups?: any;
    keywords_final?: string[];
  }
  
  // Pomocnicze typy dla UI
  export interface CampaignDraft {
    url: string;
    description: string;
    keywords: string[];
    industry: string;
    title: string;
    targetAudience: string;
    budgetRecommendation: number;
    notes: string;
  }
  
  // Enum-y dla lepszej obsługi statusów i typów
  export const CampaignStatus = {
    DRAFT: 'draft',
    ACTIVE: 'active',
    PAUSED: 'paused',
    COMPLETED: 'completed',
  } as const;
  
  export const CampaignType = {
    SEARCH: 'search',
    DISPLAY: 'display',
    SHOPPING: 'shopping',
    VIDEO: 'video',
    APP: 'app',
  } as const;
  
  export type CampaignStatusType = typeof CampaignStatus[keyof typeof CampaignStatus];
  export type CampaignTypeType = typeof CampaignType[keyof typeof CampaignType];