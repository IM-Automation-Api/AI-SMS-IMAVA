
import { Button } from "@/components/ui/button";
import { bellDot, download } from "lucide-react";

export function MessageInput() {
  return (
    <div className="self-stretch px-8 py-6 flex flex-col justify-start items-start gap-2.5">
      <div className="self-stretch p-4 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-start items-start gap-2.5 overflow-hidden">
        <div className="self-stretch flex flex-col justify-start items-end gap-12">
          <div className="self-stretch inline-flex justify-start items-center gap-2">
            <bellDot className="w-6 h-6 text-slate-400" />
            <div className="flex-1 text-slate-600 text-base font-medium">
              Message to IM AVA...
            </div>
          </div>
          <div className="self-stretch inline-flex justify-end items-start gap-2">
            <Button variant="outline" size="icon" className="w-10 h-10 rounded-full">
              <download className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="w-10 h-10 rounded-full">
              <bellDot className="w-5 h-5" />
            </Button>
            <Button className="rounded-full">
              <span>Send</span>
              <bellDot className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
