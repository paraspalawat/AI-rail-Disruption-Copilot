import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Mock weather data for Indian railway locations since we don't have a real API key
const mockWeatherData: Record<string, any> = {
  "Delhi": { temperature: 12, condition: "Foggy", visibility_km: 0.5, humidity: 95, fog_risk: true, flood_risk: false },
  "Kanpur": { temperature: 15, condition: "Heavy Rain", visibility_km: 2, humidity: 88, fog_risk: false, flood_risk: true },
  "Mumbai": { temperature: 28, condition: "Partly Cloudy", visibility_km: 10, humidity: 72, fog_risk: false, flood_risk: false },
  "Howrah": { temperature: 22, condition: "Clear", visibility_km: 8, humidity: 65, fog_risk: false, flood_risk: false },
  "Chennai": { temperature: 32, condition: "Sunny", visibility_km: 12, humidity: 60, fog_risk: false, flood_risk: false },
  "Allahabad": { temperature: 14, condition: "Mist", visibility_km: 1.5, humidity: 90, fog_risk: true, flood_risk: false },
  "Vadodara": { temperature: 25, condition: "Clear", visibility_km: 10, humidity: 55, fog_risk: false, flood_risk: false },
  "Bhopal": { temperature: 18, condition: "Overcast", visibility_km: 6, humidity: 70, fog_risk: false, flood_risk: false },
  "Nagpur": { temperature: 23, condition: "Partly Cloudy", visibility_km: 8, humidity: 62, fog_risk: false, flood_risk: false },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, locations } = await req.json();

    if (action === "fetch_weather") {
      const weatherResults = [];
      const locationsToFetch = locations || Object.keys(mockWeatherData);

      for (const location of locationsToFetch) {
        const weatherData = mockWeatherData[location] || {
          temperature: 20 + Math.random() * 10,
          condition: ["Clear", "Cloudy", "Partly Cloudy"][Math.floor(Math.random() * 3)],
          visibility_km: 5 + Math.random() * 10,
          humidity: 50 + Math.random() * 40,
          fog_risk: false,
          flood_risk: false
        };

        // Upsert weather data
        const { data, error } = await supabase
          .from("weather_data")
          .upsert({
            location,
            temperature: weatherData.temperature,
            condition: weatherData.condition,
            visibility_km: weatherData.visibility_km,
            humidity: Math.round(weatherData.humidity),
            fog_risk: weatherData.fog_risk,
            flood_risk: weatherData.flood_risk,
            rain_probability: weatherData.condition.includes("Rain") ? 80 : 10,
            wind_speed_kmh: 10 + Math.random() * 30,
            fetched_at: new Date().toISOString()
          }, { onConflict: "location" })
          .select()
          .single();

        if (!error) {
          weatherResults.push(data);
        }
      }

      return new Response(
        JSON.stringify({ success: true, weather: weatherResults }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "get_weather") {
      const { data: weatherData, error } = await supabase
        .from("weather_data")
        .select("*")
        .order("location");

      if (error) throw error;

      return new Response(
        JSON.stringify({ weather: weatherData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "get_alerts_for_weather") {
      // Check for weather conditions that need alerts
      const { data: weatherData } = await supabase
        .from("weather_data")
        .select("*")
        .or("fog_risk.eq.true,flood_risk.eq.true");

      const alerts = [];
      
      for (const weather of weatherData || []) {
        if (weather.fog_risk) {
          alerts.push({
            type: "weather",
            severity: weather.visibility_km < 1 ? "critical" : "warning",
            location: weather.location,
            message: `Dense fog in ${weather.location} region. Visibility: ${weather.visibility_km}km`,
            recommendation: "Speed restrictions advised"
          });
        }
        if (weather.flood_risk) {
          alerts.push({
            type: "weather",
            severity: "critical",
            location: weather.location,
            message: `Flood risk in ${weather.location} region due to heavy rainfall`,
            recommendation: "Check track conditions before proceeding"
          });
        }
      }

      return new Response(
        JSON.stringify({ alerts }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error("Unknown action");
  } catch (error) {
    console.error("Weather service error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
