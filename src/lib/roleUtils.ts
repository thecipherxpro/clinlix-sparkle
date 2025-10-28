import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if the current user has a specific role using the user_roles table
 * This is more secure than checking roles from the profiles table
 */
export async function checkUserRole(userId: string, expectedRole: 'customer' | 'provider'): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', expectedRole)
      .single();

    if (error) {
      console.error('Error checking user role:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Exception checking user role:', error);
    return false;
  }
}

/**
 * Gets the user's primary role from the user_roles table
 */
export async function getUserRole(userId: string): Promise<'customer' | 'provider' | null> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .limit(1)
      .single();

    if (error) {
      console.error('Error getting user role:', error);
      return null;
    }

    return data.role as 'customer' | 'provider';
  } catch (error) {
    console.error('Exception getting user role:', error);
    return null;
  }
}
