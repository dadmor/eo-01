// src/pages/operator/api/operator.ts
import { supabase } from '@/utility';

export interface ServiceRequestWithUser {
  id: string;
  beneficiary_id: string;
  postal_code: string;
  city: string;
  street_address: string;
  phone_number: string;
  heat_source?: string;
  windows_count?: number;
  doors_count?: number;
  wall_insulation_m2?: number;
  attic_insulation_m2?: number;
  audit_file_url?: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
  users?: {
    id: string;
    email: string;
    name?: string;
    phone_number?: string;
  };
  contractor_offers?: Array<{
    id: string;
    contractor_id: string;
    price: number;
    status: string;
  }>;
}

export interface ModerationLog {
  id: string;
  operator_id: string;
  target_table: string;
  target_id: string;
  action: string;
  reason?: string;
  created_at: string;
  users?: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface Report {
  id: string;
  operator_id: string;
  title: string;
  payload: any;
  created_at: string;
}

export interface UserContact {
  id: string;
  email: string;
  name?: string;
  phone_number?: string;
  city?: string;
  postal_code?: string;
  role: string;
  created_at: string;
}

export const operatorApi = {
  // Pobranie wszystkich zapytań do weryfikacji
  async getServiceRequestsForVerification(): Promise<ServiceRequestWithUser[]> {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        users!service_requests_beneficiary_id_fkey(
          id,
          email,
          name,
          phone_number
        ),
        contractor_offers(
          id,
          contractor_id,
          price,
          status
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching service requests:', error);
      throw error;
    }

    return data || [];
  },

  // Aktualizacja statusu zapytania
  async updateServiceRequestStatus(
    id: string, 
    status: 'pending' | 'verified' | 'rejected',
    operatorId: string,
    reason?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('service_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating service request status:', error);
      throw error;
    }

    // Dodaj log moderacji
    await this.createModerationLog({
      operator_id: operatorId,
      target_table: 'service_requests',
      target_id: id,
      action: `status_changed_to_${status}`,
      reason
    });
  },

  // Pobranie logów moderacji
  async getModerationLogs(): Promise<ModerationLog[]> {
    const { data, error } = await supabase
      .from('moderation_logs')
      .select(`
        *,
        users!moderation_logs_operator_id_fkey(
          id,
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching moderation logs:', error);
      throw error;
    }

    return data || [];
  },

  // Tworzenie logu moderacji
  async createModerationLog(logData: {
    operator_id: string;
    target_table: string;
    target_id: string;
    action: string;
    reason?: string;
  }): Promise<void> {
    const { error } = await supabase
      .from('moderation_logs')
      .insert([logData]);

    if (error) {
      console.error('Error creating moderation log:', error);
      throw error;
    }
  },

  // Pobranie wszystkich raportów
  async getReports(): Promise<Report[]> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }

    return data || [];
  },

  // Tworzenie nowego raportu
  async createReport(reportData: {
    operator_id: string;
    title: string;
    payload: any;
  }): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .insert([reportData])
      .select()
      .single();

    if (error) {
      console.error('Error creating report:', error);
      throw error;
    }

    return data;
  },

  // Pobranie kontaktów wszystkich użytkowników
  async getUserContacts(): Promise<UserContact[]> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        name,
        phone_number,
        city,
        postal_code,
        role,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user contacts:', error);
      throw error;
    }

    return data || [];
  },

  // Statystyki dla dashboardu
  async getStats() {
    const [serviceRequests, auditRequests, contractorOffers, auditorOffers] = await Promise.all([
      supabase.from('service_requests').select('status', { count: 'exact' }),
      supabase.from('audit_requests').select('status', { count: 'exact' }),
      supabase.from('contractor_offers').select('status', { count: 'exact' }),
      supabase.from('auditor_offers').select('status', { count: 'exact' })
    ]);

    return {
      serviceRequests: serviceRequests.data || [],
      serviceRequestsCount: serviceRequests.count || 0,
      auditRequests: auditRequests.data || [],
      auditRequestsCount: auditRequests.count || 0,
      contractorOffers: contractorOffers.data || [],
      contractorOffersCount: contractorOffers.count || 0,
      auditorOffers: auditorOffers.data || [],
      auditorOffersCount: auditorOffers.count || 0,
    };
  }
};

// =================================================================