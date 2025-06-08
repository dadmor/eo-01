// src/pages/contractor/api/contractors.ts

import { supabase } from '@/utility';

export interface ServiceRequestData {
  id: string;
  title?: string;
  description?: string;
  city?: string;
  postal_code?: string;
  created_at: string;
  users?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface ContractorOfferData {
  id: string;
  contractor_id: string;
  price: number;
  scope: string;
  status: string;
  created_at: string;
}

export interface ContractorPortfolioData {
  id: string;
  contractor_id: string;
  company_name: string;
  nip: string;
  company_address: string;
  description: string;
  contractor_gallery?: Array<{
    id: string;
    image_url?: string;
    description?: string;
  }>;
}

export const contractorApi = {
  // === SERVICE REQUESTS ===
  async getServiceRequests(): Promise<ServiceRequestData[]> {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        users(id, email, first_name, last_name)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getServiceRequestById(id: string): Promise<ServiceRequestData | null> {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        users(id, email, first_name, last_name)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createServiceRequest(requestData: Partial<ServiceRequestData>): Promise<ServiceRequestData> {
    const { data, error } = await supabase
      .from('service_requests')
      .insert([requestData])
      .select(`
        *,
        users(id, email, first_name, last_name)
      `)
      .single();
    if (error) throw error;
    return data;
  },

  async updateServiceRequest(id: string, updates: Partial<ServiceRequestData>): Promise<ServiceRequestData> {
    const { data, error } = await supabase
      .from('service_requests')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        users(id, email, first_name, last_name)
      `)
      .single();
    if (error) throw error;
    return data;
  },

  async deleteServiceRequest(id: string): Promise<void> {
    const { error } = await supabase
      .from('service_requests')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // === CONTRACTOR OFFERS ===
  async getContractorOffers(contractorId: string): Promise<ContractorOfferData[]> {
    const { data, error } = await supabase
      .from('contractor_offers')
      .select('*')
      .eq('contractor_id', contractorId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createOffer(offer: Partial<ContractorOfferData> & { contractor_id: string }): Promise<ContractorOfferData> {
    const { data, error } = await supabase
      .from('contractor_offers')
      .insert([offer])
      .single();
    if (error) throw error;
    return data;
  },

  // === CONTRACTOR PORTFOLIO ===
  async getPortfolio(contractorId: string): Promise<ContractorPortfolioData | null> {
    const { data, error } = await supabase
      .from('contractor_portfolios')
      .select(`
        *,
        contractor_gallery(id, image_url, description)
      `)
      .eq('contractor_id', contractorId)
      .single();
    if (error) throw error;
    return data;
  },

  async createPortfolio(portfolio: Omit<ContractorPortfolioData, 'id'>): Promise<ContractorPortfolioData> {
    const { data, error } = await supabase
      .from('contractor_portfolios')
      .insert([portfolio])
      .select(`
        *,
        contractor_gallery(id, image_url, description)
      `)
      .single();
    if (error) throw error;
    return data;
  },

  async updatePortfolio(id: string, updates: Partial<ContractorPortfolioData>): Promise<ContractorPortfolioData> {
    const { data, error } = await supabase
      .from('contractor_portfolios')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        contractor_gallery(id, image_url, description)
      `)
      .single();
    if (error) throw error;
    return data;
  },
};
