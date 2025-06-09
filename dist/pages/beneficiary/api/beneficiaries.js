// src/pages/beneficiary/api/beneficiary.ts
import { supabase } from '@/utility';
export const beneficiaryApi = {
    // === SERVICE REQUESTS ===
    async getServiceRequests(beneficiaryId) {
        const { data, error } = await supabase
            .from('service_requests')
            .select(`
        *,
        contractor_offers(*)
      `)
            .eq('beneficiary_id', beneficiaryId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data || [];
    },
    async getServiceRequestById(id) {
        const { data, error } = await supabase
            .from('service_requests')
            .select(`
        *,
        contractor_offers(*)
      `)
            .eq('id', id)
            .single();
        if (error)
            throw error;
        return data;
    },
    async createServiceRequest(requestData) {
        const { data, error } = await supabase
            .from('service_requests')
            .insert([{ ...requestData, status: 'pending' }])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    async updateServiceRequest(id, updates) {
        const { data, error } = await supabase
            .from('service_requests')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    async deleteServiceRequest(id) {
        const { error } = await supabase
            .from('service_requests')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
    },
    // === AUDIT REQUESTS ===
    async getAuditRequests(beneficiaryId) {
        const { data, error } = await supabase
            .from('audit_requests')
            .select(`
        *,
        auditor_offers(*)
      `)
            .eq('beneficiary_id', beneficiaryId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data || [];
    },
    async createAuditRequest(requestData) {
        const { data, error } = await supabase
            .from('audit_requests')
            .insert([{ ...requestData, status: 'pending' }])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    // === OFFERS MANAGEMENT ===
    async acceptContractorOffer(offerId) {
        const { error } = await supabase
            .from('contractor_offers')
            .update({ status: 'accepted' })
            .eq('id', offerId);
        if (error)
            throw error;
    },
    async rejectContractorOffer(offerId) {
        const { error } = await supabase
            .from('contractor_offers')
            .update({ status: 'rejected' })
            .eq('id', offerId);
        if (error)
            throw error;
    },
    async acceptAuditorOffer(offerId) {
        const { error } = await supabase
            .from('auditor_offers')
            .update({ status: 'accepted' })
            .eq('id', offerId);
        if (error)
            throw error;
    },
    async rejectAuditorOffer(offerId) {
        const { error } = await supabase
            .from('auditor_offers')
            .update({ status: 'rejected' })
            .eq('id', offerId);
        if (error)
            throw error;
    },
};
