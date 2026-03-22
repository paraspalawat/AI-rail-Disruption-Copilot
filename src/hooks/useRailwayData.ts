import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Train {
  id: string;
  train_number: string;
  train_name: string;
  origin: string;
  destination: string;
  current_location: string | null;
  last_station: string | null;
  next_station: string | null;
  scheduled_departure: string | null;
  actual_departure: string | null;
  scheduled_arrival: string | null;
  expected_arrival: string | null;
  delay_minutes: number;
  status: "on_time" | "delayed" | "cancelled" | "arrived" | "departed";
  speed_kmh: number | null;
  platform: string | null;
  zone: string | null;
  risk_level: "low" | "medium" | "high" | "critical";
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  train_id: string | null;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  alert_type: string;
  affected_routes: string[] | null;
  is_active: boolean;
  acknowledged: boolean;
  acknowledged_at: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target_audience: "all" | "passengers" | "staff";
  priority: "low" | "normal" | "high" | "urgent";
  is_ai_generated: boolean;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

export interface AIAction {
  id: string;
  action_type: "reroute" | "delay_notice" | "platform_change" | "cancellation" | "alternate_travel";
  title: string;
  description: string;
  train_id: string | null;
  affected_trains: string[] | null;
  priority: "low" | "medium" | "high" | "critical";
  risk_score: number | null;
  weather_context: any;
  ai_reasoning: string | null;
  status: "pending" | "approved" | "modified" | "dismissed";
  modified_action: string | null;
  processed_at: string | null;
  created_at: string;
}

export interface ActionLog {
  id: string;
  action_type: string;
  description: string;
  ai_action_id: string | null;
  metadata: any;
  created_at: string;
}

export interface WeatherData {
  id: string;
  location: string;
  temperature: number | null;
  condition: string | null;
  visibility_km: number | null;
  wind_speed_kmh: number | null;
  humidity: number | null;
  rain_probability: number | null;
  fog_risk: boolean;
  flood_risk: boolean;
  fetched_at: string;
}

// Cache for AI recommendations
let cachedAIResponse: { actions: AIAction[]; timestamp: number } | null = null;
const CACHE_DURATION = 60000; // 1 minute cache

export function useRailwayData() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [aiActions, setAiActions] = useState<AIAction[]>([]);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Debounce: prevent fetching if last fetch was less than 500ms ago
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime < 500) {
      return;
    }
    
    try {
      // Only show loading on initial load
      if (trains.length === 0) {
        setLoading(true);
      }
      
      // Fetch only essential fields to reduce payload size
      const [trainsRes, alertsRes, announcementsRes, aiActionsRes, logsRes, weatherRes] = await Promise.all([
        supabase.from("trains").select("id,train_number,train_name,origin,destination,current_location,last_station,next_station,scheduled_departure,actual_departure,scheduled_arrival,expected_arrival,delay_minutes,status,speed_kmh,platform,zone,risk_level,updated_at").order("train_number"),
        supabase.from("alerts").select("id,train_id,title,message,severity,alert_type,affected_routes,is_active,acknowledged,acknowledged_at,created_at,expires_at").eq("is_active", true).order("created_at", { ascending: false }).limit(20),
        supabase.from("announcements").select("id,title,content,target_audience,priority,is_ai_generated,is_active,created_at,expires_at").eq("is_active", true).order("created_at", { ascending: false }).limit(10),
        supabase.from("ai_actions").select("id,action_type,title,description,train_id,affected_trains,priority,risk_score,weather_context,ai_reasoning,status,modified_action,processed_at,created_at").order("created_at", { ascending: false }).limit(30),
        supabase.from("action_logs").select("id,action_type,description,ai_action_id,metadata,created_at").order("created_at", { ascending: false }).limit(30),
        supabase.from("weather_data").select("id,location,temperature,condition,visibility_km,wind_speed_kmh,humidity,rain_probability,fog_risk,flood_risk,fetched_at").order("location"),
      ]);

      if (trainsRes.error) throw trainsRes.error;
      if (alertsRes.error) throw alertsRes.error;
      if (announcementsRes.error) throw announcementsRes.error;
      if (aiActionsRes.error) throw aiActionsRes.error;
      if (logsRes.error) throw logsRes.error;
      if (weatherRes.error) throw weatherRes.error;

      setTrains(trainsRes.data as Train[] || []);
      setAlerts(alertsRes.data as Alert[] || []);
      setAnnouncements(announcementsRes.data as Announcement[] || []);
      setAiActions(aiActionsRes.data as AIAction[] || []);
      setActionLogs(logsRes.data as ActionLog[] || []);
      setWeather(weatherRes.data as WeatherData[] || []);
      setError(null);
      setLastFetchTime(now);
    } catch (err) {
      console.error("Error fetching railway data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [lastFetchTime, trains.length]);

  // Set up realtime subscriptions
  useEffect(() => {
    fetchData();

    const trainsChannel = supabase
      .channel("trains-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "trains" }, () => {
        fetchData();
      })
      .subscribe();

    const alertsChannel = supabase
      .channel("alerts-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "alerts" }, () => {
        fetchData();
      })
      .subscribe();

    const announcementsChannel = supabase
      .channel("announcements-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, () => {
        fetchData();
      })
      .subscribe();

    const aiActionsChannel = supabase
      .channel("ai-actions-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "ai_actions" }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(trainsChannel);
      supabase.removeChannel(alertsChannel);
      supabase.removeChannel(announcementsChannel);
      supabase.removeChannel(aiActionsChannel);
    };
  }, [fetchData]);

  return {
    trains,
    alerts,
    announcements,
    aiActions,
    actionLogs,
    weather,
    loading,
    error,
    refetch: fetchData
  };
}

