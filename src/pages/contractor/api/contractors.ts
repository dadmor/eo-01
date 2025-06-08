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

export const contractorApi = {
  async getServiceRequests(): Promise<ServiceRequestData[]> {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        users(
          id,
          email,
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching service requests:', error);
      throw error;
    }

    return data || [];
  },

  async getServiceRequestById(id: string): Promise<ServiceRequestData | null> {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        users(
          id,
          email,
          first_name,
          last_name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching service request:', error);
      throw error;
    }

    return data;
  },

  async createServiceRequest(requestData: Partial<ServiceRequestData>): Promise<ServiceRequestData> {
    const { data, error } = await supabase
      .from('service_requests')
      .insert([requestData])
      .select(`
        *,
        users(
          id,
          email,
          first_name,
          last_name
        )
      `)
      .single();

    if (error) {
      console.error('Error creating service request:', error);
      throw error;
    }

    return data;
  },

  async updateServiceRequest(id: string, updates: Partial<ServiceRequestData>): Promise<ServiceRequestData> {
    const { data, error } = await supabase
      .from('service_requests')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        users(
          id,
          email,
          first_name,
          last_name
        )
      `)
      .single();

    if (error) {
      console.error('Error updating service request:', error);
      throw error;
    }

    return data;
  },

  async deleteServiceRequest(id: string): Promise<void> {
    const { error } = await supabase
      .from('service_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting service request:', error);
      throw error;
    }
  }
};