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
      document_views: {
        Row: {
          created_at: string
          department: string | null
          document_id: string
          document_title: string | null
          document_type: string
          id: string
          search_query: string | null
          user_session: string | null
          view_date: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          document_id: string
          document_title?: string | null
          document_type: string
          id?: string
          search_query?: string | null
          user_session?: string | null
          view_date?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          document_id?: string
          document_title?: string | null
          document_type?: string
          id?: string
          search_query?: string | null
          user_session?: string | null
          view_date?: string
        }
        Relationships: []
      }
      pdf_documents: {
        Row: {
          content_text: string | null
          department: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_url: string | null
          id: string
          page_count: number | null
          status: string | null
          title: string | null
          upload_date: string
        }
        Insert: {
          content_text?: string | null
          department?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          page_count?: number | null
          status?: string | null
          title?: string | null
          upload_date?: string
        }
        Update: {
          content_text?: string | null
          department?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          page_count?: number | null
          status?: string | null
          title?: string | null
          upload_date?: string
        }
        Relationships: []
      }
      popular_statistics: {
        Row: {
          created_at: string
          department: string | null
          document_id: string
          document_title: string | null
          document_type: string
          id: string
          last_viewed: string | null
          monthly_views: number | null
          rank_position: number | null
          updated_at: string
          view_count: number | null
          weekly_growth_rate: number | null
          weekly_views: number | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          document_id: string
          document_title?: string | null
          document_type: string
          id?: string
          last_viewed?: string | null
          monthly_views?: number | null
          rank_position?: number | null
          updated_at?: string
          view_count?: number | null
          weekly_growth_rate?: number | null
          weekly_views?: number | null
        }
        Update: {
          created_at?: string
          department?: string | null
          document_id?: string
          document_title?: string | null
          document_type?: string
          id?: string
          last_viewed?: string | null
          monthly_views?: number | null
          rank_position?: number | null
          updated_at?: string
          view_count?: number | null
          weekly_growth_rate?: number | null
          weekly_views?: number | null
        }
        Relationships: []
      }
      search_logs: {
        Row: {
          created_at: string
          id: string
          query: string
          results_count: number | null
          search_date: string
          user_session: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          query: string
          results_count?: number | null
          search_date?: string
          user_session?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          query?: string
          results_count?: number | null
          search_date?: string
          user_session?: string | null
        }
        Relationships: []
      }
      결재문서목록: {
        Row: {
          id: number
          공개여부: string | null
          생성일자: string | null
          전체부서명: string | null
          제목: string | null
        }
        Insert: {
          id: number
          공개여부?: string | null
          생성일자?: string | null
          전체부서명?: string | null
          제목?: string | null
        }
        Update: {
          id?: number
          공개여부?: string | null
          생성일자?: string | null
          전체부서명?: string | null
          제목?: string | null
        }
        Relationships: []
      }
      직원정보: {
        Row: {
          id: number
          담당업무: string | null
          부서명: string | null
          전화번호: string | null
          직책: string | null
          팩스번호: string | null
        }
        Insert: {
          id: number
          담당업무?: string | null
          부서명?: string | null
          전화번호?: string | null
          직책?: string | null
          팩스번호?: string | null
        }
        Update: {
          id?: number
          담당업무?: string | null
          부서명?: string | null
          전화번호?: string | null
          직책?: string | null
          팩스번호?: string | null
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
