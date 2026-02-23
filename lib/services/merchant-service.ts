import { createClient } from '@/lib/supabase/client';

export const merchantService = {
  async getDashboard(merchantId: string) {
    const supabase = createClient();

    const [
      { data: transactions },
      { data: merchant },
      { data: apiKeys },
    ] = await Promise.all([
      supabase
        .from('transactions')
        .select('*')
        .eq('merchant_id', merchantId)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('merchants')
        .select('*')
        .eq('id', merchantId)
        .single(),
      supabase
        .from('api_keys')
        .select('*')
        .eq('merchant_id', merchantId),
    ]);

    return {
      transactions: transactions || [],
      merchant,
      apiKeys: apiKeys || [],
    };
  },

  async generateApiKey(merchantId: string, keyName: string) {
    const supabase = createClient();

    const publicKey = `pk_${Math.random().toString(36).substring(2, 15)}`;
    const secretKey = `sk_${Math.random().toString(36).substring(2, 15)}`;

    const { data, error } = await supabase
      .from('api_keys')
      .insert([
        {
          merchant_id: merchantId,
          key_name: keyName,
          public_key: publicKey,
          secret_key: secretKey,
          test_mode: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteApiKey(keyId: string) {
    const supabase = createClient();

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId);

    if (error) throw error;
  },

  async updateCheckoutSettings(merchantId: string, settings: any) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('merchant_checkouts')
      .upsert(
        {
          merchant_id: merchantId,
          ...settings,
        },
        { onConflict: 'merchant_id' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
