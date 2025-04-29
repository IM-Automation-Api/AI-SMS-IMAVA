import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from 'react-router-dom';

const messages = [
  {
    id: 1,
    name: "John Doe",
    message: "Hey there! How's it going?",
    time: "2 mins ago",
    avatar: "https://github.com/shadcn.png"
  },
  {
    id: 2,
    name: "Alice Smith",
    message: "Just finished the report. Can you review it?",
    time: "5 mins ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b2933e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 3,
    name: "Bob Johnson",
    message: "Reminder: Meeting at 3 PM today.",
    time: "10 mins ago",
    avatar: "https://images.unsplash.com/photo-1500648767791-00d5a4ee9baa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
  },
  {
    id: 4,
    name: "Emily White",
    message: "Need your approval on the new design.",
    time: "20 mins ago",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd6ca6ac9e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 5,
    name: "David Brown",
    message: "Updated the project timeline. Please check.",
    time: "30 mins ago",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936e79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
  },
  {
    id: 6,
    name: "John Doe",
    message: "Hey there! How's it going?",
    time: "2 mins ago",
    avatar: "https://github.com/shadcn.png"
  },
  {
    id: 7,
    name: "Alice Smith",
    message: "Just finished the report. Can you review it?",
    time: "5 mins ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b2933e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 8,
    name: "Bob Johnson",
    message: "Reminder: Meeting at 3 PM today.",
    time: "10 mins ago",
    avatar: "https://images.unsplash.com/photo-1500648767791-00d5a4ee9baa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
  },
  {
    id: 9,
    name: "Emily White",
    message: "Need your approval on the new design.",
    time: "20 mins ago",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd6ca6ac9e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    id: 10,
    name: "David Brown",
    message: "Updated the project timeline. Please check.",
    time: "30 mins ago",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936e79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
  },
];

export const CommunicationsLogCard = () => {
  return (
    <Card className="neo-blur border-white/5 transition-all duration-300 rounded-xl shadow-glow">
      <CardHeader>
        <CardTitle className="text-gradient-primary">Communications Log</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] w-full">
          <div className="space-y-4 p-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={message.avatar} alt={message.name} />
                  <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none text-gray-300">{message.name}</p>
                  <p className="text-sm text-gray-400">{message.message}</p>
                  <time className="block text-xs text-gray-500">{message.time}</time>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
