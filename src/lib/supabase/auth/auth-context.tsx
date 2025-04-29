import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id: string;
  full_name?: string;
  organization_name?: string;
  programming_level?: "beginner" | "proficient" | "advanced";
  onboarding_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

type ExtendedUser = User & {
  company_name?: string;
  phone?: string;
  profile?: UserProfile;
};

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: { company_name?: string; phone?: string }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<{ error: any }>;
  isOnboardingCompleted: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
  updateUserProfile: async () => ({ error: null }),
  isOnboardingCompleted: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string) => {
    console.log("Fetching user profile for:", userId);
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();
      
    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
    
    console.log("User profile data:", data);
    return data as UserProfile;
  };
  
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        
        if (event === "SIGNED_IN" && session) {
          const userData = session.user as ExtendedUser;
          console.log("User signed in:", userData.id);
          
          // Fetch user profile
          const profile = await fetchUserProfile(userData.id);
          if (profile) {
            userData.profile = profile;
            console.log("User profile fetched:", profile);
          } else {
            console.log("No user profile found or error fetching profile");
          }
          
          setUser(userData);
          
          // Check if user needs onboarding
          if (profile?.onboarding_completed) {
            console.log("User has completed onboarding, redirecting to dashboard");
            navigate('/dashboard');
          } else {
            console.log("User needs onboarding, redirecting to onboarding");
            navigate('/onboarding');
          }
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
          setUser(null);
        }
      }
    );

    // Then check for existing session
    const checkExistingSession = async () => {
      console.log("Checking for existing session");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Existing session:", session ? "found" : "not found");
      
      setSession(session);
      
      if (session?.user) {
        const userData = session.user as ExtendedUser;
        console.log("Found existing session for user:", userData.id);
        
        // Fetch user profile
        const profile = await fetchUserProfile(userData.id);
        if (profile) {
          userData.profile = profile;
          console.log("User profile fetched for existing session:", profile);
        } else {
          console.log("No user profile found for existing session");
        }
        
        setUser(userData);
      } else {
        console.log("No existing user session found");
      }
      
      setLoading(false);
    };
    
    checkExistingSession();

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    console.log("Signing in with email:", email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
      } else {
        console.log("Sign in successful:", data?.user?.id);
      }

      return { error };
    } catch (e) {
      console.error("Unexpected error during sign in:", e);
      return { error: e };
    }
  };

  const signInWithGoogle = async () => {
    console.log("Signing in with Google");
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (error) {
        console.error("Google sign in error:", error);
      } else {
        console.log("Google sign in initiated:", data);
      }

      return { error };
    } catch (e) {
      console.error("Unexpected error during Google sign in:", e);
      return { error: e };
    }
  };

  const signUp = async (email: string, password: string, userData: { company_name?: string; phone?: string }) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (!error && data?.user) {
      // Create user profile in users table
      const { error: profileError } = await supabase
        .from("users")
        .insert([
          {
            id: data.user.id,
            email,
            company_name: userData.company_name,
            phone: userData.phone,
          },
        ]);

      // Also initialize user_profiles table for onboarding
      const { error: onboardingError } = await supabase
        .from("user_profiles")
        .insert([{
          id: data.user.id,
          onboarding_completed: false,
        }]);

      if (profileError) {
        console.error("Error creating user profile:", profileError);
        return { error: profileError };
      }

      if (onboardingError) {
        console.error("Error initializing onboarding:", onboardingError);
      }
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    return { error };
  };
  
  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (!user) return { error: new Error("No user logged in") };
    
    console.log("Updating user profile:", profile);
    
    const { error } = await supabase
      .from("user_profiles")
      .upsert({
        id: user.id,
        ...profile,
      });
      
    if (!error) {
      console.log("User profile updated successfully");
      
      // Update local user state
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          profile: {
            ...prev.profile,
            ...profile,
          }
        };
      });
    } else {
      console.error("Error updating user profile:", error);
    }
      
    return { error };
  };
  
  const isOnboardingCompleted = () => {
    const completed = !!user?.profile?.onboarding_completed;
    console.log("Checking if onboarding is completed:", completed);
    return completed;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
        resetPassword,
        updateUserProfile,
        isOnboardingCompleted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
