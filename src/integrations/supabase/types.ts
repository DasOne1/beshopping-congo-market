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
      admin_profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          last_login: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          customer_id: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          product_id: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          product_id?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          product_id?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image: string | null
          is_visible: boolean
          name: string
          parent_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          is_visible?: boolean
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          is_visible?: boolean
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_auth: {
        Row: {
          created_at: string
          customer_id: string | null
          email: string
          email_verified: boolean
          id: string
          password_hash: string
          updated_at: string
          verification_token: string | null
          verification_token_expires_at: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          email: string
          email_verified?: boolean
          id?: string
          password_hash: string
          updated_at?: string
          verification_token?: string | null
          verification_token_expires_at?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          email?: string
          email_verified?: boolean
          id?: string
          password_hash?: string
          updated_at?: string
          verification_token?: string | null
          verification_token_expires_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_auth_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: Json | null
          created_at: string
          email: string | null
          id: string
          last_order_date: string | null
          name: string
          orders_count: number | null
          password_hash: string | null
          phone: string | null
          status: string | null
          total_spent: number | null
          updated_at: string
        }
        Insert: {
          address?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          last_order_date?: string | null
          name: string
          orders_count?: number | null
          password_hash?: string | null
          phone?: string | null
          status?: string | null
          total_spent?: number | null
          updated_at?: string
        }
        Update: {
          address?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          last_order_date?: string | null
          name?: string
          orders_count?: number | null
          password_hash?: string | null
          phone?: string | null
          status?: string | null
          total_spent?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_image: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_image?: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_image?: string | null
          product_name?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          discount_amount: number | null
          id: string
          notes: string | null
          order_number: string | null
          payment_method: string | null
          payment_status: string | null
          shipping_address: Json | null
          shipping_amount: number | null
          status: string | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          tracking_number: string | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          order_number?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          shipping_amount?: number | null
          status?: string | null
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          order_number?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          shipping_amount?: number | null
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          care_instructions: string | null
          category_id: string | null
          collection: string | null
          colors: string[] | null
          created_at: string
          description: string | null
          dimensions: Json | null
          discount: number | null
          discounted_price: number | null
          featured: boolean | null
          gender: string | null
          id: string
          images: string[] | null
          is_visible: boolean
          material: string | null
          name: string
          original_price: number
          popular: number | null
          season: string | null
          sizes: string[] | null
          sku: string | null
          status: string | null
          stock: number
          subcategory_id: string | null
          tags: string[] | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          brand?: string | null
          care_instructions?: string | null
          category_id?: string | null
          collection?: string | null
          colors?: string[] | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          discount?: number | null
          discounted_price?: number | null
          featured?: boolean | null
          gender?: string | null
          id?: string
          images?: string[] | null
          is_visible?: boolean
          material?: string | null
          name: string
          original_price: number
          popular?: number | null
          season?: string | null
          sizes?: string[] | null
          sku?: string | null
          status?: string | null
          stock?: number
          subcategory_id?: string | null
          tags?: string[] | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          brand?: string | null
          care_instructions?: string | null
          category_id?: string | null
          collection?: string | null
          colors?: string[] | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          discount?: number | null
          discounted_price?: number | null
          featured?: boolean | null
          gender?: string | null
          id?: string
          images?: string[] | null
          is_visible?: boolean
          material?: string | null
          name?: string
          original_price?: number
          popular?: number | null
          season?: string | null
          sizes?: string[] | null
          sku?: string | null
          status?: string | null
          stock?: number
          subcategory_id?: string | null
          tags?: string[] | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          id: string
          name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id: string
          name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
