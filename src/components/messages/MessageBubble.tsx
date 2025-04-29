
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Check } from 'lucide-react';

export type MessageType = 'user' | 'bot' | 'system';

interface MessageBubbleProps {
  content: string;
  type: MessageType;
  timestamp?: string;
  avatar?: string;
  name?: string;
  status?: 'sent' | 'delivered' | 'read';
}

export function MessageBubble({
  content,
  type,
  timestamp = '12:45 PM',
  avatar,
  name,
  status = 'read',
}: MessageBubbleProps) {
  const isUser = type === 'user';
  const isBot = type === 'bot';
  const isSystem = type === 'system';
  
  return (
    <div className={cn(
      'flex gap-3 mb-4 max-w-[85%] group fade-in',
      isUser ? 'self-end flex-row-reverse' : 'self-start',
      isSystem ? 'self-center' : ''
    )}>
      {!isUser && !isSystem && (
        <Avatar className="h-8 w-8 mt-1">
          {avatar ? <img src={avatar} alt={name} /> : <span>{name?.charAt(0) || 'A'}</span>}
        </Avatar>
      )}
      
      <div className="flex flex-col">
        {!isUser && !isSystem && name && (
          <span className="text-xs text-muted-foreground mb-1">{name}</span>
        )}
        
        <div className={cn(
          'rounded-2xl p-3 text-sm shadow-soft',
          isUser && 'message-sent-gradient text-primary-foreground rounded-tr-none',
          isBot && 'message-received-gradient text-foreground rounded-tl-none',
          isSystem && 'glass-effect text-accent-foreground text-center text-xs py-1.5 rounded-xl'
        )}>
          {content}
        </div>
        
        <div className={cn(
          'flex text-xs text-muted-foreground mt-1',
          isUser ? 'justify-end' : 'justify-start'
        )}>
          <span>{timestamp}</span>
          
          {isUser && (
            <div className="flex items-center ml-1.5">
              {status === 'read' && (
                <Check className="h-3 w-3 text-primary" />
              )}
              {status === 'delivered' && (
                <Check className="h-3 w-3" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
