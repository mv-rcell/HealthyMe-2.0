import axios from 'axios';
import dayjs from 'dayjs';
import { supabase } from '../utils/supabase.js';

const {
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_SHORTCODE,
  MPESA_PASSKEY,
  MPESA_CALLBACK_URL,
  MPESA_BASE_URL,
} = process.env;

let accessToken = null;

async function getAccessToken() {
  const url = `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');

  const { data } = await axios.get(url, {
    headers: { Authorization: `Basic ${auth}` },
  });

  accessToken = data.access_token;
  return accessToken;
}

export async function initiateSTKPush(req, res) {
  try {
    const token = await getAccessToken();
    const { phone, amount, user_id, plan_id } = req.body;

    const timestamp = dayjs().format('YYYYMMDDHHmmss');
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: 'HealthApp',
      TransactionDesc: `Membership - ${plan_id || 'General'}`,
    };

    const { data } = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(200).json({
      message: 'STK Push initiated',
      checkoutRequestID: data.CheckoutRequestID,
    });
  } catch (error) {
    console.error('STK Push error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to initiate payment', error });
  }
}

export async function handleCallback(req, res) {
  try {
    const body = req.body;
    const metadata = body.Body?.stkCallback;

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = metadata;

    if (ResultCode === 0) {
      const phone = CallbackMetadata?.Item?.find((i) => i.Name === 'PhoneNumber')?.Value;
      const amount = CallbackMetadata?.Item?.find((i) => i.Name === 'Amount')?.Value;

      await supabase.from('payments').update({
        payment_status: 'successful',
      }).eq('transaction_id', CheckoutRequestID);

      console.log(`✅ Payment success: ${phone}, ${amount}`);
    } else {
      console.warn(`❌ Payment failed: ${ResultDesc}`);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Callback error:', error.message);
    res.sendStatus(500);
  }
}
