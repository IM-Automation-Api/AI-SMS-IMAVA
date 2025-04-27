
import { Button } from "@/components/ui/button";
import { Download, BellDot, Users, FileText, MessageSquare } from "lucide-react";

export function MessagesSidebar() {
  return (
    <div className="w-96 bg-slate-50 border-r border-slate-200 inline-flex flex-col justify-start items-start gap-1 overflow-hidden">
      <div className="self-stretch px-6 py-5 border-b border-slate-300 inline-flex justify-start items-center gap-4">
        <div className="flex-1 flex justify-start items-center gap-2">
          <BellDot className="w-8 h-8 text-indigo-600" />
          <div className="text-slate-800 text-3xl font-extrabold">IM AVA</div>
        </div>
        <Button variant="outline" size="icon" className="w-10 h-10 rounded-full">
          <Download className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="self-stretch border-b border-slate-300 flex flex-col justify-start items-start">
        <Button variant="ghost" className="w-full px-6 py-5 justify-start gap-2">
          <Users className="w-6 h-6" />
          <span className="text-lg font-bold">Explore Assistants</span>
        </Button>
        
        <Button variant="ghost" className="w-full px-6 py-5 justify-start gap-2">
          <FileText className="w-6 h-6" />
          <span className="text-lg font-bold">Assistant Store</span>
        </Button>
        
        <Button variant="ghost" className="w-full px-6 py-5 justify-start gap-2">
          <MessageSquare className="w-6 h-6" />
          <span className="text-lg font-bold">Custom Instructions</span>
        </Button>
      </div>
      
      {/* Recent conversations section */}
      <div className="self-stretch py-2 border-b border-slate-300 flex flex-col justify-start items-start">
        <div className="self-stretch px-6 pt-4 pb-3 inline-flex justify-between items-center">
          <div className="text-slate-800 text-lg font-bold">Today</div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-base">5 Total</span>
            <BellDot className="w-6 h-6" />
          </div>
        </div>
        
        {/* Conversation items */}
        <Button variant="ghost" className="w-full px-6 py-3 justify-start">
          <span className="text-slate-800">How can I help you today?</span>
        </Button>
      </div>
    </div>
  );
}
