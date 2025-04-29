import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface AuthError {
  message: string;
  status?: number;
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string): Promise<{
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}> {
  console.log("Auth utility: Attempting email sign in for:", email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Auth utility: Sign in error:", error);
      return { 
        user: null, 
        session: null, 
        error: { 
          message: error.message || "Failed to sign in", 
          status: error.status 
        } 
      };
    }
    
    console.log("Auth utility: Sign in successful for:", email);
    return { user: data.user, session: data.session, error: null };
  } catch (e) {
    console.error("Auth utility: Unexpected error during sign in:", e);
    const error = e as Error;
    return { 
      user: null, 
      session: null, 
      error: { 
        message: error.message || "An unexpected error occurred" 
      } 
    };
  }
}

// Sign in with Google
export async function signInWithGoogle(): Promise<{
  error: AuthError | null;
}> {
  console.log("Auth utility: Initiating Google sign in");
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/onboarding`,
      },
    });

    if (error) {
      console.error("Auth utility: Google sign in error:", error);
      return { error: { message: error.message || "Failed to sign in with Google" } };
    }

    console.log("Auth utility: Google sign in initiated");
    return { error: null };
  } catch (e) {
    console.error("Auth utility: Unexpected error during Google sign in:", e);
    const error = e as Error;
    return { error: { message: error.message || "An unexpected error occurred" } };
  }
}

// Sign up with email
export async function signUpWithEmail(
  email: string, 
  password: string, 
  userData: { 
    company_name?: string; 
    phone?: string; 
    full_name?: string;
  }
): Promise<{
  error: AuthError | null;
}> {
  console.log("Auth utility: Attempting sign up for:", email);
  try {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) {
      console.error("Auth utility: Sign up error:", error);
      return { error: { message: error.message || "Failed to sign up" } };
    }

    if (!data.user) {
      console.error("Auth utility: Sign up failed - no user returned");
      return { error: { message: "Failed to create user account" } };
    }

    // Create user profile in users table
    const { error: profileError } = await supabase
      .from("users")
      .insert([{
        id: data.user.id,
        email,
        company_name: userData.company_name,
        full_name: userData.full_name,
        phone: userData.phone,
      }]);

    // Also initialize user_profiles table for onboarding
    const { error: onboardingError } = await supabase
      .from("user_profiles")
      .insert([{
        id: data.user.id,
        full_name: userData.full_name,
        organization_name: userData.company_name,
        onboarding_completed: true, // Set to true since we're skipping onboarding
      }]);

    if (profileError) {
      console.error("Auth utility: Error creating user profile:", profileError);
      return { error: { message: "Account created but failed to set up profile" } };
    }

    if (onboardingError) {
      console.error("Auth utility: Error initializing profile:", onboardingError);
      // We don't return an error here since the user was still created
    }

    console.log("Auth utility: Sign up successful for:", email);
    return { error: null };
  } catch (e) {
    console.error("Auth utility: Unexpected error during sign up:", e);
    const error = e as Error;
    return { error: { message: error.message || "An unexpected error occurred" } };
  }
}

// Sign out
export async function signOutUser(): Promise<void> {
  console.log("Auth utility: Signing out user");
  await supabase.auth.signOut();
}

// Reset password
export async function resetPassword(email: string): Promise<{
  error: AuthError | null;
}> {
  console.log("Auth utility: Requesting password reset for:", email);
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error("Auth utility: Password reset error:", error);
      return { error: { message: error.message || "Failed to request password reset" } };
    }

    console.log("Auth utility: Password reset email sent to:", email);
    return { error: null };
  } catch (e) {
    console.error("Auth utility: Unexpected error during password reset:", e);
    const error = e as Error;
    return { error: { message: error.message || "An unexpected error occurred" } };
  }
}

// Fetch user profile
export async function fetchUserProfile(userId: string): Promise<{
  profile: any | null;
  error: AuthError | null;
}> {
  console.log("Auth utility: Fetching user profile for:", userId);
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();
      
    if (error) {
      console.error("Auth utility: Error fetching user profile:", error);
      return { profile: null, error: { message: error.message || "Failed to fetch user profile" } };
    }
    
    console.log("Auth utility: User profile fetched:", data);
    return { profile: data, error: null };
  } catch (e) {
    console.error("Auth utility: Unexpected error fetching user profile:", e);
    const error = e as Error;
    return { profile: null, error: { message: error.message || "An unexpected error occurred" } };
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  profile: any
): Promise<{
  error: AuthError | null;
}> {
  console.log("Auth utility: Updating user profile for:", userId);
  try {
    const { error } = await supabase
      .from("user_profiles")
      .upsert({
        id: userId,
        ...profile,
      });
      
    if (error) {
      console.error("Auth utility: Error updating user profile:", error);
      return { error: { message: error.message || "Failed to update user profile" } };
    }
    
    console.log("Auth utility: User profile updated for:", userId);
    return { error: null };
  } catch (e) {
    console.error("Auth utility: Unexpected error updating user profile:", e);
    const error = e as Error;
    return { error: { message: error.message || "An unexpected error occurred" } };
  }
}
