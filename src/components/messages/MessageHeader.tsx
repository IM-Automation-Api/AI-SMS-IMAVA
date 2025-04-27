
import { Button } from "@/components/ui/button";
import { download, moreHorizontal, bellDot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function MessageHeader() {
  return (
    <div className="self-stretch p-6 border-b border-slate-200 inline-flex justify-between items-center overflow-hidden">
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-2.5">
        <div className="justify-start text-slate-800 text-3xl font-extrabold font-['Plus Jakarta Sans'] leading-9">
          IM AVA 🤖
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center gap-2">
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full">
          <bellDot className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full">
          <moreHorizontal className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex-1 flex justify-end items-center gap-2">
        <Button variant="outline" size="icon" className="w-10 h-10 rounded-full">
          <download className="w-5 h-5" />
        </Button>
        <Avatar>
          <AvatarFallback>VA</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
