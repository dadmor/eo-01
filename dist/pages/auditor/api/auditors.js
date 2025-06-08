// ------ src/pages/auditor/api/auditors.ts ------
import { supabase } from '@/utility';
export const auditorApi = {
    // Audit Requests
    async getAuditRequests() {
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
    async getAuditRequestById(id) {
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
    async getAuditorOffers() {
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
    async createAuditorOffer(offerData) {
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
    async updateAuditorOffer(id, updates) {
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
    async getAuditorPortfolios() {
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
    async createAuditorPortfolio(portfolioData) {
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
    async updateAuditorPortfolio(id, updates) {
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
    async deleteAuditorPortfolio(id) {
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
