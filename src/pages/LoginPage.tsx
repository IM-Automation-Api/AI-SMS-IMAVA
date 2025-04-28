
import { useState } from "react";
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

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      const { error } = await signIn(data.email, data.password);

      if (error) {
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: "Google Sign in failed",
          description: error.message || "Could not sign in with Google",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast({
        title: "Google Sign in failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <BeamsBackground>
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/70 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-[0.12em] text-center">AI SMS AUTOMATION</CardTitle>
            <CardDescription className="text-center">Welcome back. Log in to your account below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              type="button" 
              disabled={isGoogleLoading} 
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2"
            >
              {isGoogleLoading ? (
                "Signing in..."
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 0, 0)">
                      <path d="M21.35,11.1H12v3.2h5.59c-0.56,2.19-2.42,3.78-5.59,3.78c-3.39,0-6.12-2.73-6.12-6.12s2.73-6.12,6.12-6.12 c1.49,0,2.85,0.55,3.9,1.44l2.47-2.47C17.12,3.68,14.7,2.7,12,2.7c-5.05,0-9.15,4.09-9.15,9.15s4.09,9.15,9.15,9.15 c5.29,0,8.82-3.72,8.82-8.96C20.93,11.62,20.78,11.1,21.35,11.1z"/>
                    </g>
                  </svg>
                  Sign in with Google
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card/70 px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@company.com" 
                          type="email" 
                          {...field} 
                          autoComplete="email"
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="••••••••" 
                          type="password" 
                          {...field} 
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-end">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Reset your password
                  </Link>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Need to create a new organization?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </BeamsBackground>
  );
}
