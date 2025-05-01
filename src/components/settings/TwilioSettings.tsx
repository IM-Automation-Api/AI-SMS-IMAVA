
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/supabase/auth/auth-context";
import { Loader2 } from "lucide-react";

export function TwilioSettings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [twilioData, setTwilioData] = useState({
    accountSid: "",
    authToken: "",
    phoneNumber: "",
  });

  // Fetch existing Twilio credentials on component mount
  useEffect(() => {
    const fetchTwilioCredentials = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("twilio_credentials")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "Results contain 0 rows" which is expected if no credentials exist
          console.error("Error fetching Twilio credentials:", error);
        } else if (data) {
          setTwilioData({
            accountSid: data.account_sid,
            authToken: data.auth_token,
            phoneNumber: data.phone_number,
          });
        }
      } catch (error) {
        console.error("Error fetching Twilio credentials:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTwilioCredentials();
  }, [user]);

  const handleTwilioInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTwilioData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveTwilioCredentials = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save credentials.",
        variant: "destructive",
      });
      return;
    }
    
    if (!twilioData.accountSid || !twilioData.authToken || !twilioData.phoneNumber) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    try {
      console.log("Saving Twilio credentials for user:", user.id);
      
      // Check if credentials already exist
      const { data: existingData, error: fetchError } = await supabase
        .from("twilio_credentials")
        .select("id")
        .eq("user_id", user.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "Results contain 0 rows" which is expected if no credentials exist
        console.error("Error checking existing credentials:", fetchError);
        throw new Error("Failed to check existing credentials");
      }
      
      let result;
      
      if (existingData) {
        console.log("Updating existing Twilio credentials");
        // Update existing credentials
        result = await supabase
          .from("twilio_credentials")
          .update({
            account_sid: twilioData.accountSid,
            auth_token: twilioData.authToken,
            phone_number: twilioData.phoneNumber,
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);
      } else {
        console.log("Inserting new Twilio credentials");
        // Insert new credentials
        result = await supabase
          .from("twilio_credentials")
          .insert({
            user_id: user.id,
            account_sid: twilioData.accountSid,
            auth_token: twilioData.authToken,
            phone_number: twilioData.phoneNumber,
            is_active: true,
          });
      }
      
      if (result.error) {
        console.error("Error saving Twilio credentials:", result.error);
        throw result.error;
      }
      
      console.log("Twilio credentials saved successfully");
      
      toast({
        title: "Twilio credentials saved",
        description: "Your Twilio credentials have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving Twilio credentials:", error);
      toast({
        title: "Error",
        description: "Failed to save Twilio credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Twilio Credentials</CardTitle>
        <CardDescription>
          Configure your Twilio credentials for SMS messaging services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm">
          These credentials are required to send and receive SMS messages through the application.
        </p>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading credentials...</span>
          </div>
        ) : (
          <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Twilio Account SID</label>
            <Input
              type="text"
              name="accountSid"
              value={twilioData.accountSid}
              onChange={handleTwilioInputChange}
              className="w-full"
              placeholder="Enter your Twilio Account SID"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Twilio Auth Token</label>
            <Input
              type="password"
              name="authToken"
              value={twilioData.authToken}
              onChange={handleTwilioInputChange}
              className="w-full"
              placeholder="Enter your Twilio Auth Token"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Twilio Phone Number</label>
            <Input
              type="text"
              name="phoneNumber"
              value={twilioData.phoneNumber}
              onChange={handleTwilioInputChange}
              className="w-full"
              placeholder="+1234567890"
            />
          </div>
          <Button 
            onClick={handleSaveTwilioCredentials} 
            className="mt-4"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Credentials"
            )}
          </Button>
        </div>
        )}
      </CardContent>
    </Card>
  );
}
