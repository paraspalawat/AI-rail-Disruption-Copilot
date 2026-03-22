export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      action_logs: {
        Row: {
          action_type: string
          ai_action_id: string | null
          created_at: string
          description: string
          id: string
          metadata: Json | null
        }
        Insert: {
          action_type: string
          ai_action_id?: string | null
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          action_type?: string
          ai_action_id?: string | null
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "action_logs_ai_action_id_fkey"
            columns: ["ai_action_id"]
            isOneToOne: false
            referencedRelation: "ai_actions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_actions: {
        Row: {
          action_type: string
          affected_trains: string[] | null
          ai_reasoning: string | null
          created_at: string
          description: string
          id: string
          modified_action: string | null
          priority: string | null
          processed_at: string | null
          risk_score: number | null
          status: string | null
          title: string
          train_id: string | null
          weather_context: Json | null
        }
        Insert: {
          action_type: string
          affected_trains?: string[] | null
          ai_reasoning?: string | null
          created_at?: string
          description: string
          id?: string
          modified_action?: string | null
          priority?: string | null
          processed_at?: string | null
          risk_score?: number | null
          status?: string | null
          title: string
          train_id?: string | null
          weather_context?: Json | null
        }
        Update: {
          action_type?: string
          affected_trains?: string[] | null
          ai_reasoning?: string | null
          created_at?: string
          description?: string
          id?: string
          modified_action?: string | null
          priority?: string | null
          processed_at?: string | null
          risk_score?: number | null
          status?: string | null
          title?: string
          train_id?: string | null
          weather_context?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_actions_train_id_fkey"
            columns: ["train_id"]
            isOneToOne: false
            referencedRelation: "trains"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          acknowledged: boolean | null
          acknowledged_at: string | null
          affected_routes: string[] | null
          alert_type: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          message: string
          severity: string | null
          title: string
          train_id: string | null
        }
        Insert: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          affected_routes?: string[] | null
          alert_type: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          severity?: string | null
          title: string
          train_id?: string | null
        }
        Update: {
          acknowledged?: boolean | null
          acknowledged_at?: string | null
          affected_routes?: string[] | null
          alert_type?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          severity?: string | null
          title?: string
          train_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_train_id_fkey"
            columns: ["train_id"]
            isOneToOne: false
            referencedRelation: "trains"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          content: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          is_ai_generated: boolean | null
          priority: string | null
          target_audience: string | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_ai_generated?: boolean | null
          priority?: string | null
          target_audience?: string | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_ai_generated?: boolean | null
          priority?: string | null
          target_audience?: string | null
          title?: string
        }
        Relationships: []
      }
      trains: {
        Row: {
          actual_departure: string | null
          created_at: string
          current_location: string | null
          delay_minutes: number | null
          destination: string
          expected_arrival: string | null
          id: string
          last_station: string | null
          next_station: string | null
          origin: string
          platform: string | null
          risk_level: string | null
          scheduled_arrival: string | null
          scheduled_departure: string | null
          speed_kmh: number | null
          status: string | null
          train_name: string
          train_number: string
          updated_at: string
          zone: string | null
        }
        Insert: {
          actual_departure?: string | null
          created_at?: string
          current_location?: string | null
          delay_minutes?: number | null
          destination: string
          expected_arrival?: string | null
          id?: string
          last_station?: string | null
          next_station?: string | null
          origin: string
          platform?: string | null
          risk_level?: string | null
          scheduled_arrival?: string | null
          scheduled_departure?: string | null
          speed_kmh?: number | null
          status?: string | null
          train_name: string
          train_number: string
          updated_at?: string
          zone?: string | null
        }
        Update: {
          actual_departure?: string | null
          created_at?: string
          current_location?: string | null
          delay_minutes?: number | null
          destination?: string
          expected_arrival?: string | null
          id?: string
          last_station?: string | null
          next_station?: string | null
          origin?: string
          platform?: string | null
          risk_level?: string | null
          scheduled_arrival?: string | null
          scheduled_departure?: string | null
          speed_kmh?: number | null
          status?: string | null
          train_name?: string
          train_number?: string
          updated_at?: string
          zone?: string | null
        }
        Relationships: []
      }
      weather_data: {
        Row: {
          condition: string | null
          fetched_at: string
          flood_risk: boolean | null
          fog_risk: boolean | null
          humidity: number | null
          id: string
          location: string
          rain_probability: number | null
          raw_data: Json | null
          temperature: number | null
          visibility_km: number | null
          wind_speed_kmh: number | null
        }
        Insert: {
          condition?: string | null
          fetched_at?: string
          flood_risk?: boolean | null
          fog_risk?: boolean | null
          humidity?: number | null
          id?: string
          location: string
          rain_probability?: number | null
          raw_data?: Json | null
          temperature?: number | null
          visibility_km?: number | null
          wind_speed_kmh?: number | null
        }
        Update: {
          condition?: string | null
          fetched_at?: string
          flood_risk?: boolean | null
          fog_risk?: boolean | null
          humidity?: number | null
          id?: string
          location?: string
          rain_probability?: number | null
          raw_data?: Json | null
          temperature?: number | null
          visibility_km?: number | null
          wind_speed_kmh?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
