import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/supabase/auth/auth-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

  // Form states
  const [fullName, setFullName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [programmingLevel, setProgrammingLevel] = useState<'beginner' | 'proficient' | 'advanced'>('beginner');
  const [subdomainAvailable, setSubdomainAvailable] = useState(true);
  useEffect(() => {
    // If onboarding is completed, redirect to dashboard
    if (isOnboardingCompleted()) {
      navigate('/dashboard');
    }
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
      const {
        error
      } = await updateUserProfile({
        full_name: fullName
      });
      if (error) throw error;
      setCurrentStep('organization');
    } catch (error) {
      console.error("Failed to update name:", error);
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
    // For this example, we'll say the subdomain is available
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
      const {
        error
      } = await updateUserProfile({
        organization_name: organizationName
      });
      if (error) throw error;
      setCurrentStep('experience');
    } catch (error) {
      console.error("Failed to update organization:", error);
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
      const {
        error
      } = await updateUserProfile({
        programming_level: programmingLevel,
        onboarding_completed: true
      });
      if (error) throw error;
      toast({
        title: "Setup complete!",
        description: "Welcome to the platform."
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to update experience:", error);
      toast({
        title: "Update failed",
        description: "Could not save your experience level. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const renderNameStep = () => {
    return <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Hi, {user?.email?.split('@')[0]}</h2>
          <p className="text-muted-foreground">What's your full name?</p>
        </div>
        
        <Input type="text" placeholder="Grace Hopper" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full" disabled={loading} />
        
        <Button className="w-full" onClick={handleNameStep} disabled={loading || !fullName.trim()}>
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>;
  };
  const renderOrganizationStep = () => {
    return <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">What's the name of your organization?</h2>
        </div>
        
        <div className="flex items-center gap-0">
          <div className="relative flex-grow">
            <Input type="text" placeholder="myorganization" value={organizationName} onChange={e => {
            setOrganizationName(e.target.value);
            if (e.target.value.length > 2) {
              checkSubdomainAvailability(e.target.value);
            }
          }} className="w-full rounded-r-none" disabled={loading} />
            {organizationName.length > 2 && <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                {subdomainAvailable && <CheckCircle className="h-5 w-5 text-green-500" />}
              </div>}
          </div>
          
        </div>
        
        <p className="text-xs text-muted-foreground">Letters and numbers only</p>
        
        {organizationName.length > 2 && subdomainAvailable && <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-300 text-sm rounded-md p-2 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Subdomain available
          </div>}
        
        <Button className="w-full" onClick={handleOrganizationStep} disabled={loading || !organizationName.trim() || !subdomainAvailable}>
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>;
  };
  const renderExperienceStep = () => {
    return <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">How familiar are you with programming?</h2>
          <p className="text-muted-foreground">Your answer here will help us craft the best setup experience</p>
        </div>
        
        <RadioGroup value={programmingLevel} onValueChange={(value: any) => setProgrammingLevel(value)} className="space-y-0">
          <label className="flex items-center space-x-2 border rounded-t-md p-4 cursor-pointer hover:bg-accent">
            <RadioGroupItem value="advanced" id="advanced" />
            <span className="text-sm">Advanced, I love building apps</span>
          </label>
          <label className="flex items-center space-x-2 border border-t-0 p-4 cursor-pointer hover:bg-accent">
            <RadioGroupItem value="proficient" id="proficient" />
            <span className="text-sm">Proficient, I can hack something together</span>
          </label>
          <label className="flex items-center space-x-2 border border-t-0 rounded-b-md p-4 cursor-pointer hover:bg-accent">
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
  return <BeamsBackground>
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            {renderCurrentStep()}
          </CardContent>
        </Card>
      </div>
    </BeamsBackground>;
}