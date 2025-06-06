// src/services/databaseService.ts
import { createClient } from "@pankod/refine-supabase";
import { 
  CampaignWithRelations, 
  GoogleAdsCampaign, 
  GoogleAdsCampaignInsert, 
  MarketingStrategy, 
  MarketingStrategyInsert, 
  StrategyWithWebsite, 
  WebsiteAnalysis, 
  WebsiteAnalysisInsert 
} from "../types/database.js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// ==================== INTERFACES ====================

interface ActiveCampaignInsert {
  campaign_id: string;
  activated_at: string;
  daily_budget?: number;
  total_budget?: number;
  current_spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface ActiveCampaign extends ActiveCampaignInsert {
  id: string;
  deactivated_at?: string;
  cost_per_click?: number;
  conversion_rate?: number;
  updated_at: string;
}

interface CampaignActivationData {
  daily_budget?: number;
  total_budget?: number;
  keywords: string[];
  target_locations: string[];
}

interface AdGroup {
  id: string;
  campaign_id: string;
  name: string;
  status: string;
  default_bid?: number;
  created_at: string;
  updated_at: string;
}

interface AdGroupInsert {
  campaign_id: string;
  name: string;
  status?: string;
  default_bid?: number;
}

interface TextAd {
  id: string;
  ad_group_id: string;
  headline1: string;
  headline2?: string;
  headline3?: string;
  description1: string;
  description2?: string;
  final_url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface TextAdInsert {
  ad_group_id: string;
  headline1: string;
  headline2?: string;
  headline3?: string;
  description1: string;
  description2?: string;
  final_url: string;
  status?: string;
}

interface CampaignKeyword {
  id: string;
  campaign_id: string;
  ad_group_id?: string;
  keyword: string;
  match_type: 'broad' | 'phrase' | 'exact';
  bid_amount?: number;
  status: string;
  quality_score?: number;
  created_at: string;
  updated_at: string;
}

interface CampaignKeywordInsert {
  campaign_id: string;
  ad_group_id?: string;
  keyword: string;
  match_type?: 'broad' | 'phrase' | 'exact';
  bid_amount?: number;
  status?: string;
  quality_score?: number;
}

interface EnhancedStats {
  totalWebsites: number;
  totalStrategies: number;
  totalCampaigns: number;
  activeCampaigns: number;
  draftCampaigns: number;
  pausedCampaigns: number;
  completedCampaigns: number;
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  avgCPC: number;
  avgConversionRate: number;
}

interface CampaignWithStats extends GoogleAdsCampaign {
  strategy_title?: string;
  website_url?: string;
  current_spend?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  activated_at?: string;
  avg_cpc?: number;
  conversion_rate_percent?: number;
}

export class DatabaseService {
  // ==================== WEBSITE ANALYSES ====================
  
  static async createWebsiteAnalysis(data: WebsiteAnalysisInsert): Promise<WebsiteAnalysis> {
    const { data: result, error } = await supabaseClient
      .from("website_analyses")
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(`Błąd podczas zapisywania analizy WWW: ${error.message}`);
    }

    return result;
  }

  static async getWebsiteAnalysis(id: string): Promise<WebsiteAnalysis | null> {
    const { data, error } = await supabaseClient
      .from("website_analyses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Błąd podczas pobierania analizy WWW: ${error.message}`);
    }

    return data;
  }

  static async getAllWebsiteAnalyses(): Promise<WebsiteAnalysis[]> {
    const { data, error } = await supabaseClient
      .from("website_analyses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Błąd podczas pobierania analiz WWW: ${error.message}`);
    }

    return data || [];
  }

