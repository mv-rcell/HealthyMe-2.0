import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Deno from 'react'


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ZoomMeetingRequest {
  topic: string
  duration?: number
  start_time?: string
  participant_email?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { topic, duration = 60, start_time, participant_email }: ZoomMeetingRequest = await req.json()

    // Get Zoom credentials from Supabase secrets
    const zoomAccountId = Deno.env.get('ZOOM_ACCOUNT_ID')
    const zoomClientId = Deno.env.get('ZOOM_CLIENT_ID')
    const zoomClientSecret = Deno.env.get('ZOOM_CLIENT_SECRET')

    if (!zoomAccountId || !zoomClientId || !zoomClientSecret) {
      return new Response(
        JSON.stringify({ error: 'Zoom credentials not configured' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get Zoom access token
    const tokenResponse = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${zoomClientId}:${zoomClientSecret}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'account_credentials',
        account_id: zoomAccountId
      })
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to get Zoom access token')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Create Zoom meeting
    const meetingData = {
      topic,
      type: 1, // Instant meeting
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
        audio: 'both',
        auto_recording: 'none'
      }
    }

    const meetingResponse = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(meetingData)
    })

    if (!meetingResponse.ok) {
      throw new Error('Failed to create Zoom meeting')
    }

    const meeting = await meetingResponse.json()

    return new Response(
      JSON.stringify({
        id: meeting.id,
        topic: meeting.topic,
        start_time: meeting.start_time,
        duration: meeting.duration,
        join_url: meeting.join_url,
        password: meeting.password,
        meeting_id: meeting.id.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error creating Zoom meeting:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})