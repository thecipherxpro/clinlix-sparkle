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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          addon_ids: string[] | null
          address_id: string
          completed_at: string | null
          confirmed_at: string | null
          created_at: string | null
          customer_id: string
          has_review: boolean | null
          id: string
          job_status: string | null
          overtime_minutes: number | null
          package_id: string
          payment_intent_id: string | null
          payment_status: string
          provider_id: string | null
          requested_date: string
          requested_time: string
          started_at: string | null
          status: string
          total_estimate: number
          total_final: number | null
          updated_at: string | null
        }
        Insert: {
          addon_ids?: string[] | null
          address_id: string
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          customer_id: string
          has_review?: boolean | null
          id?: string
          job_status?: string | null
          overtime_minutes?: number | null
          package_id: string
          payment_intent_id?: string | null
          payment_status?: string
          provider_id?: string | null
          requested_date: string
          requested_time: string
          started_at?: string | null
          status?: string
          total_estimate: number
          total_final?: number | null
          updated_at?: string | null
        }
        Update: {
          addon_ids?: string[] | null
          address_id?: string
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          customer_id?: string
          has_review?: boolean | null
          id?: string
          job_status?: string | null
          overtime_minutes?: number | null
          package_id?: string
          payment_intent_id?: string | null
          payment_status?: string
          provider_id?: string | null
          requested_date?: string
          requested_time?: string
          started_at?: string | null
          status?: string
          total_estimate?: number
          total_final?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "customer_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "cleaning_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cleaning_addons: {
        Row: {
          created_at: string | null
          id: string
          name_en: string
          name_pt: string
          price: number
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name_en: string
          name_pt: string
          price: number
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name_en?: string
          name_pt?: string
          price?: number
          type?: string
        }
        Relationships: []
      }
      cleaning_packages: {
        Row: {
          areas_included: string[] | null
          bedroom_count: number
          id: string
          one_time_price: number
          package_code: string
          package_name: string
          recurring_price: number
          time_included: string
        }
        Insert: {
          areas_included?: string[] | null
          bedroom_count: number
          id?: string
          one_time_price: number
          package_code: string
          package_name: string
          recurring_price: number
          time_included: string
        }
        Update: {
          areas_included?: string[] | null
          bedroom_count?: number
          id?: string
          one_time_price?: number
          package_code?: string
          package_name?: string
          recurring_price?: number
          time_included?: string
        }
        Relationships: []
      }
      customer_addresses: {
        Row: {
          apt_unit: string | null
          city: string | null
          codigo_postal: string | null
          country: string
          created_at: string | null
          currency: string
          customer_id: string
          distrito: string | null
          email: string
          first_name: string
          id: string
          is_primary: boolean | null
          label: string
          last_name: string
          layout_type: string
          localidade: string | null
          package_code: string
          phone: string
          porta_andar: string | null
          postal_code: string | null
          property_type: string
          province: string | null
          rua: string | null
          street: string | null
          updated_at: string | null
        }
        Insert: {
          apt_unit?: string | null
          city?: string | null
          codigo_postal?: string | null
          country: string
          created_at?: string | null
          currency?: string
          customer_id: string
          distrito?: string | null
          email: string
          first_name: string
          id?: string
          is_primary?: boolean | null
          label: string
          last_name: string
          layout_type: string
          localidade?: string | null
          package_code: string
          phone: string
          porta_andar?: string | null
          postal_code?: string | null
          property_type: string
          province?: string | null
          rua?: string | null
          street?: string | null
          updated_at?: string | null
        }
        Update: {
          apt_unit?: string | null
          city?: string | null
          codigo_postal?: string | null
          country?: string
          created_at?: string | null
          currency?: string
          customer_id?: string
          distrito?: string | null
          email?: string
          first_name?: string
          id?: string
          is_primary?: boolean | null
          label?: string
          last_name?: string
          layout_type?: string
          localidade?: string | null
          package_code?: string
          phone?: string
          porta_andar?: string | null
          postal_code?: string | null
          property_type?: string
          province?: string | null
          rua?: string | null
          street?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_addresses_package_code_fkey"
            columns: ["package_code"]
            isOneToOne: false
            referencedRelation: "cleaning_packages"
            referencedColumns: ["package_code"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          id: string
          read_status: boolean | null
          target_url: string | null
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          read_status?: boolean | null
          target_url?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          read_status?: boolean | null
          target_url?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      overtime_rules: {
        Row: {
          id: string
          increment_minutes: number
          price_cad: number
          price_eur: number
        }
        Insert: {
          id?: string
          increment_minutes?: number
          price_cad?: number
          price_eur?: number
        }
        Update: {
          id?: string
          increment_minutes?: number
          price_cad?: number
          price_eur?: number
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          used: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          used?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          used?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accept_recurring: boolean | null
          available_status: boolean | null
          avatar_url: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          email: string
          first_name: string
          id: string
          language: string | null
          last_name: string
          notifications_enabled: boolean | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          sms_notifications: boolean | null
          updated_at: string | null
        }
        Insert: {
          accept_recurring?: boolean | null
          available_status?: boolean | null
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          email: string
          first_name: string
          id: string
          language?: string | null
          last_name: string
          notifications_enabled?: boolean | null
          phone?: string | null
          role: Database["public"]["Enums"]["app_role"]
          sms_notifications?: boolean | null
          updated_at?: string | null
        }
        Update: {
          accept_recurring?: boolean | null
          available_status?: boolean | null
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string
          first_name?: string
          id?: string
          language?: string | null
          last_name?: string
          notifications_enabled?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          sms_notifications?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      provider_availability: {
        Row: {
          created_at: string | null
          date: string
          end_time: string
          id: string
          provider_id: string
          start_time: string
        }
        Insert: {
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          provider_id: string
          start_time: string
        }
        Update: {
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          provider_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_availability_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          experience_years: number | null
          full_name: string
          id: string
          languages: string[] | null
          new_provider: boolean | null
          photo_url: string | null
          rating_avg: number | null
          rating_count: number | null
          service_areas: string[] | null
          skills: string[] | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          experience_years?: number | null
          full_name: string
          id?: string
          languages?: string[] | null
          new_provider?: boolean | null
          photo_url?: string | null
          rating_avg?: number | null
          rating_count?: number | null
          service_areas?: string[] | null
          skills?: string[] | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          experience_years?: number | null
          full_name?: string
          id?: string
          languages?: string[] | null
          new_provider?: boolean | null
          photo_url?: string | null
          rating_avg?: number | null
          rating_count?: number | null
          service_areas?: string[] | null
          skills?: string[] | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string | null
          customer_id: string
          id: string
          provider_id: string
          rating: number
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string | null
          customer_id: string
          id?: string
          provider_id: string
          rating: number
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string | null
          customer_id?: string
          id?: string
          provider_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "provider_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_wallet: {
        Row: {
          addon_amount: number | null
          base_amount: number
          booking_id: string
          created_at: string | null
          id: string
          overtime_amount: number | null
          payout_due: number
          platform_fee: number
          provider_id: string
          status: string
          total_earned: number
        }
        Insert: {
          addon_amount?: number | null
          base_amount: number
          booking_id: string
          created_at?: string | null
          id?: string
          overtime_amount?: number | null
          payout_due: number
          platform_fee: number
          provider_id: string
          status?: string
          total_earned: number
        }
        Update: {
          addon_amount?: number | null
          base_amount?: number
          booking_id?: string
          created_at?: string | null
          id?: string
          overtime_amount?: number | null
          payout_due?: number
          platform_fee?: number
          provider_id?: string
          status?: string
          total_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "provider_wallet_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_wallet_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "provider_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          subscription_data: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          subscription_data: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          subscription_data?: Json
          updated_at?: string | null
          user_id?: string
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
      app_role: "customer" | "provider"
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
    Enums: {
      app_role: ["customer", "provider"],
    },
  },
} as const
