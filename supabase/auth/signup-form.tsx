// components/auth/signup-form.tsx
"use client";

import { useState } from "react";
import { redirect } from 'next/navigation'
import { useAuth } from "@/lib/supabase/auth/auth-context";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card";
import Link from "next/link";

export function SignupForm() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signUp(email, password, {
      company_name: companyName,
      phone,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
    // redirect to login page.
    console.log("User signed up successfully");
    redirect("/login");
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Sign up to start automating your SMS communications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              className="shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="shadow-sm"
            />
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters long
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your Company"
              required
              className="shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+15551234567"
              className="shadow-sm"
            />
          </div>
          <Button
            type="submit"
            className="w-full shadow-md"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
