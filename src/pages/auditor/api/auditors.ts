// ------ src/pages/auditor/api/auditors.ts ------
import { supabase } from '@/utility';

export interface AuditRequestData {
  id: string;
  beneficiary_id?: string;
  postal_code?: string;
  city?: string;
  street_address?: string;
  phone_number?: string;
  status?: string;
  created_at: string;
  updated_at?: string;
  users?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface AuditorOfferData {
  id: string;
  request_id?: string;
  auditor_id?: string;
  price?: number;
  duration_days?: number;
  status?: string;
  created_at: string;
  updated_at?: string;
  audit_requests?: AuditRequestData;
}

export interface AuditorPortfolioData {
  id: string;
  auditor_id?: string;
  name_or_company?: string;
  certificate_data?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export const auditorApi = {
  // Audit Requests
  async getAuditRequests(): Promise<AuditRequestData[]> {
    const { data, error } = await supabase
      .from('audit_requests')
      .select(`
        *,
        users!beneficiary_id(
          id,
          email,
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching audit requests:', error);
      throw error;
    }

    return data || [];
  },

  async getAuditRequestById(id: string): Promise<AuditRequestData | null> {
    const { data, error } = await supabase
      .from('audit_requests')
      .select(`
        *,
        users!beneficiary_id(
          id,
          email,
          first_name,
          last_name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching audit request:', error);
      throw error;
    }

    return data;
  },

  // Auditor Offers
  async getAuditorOffers(): Promise<AuditorOfferData[]> {
    const { data, error } = await supabase
      .from('auditor_offers')
      .select(`
        *,
        audit_requests(
          id,
          postal_code,
          city,
          street_address,
          status
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching auditor offers:', error);
      throw error;
    }

    return data || [];
  },

  async createAuditorOffer(offerData: Partial<AuditorOfferData>): Promise<AuditorOfferData> {
    const { data, error } = await supabase
      .from('auditor_offers')
      .insert([offerData])
      .select(`
        *,
        audit_requests(
          id,
          postal_code,
          city,
          street_address,
          status
        )
      `)
      .single();

    if (error) {
      console.error('Error creating auditor offer:', error);
      throw error;
    }

    return data;
  },

  async updateAuditorOffer(id: string, updates: Partial<AuditorOfferData>): Promise<AuditorOfferData> {
    const { data, error } = await supabase
      .from('auditor_offers')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        audit_requests(
          id,
          postal_code,
          city,
          street_address,
          status
        )
      `)
      .single();

    if (error) {
      console.error('Error updating auditor offer:', error);
      throw error;
    }

    return data;
  },

  // Auditor Portfolio
  async getAuditorPortfolios(): Promise<AuditorPortfolioData[]> {
    const { data, error } = await supabase
      .from('auditor_portfolios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching auditor portfolios:', error);
      throw error;
    }

    return data || [];
  },

  async createAuditorPortfolio(portfolioData: Partial<AuditorPortfolioData>): Promise<AuditorPortfolioData> {
    const { data, error } = await supabase
      .from('auditor_portfolios')
      .insert([portfolioData])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating auditor portfolio:', error);
      throw error;
    }

    return data;
  },

  async updateAuditorPortfolio(id: string, updates: Partial<AuditorPortfolioData>): Promise<AuditorPortfolioData> {
    const { data, error } = await supabase
      .from('auditor_portfolios')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating auditor portfolio:', error);
      throw error;
    }

    return data;
  },

  async deleteAuditorPortfolio(id: string): Promise<void> {
    const { error } = await supabase
      .from('auditor_portfolios')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting auditor portfolio:', error);
      throw error;
    }
  }
};