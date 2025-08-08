// supabase/functions/create-zoom-meeting/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ZoomMeetingRequest {
  topic: string;
  duration?: number;
  start_time?: string;
  participant_email?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let body: ZoomMeetingRequest;

  try {
    body = await req.json();
    console.log("Request Body:", body);
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { topic, duration = 60, start_time } = body;

  const zoomAccountId = Deno.env.get("ZOOM_ACCOUNT_ID");
  const zoomClientId = Deno.env.get("ZOOM_CLIENT_ID");
  const zoomClientSecret = Deno.env.get("ZOOM_CLIENT_SECRET");

  if (!zoomAccountId || !zoomClientId || !zoomClientSecret) {
    return new Response(JSON.stringify({ error: "Zoom credentials not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const tokenResponse = await fetch("https://zoom.us/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${zoomClientId}:${zoomClientSecret}`)}`,
      },
      body: new URLSearchParams({
        grant_type: "account_credentials",
        account_id: zoomAccountId,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token error:", errorText);
      throw new Error("Failed to get Zoom access token");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const meetingPayload = {
      topic,
      type: 1,
      duration,
      start_time: start_time || new Date().toISOString(),
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        watermark: false,
        use_pmi: false,
        approval_type: 0,
        audio: "both",
        auto_recording: "none",
      },
    };

    const meetingResponse = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meetingPayload),
    });

    const rawMeetingText = await meetingResponse.text();

    if (!meetingResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to create Zoom meeting", details: rawMeetingText }),
        {
          status: meetingResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const meeting = JSON.parse(rawMeetingText);

    return new Response(
      JSON.stringify({
        id: meeting.id,
        topic: meeting.topic,
        start_time: meeting.start_time,
        duration: meeting.duration,
        join_url: meeting.join_url,
        password: meeting.password,
        meeting_id: meeting.id.toString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
