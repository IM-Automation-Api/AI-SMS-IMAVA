
import React from 'react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-md w-full space-y-6 bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600">AI SMS Platform</h1>
        <p className="text-center text-gray-600">
          Manage and automate your SMS communications with ease
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="default">Send SMS</Button>
          <Button variant="outline">View History</Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
