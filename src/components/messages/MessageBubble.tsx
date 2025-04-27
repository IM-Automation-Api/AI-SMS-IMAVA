
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MessageBubbleProps {
  message: string;
  timestamp: string;
  isUser?: boolean;
  avatarText?: string;
}

export function MessageBubble({ message, timestamp, isUser = false, avatarText = "VA" }: MessageBubbleProps) {
  return (
    <div className={cn(
      "self-stretch inline-flex justify-start items-start gap-3",
      isUser && "flex-row-reverse"
    )}>
      <Avatar className="w-12 h-12">
        <AvatarFallback>{avatarText}</AvatarFallback>
      </Avatar>
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-3">
        <div className="self-stretch flex flex-col justify-start items-start gap-1">
          <div className="min-h-6 inline-flex justify-start items-center gap-3">
            <div className="flex justify-start items-center gap-2">
              <div className="text-foreground text-base font-bold">
                {isUser ? "You" : "IM AVA"}
              </div>
            </div>
            <div className="text-muted-foreground text-sm font-medium">
              {timestamp}
            </div>
          </div>
          <div className={cn(
            "p-3 rounded-3xl inline-flex justify-start items-start gap-2.5",
            isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          )}>
            <div className="text-base font-normal leading-relaxed">
              {message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
