export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_type: string | null
          consultation_reason: string | null
          created_at: string
          disclaimer: string | null
          doctor: string | null
          email: string | null
          has_medical_record: string | null
          id: number
          location: string | null
          medical_record_number: number
          mobile_number: number | null
          receive_updates: string | null
          specialty: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          appointment_type?: string | null
          consultation_reason?: string | null
          created_at?: string
          disclaimer?: string | null
          doctor?: string | null
          email?: string | null
          has_medical_record?: string | null
          id?: number
          location?: string | null
          medical_record_number?: number
          mobile_number?: number | null
          receive_updates?: string | null
          specialty?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          appointment_type?: string | null
          consultation_reason?: string | null
          created_at?: string
          disclaimer?: string | null
          doctor?: string | null
          email?: string | null
          has_medical_record?: string | null
          id?: number
          location?: string | null
          medical_record_number?: number
          mobile_number?: number | null
          receive_updates?: string | null
          specialty?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      appointments_new: {
        Row: {
          appointment_date: string
          client_id: string | null
          created_at: string | null
          duration: number | null
          id: number
          notes: string | null
          price: number | null
          service_type: string
          specialist_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          client_id?: string | null
          created_at?: string | null
          duration?: number | null
          id?: number
          notes?: string | null
          price?: number | null
          service_type: string
          specialist_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          client_id?: string | null
          created_at?: string | null
          duration?: number | null
          id?: number
          notes?: string | null
          price?: number | null
          service_type?: string
          specialist_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      client_progress: {
        Row: {
          appointment_id: number | null
          client_id: string
          created_at: string
          follow_up_date: string | null
          id: string
          issue_description: string | null
          progress_notes: string | null
          recommendations: string | null
          specialist_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          appointment_id?: number | null
          client_id: string
          created_at?: string
          follow_up_date?: string | null
          id?: string
          issue_description?: string | null
          progress_notes?: string | null
          recommendations?: string | null
          specialist_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          appointment_id?: number | null
          client_id?: string
          created_at?: string
          follow_up_date?: string | null
          id?: string
          issue_description?: string | null
          progress_notes?: string | null
          recommendations?: string | null
          specialist_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_progress_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments_new"
            referencedColumns: ["id"]
          },
        ]
      }
      foods: {
        Row: {
          calories: number | null
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          calories?: number | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          calories?: number | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      health_records: {
        Row: {
          attachments: Json | null
          client_id: string | null
          created_at: string | null
          created_by: string | null
          date: string
          description: string | null
          id: string
          record_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          date: string
          description?: string | null
          id?: string
          record_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string | null
          id?: string
          record_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lab_tests: {
        Row: {
          client_id: string | null
          created_at: string | null
          follow_up_date: string | null
          follow_up_scheduled: boolean | null
          id: string
          price: number | null
          report_url: string | null
          results: Json | null
          scheduled_date: string
          status: string | null
          test_name: string
          test_type: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          follow_up_date?: string | null
          follow_up_scheduled?: boolean | null
          id?: string
          price?: number | null
          report_url?: string | null
          results?: Json | null
          scheduled_date: string
          status?: string | null
          test_name: string
          test_type: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          follow_up_date?: string | null
          follow_up_scheduled?: boolean | null
          id?: string
          price?: number | null
          report_url?: string | null
          results?: Json | null
          scheduled_date?: string
          status?: string | null
          test_name?: string
          test_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      memberships: {
        Row: {
          created_at: string | null
          description: string
          features: Json
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          features?: Json
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string | null
          description?: string
          features?: Json
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          appointment_id: number | null
          created_at: string
          id: string
          is_read: boolean | null
          message_text: string
          message_type: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          appointment_id?: number | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_text: string
          message_type?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          appointment_id?: number | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_text?: string
          message_type?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments_new"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          membership_plan: string | null
          payment_method: string
          payment_status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          membership_plan?: string | null
          payment_method: string
          payment_status?: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          membership_plan?: string | null
          payment_method?: string
          payment_status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          availability: string | null
          bio: string | null
          consultation_fee: number | null
          created_at: string
          experience: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          is_online: boolean | null
          languages: string | null
          location: string | null
          membership_tier: string | null
          payment_method: string | null
          phone_number: string | null
          profile_picture_url: string | null
          role: string | null
          specialist_type: string | null
          subsequent_visits_fee: number | null
          updated_at: string
        }
        Insert: {
          availability?: string | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string
          experience?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          is_online?: boolean | null
          languages?: string | null
          location?: string | null
          membership_tier?: string | null
          payment_method?: string | null
          phone_number?: string | null
          profile_picture_url?: string | null
          role?: string | null
          specialist_type?: string | null
          subsequent_visits_fee?: number | null
          updated_at?: string
        }
        Update: {
          availability?: string | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string
          experience?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          languages?: string | null
          location?: string | null
          membership_tier?: string | null
          payment_method?: string | null
          phone_number?: string | null
          profile_picture_url?: string | null
          role?: string | null
          specialist_type?: string | null
          subsequent_visits_fee?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      Profiles: {
        Row: {
          created_at: string | null
          "full name": string
          id: string
          "phone number": number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          "full name": string
          id?: string
          "phone number"?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          "full name"?: string
          id?: string
          "phone number"?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          appointment_id: number | null
          client_id: string | null
          comment: string | null
          communication_rating: number | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          overall_rating: number | null
          professionalism_rating: number | null
          service_rating: number | null
          specialist_id: string | null
        }
        Insert: {
          appointment_id?: number | null
          client_id?: string | null
          comment?: string | null
          communication_rating?: number | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          overall_rating?: number | null
          professionalism_rating?: number | null
          service_rating?: number | null
          specialist_id?: string | null
        }
        Update: {
          appointment_id?: number | null
          client_id?: string | null
          comment?: string | null
          communication_rating?: number | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          overall_rating?: number | null
          professionalism_rating?: number | null
          service_rating?: number | null
          specialist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      specialist_services: {
        Row: {
          created_at: string
          description: string | null
          duration: number | null
          id: string
          is_active: boolean | null
          price: number
          service_name: string
          specialist_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          is_active?: boolean | null
          price: number
          service_name: string
          specialist_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          is_active?: boolean | null
          price?: number
          service_name?: string
          specialist_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      User: {
        Row: {
          created_at: string
          email: string | null
          id: number
          weight: number | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          weight?: number | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          weight?: number | null
        }
        Relationships: []
      }
      video_sessions: {
        Row: {
          appointment_id: number | null
          client_id: string | null
          created_at: string | null
          ended_at: string | null
          id: string
          session_token: string | null
          specialist_id: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          appointment_id?: number | null
          client_id?: string | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          session_token?: string | null
          specialist_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          appointment_id?: number | null
          client_id?: string | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          session_token?: string | null
          specialist_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_sessions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      WorkoutPlans: {
        Row: {
          "exercise name": string | null
          id: number
          reps: number | null
          sets: number | null
        }
        Insert: {
          "exercise name"?: string | null
          id?: number
          reps?: number | null
          sets?: number | null
        }
        Update: {
          "exercise name"?: string | null
          id?: number
          reps?: number | null
          sets?: number | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const