import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingNotificationRequest {
  bookingRequest: {
    id: string;
    client_id: string;
    specialist_id: string;
    service_type: string;
    preferred_date: string;
    duration: number;
    notes?: string;
  };
  specialistId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingRequest, specialistId }: BookingNotificationRequest = await req.json();

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get specialist profile to get email
    const { data: specialistProfile, error: specialistError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', specialistId)
      .single();

    if (specialistError) {
      console.error('Error fetching specialist profile:', specialistError);
      throw specialistError;
    }

    // Get specialist email from auth.users (using service role key)
    const { data: { user: specialist }, error: userError } = await supabase.auth.admin.getUserById(specialistId);
    
    if (userError || !specialist?.email) {
      console.error('Error fetching specialist email:', userError);
      throw new Error('Could not retrieve specialist email');
    }

    // Get client profile
    const { data: clientProfile, error: clientError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', bookingRequest.client_id)
      .single();

    if (clientError) {
      console.error('Error fetching client profile:', clientError);
      throw clientError;
    }

    const formattedDate = new Date(bookingRequest.preferred_date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const emailResponse = await resend.emails.send({
      from: "HealthConnect <notifications@resend.dev>",
      to: [specialist.email],
      subject: "New Booking Request Received",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">New Booking Request</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Client:</strong> ${clientProfile?.full_name || 'Unknown'}</p>
            <p><strong>Service Type:</strong> ${bookingRequest.service_type}</p>
            <p><strong>Preferred Date:</strong> ${formattedDate}</p>
            <p><strong>Duration:</strong> ${bookingRequest.duration} minutes</p>
            ${bookingRequest.notes ? `<p><strong>Notes:</strong> ${bookingRequest.notes}</p>` : ''}
          </div>
          
          <p>Please log into your dashboard to accept or decline this booking request.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
            <p>This is an automated notification from HealthConnect.</p>
          </div>
        </div>
      `,
    });

    console.log("Booking notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);