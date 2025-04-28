"use client";
import { useEffect } from 'react';
import { redirect } from 'next/navigation'
import { useAuth } from '@/lib/supabase/auth/auth-context';
import { ComponentType } from 'react';
import { usePathname } from "next/navigation";
import { useRouter } from 'next/navigation';

export const isAlreadyLoggedIn = () => {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (user && !loading && ["/login", "/signup", "/forgot-password"].includes(pathname)) {
    redirect('/dashboard');
  }
};



const checkAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // If the user is not authenticated, redirect them to the login page
      if (!user) {
        router.push('/login');
      }
    }, [user, router]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default checkAuth;


