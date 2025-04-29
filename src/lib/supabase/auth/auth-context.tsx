
import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  signOutUser,
  resetPassword,
  fetchUserProfile,
  updateUserProfile as updateProfile,
  AuthError
} from "./auth-utils";

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
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, userData: { company_name?: string; phone?: string }) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<{ error: AuthError | null }>;
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

  // Function to safely fetch user profile outside of auth state change
  const loadUserProfile = async (userId: string) => {
    console.log("Auth context: Loading user profile for:", userId);
    const { profile, error } = await fetchUserProfile(userId);
    
    if (profile && !error) {
      console.log("Auth context: Profile loaded successfully:", profile);
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          profile
        };
      });
      
      return profile;
    } else {
      console.error("Auth context: Failed to load profile:", error);
    }
    
    return null;
  };

  useEffect(() => {
    console.log("Auth context: Setting up auth state listener");
    
    // Set up auth state listener first to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth context: Auth state changed:", event, currentSession?.user?.id);
        
        // Update session state immediately
        setSession(currentSession);
        
        if (event === "SIGNED_IN" && currentSession) {
          const currentUser = currentSession.user as ExtendedUser;
          console.log("Auth context: User signed in:", currentUser.id);
          
          // Set user immediately without profile
          setUser(currentUser);
          
          // Fetch profile separately to avoid blocking the auth state change
          setTimeout(async () => {
            try {
              const profile = await loadUserProfile(currentUser.id);
              console.log("Auth context: Profile loaded:", profile ? "success" : "not found");
              
              if (profile?.onboarding_completed) {
                console.log("Auth context: User has completed onboarding, redirecting to dashboard");
                navigate('/dashboard', { replace: true });
              } else {
                console.log("Auth context: User needs onboarding, redirecting to onboarding");
                navigate('/onboarding', { replace: true });
              }
            } catch (error) {
              console.error("Auth context: Error loading user profile:", error);
            }
          }, 300);
        } else if (event === "SIGNED_OUT") {
          console.log("Auth context: User signed out");
          setUser(null);
        }
      }
    );

    // Then check for existing session
    const checkExistingSession = async () => {
      console.log("Auth context: Checking for existing session");
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        console.log("Auth context: Existing session:", existingSession ? "found" : "not found");
        
        setSession(existingSession);
        
        if (existingSession?.user) {
          const currentUser = existingSession.user as ExtendedUser;
          console.log("Auth context: Found existing session for user:", currentUser.id);
          
          // Set user immediately without profile
          setUser(currentUser);
          
          // Fetch profile separately
          try {
            const profile = await loadUserProfile(currentUser.id);
            console.log("Auth context: Profile for existing session:", profile ? "loaded" : "not found");
          } catch (error) {
            console.error("Auth context: Error loading existing user profile:", error);
          } finally {
            setLoading(false);
          }
        } else {
          console.log("Auth context: No existing user session found");
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth context: Error checking existing session:", error);
        setLoading(false);
      }
    };
    
    checkExistingSession();

    return () => {
      console.log("Auth context: Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    console.log("Auth context: Signing in with email:", email);
    const { user: signedInUser, session: newSession, error } = await signInWithEmail(email, password);
    
    if (!error && signedInUser) {
      console.log("Auth context: Sign-in successful, setting session");
      setSession(newSession);
      setUser(signedInUser as ExtendedUser);
    } else {
      console.error("Auth context: Sign-in failed:", error);
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string, userData: { company_name?: string; phone?: string }) => {
    console.log("Auth context: Signing up with email:", email);
    const { error } = await signUpWithEmail(email, password, userData);
    return { error };
  };

  const signOut = async () => {
    console.log("Auth context: Signing out user");
    await signOutUser();
    setUser(null);
    setSession(null);
    navigate('/', { replace: true });
  };

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (!user) {
      console.error("Auth context: Cannot update profile - no user logged in");
      return { error: { message: "No user logged in" } };
    }
    
    console.log("Auth context: Updating user profile", profile);
    const { error } = await updateProfile(user.id, profile);
    
    if (!error) {
      console.log("Auth context: User profile updated successfully");
      
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
      console.error("Auth context: Failed to update user profile:", error);
    }
      
    return { error };
  };
  
  const isOnboardingCompleted = () => {
    const completed = !!user?.profile?.onboarding_completed;
    console.log("Auth context: Checking if onboarding is completed:", completed);
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
