// File: /lib/supabase/auth/auth-context.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/components/ui/toast";

type User = {
  id: string;
  email: string;
  company_name?: string;
  phone?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => { },
  resetPassword: async () => ({ error: null }),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for active session on mount and subscribe to auth changes
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.info(error.message);
        setLoading(false);
        setUser(null);
        return false;
      }
      if (data.session) {
        setUser(data.session.user as User);
      }
      setLoading(false);
      return true;
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setUser(session.user as User);
          // Use window.location for a full page navigation instead of client-side routing
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 500);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          // Use window.location for a full page navigation instead of client-side routing
          setTimeout(() => {
            window.location.href = "/login";
          }, 500);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // Session timeout detection
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (user) {
          signOut();
          toast({
            title: "Session expired",
            description: "Your session has expired due to inactivity. Please sign in again.",
            variant: "destructive",
          });
        }
      }, 30 * 60 * 1000); // 30 minutes
    };

    const handleActivity = () => resetInactivityTimer();

    if (user) {
      resetInactivityTimer();
      window.addEventListener("mousemove", handleActivity);
      window.addEventListener("keypress", handleActivity);
      window.addEventListener("click", handleActivity);
      window.addEventListener("scroll", handleActivity);
    }

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keypress", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { error };
      }
      if (data.user) {
        setUser(data.user as User);
        // Navigation handled in onAuthStateChange
      }
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: userData },
      });
      if (error) {
        return { error };
      }
      if (data.user) {
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
        if (profileError) {
          console.error("Error creating user profile:", profileError);
          return { error: profileError };
        }
        setUser(data.user as User);
        // Navigation handled in onAuthStateChange
      }
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      // Use window.location for a full page navigation instead of client-side routing
      window.location.href = "/login";
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const contextValue = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
