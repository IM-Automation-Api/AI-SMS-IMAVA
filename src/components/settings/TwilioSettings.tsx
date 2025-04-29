
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function TwilioSettings() {
  const { toast } = useToast();
  const [twilioData, setTwilioData] = useState({
    accountSid: "",
    authToken: "",
    phoneNumber: "",
  });

  const handleTwilioInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTwilioData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveTwilioCredentials = () => {
    toast({
      title: "Twilio credentials saved",
      description: "Your Twilio credentials have been saved successfully.",
    });
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
          <Button onClick={handleSaveTwilioCredentials} className="mt-4">Save Credentials</Button>
        </div>
      </CardContent>
    </Card>
  );
}
