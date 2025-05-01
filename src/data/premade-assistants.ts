export interface PremadeAssistant {
  id: string;
  name: string;
  role: string;
  status: string;
  avatar?: string;
  system_prompt?: string;
  initial_prompt?: string;
}

export const premadeAssistants: PremadeAssistant[] = [
  {
    id: "ava-solar",
    name: "AVA Solar",
    role: "Solar energy specialist assistant",
    status: "active",
    avatar: "/lovable-uploads/5ea85af7-0a44-4b29-bc40-6d45118c8482.png",
    system_prompt: "You are AVA Solar, a specialist in solar energy solutions. Help customers understand solar options, benefits, and installation processes."
  },
  {
    id: "ava-roofing",
    name: "AVA Roofing",
    role: "Roofing specialist assistant",
    status: "active",
    avatar: "/lovable-uploads/aa250a01-2f1b-4e50-a1c8-f4cd432b282a.png",
    system_prompt: "You are AVA Roofing, a specialist in roofing solutions. Help customers understand roofing options, materials, and installation processes."
  }
];
