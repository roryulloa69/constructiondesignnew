import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {showSignup ? "Create Account" : "Admin Login"}
          </h1>
          <p className="text-muted-foreground">
            {showSignup
              ? "Sign up to manage project videos"
              : "Login to manage project videos"}
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          {showSignup ? <SignupForm /> : <LoginForm />}

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setShowSignup(!showSignup)}
              className="text-sm"
            >
              {showSignup
                ? "Already have an account? Login"
                : "Don't have an account? Sign up"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
