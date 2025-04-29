import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/supabase/auth/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BeamsBackground } from "@/components/ui/beams-background";
import { CheckCircle } from "lucide-react";

type OnboardingStep = 'name' | 'organization' | 'experience';

export default function OnboardingPage() {
  const {
    user,
    updateUserProfile,
    isOnboardingCompleted
  } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('name');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [programmingLevel, setProgrammingLevel] = useState<'beginner' | 'proficient' | 'advanced'>('beginner');
  const [subdomainAvailable, setSubdomainAvailable] = useState(true);

  // Check onboarding status when component mounts
  useEffect(() => {
    console.log("Onboarding: Initial check if onboarding is needed");
    
    const checkOnboardingStatus = () => {
      try {
        const completed = isOnboardingCompleted();
        console.log("Onboarding: Initial check - onboarding completed status:", completed);
        
        if (completed) {
          console.log("Onboarding: Initial check found onboarding completed, redirecting to dashboard");
          setRedirecting(true);
          navigate('/dashboard', { replace: true });
        }
      } finally {
        // Always set initializing to false after check completes, regardless of result
        setInitializing(false);
      }
    };
    
    // Small delay to ensure auth context is fully initialized
    const timer = setTimeout(checkOnboardingStatus, 300);
    return () => clearTimeout(timer);
  }, [isOnboardingCompleted, navigate]);
  
  const handleNameStep = async () => {
    if (!fullName.trim()) {
      toast({
        title: "Required Field",
        description: "Please enter your full name",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await updateUserProfile({ full_name: fullName });
      
      if (error) {
        console.error("Onboarding: Failed to update name:", error);
        throw error;
      }
      
      console.log("Onboarding: Name step completed successfully");
      setCurrentStep('organization');
    } catch (error) {
      console.error("Onboarding: Failed to update name:", error);
      toast({
        title: "Update failed",
        description: "Could not save your name. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const checkSubdomainAvailability = (subdomain: string) => {
    // Simulate checking availability - in a real app, this would be an API call
    setSubdomainAvailable(true);
  };
  
  const handleOrganizationStep = async () => {
    if (!organizationName.trim()) {
      toast({
        title: "Required Field",
        description: "Please enter your organization name",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await updateUserProfile({ organization_name: organizationName });
      
      if (error) {
        console.error("Onboarding: Failed to update organization:", error);
        throw error;
      }
      
      console.log("Onboarding: Organization step completed successfully");
      setCurrentStep('experience');
    } catch (error) {
      console.error("Onboarding: Failed to update organization:", error);
      toast({
        title: "Update failed",
        description: "Could not save your organization. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleExperienceStep = async () => {
    setLoading(true);
    try {
      console.log("Onboarding: Completing final step with programming level:", programmingLevel);
      const { error } = await updateUserProfile({
        programming_level: programmingLevel,
        onboarding_completed: true
      });
      
      if (error) {
        console.error("Onboarding: Failed to update experience:", error);
        throw error;
      }
      
      console.log("Onboarding: Onboarding completed, redirecting to dashboard");
      toast({
        title: "Setup complete!",
        description: "Welcome to the platform."
      });
      
      // Set redirecting state to prevent UI flicker
      setRedirecting(true);
      // Use replace to prevent back button returning to onboarding
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error("Onboarding: Failed to update experience:", error);
      toast({
        title: "Update failed",
        description: "Could not save your experience level. Please try again.",
        variant: "destructive"
      });
      setRedirecting(false);
    } finally {
      setLoading(false);
    }
  };

  const renderNameStep = () => {
    return <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold font-mono">Hi, {user?.email?.split('@')[0]}</h2>
          <p className="text-muted-foreground font-mono">What's your full name?</p>
        </div>
        
        <Input type="text" placeholder="Grace Hopper" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full font-mono" disabled={loading} />
        
        <Button className="w-full" onClick={handleNameStep} disabled={loading || !fullName.trim()}>
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>;
  };

  const renderOrganizationStep = () => {
    return <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold font-mono">What's the name of your organization?</h2>
        </div>
        
        <div className="w-full">
          <Input 
            type="text" 
            placeholder="My Organization" 
            value={organizationName} 
            onChange={e => {
              setOrganizationName(e.target.value);
              if (e.target.value.length > 2) {
                checkSubdomainAvailability(e.target.value);
              }
            }} 
            className="w-full font-mono" 
            disabled={loading} 
          />
          <p className="text-xs text-muted-foreground mt-2 font-mono">Letters and numbers only</p>
          
          {organizationName.length > 2 && subdomainAvailable && <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-300 text-sm rounded-md p-2 mt-2 flex items-center font-mono">
              <CheckCircle className="h-4 w-4 mr-2" />
              Organization name available
            </div>}
        </div>
        
        <Button className="w-full" onClick={handleOrganizationStep} disabled={loading || !organizationName.trim() || !subdomainAvailable}>
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>;
  };

  const renderExperienceStep = () => {
    return <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold font-mono">How familiar are you with programming?</h2>
          <p className="text-muted-foreground font-mono">Your answer here will help us craft the best setup experience</p>
        </div>
        
        <RadioGroup value={programmingLevel} onValueChange={(value: any) => setProgrammingLevel(value)} className="space-y-0">
          <label className="flex items-center space-x-2 border rounded-t-md p-4 cursor-pointer hover:bg-accent font-mono">
            <RadioGroupItem value="advanced" id="advanced" />
            <span className="text-sm">Advanced, I love building apps</span>
          </label>
          <label className="flex items-center space-x-2 border border-t-0 p-4 cursor-pointer hover:bg-accent font-mono">
            <RadioGroupItem value="proficient" id="proficient" />
            <span className="text-sm">Proficient, I can hack something together</span>
          </label>
          <label className="flex items-center space-x-2 border border-t-0 rounded-b-md p-4 cursor-pointer hover:bg-accent font-mono">
            <RadioGroupItem value="beginner" id="beginner" />
            <span className="text-sm">Beginner, I've never written code before</span>
          </label>
        </RadioGroup>
        
        <Button className="w-full" onClick={handleExperienceStep} disabled={loading}>
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'name':
        return renderNameStep();
      case 'organization':
        return renderOrganizationStep();
      case 'experience':
        return renderExperienceStep();
      default:
        return null;
    }
  };
  
  // Show loading screen during initial check and redirecting
  if (initializing || redirecting) {
    return (
      <BeamsBackground>
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="text-center bg-card/70 backdrop-blur-sm p-8 rounded-lg">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
              <p className="text-xl font-mono">
                {initializing ? "Checking your profile..." : "Redirecting to dashboard..."}
              </p>
            </div>
          </div>
        </div>
      </BeamsBackground>
    );
  }

  return (
    <BeamsBackground>
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6 font-mono">
            {renderCurrentStep()}
          </CardContent>
        </Card>
      </div>
    </BeamsBackground>
  );
}
