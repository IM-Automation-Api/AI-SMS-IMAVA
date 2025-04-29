
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Key, Bot, Bell, Phone } from "lucide-react";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { TwilioSettings } from "@/components/settings/TwilioSettings";
import { ApiKeysSettings } from "@/components/settings/ApiKeysSettings";
import { AISettings } from "@/components/settings/AISettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl tracking-[0.12em] font-zag">Settings</h1>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-8 flex flex-wrap">
          <TabsTrigger value="account" className="mr-2 mb-2">
            <Settings className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="twilio" className="mr-2 mb-2">
            <Phone className="h-4 w-4 mr-2" />
            Twilio
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="mr-2 mb-2">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="ai-settings" className="mr-2 mb-2">
            <Bot className="h-4 w-4 mr-2" />
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="notifications" className="mb-2">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>

        <TabsContent value="twilio">
          <TwilioSettings />
        </TabsContent>

        <TabsContent value="api-keys">
          <ApiKeysSettings />
        </TabsContent>

        <TabsContent value="ai-settings">
          <AISettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
