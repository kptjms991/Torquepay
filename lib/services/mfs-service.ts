import { createClient } from '@/lib/supabase/client';

export const mfsService = {
  async getWallet(userId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async getTransactionHistory(userId: string, limit = 20) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .or(`user_id.eq.${userId},merchant_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getSavedPaymentMethods(userId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('payment_tokens')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async setDefaultPaymentMethod(tokenId: string) {
    const supabase = createClient();

    // First, remove default from all
    const { data: tokens, error: fetchError } = await supabase
      .from('payment_tokens')
      .select('user_id')
      .eq('id', tokenId)
      .single();

    if (fetchError) throw fetchError;

    await supabase
      .from('payment_tokens')
      .update({ is_default: false })
      .eq('user_id', tokens.user_id);

    // Set the new default
    const { data, error } = await supabase
      .from('payment_tokens')
      .update({ is_default: true })
      .eq('id', tokenId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletePaymentToken(tokenId: string) {
    const supabase = createClient();

    const { error } = await supabase
      .from('payment_tokens')
      .delete()
      .eq('id', tokenId);

    if (error) throw error;
  },

  async setTransactionPin(userId: string, pin: string) {
    const supabase = createClient();

    // Hash the PIN (in production, use bcrypt)
    const hashedPin = await this.hashPin(pin);

    const { data, error } = await supabase
      .from('profiles')
      .update({ transaction_pin: hashedPin })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async setup2fa(userId: string, method: 'sms' | 'email' | 'authenticator') {
    const supabase = createClient();

    let updateData: any = {
      two_fa_enabled: true,
      two_fa_method: method,
    };

    if (method === 'authenticator') {
      // Generate a TOTP secret
      updateData.two_fa_secret = this.generateTotpSecret();
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async sendMoney(userId: string, recipientId: string, amount: number, description: string) {
    const supabase = createClient();

    // Create transfer record
    const { data: transfer, error: transferError } = await supabase
      .from('p2p_transfers')
      .insert([
        {
          sender_id: userId,
          receiver_id: recipientId,
          amount,
          description,
        },
      ])
      .select()
      .single();

    if (transferError) throw transferError;

    // Create transaction records
    const referenceId = `ref_${Date.now()}`;

    await supabase.from('transactions').insert([
      {
        reference_id: `${referenceId}_send`,
        user_id: userId,
        amount,
        payment_method: 'wallet',
        status: 'completed',
        description: `Sent to ${recipientId}`,
      },
      {
        reference_id: `${referenceId}_receive`,
        user_id: recipientId,
        amount,
        payment_method: 'wallet',
        status: 'completed',
        description: `Received from ${userId}`,
      },
    ]);

    return transfer;
  },

  async generateQRCode(userId: string, amount?: number) {
    const supabase = createClient();

    const qrData = {
      type: 'payment',
      userId,
      amount,
      timestamp: Date.now(),
    };

    const { data, error } = await supabase
      .from('qr_codes')
      .insert([
        {
          user_id: userId,
          qr_type: 'payment',
          qr_data: qrData,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Utility functions
  private async hashPin(pin: string): Promise<string> {
    // In production, use bcrypt or similar
    return Buffer.from(pin).toString('base64');
  },

  private generateTotpSecret(): string {
    // In production, use speakeasy or similar
    return Math.random().toString(36).substring(2, 15);
  },
};
