
import React, { Suspense } from 'react';
import { MessagesLayout } from "@/components/messages/MessagesLayout";
import { Skeleton } from "@/components/ui/skeleton";

const MessagesLoadingSkeleton = () => (
  <div className="w-full h-full flex glass-effect rounded-2xl shadow-lg mx-auto my-4 max-w-7xl">
    <div className="w-72 glass-effect rounded-l-2xl p-4 space-y-4">
      <Skeleton className="w-48 h-6 bg-white/10" />
      <Skeleton className="w-full h-10 bg-white/5" />
      <div className="space-y-3">
        <Skeleton className="w-full h-14 rounded-lg bg-white/5" />
        <Skeleton className="w-full h-14 rounded-lg bg-white/5" />
        <Skeleton className="w-full h-14 rounded-lg bg-white/5" />
      </div>
    </div>
    <div className="flex-1 flex flex-col p-6">
      <Skeleton className="w-48 h-8 mb-6 bg-white/10" />
      <Skeleton className="w-full h-10 mb-8 bg-white/10" />
      <div className="flex-1 flex flex-col justify-end space-y-4 p-6">
        <Skeleton className="w-2/3 h-16 ml-auto rounded-lg bg-white/5" />
        <Skeleton className="w-3/4 h-16 rounded-lg bg-white/5" />
        <Skeleton className="w-2/3 h-16 ml-auto rounded-lg bg-white/5" />
      </div>
      <Skeleton className="w-full h-16 rounded-lg bg-white/10" />
    </div>
  </div>
);

export default function MessagesPage() {
  return (
    <Suspense fallback={<MessagesLoadingSkeleton />}>
      <div className="max-w-7xl mx-auto">
        <MessagesLayout />
      </div>
    </Suspense>
  );
}
