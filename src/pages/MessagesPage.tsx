
import React, { Suspense } from 'react';
import { MessagesLayout } from "@/components/messages/MessagesLayout";
import { Skeleton } from "@/components/ui/skeleton";

const MessagesLoader = () => (
  <div className="h-[calc(100vh-10rem)] flex flex-col">
    <div className="p-6">
      <Skeleton className="h-10 w-32 mb-6" />
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="flex-1 flex flex-col h-[calc(100vh-18rem)]">
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-background to-background/95 flex flex-col gap-4">
          <Skeleton className="h-16 w-3/4 ml-auto" />
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-16 w-3/4 ml-auto" />
        </div>
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  </div>
);

export default function MessagesPage() {
  return (
    <Suspense fallback={<MessagesLoader />}>
      <MessagesLayout />
    </Suspense>
  );
}