export function useRailwayActions() {
  const [loading, setLoading] = useState(false);

  const callEdgeFunction = async (functionName: string, body: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(functionName, { body });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Edge function ${functionName} error:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = () => 
    callEdgeFunction("ai-railway-assistant", { action: "generate_recommendations" });

  const generateAnnouncement = (data: { context?: string; targetAudience?: string; trainNumbers?: string[] }) =>
    callEdgeFunction("ai-railway-assistant", { action: "generate_announcement", data });

  const analyzeRisk = () =>
    callEdgeFunction("ai-railway-assistant", { action: "analyze_risk" });

  const approveAction = (actionId: string, title: string) =>
    callEdgeFunction("ai-railway-assistant", { action: "approve_action", data: { actionId, title } });

  const modifyAction = (actionId: string, title: string, modifiedDescription: string) =>
    callEdgeFunction("ai-railway-assistant", { action: "modify_action", data: { actionId, title, modifiedDescription } });

  const dismissAction = (actionId: string, title: string) =>
    callEdgeFunction("ai-railway-assistant", { action: "dismiss_action", data: { actionId, title } });

  const sendAnnouncement = (content: string, targetAudience: string, title?: string, priority?: string) =>
    callEdgeFunction("ai-railway-assistant", { action: "send_announcement", data: { content, targetAudience, title, priority } });

  const acknowledgeAlert = (alertId: string, alertTitle: string) =>
    callEdgeFunction("ai-railway-assistant", { action: "acknowledge_alert", data: { alertId, alertTitle } });

  const fetchWeather = (locations?: string[]) =>
    callEdgeFunction("weather-service", { action: "fetch_weather", locations });

  const getWeatherAlerts = () =>
    callEdgeFunction("weather-service", { action: "get_alerts_for_weather" });

  return {
    loading,
    generateRecommendations,
    generateAnnouncement,
    analyzeRisk,
    approveAction,
    modifyAction,
    dismissAction,
    sendAnnouncement,
    acknowledgeAlert,
    fetchWeather,
    getWeatherAlerts
  };
}