  static async updateWebsiteAnalysis(id: string, updates: Partial<WebsiteAnalysisInsert>): Promise<WebsiteAnalysis> {
    const { data, error } = await supabaseClient
      .from("website_analyses")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Błąd podczas aktualizacji analizy WWW: ${error.message}`);
    }

    return data;
  }

  static async deleteWebsiteAnalysis(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("website_analyses")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Błąd podczas usuwania analizy WWW: ${error.message}`);
    }
  }

  // ==================== MARKETING STRATEGIES ====================

  static async createMarketingStrategy(data: MarketingStrategyInsert): Promise<MarketingStrategy> {
    const { data: result, error } = await supabaseClient
      .from("marketing_strategies")
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(`Błąd podczas zapisywania strategii: ${error.message}`);
    }

    return result;
  }

  static async getMarketingStrategy(id: string): Promise<StrategyWithWebsite | null> {
    const { data, error } = await supabaseClient
      .from("marketing_strategies")
      .select(`
        *,
        website_analysis:website_analyses(*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Błąd podczas pobierania strategii: ${error.message}`);
    }

    return data;
  }

  static async getStrategiesByWebsite(websiteAnalysisId: string): Promise<MarketingStrategy[]> {
    const { data, error } = await supabaseClient
      .from("marketing_strategies")
      .select("*")
      .eq("website_analysis_id", websiteAnalysisId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Błąd podczas pobierania strategii: ${error.message}`);
    }

    return data || [];
  }

  static async getAllMarketingStrategies(): Promise<StrategyWithWebsite[]> {
    const { data, error } = await supabaseClient
      .from("marketing_strategies")
      .select(`
        *,
        website_analysis:website_analyses(*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Błąd podczas pobierania strategii: ${error.message}`);
    }

    return data || [];
  }

  static async updateMarketingStrategy(id: string, updates: Partial<MarketingStrategyInsert>): Promise<MarketingStrategy> {
    const { data, error } = await supabaseClient
      .from("marketing_strategies")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Błąd podczas aktualizacji strategii: ${error.message}`);
    }

    return data;
  }

  static async deleteMarketingStrategy(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("marketing_strategies")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Błąd podczas usuwania strategii: ${error.message}`);
    }
  }

  // ==================== GOOGLE ADS CAMPAIGNS ====================

  static async createGoogleAdsCampaign(data: GoogleAdsCampaignInsert): Promise<GoogleAdsCampaign> {
    const { data: result, error } = await supabaseClient
      .from("google_ads_campaigns")
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(`Błąd podczas zapisywania kampanii: ${error.message}`);
    }

    return result;
  }

  static async getGoogleAdsCampaign(id: string): Promise<CampaignWithRelations | null> {
    const { data, error } = await supabaseClient
      .from("google_ads_campaigns")
      .select(`
        *,
        strategy:marketing_strategies(
          *,
          website_analysis:website_analyses(*)
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Błąd podczas pobierania kampanii: ${error.message}`);
    }

    return data;
  }

  static async getAllGoogleAdsCampaigns(): Promise<CampaignWithRelations[]> {
    const { data, error } = await supabaseClient
      .from("google_ads_campaigns")
      .select(`
        *,
        strategy:marketing_strategies(
          *,
          website_analysis:website_analyses(*)
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Błąd podczas pobierania kampanii: ${error.message}`);
    }

    return data || [];
  }

  static async getCampaignsByStrategy(strategyId: string): Promise<GoogleAdsCampaign[]> {
    const { data, error } = await supabaseClient
      .from("google_ads_campaigns")
      .select("*")
      .eq("strategy_id", strategyId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Błąd podczas pobierania kampanii: ${error.message}`);
    }

    return data || [];
  }

  static async updateGoogleAdsCampaign(id: string, updates: Partial<GoogleAdsCampaignInsert>): Promise<GoogleAdsCampaign> {
    const { data, error } = await supabaseClient
      .from("google_ads_campaigns")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Błąd podczas aktualizacji kampanii: ${error.message}`);
    }

    return data;
  }

  static async deleteGoogleAdsCampaign(id: string): Promise<void> {
    // Najpierw usuń z active_campaigns jeśli istnieje
    await this.deactivateCampaign(id);
    
    const { error } = await supabaseClient
      .from("google_ads_campaigns")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Błąd podczas usuwania kampanii: ${error.message}`);
    }
  }

  // ==================== ACTIVE CAMPAIGNS ====================

  static async activateCampaign(campaignId: string, data: CampaignActivationData): Promise<void> {
    try {
      // 1. Sprawdź czy kampania już nie jest aktywna
      const existingActive = await this.getActiveCampaignStats(campaignId);
      if (existingActive) {
        console.log('Kampania jest już aktywna');
        return;
      }

      // 2. Dodaj do tabeli active_campaigns
      const { error: activeError } = await supabaseClient
        .from("active_campaigns")
        .insert([{
          campaign_id: campaignId,
          activated_at: new Date().toISOString(),
          daily_budget: data.daily_budget,
          total_budget: data.total_budget,
          current_spend: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0
        }]);

      if (activeError) {
        throw new Error(`Błąd podczas aktywacji kampanii: ${activeError.message}`);
      }

      // 3. Aktualizuj status kampanii na 'active'
      await this.updateGoogleAdsCampaign(campaignId, { status: 'active' });

      // 4. Wygeneruj zawartość kampanii (opcjonalnie)
      await this.generateCampaignContent(campaignId, data);

      console.log(`Kampania ${campaignId} została aktywowana`);

    } catch (error: any) {
      throw new Error(`Błąd podczas aktywacji kampanii: ${error.message}`);
    }
  }

  static async deactivateCampaign(campaignId: string): Promise<void> {
    const { error } = await supabaseClient
      .from("active_campaigns")
      .update({ deactivated_at: new Date().toISOString() })
      .eq("campaign_id", campaignId);

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Błąd podczas dezaktywacji kampanii: ${error.message}`);
    }
  }

  static async getActiveCampaignStats(campaignId: string): Promise<ActiveCampaign | null> {
    const { data, error } = await supabaseClient
      .from("active_campaigns")
      .select("*")
      .eq("campaign_id", campaignId)
      .is("deactivated_at", null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Błąd podczas pobierania statystyk: ${error.message}`);
    }

    return data;
  }

  static async getAllActiveCampaigns(): Promise<ActiveCampaign[]> {
    const { data, error } = await supabaseClient
      .from("active_campaigns")
      .select("*")
      .is("deactivated_at", null)
      .order("activated_at", { ascending: false });

    if (error) {
      throw new Error(`Błąd podczas pobierania aktywnych kampanii: ${error.message}`);
    }

    return data || [];
  }

  static async updateCampaignStats(campaignId: string, stats: {
    current_spend?: number;
    impressions?: number;
    clicks?: number;
    conversions?: number;
  }): Promise<void> {
    // Oblicz dodatkowe metryki
    const updateData: any = { ...stats };
    
    if (stats.current_spend && stats.clicks && stats.clicks > 0) {
      updateData.cost_per_click = Number((stats.current_spend / stats.clicks).toFixed(2));
    }
    
    if (stats.conversions && stats.clicks && stats.clicks > 0) {
      updateData.conversion_rate = Number((stats.conversions / stats.clicks).toFixed(4));
    }

    const { error } = await supabaseClient
      .from("active_campaigns")
      .update(updateData)
      .eq("campaign_id", campaignId);

    if (error) {
      throw new Error(`Błąd podczas aktualizacji statystyk: ${error.message}`);
    }
  }

  // ==================== CAMPAIGN STATUS MANAGEMENT ====================

  static async changeCampaignStatus(campaignId: string, newStatus: 'draft' | 'active' | 'paused' | 'completed'): Promise<void> {
    try {
      // Aktualizuj status w tabeli głównej
      await this.updateGoogleAdsCampaign(campaignId, { status: newStatus });

      // Zarządzaj active_campaigns w zależności od statusu
      if (newStatus === 'active') {
        // Sprawdź czy kampania już nie jest aktywna
        const existingActive = await this.getActiveCampaignStats(campaignId);
        if (!existingActive) {
          // Pobierz dane kampanii do aktywacji
          const campaign = await this.getGoogleAdsCampaign(campaignId);
          if (campaign) {
            await this.activateCampaign(campaignId, {
              daily_budget: campaign.budget_daily,
              total_budget: campaign.budget_total,
              keywords: campaign.keywords_final || [],
              target_locations: campaign.target_locations || []
            });
          }
        }
      } else {
        // Dezaktywuj jeśli status nie jest 'active'
        await this.deactivateCampaign(campaignId);
      }

    } catch (error: any) {
      throw new Error(`Błąd podczas zmiany statusu kampanii: ${error.message}`);
    }
  }

  // ==================== CAMPAIGN CONTENT GENERATION ====================

  static async generateCampaignContent(campaignId: string, data: CampaignActivationData): Promise<void> {
    try {
      console.log(`Generowanie zawartości dla kampanii ${campaignId}:`, {
        keywords: data.keywords.length,
        locations: data.target_locations.length,
        budget: data.total_budget
      });

      // Generuj grupy reklamowe na podstawie słów kluczowych
      const adGroups = await this.generateAdGroups(campaignId, data.keywords);
      
      // Generuj reklamy tekstowe dla każdej grupy
      for (const adGroup of adGroups) {
        await this.generateTextAdsForGroup(adGroup.id, data.keywords);
      }

      // Dodaj słowa kluczowe z stawkami
      await this.generateCampaignKeywords(campaignId, data.keywords);
      
    } catch (error: any) {
      console.error('Błąd podczas generowania zawartości:', error);
      // Nie rzucaj błędu - kampania powinna zostać utworzona nawet jeśli generowanie nie powiodło się
    }
  }

  private static async generateAdGroups(campaignId: string, keywords: string[]): Promise<AdGroup[]> {
    const adGroups: AdGroup[] = [];
    
    // Utwórz grupy reklamowe - max 5 grup dla każdej kampanii
    const groupCount = Math.min(keywords.length, 5);
    const keywordsPerGroup = Math.ceil(keywords.length / groupCount);
    
    for (let i = 0; i < groupCount; i++) {
      const groupKeywords = keywords.slice(i * keywordsPerGroup, (i + 1) * keywordsPerGroup);
      const mainKeyword = groupKeywords[0];
      
      try {
        const adGroup = await this.createAdGroup({
          campaign_id: campaignId,
          name: `Grupa: ${mainKeyword}`,
          status: 'active',
          default_bid: 2.50
        });
        
        adGroups.push(adGroup);
      } catch (error) {
        console.error(`Błąd podczas tworzenia grupy reklamowej ${i + 1}:`, error);
      }
    }
    
    return adGroups;
  }

  private static async generateTextAdsForGroup(adGroupId: string, keywords: string[]): Promise<void> {
    // Generuj 2-3 reklamy na grupę
    const adCount = Math.min(keywords.length, 3);
    
    for (let i = 0; i < adCount; i++) {
      const keyword = keywords[i] || keywords[0];
      
      try {
        await this.createTextAd({
          ad_group_id: adGroupId,
          headline1: `${keyword} - Najlepsza oferta`,
          headline2: `Sprawdź ${keyword} już dziś`,
          description1: `Odkryj najlepsze rozwiązania związane z ${keyword}. Skontaktuj się z nami!`,
          final_url: 'https://example.com',
          status: 'active'
        });
      } catch (error) {
        console.error(`Błąd podczas tworzenia reklamy ${i + 1}:`, error);
      }
    }
  }

  private static async generateCampaignKeywords(campaignId: string, keywords: string[]): Promise<void> {
    for (const keyword of keywords) {
      try {
        await this.createCampaignKeyword({
          campaign_id: campaignId,
          keyword: keyword,
          match_type: 'broad',
          bid_amount: 2.50,
          status: 'active'
        });
      } catch (error) {
        console.error(`Błąd podczas dodawania słowa kluczowego "${keyword}":`, error);
      }
    }
  }

  // ==================== AD GROUPS ====================

  static async createAdGroup(data: AdGroupInsert): Promise<AdGroup> {
    const { data: result, error } = await supabaseClient
      .from("ad_groups")
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(`Błąd podczas tworzenia grupy reklamowej: ${error.message}`);
    }

    return result;
  }

  static async getAdGroupsByCampaign(campaignId: string): Promise<AdGroup[]> {
    const { data, error } = await supabaseClient
      .from("ad_groups")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Błąd podczas pobierania grup reklamowych: ${error.message}`);
    }

    return data || [];
  }

  static async updateAdGroup(id: string, updates: Partial<AdGroupInsert>): Promise<AdGroup> {
    const { data, error } = await supabaseClient
      .from("ad_groups")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Błąd podczas aktualizacji grupy reklamowej: ${error.message}`);
    }

    return data;
  }

  static async deleteAdGroup(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("ad_groups")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Błąd podczas usuwania grupy reklamowej: ${error.message}`);
    }
  }

  // ==================== TEXT ADS ====================

  static async createTextAd(data: TextAdInsert): Promise<TextAd> {
    const { data: result, error } = await supabaseClient
      .from("text_ads")
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(`Błąd podczas tworzenia reklamy: ${error.message}`);
    }

    return result;
  }

  static async getTextAdsByAdGroup(adGroupId: string): Promise<TextAd[]> {
    const { data, error } = await supabaseClient
      .from("text_ads")
      .select("*")
      .eq("ad_group_id", adGroupId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Błąd podczas pobierania reklam: ${error.message}`);
    }

    return data || [];
  }

  static async updateTextAd(id: string, updates: Partial<TextAdInsert>): Promise<TextAd> {
    const { data, error } = await supabaseClient
      .from("text_ads")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Błąd podczas aktualizacji reklamy: ${error.message}`);
    }

    return data;
  }

  static async deleteTextAd(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("text_ads")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Błąd podczas usuwania reklamy: ${error.message}`);
    }
  }

  // ==================== CAMPAIGN KEYWORDS ====================

  static async createCampaignKeyword(data: CampaignKeywordInsert): Promise<CampaignKeyword> {
    const { data: result, error } = await supabaseClient
      .from("campaign_keywords")
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(`Błąd podczas dodawania słowa kluczowego: ${error.message}`);
    }

    return result;
  }

  static async getCampaignKeywords(campaignId: string): Promise<CampaignKeyword[]> {
    const { data, error } = await supabaseClient
      .from("campaign_keywords")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Błąd podczas pobierania słów kluczowych: ${error.message}`);
    }

    return data || [];
  }

  static async updateCampaignKeyword(id: string, updates: Partial<CampaignKeywordInsert>): Promise<CampaignKeyword> {
    const { data, error } = await supabaseClient
      .from("campaign_keywords")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Błąd podczas aktualizacji słowa kluczowego: ${error.message}`);
    }

    return data;
  }

  static async deleteCampaignKeyword(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("campaign_keywords")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Błąd podczas usuwania słowa kluczowego: ${error.message}`);
    }
  }

  // ==================== CAMPAIGNS WITH STATS ====================

  static async getCampaignsWithStats(): Promise<CampaignWithStats[]> {
    const { data, error } = await supabaseClient
      .from("campaigns_with_stats")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Błąd podczas pobierania kampanii ze statystykami: ${error.message}`);
    }

    return data || [];
  }

  static async getCampaignWithStats(campaignId: string): Promise<CampaignWithStats | null> {
    const { data, error } = await supabaseClient
      .from("campaigns_with_stats")
      .select("*")
      .eq("id", campaignId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Błąd podczas pobierania kampanii ze statystykami: ${error.message}`);
    }

    return data;
  }

  // ==================== COMPLEX QUERIES ====================

  static async getFullCampaignHierarchy(): Promise<{
    websites: (WebsiteAnalysis & {
      strategies: (MarketingStrategy & {
        campaigns: GoogleAdsCampaign[];
      })[];
    })[];
  }> {
    // Pobierz wszystkie analizy WWW
    const websites = await this.getAllWebsiteAnalyses();
    
    const result = await Promise.all(
      websites.map(async (website) => {
        // Pobierz strategie dla każdej analizy
        const strategies = await this.getStrategiesByWebsite(website.id);
        
        const strategiesWithCampaigns = await Promise.all(
          strategies.map(async (strategy) => {
            // Pobierz kampanie dla każdej strategii
            const campaigns = await this.getCampaignsByStrategy(strategy.id);
            return {
              ...strategy,
              campaigns,
            };
          })
        );

        return {
          ...website,
          strategies: strategiesWithCampaigns,
        };
      })
    );

    return { websites: result };
  }

  static async searchCampaigns(query: string): Promise<CampaignWithRelations[]> {
    const { data, error } = await supabaseClient
      .from("google_ads_campaigns")
      .select(`
        *,
        strategy:marketing_strategies(
          *,
          website_analysis:website_analyses(*)
        )
      `)
      .or(`name.ilike.%${query}%,strategy.title.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Błąd podczas wyszukiwania kampanii: ${error.message}`);
    }

    return data || [];
  }

  // ==================== ENHANCED STATISTICS ====================

  static async getEnhancedStats(): Promise<EnhancedStats> {
    const [
      { count: websiteCount },
      { count: strategyCount },
      { count: campaignCount },
      { count: activeCount },
      { count: draftCount },
      { count: pausedCount },
      { count: completedCount },
      activeCampaignsData
    ] = await Promise.all([
      supabaseClient.from("website_analyses").select("*", { count: "exact", head: true }),
      supabaseClient.from("marketing_strategies").select("*", { count: "exact", head: true }),
      supabaseClient.from("google_ads_campaigns").select("*", { count: "exact", head: true }),
      supabaseClient.from("google_ads_campaigns").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabaseClient.from("google_ads_campaigns").select("*", { count: "exact", head: true }).eq("status", "draft"),
      supabaseClient.from("google_ads_campaigns").select("*", { count: "exact", head: true }).eq("status", "paused"),
      supabaseClient.from("google_ads_campaigns").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabaseClient.from("active_campaigns").select("current_spend, impressions, clicks, conversions").is("deactivated_at", null)
    ]);

    // Oblicz sumy z aktywnych kampanii
    const totals = (activeCampaignsData.data || []).reduce((acc, campaign) => ({
      spend: acc.spend + (campaign.current_spend || 0),
      impressions: acc.impressions + (campaign.impressions || 0),
      clicks: acc.clicks + (campaign.clicks || 0),
      conversions: acc.conversions + (campaign.conversions || 0)
    }), { spend: 0, impressions: 0, clicks: 0, conversions: 0 });

    // Oblicz średnie metryki
    const avgCPC = totals.clicks > 0 ? Number((totals.spend / totals.clicks).toFixed(2)) : 0;
    const avgConversionRate = totals.clicks > 0 ? Number(((totals.conversions / totals.clicks) * 100).toFixed(2)) : 0;

    return {
      totalWebsites: websiteCount || 0,
      totalStrategies: strategyCount || 0,
      totalCampaigns: campaignCount || 0,
      activeCampaigns: activeCount || 0,
      draftCampaigns: draftCount || 0,
      pausedCampaigns: pausedCount || 0,
      completedCampaigns: completedCount || 0,
      totalSpend: totals.spend,
      totalImpressions: totals.impressions,
      totalClicks: totals.clicks,
      totalConversions: totals.conversions,
      avgCPC,
      avgConversionRate
    };
  }

  // ==================== UTILITY METHODS ====================

  static async getStats(): Promise<{
    totalWebsites: number;
    totalStrategies: number;
    totalCampaigns: number;
    activeCampaigns: number;
    draftCampaigns: number;
  }> {
    const [
      { count: websiteCount },
      { count: strategyCount },
      { count: campaignCount },
      { count: activeCount },
      { count: draftCount }
    ] = await Promise.all([
      supabaseClient.from("website_analyses").select("*", { count: "exact", head: true }),
      supabaseClient.from("marketing_strategies").select("*", { count: "exact", head: true }),
      supabaseClient.from("google_ads_campaigns").select("*", { count: "exact", head: true }),
      supabaseClient.from("google_ads_campaigns").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabaseClient.from("google_ads_campaigns").select("*", { count: "exact", head: true }).eq("status", "draft"),
    ]);

    return {
      totalWebsites: websiteCount || 0,
      totalStrategies: strategyCount || 0,
      totalCampaigns: campaignCount || 0,
      activeCampaigns: activeCount || 0,
      draftCampaigns: draftCount || 0,
    };
  }

  // ==================== BULK OPERATIONS ====================

  static async bulkUpdateCampaignStatus(campaignIds: string[], newStatus: 'draft' | 'active' | 'paused' | 'completed'): Promise<void> {
    try {
      // Aktualizuj wszystkie kampanie
      const { error } = await supabaseClient
        .from("google_ads_campaigns")
        .update({ status: newStatus })
        .in("id", campaignIds);

      if (error) {
        throw new Error(`Błąd podczas masowej aktualizacji statusu: ${error.message}`);
      }

      // Zarządzaj active_campaigns dla każdej kampanii
      for (const campaignId of campaignIds) {
        if (newStatus === 'active') {
          const campaign = await this.getGoogleAdsCampaign(campaignId);
          if (campaign) {
            await this.activateCampaign(campaignId, {
              daily_budget: campaign.budget_daily,
              total_budget: campaign.budget_total,
              keywords: campaign.keywords_final || [],
              target_locations: campaign.target_locations || []
            });
          }
        } else {
          await this.deactivateCampaign(campaignId);
        }
      }
    } catch (error: any) {
      throw new Error(`Błąd podczas masowej zmiany statusu: ${error.message}`);
    }
  }

  static async bulkDeleteCampaigns(campaignIds: string[]): Promise<void> {
    try {
      // Najpierw dezaktywuj wszystkie kampanie
      for (const campaignId of campaignIds) {
        await this.deactivateCampaign(campaignId);
      }

      // Usuń kampanie
      const { error } = await supabaseClient
        .from("google_ads_campaigns")
        .delete()
        .in("id", campaignIds);

      if (error) {
        throw new Error(`Błąd podczas masowego usuwania kampanii: ${error.message}`);
      }
    } catch (error: any) {
      throw new Error(`Błąd podczas masowego usuwania: ${error.message}`);
    }
  }

  // ==================== REPORTING METHODS ====================

  static async getCampaignPerformanceReport(campaignId: string, dateFrom?: string, dateTo?: string): Promise<{
    campaign: CampaignWithStats;
    dailyStats: any[];
    keywordPerformance: any[];
    adGroupPerformance: any[];
  }> {
    try {
      // Pobierz podstawowe dane kampanii
      const campaign = await this.getCampaignWithStats(campaignId);
      if (!campaign) {
        throw new Error('Kampania nie została znaleziona');
      }

      // Pobierz dodatkowe dane dla raportu
      const [adGroups, keywords] = await Promise.all([
        this.getAdGroupsByCampaign(campaignId),
        this.getCampaignKeywords(campaignId)
      ]);

      // Dla uproszczenia - zwracamy podstawowe dane
      // W przyszłości można dodać szczegółowe statystyki dzienne
      return {
        campaign,
        dailyStats: [], // Tutaj mogłyby być statystyki dzienne
        keywordPerformance: keywords.map(kw => ({
          keyword: kw.keyword,
          match_type: kw.match_type,
          bid_amount: kw.bid_amount,
          quality_score: kw.quality_score,
          status: kw.status
        })),
        adGroupPerformance: adGroups.map(ag => ({
          name: ag.name,
          status: ag.status,
          default_bid: ag.default_bid
        }))
      };
    } catch (error: any) {
      throw new Error(`Błąd podczas generowania raportu: ${error.message}`);
    }
  }

  static async getAccountSummary(): Promise<{
    overview: EnhancedStats;
    recentCampaigns: CampaignWithStats[];
    topPerformingCampaigns: CampaignWithStats[];
    campaignsByStatus: { [key: string]: number };
  }> {
    try {
      const [overview, allCampaigns] = await Promise.all([
        this.getEnhancedStats(),
        this.getCampaignsWithStats()
      ]);

      // Najnowsze kampanie (ostatnie 5)
      const recentCampaigns = allCampaigns.slice(0, 5);

      // Najlepiej performujące kampanie (sortuj po konwersjach)
      const topPerformingCampaigns = allCampaigns
        .filter(c => c.conversions && c.conversions > 0)
        .sort((a, b) => (b.conversions || 0) - (a.conversions || 0))
        .slice(0, 5);

      // Kampanie pogrupowane według statusu
      const campaignsByStatus = allCampaigns.reduce((acc, campaign) => {
        acc[campaign.status] = (acc[campaign.status] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      return {
        overview,
        recentCampaigns,
        topPerformingCampaigns,
        campaignsByStatus
      };
    } catch (error: any) {
      throw new Error(`Błąd podczas pobierania podsumowania konta: ${error.message}`);
    }
  }

  // ==================== VALIDATION METHODS ====================

  static async validateCampaignData(data: GoogleAdsCampaignInsert): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Sprawdź czy strategia istnieje
    const strategy = await this.getMarketingStrategy(data.strategy_id);
    if (!strategy) {
      errors.push('Wybrana strategia nie istnieje');
    }

    // Sprawdź nazwę kampanii
    if (!data.name || data.name.trim().length < 3) {
      errors.push('Nazwa kampanii musi mieć co najmniej 3 znaki');
    }

    // Sprawdź budżet
    if (data.budget_daily && data.budget_daily < 1) {
      errors.push('Budżet dzienny musi być większy niż 1 PLN');
    }

    if (data.budget_total && data.budget_total < 10) {
      errors.push('Budżet całkowity musi być większy niż 10 PLN');
    }

    // Sprawdź czy budżet dzienny nie przekracza całkowitego
    if (data.budget_daily && data.budget_total && data.budget_daily > data.budget_total) {
      errors.push('Budżet dzienny nie może być większy niż całkowity');
    }

    // Ostrzeżenia
    if (data.keywords_final && data.keywords_final.length === 0) {
      warnings.push('Kampania nie ma słów kluczowych');
    }

    if (data.target_locations && data.target_locations.length === 0) {
      warnings.push('Kampania nie ma określonych lokalizacji docelowych');
    }

    if (data.budget_total && data.budget_total > 10000) {
      warnings.push('Budżet kampanii jest bardzo wysoki');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // ==================== CLEANUP METHODS ====================

  static async cleanupInactiveCampaigns(): Promise<{
    deactivatedCount: number;
    deletedCount: number;
  }> {
    try {
      let deactivatedCount = 0;
      let deletedCount = 0;

      // Znajdź kampanie które są aktywne ale nie mają ruchu przez 30 dni
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: stagnantCampaigns } = await supabaseClient
        .from("active_campaigns")
        .select("campaign_id, impressions, clicks")
        .lt("activated_at", thirtyDaysAgo.toISOString())
        .eq("impressions", 0)
        .eq("clicks", 0);

      // Dezaktywuj stagnujące kampanie
      if (stagnantCampaigns && stagnantCampaigns.length > 0) {
        for (const campaign of stagnantCampaigns) {
          await this.changeCampaignStatus(campaign.campaign_id, 'paused');
          deactivatedCount++;
        }
      }

      // Usuń szkice starsze niż 90 dni
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const { data: oldDrafts } = await supabaseClient
        .from("google_ads_campaigns")
        .select("id")
        .eq("status", "draft")
        .lt("created_at", ninetyDaysAgo.toISOString());

      if (oldDrafts && oldDrafts.length > 0) {
        const draftIds = oldDrafts.map(d => d.id);
        await this.bulkDeleteCampaigns(draftIds);
        deletedCount = oldDrafts.length;
      }

      return { deactivatedCount, deletedCount };
    } catch (error: any) {
      throw new Error(`Błąd podczas czyszczenia kampanii: ${error.message}`);
    }
  }
}

export default DatabaseService;