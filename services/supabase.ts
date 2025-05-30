import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = 'https://fhrkdeejcqqfofgsiluf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZocmtkZWVqY3FxZm9mZ3NpbHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NDA1NTEsImV4cCI6MjA2NDExNjU1MX0.5_z4ilJ4z-KwvZm21bMOdZW2XWxDHgK0jKzmCWO-ORU';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function signUpUser(email: string, password: string, name: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  const { error: profileError } = await supabase
    .from('users')
    .insert([{ id: authData.user?.id, email, name }]);

  if (profileError) throw profileError;

  return authData;
}

export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function createGroup(groupName: string, userId: string) {
  const { data, error } = await supabase
    .from('groups')
    .insert([{
      group_name: groupName,
      created_by: userId,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getGroupsByUser(userId: string) {
  const { data, error } = await supabase
    .from('groups')
    .select(`
      *,
      expenses (*)
    `)
    .eq('created_by', userId);

  if (error) throw error;
  return data;
}

export async function addExpense(
  groupId: string,
  title: string,
  amount: number,
  paidBy: string,
  splitWith: string[],
  date: string
) {
  const { data, error } = await supabase
    .from('expenses')
    .insert([{
      group_id: groupId,
      title,
      amount,
      paid_by: paidBy,
      split_with: splitWith,
      date,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getGroupExpenses(groupId: string) {
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      *,
      users!paid_by (name)
    `)
    .eq('group_id', groupId);

  if (error) throw error;
  return data;
}