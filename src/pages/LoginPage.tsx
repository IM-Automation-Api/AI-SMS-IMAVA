
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/supabase/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { BeamsBackground } from "@/components/ui/beams-background";

// Define the form schema outside component to prevent recreation on each render
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
});
type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [submitAttempts, setSubmitAttempts] = useState(0);

  // Pre-initialize form with resolver and default values
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // This effect will log diagnostic information when login errors occur
  useEffect(() => {
    if (loginError) {
      console.log("LoginPage: Login error detected:", loginError);
      console.log("LoginPage: Form values (email only):", form.getValues("email"));
      console.log("LoginPage: Submit attempts:", submitAttempts);
    }
  }, [loginError, submitAttempts, form]);
  
  const onSubmit = async (data: FormData) => {
    if (isLoading) {
      console.log("LoginPage: Submit blocked - already loading");
      return;
    }

    // Reset any previous errors
    setLoginError(null);
    setIsLoading(true);
    setSubmitAttempts(prev => prev + 1);
    console.log(`LoginPage: Login attempt ${submitAttempts + 1} with email:`, data.email);
    console.log("LoginPage: Browser info:", navigator.userAgent);
    
    try {
      console.time("LoginPage: signIn call duration");
      const { error } = await signIn(data.email, data.password);
      console.timeEnd("LoginPage: signIn call duration");
      
      if (error) {
        console.error("LoginPage: Login error:", error);
        setLoginError(error.message || "Invalid email or password");
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password",
          variant: "destructive"
        });
      } else {
        console.log("LoginPage: Login successful");
        toast({
          title: "Login successful",
          description: "Welcome back!"
        });
        // Auth context handles the redirect
      }
    } catch (error) {
      console.error("LoginPage: Unexpected error:", error);
      setLoginError("An unexpected error occurred. Please try again.");
      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    if (isGoogleLoading) {
      console.log("LoginPage: Google sign-in blocked - already in progress");
      return;
    }
    
    setIsGoogleLoading(true);
    setLoginError(null);
    
    try {
      console.log("LoginPage: Initiating Google sign in");
      console.time("LoginPage: Google sign-in duration");
      const { error } = await signInWithGoogle();
      console.timeEnd("LoginPage: Google sign-in duration");
      
      if (error) {
        console.error("LoginPage: Google sign in error:", error);
        setLoginError(error.message || "Could not sign in with Google");
        toast({
          title: "Google Sign in failed",
          description: error.message || "Could not sign in with Google",
          variant: "destructive"
        });
      } else {
        // Google auth will redirect, so we don't need to do anything here
        console.log("LoginPage: Google sign in initiated (redirecting)");
      }
    } catch (error) {
      console.error("LoginPage: Unexpected Google sign in error:", error);
      setLoginError("An unexpected error occurred with Google sign in");
      toast({
        title: "Google Sign in failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <BeamsBackground>
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md glass-panel border-white/10">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/ee6adf79-8c4c-4f35-850e-7ec0b80ceb23.png" 
                alt="Company Logo" 
                className="h-20 w-auto object-fill" 
              />
            </div>
            <CardTitle className="text-3xl font-bold text-gradient text-center">
              AI SMS AUTOMATION
            </CardTitle>
            <CardDescription className="text-center text-white/70">
              Welcome back. Log in to your account below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              type="button" 
              disabled={isGoogleLoading} 
              onClick={handleGoogleSignIn} 
              className="w-full flex items-center justify-center gap-2 premium-input hover:bg-white/5"
            >
              {isGoogleLoading ? "Signing in..." : (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 0, 0)">
                      <path d="M21.35,11.1H12v3.2h5.59c-0.56,2.19-2.42,3.78-5.59,3.78c-3.39,0-6.12-2.73-6.12-6.12s2.73-6.12,6.12-6.12 c1.49,0,2.85,0.55,3.9,1.44l2.47-2.47C17.12,3.68,14.7,2.7,12,2.7c-5.05,0-9.15,4.09-9.15,9.15s4.09,9.15,9.15,9.15 c5.29,0,8.82-3.72,8.82-8.96C20.93,11.62,20.78,11.1,21.35,11.1z" />
                    </g>
                  </svg>
                  Sign in with Google
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/30 px-2 text-white/50">Or continue with</span>
              </div>
            </div>
            
            {loginError && (
              <div className="p-3 text-sm bg-red-500/20 text-red-200 rounded-md">
                {loginError}
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField 
                  control={form.control} 
                  name="email" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@company.com" 
                          type="email" 
                          {...field} 
                          autoComplete="email" 
                          className="premium-input bg-black/20 border-white/10 text-white placeholder-white/40" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                
                <FormField 
                  control={form.control} 
                  name="password" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="••••••••" 
                          type="password" 
                          {...field} 
                          autoComplete="current-password" 
                          className="premium-input bg-black/20 border-white/10 text-white placeholder-white/40" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                
                <div className="flex items-center justify-end">
                  <Link to="/forgot-password" className="text-sm text-indigo-300 hover:text-indigo-200 hover:underline">
                    Reset your password
                  </Link>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full premium-button" 
                  disabled={isLoading} 
                  data-testid="login-button"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-white/70">
              Need to create a new organization?{" "}
              <Link to="/signup" className="text-indigo-300 hover:text-indigo-200 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </BeamsBackground>
  );
}
