
import { ApiProviderSelector } from "@/components/settings/api-provider-selector";
import { SystemPromptEditor } from "@/components/settings/system-prompt-editor";

export default function AISettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-8">AI Settings</h1>
      <div className="space-y-8">
        <ApiProviderSelector />
        <SystemPromptEditor />
      </div>
    </div>
  );
}
