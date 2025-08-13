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

  // Parse request body
  let body: ZoomMeetingRequest;
  try {
    body = await req.json();
    console.log("Incoming Request Body:", body);
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const { topic, duration = 60, start_time } = body;

  // Load and validate environment variables
  const zoomAccountId = (Deno.env.get("ZOOM_ACCOUNT_ID") || "").trim();
  const zoomClientId = (Deno.env.get("ZOOM_CLIENT_ID") || "").trim();
  const zoomClientSecret = (Deno.env.get("ZOOM_CLIENT_SECRET") || "").trim();

  if (!zoomAccountId || !zoomClientId || !zoomClientSecret) {
    return jsonResponse({ 
      error: "Zoom credentials not configured",
      details: { zoomAccountId, zoomClientIdPresent: !!zoomClientId, zoomClientSecretPresent: !!zoomClientSecret }
    }, 500);
  }

  try {
    // STEP 1 — Get Zoom Access Token
// STEP 1 — Get Zoom Access Token
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

// ✅ Read only once
const tokenText = await tokenResponse.text();
console.log("Zoom Token Response:", tokenText);

if (!tokenResponse.ok) {
  return jsonResponse({
    error: "Failed to get Zoom access token",
    zoomResponse: tokenText,
  }, tokenResponse.status);
}

// ✅ Now parse
let tokenData;
try {
  tokenData = JSON.parse(tokenText);
} catch {
  return jsonResponse({
    error: "Invalid JSON in Zoom token response",
    rawResponse: tokenText,
  }, 500);
}

const accessToken = tokenData.access_token;


    // STEP 2 — Create Meeting
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

    console.log("Meeting Payload:", meetingPayload);

    const meetingResponse = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(meetingPayload),
    });

    const meetingText = await meetingResponse.text();
    console.log("Zoom Meeting Creation Response:", meetingText);

    if (!meetingResponse.ok) {
      return jsonResponse({
        error: "Failed to create Zoom meeting",
        zoomResponse: meetingText,
      }, meetingResponse.status);
    }

    const meeting = JSON.parse(meetingText);

    return jsonResponse({
      id: meeting.id,
      topic: meeting.topic,
      start_time: meeting.start_time,
      duration: meeting.duration,
      join_url: meeting.join_url,
      password: meeting.password,
      meeting_id: meeting.id?.toString(),
    });

  } catch (err) {
    console.error("Unexpected Error:", err);
    return jsonResponse({ error: err.message }, 500);
  }
});

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
