import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch current context for AI decisions
    const { data: trains } = await supabase.from("trains").select("*");
    const { data: alerts } = await supabase.from("alerts").select("*").eq("is_active", true);
    const { data: weather } = await supabase.from("weather_data").select("*");

    const trainsData = trains || [];
    const alertsData = alerts || [];
    const weatherData = weather || [];

    let result;

    switch (action) {
      case "generate_recommendations":
        result = await generateRecommendations(lovableApiKey, trainsData, alertsData, weatherData);
        // Store AI actions in database
        if (result.actions?.length > 0) {
          for (const aiAction of result.actions) {
            await supabase.from("ai_actions").insert({
              action_type: aiAction.type,
              title: aiAction.title,
              description: aiAction.description,
              priority: aiAction.priority,
              risk_score: aiAction.riskScore,
              ai_reasoning: aiAction.reasoning,
              affected_trains: aiAction.affectedTrains,
              weather_context: aiAction.weatherContext,
              status: "pending"
            });
          }
        }
        break;

      case "generate_announcement":
        result = await generateAnnouncement(lovableApiKey, data, trainsData, alertsData, weatherData);
        // Store announcement
        if (result.announcement) {
          await supabase.from("announcements").insert({
            title: result.announcement.title,
            content: result.announcement.content,
            target_audience: data.targetAudience || "all",
            priority: result.announcement.priority,
            is_ai_generated: true,
            is_active: true
          });
        }
        break;

      case "analyze_risk":
        result = await analyzeRisk(lovableApiKey, trainsData, alertsData, weatherData);
        // Update train risk levels
        if (result.riskAssessments?.length > 0) {
          for (const assessment of result.riskAssessments) {
            await supabase.from("trains")
              .update({ risk_level: assessment.riskLevel })
              .eq("train_number", assessment.trainNumber);
          }
        }
        break;

      case "approve_action":
        await supabase.from("ai_actions")
          .update({ status: "approved", processed_at: new Date().toISOString() })
          .eq("id", data.actionId);
        await supabase.from("action_logs").insert({
          action_type: "approved",
          description: `Approved AI action: ${data.title}`,
          ai_action_id: data.actionId,
          metadata: { actionTitle: data.title }
        });
        result = { success: true };
        break;

      case "modify_action":
        await supabase.from("ai_actions")
          .update({ 
            status: "modified", 
            modified_action: data.modifiedDescription,
            processed_at: new Date().toISOString() 
          })
          .eq("id", data.actionId);
        await supabase.from("action_logs").insert({
          action_type: "modified",
          description: `Modified AI action: ${data.title}`,
          ai_action_id: data.actionId,
          metadata: { actionTitle: data.title, modification: data.modifiedDescription }
        });
        result = { success: true };
        break;

      case "dismiss_action":
        await supabase.from("ai_actions")
          .update({ status: "dismissed", processed_at: new Date().toISOString() })
          .eq("id", data.actionId);
        await supabase.from("action_logs").insert({
          action_type: "dismissed",
          description: `Dismissed AI action: ${data.title}`,
          ai_action_id: data.actionId,
          metadata: { actionTitle: data.title }
        });
        result = { success: true };
        break;

      case "send_announcement":
        await supabase.from("announcements").insert({
          title: data.title || "Announcement",
          content: data.content,
          target_audience: data.targetAudience,
          priority: data.priority || "normal",
          is_ai_generated: false,
          is_active: true
        });
        await supabase.from("action_logs").insert({
          action_type: "announcement",
          description: `Announcement sent to ${data.targetAudience}: ${data.content.substring(0, 100)}...`,
          metadata: { content: data.content, targetAudience: data.targetAudience }
        });
        result = { success: true };
        break;

      case "acknowledge_alert":
        await supabase.from("alerts")
          .update({ acknowledged: true, acknowledged_at: new Date().toISOString() })
          .eq("id", data.alertId);
        await supabase.from("action_logs").insert({
          action_type: "alert_acknowledged",
          description: `Alert acknowledged: ${data.alertTitle}`,
          metadata: { alertId: data.alertId }
        });
        result = { success: true };
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Railway Assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Filter function to remove non-train alternatives from AI responses
function filterNonTrainAlternatives(actions: any[]): any[] {
  const nonTrainKeywords = [
    'bus', 'road transport', 'shuttle', 'road alternative', 'volvo', 
    'taxi', 'cab', 'car', 'auto', 'rickshaw', 'flight', 'air travel',
    'upsrtc', 'isbt', 'highway', 'road journey'
  ];

  return actions.filter(action => {
    const actionText = JSON.stringify(action).toLowerCase();
    return !nonTrainKeywords.some(keyword => actionText.includes(keyword));
  }).map(action => {
    // Also filter description text that mentions buses
    if (action.description) {
      action.description = action.description
        .split(/[.!?]/)
        .filter((sentence: string) => {
          const lowerSentence = sentence.toLowerCase();
          return !nonTrainKeywords.some(keyword => lowerSentence.includes(keyword));
        })
        .join('. ')
        .trim();
    }
    return action;
  });
}

async function generateRecommendations(apiKey: string, trains: any[], alerts: any[], weather: any[]) {
  const systemPrompt = `You are an AI railway operations assistant for Indian Railways. Analyze train data, alerts, and weather conditions to generate actionable recommendations for the control room.

CRITICAL CONSTRAINT: You must ONLY suggest train-based alternatives. NEVER suggest:
- Buses, road transport, shuttles, or any road-based alternatives
- Taxis, cabs, auto-rickshaws
- Flights or air travel

Your recommendations should ONLY focus on:
1. Nearby trains or connecting trains as alternatives
2. Rerouting the same train via alternate rail routes
3. Platform changes to optimize passenger flow
4. Train speed adjustments
5. Skip-station mode for express running
6. Delay notifications for passengers
7. Resource positioning (backup locomotives, staff)

Return JSON format:
{
  "actions": [
    {
      "type": "reroute|delay_notice|platform_change|cancellation|alternate_train|speed_adjustment|skip_station",
      "title": "Short action title",
      "description": "Detailed description of the action (TRAIN-ONLY alternatives)",
      "priority": "low|medium|high|critical",
      "riskScore": 0.0-1.0,
      "reasoning": "AI reasoning for this recommendation",
      "affectedTrains": ["train_numbers"],
      "weatherContext": {"condition": "...", "impact": "..."}
    }
  ]
}`;

  const userPrompt = `Current Railway Situation:

TRAINS:
${JSON.stringify(trains, null, 2)}

ACTIVE ALERTS:
${JSON.stringify(alerts, null, 2)}

WEATHER CONDITIONS:
${JSON.stringify(weather, null, 2)}

Generate up to 5 priority recommendations based on this data. Remember: ONLY train-based solutions, NO buses or road transport.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI API error:", response.status, errorText);
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  try {
    const parsed = JSON.parse(content);
    // Filter out any non-train alternatives that slipped through
    if (parsed.actions) {
      parsed.actions = filterNonTrainAlternatives(parsed.actions);
    }
    return parsed;
  } catch {
    return { actions: [] };
  }
}

async function generateAnnouncement(apiKey: string, data: any, trains: any[], alerts: any[], weather: any[]) {
  const systemPrompt = `You are an AI assistant for Indian Railways announcements. Generate clear, informative, and passenger-friendly announcements.

For passengers: Use simple language, include train numbers, timing, and actionable advice.
For staff: Use technical terms, include operational details.

Return JSON format:
{
  "announcement": {
    "title": "Brief title",
    "content": "Full announcement text",
    "priority": "low|normal|high|urgent"
  }
}`;

  const userPrompt = `Generate an announcement based on:
Context: ${data.context || "General update"}
Target: ${data.targetAudience || "all"}
Specific trains: ${data.trainNumbers?.join(", ") || "All affected"}

Current situation:
- Delayed trains: ${trains?.filter((t: any) => t.status === 'delayed').length || 0}
- Active alerts: ${alerts?.length || 0}
- Weather issues: ${weather?.some((w: any) => w.fog_risk || w.flood_risk) ? 'Yes' : 'No'}`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  const aiData = await response.json();
  const content = aiData.choices?.[0]?.message?.content;
  
  try {
    return JSON.parse(content);
  } catch {
    return { announcement: null };
  }
}

async function analyzeRisk(apiKey: string, trains: any[], alerts: any[], weather: any[]) {
  const systemPrompt = `You are an AI risk analyst for Indian Railways. Analyze current conditions and assess risk levels for each train.

Consider:
- Current delay status
- Weather conditions on route
- Active alerts affecting the route
- Time of day and congestion patterns
- Historical patterns

Return JSON format:
{
  "riskAssessments": [
    {
      "trainNumber": "12345",
      "riskLevel": "low|medium|high|critical",
      "factors": ["factor1", "factor2"],
      "recommendation": "Brief recommendation"
    }
  ],
  "overallSummary": "Brief network risk summary"
}`;

  const userPrompt = `Analyze risk for these trains:
${JSON.stringify(trains, null, 2)}

With these active alerts:
${JSON.stringify(alerts, null, 2)}

And weather conditions:
${JSON.stringify(weather, null, 2)}`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  const aiData = await response.json();
  const content = aiData.choices?.[0]?.message?.content;
  
  try {
    return JSON.parse(content);
  } catch {
    return { riskAssessments: [] };
  }
}
