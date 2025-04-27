
import { Link } from "react-router-dom";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">AI SMS Automation</h1>
        <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-center mb-6">Create an Account</h2>
          {/* Placeholder for signup form - implement auth first */}
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
        <p className="text-center text-sm mt-4 text-muted-foreground">
          By signing up, you agree to our Terms and Conditions.
        </p>
      </div>
    </div>
  );
}
