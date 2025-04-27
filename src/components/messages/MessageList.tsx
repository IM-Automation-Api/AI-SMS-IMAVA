
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function MessageList() {
  return (
    <div className="self-stretch px-24 py-8 flex flex-col justify-start items-start gap-6">
      <div className="self-stretch inline-flex justify-start items-start gap-3">
        <Avatar className="w-12 h-12">
          <AvatarFallback>VA</AvatarFallback>
        </Avatar>
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-3">
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="min-h-6 inline-flex justify-start items-center gap-3">
              <div className="flex justify-start items-center gap-2">
                <div className="text-slate-800 text-base font-bold">IM AVA</div>
              </div>
              <div className="text-slate-400 text-sm font-medium">02:22 AM</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-3xl inline-flex justify-start items-start gap-2.5">
              <div className="text-slate-600 text-base font-normal leading-relaxed">
                Hello! I'm your personal AI Assistant. How can I help you today?
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
