
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export function NotificationSettings() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: false,
    sms: false,
    browser: true,
  });

  const handleSaveChanges = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleNotificationToggle = (type: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure how and when you receive notifications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Set up notifications for new messages, lead activities, and system alerts.
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={() => handleNotificationToggle('email')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">SMS Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Receive notifications via SMS
              </p>
            </div>
            <Switch
              checked={notifications.sms}
              onCheckedChange={() => handleNotificationToggle('sms')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Browser Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Receive notifications in your browser
              </p>
            </div>
            <Switch
              checked={notifications.browser}
              onCheckedChange={() => handleNotificationToggle('browser')}
            />
          </div>
        </div>
        <Button onClick={handleSaveChanges} className="mt-6">Save Preferences</Button>
      </CardContent>
    </Card>
  );
}
