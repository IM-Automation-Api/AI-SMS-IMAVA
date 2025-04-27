
import { ThemeProvider } from "@/lib/supabase/context/theme-provider";
import { AuthProvider } from "@/lib/supabase/auth/auth-context";
import { SWRProvider } from "@/lib/swr-config";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <AuthProvider>
          <SWRProvider>{children}</SWRProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
