// src/pages/beneficiary/api/beneficiary.ts
import { supabase } from '@/utility';

export interface ServiceRequestData {
  id: string;
  beneficiary_id: string;
  postal_code: string;
  city: string;
  street_address: string;
  phone_number: string;
  heat_source?: 'pompa_ciepla' | 'piec_pellet' | 'piec_zgazowujacy';
  windows_count?: number;
  doors_count?: number;
  wall_insulation_m2?: number;
  attic_insulation_m2?: number;
  audit_file_url?: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
  contractor_offers?: ContractorOfferData[];
}

export interface AuditRequestData {
  id: string;
  beneficiary_id: string;
  postal_code: string;
  city: string;
  street_address: string;
  phone_number: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
  auditor_offers?: AuditorOfferData[];
}

export interface ContractorOfferData {
  id: string;
  request_id: string;
  contractor_id: string;
  price: number;
  scope: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface AuditorOfferData {
  id: string;
  request_id: string;
  auditor_id: string;
  price: number;
  duration_days: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export const beneficiaryApi = {
  // === SERVICE REQUESTS ===
  async getServiceRequests(beneficiaryId: string): Promise<ServiceRequestData[]> {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        contractor_offers(*)
      `)
      .eq('beneficiary_id', beneficiaryId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getServiceRequestById(id: string): Promise<ServiceRequestData | null> {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        contractor_offers(*)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createServiceRequest(requestData: Omit<ServiceRequestData, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<ServiceRequestData> {
    const { data, error } = await supabase
      .from('service_requests')
      .insert([{ ...requestData, status: 'pending' }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateServiceRequest(id: string, updates: Partial<ServiceRequestData>): Promise<ServiceRequestData> {
    const { data, error } = await supabase
      .from('service_requests')
      .update(updates)
      .eq('id', id)
      .select()
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

  // === AUDIT REQUESTS ===
  async getAuditRequests(beneficiaryId: string): Promise<AuditRequestData[]> {
    const { data, error } = await supabase
      .from('audit_requests')
      .select(`
        *,
        auditor_offers(*)
      `)
      .eq('beneficiary_id', beneficiaryId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createAuditRequest(requestData: Omit<AuditRequestData, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<AuditRequestData> {
    const { data, error } = await supabase
      .from('audit_requests')
      .insert([{ ...requestData, status: 'pending' }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // === OFFERS MANAGEMENT ===
  async acceptContractorOffer(offerId: string): Promise<void> {
    const { error } = await supabase
      .from('contractor_offers')
      .update({ status: 'accepted' })
      .eq('id', offerId);
    if (error) throw error;
  },

  async rejectContractorOffer(offerId: string): Promise<void> {
    const { error } = await supabase
      .from('contractor_offers')
      .update({ status: 'rejected' })
      .eq('id', offerId);
    if (error) throw error;
  },

  async acceptAuditorOffer(offerId: string): Promise<void> {
    const { error } = await supabase
      .from('auditor_offers')
      .update({ status: 'accepted' })
      .eq('id', offerId);
    if (error) throw error;
  },

  async rejectAuditorOffer(offerId: string): Promise<void> {
    const { error } = await supabase
      .from('auditor_offers')
      .update({ status: 'rejected' })
      .eq('id', offerId);
    if (error) throw error;
  },
};