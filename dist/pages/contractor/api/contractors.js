// src/pages/contractor/api/contractors.ts
import { supabase } from '@/utility';
export const contractorApi = {
    // === SERVICE REQUESTS ===
    async getServiceRequests() {
        const { data, error } = await supabase
            .from('service_requests')
            .select(`
        *,
        users(id, email, first_name, last_name)
      `)
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
        users(id, email, first_name, last_name)
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
            .insert([requestData])
            .select(`
        *,
        users(id, email, first_name, last_name)
      `)
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
            .select(`
        *,
        users(id, email, first_name, last_name)
      `)
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
    // === CONTRACTOR OFFERS ===
    async getContractorOffers(contractorId) {
        const { data, error } = await supabase
            .from('contractor_offers')
            .select('*')
            .eq('contractor_id', contractorId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data || [];
    },
    async createOffer(offer) {
        const { data, error } = await supabase
            .from('contractor_offers')
            .insert([offer])
            .single();
        if (error)
            throw error;
        return data;
    },
    // === CONTRACTOR PORTFOLIO ===
    async getPortfolio(contractorId) {
        const { data, error } = await supabase
            .from('contractor_portfolios')
            .select(`
        *,
        contractor_gallery(id, image_url, description)
      `)
            .eq('contractor_id', contractorId)
            .single();
        if (error)
            throw error;
        return data;
    },
    async createPortfolio(portfolio) {
        const { data, error } = await supabase
            .from('contractor_portfolios')
            .insert([portfolio])
            .select(`
        *,
        contractor_gallery(id, image_url, description)
      `)
            .single();
        if (error)
            throw error;
        return data;
    },
    async updatePortfolio(id, updates) {
        const { data, error } = await supabase
            .from('contractor_portfolios')
            .update(updates)
            .eq('id', id)
            .select(`
        *,
        contractor_gallery(id, image_url, description)
      `)
            .single();
        if (error)
            throw error;
        return data;
    },
};
