
import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  full_name?: string;
  organization_name?: string;
  programming_level?: "beginner" | "proficient" | "advanced";
  onboarding_completed?: boolean;
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
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();
      
    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
    
    return data;
  };
  
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (event === "SIGNED_IN" && session) {
          const userData = session.user as ExtendedUser;
          
          // Fetch user profile
          const profile = await fetchUserProfile(userData.id);
          if (profile) {
            userData.profile = profile;
          }
          
          setUser(userData);
          console.log("User logged in:", userData);
          
          // Check if user needs onboarding
          if (profile?.onboarding_completed) {
            navigate('/dashboard');
          } else {
            navigate('/onboarding');
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const userData = session.user as ExtendedUser;
        
        // Fetch user profile
        const profile = await fetchUserProfile(userData.id);
        if (profile) {
          userData.profile = profile;
        }
        
        setUser(userData);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/onboarding`,
      },
    });

    return { error };
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
    
    const { error } = await supabase
      .from("user_profiles")
      .upsert({
        id: user.id,
        ...profile,
      });
      
    if (!error) {
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
    }
      
    return { error };
  };
  
  const isOnboardingCompleted = () => {
    return !!user?.profile?.onboarding_completed;
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
