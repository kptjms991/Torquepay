import { createClient } from '@/lib/supabase/client';

export const adminService = {
  async getDashboard() {
    const supabase = createClient();

    const [
      { count: userCount },
      { count: merchantCount },
      { data: transactions },
      { count: disputeCount },
    ] = await Promise.all([
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'user'),
      supabase
        .from('merchants')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('disputes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open'),
    ]);

    const totalVolume = transactions?.reduce((sum: number, tx: any) => sum + tx.amount, 0) || 0;

    return {
      totalUsers: userCount || 0,
      activeMerchants: merchantCount || 0,
      totalVolume,
      openDisputes: disputeCount || 0,
      recentTransactions: transactions || [],
    };
  },

  async getUsers(filters?: { type?: string; kycStatus?: string }) {
    const supabase = createClient();

    let query = supabase.from('profiles').select('*');

    if (filters?.type && filters.type !== 'all') {
      query = query.eq('user_type', filters.type);
    }

    if (filters?.kycStatus && filters.kycStatus !== 'all') {
      query = query.eq('kyc_status', filters.kycStatus);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async approveMerchant(userId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('profiles')
      .update({ kyc_status: 'verified' })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async rejectMerchant(userId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('profiles')
      .update({ kyc_status: 'rejected' })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getDisputes() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async resolveDispute(disputeId: string, resolution: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('disputes')
      .update({
        status: 'resolved',
        resolution,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', disputeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async processRefund(disputeId: string, amount: number) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('disputes')
      .update({ amount_refunded: amount })
      .eq('id', disputeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
