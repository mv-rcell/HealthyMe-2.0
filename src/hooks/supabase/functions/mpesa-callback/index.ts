// supabase/functions/mpesa-callback/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    const body = await req.json();

    const callback = body?.Body?.stkCallback;
    const phone = callback?.CallbackMetadata?.Item?.find((item: any) => item.Name === 'PhoneNumber')?.Value;
    const amount = callback?.CallbackMetadata?.Item?.find((item: any) => item.Name === 'Amount')?.Value;
    const mpesaReceipt = callback?.CallbackMetadata?.Item?.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
    const status = callback?.ResultCode === 0 ? 'successful' : 'failed';

    // Optional: log for debugging
    console.log('Received MPESA callback:', callback);

    // Insert or update a payment record
    const { error } = await supabase.from('payments').insert([
      {
        phone_number: phone,
        amount: Math.round(amount * 100), // Assuming your app stores cents
        currency: 'KES',
        payment_method: 'mpesa',
        payment_status: status,
        transaction_id: mpesaReceipt || null,
      },
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return new Response(JSON.stringify({ error: 'Insert failed' }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Callback received and processed' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Callback processing error:', err);
    return new Response(JSON.stringify({ error: 'Callback processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
