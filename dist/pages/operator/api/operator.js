// src/pages/operator/api/operator.ts
import { supabase } from '@/utility';
export const operatorApi = {
    // Pobranie wszystkich zapytań do weryfikacji
    async getServiceRequestsForVerification() {
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
    async updateServiceRequestStatus(id, status, operatorId, reason) {
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
    async getModerationLogs() {
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
    async createModerationLog(logData) {
        const { error } = await supabase
            .from('moderation_logs')
            .insert([logData]);
        if (error) {
            console.error('Error creating moderation log:', error);
            throw error;
        }
    },
    // Pobranie wszystkich raportów
    async getReports() {
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
    async createReport(reportData) {
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
    async getUserContacts() {
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
