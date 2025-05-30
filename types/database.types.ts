export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          created_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          group_name: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          group_name: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          group_name?: string
          created_by?: string
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          group_id: string
          title: string
          amount: number
          paid_by: string
          split_with: Json
          date: string
        }
        Insert: {
          id?: string
          group_id: string
          title: string
          amount: number
          paid_by: string
          split_with: Json
          date: string
        }
        Update: {
          id?: string
          group_id?: string
          title?: string
          amount?: number
          paid_by?: string
          split_with?: Json
          date?: string
        }
      }
    }
  }
}