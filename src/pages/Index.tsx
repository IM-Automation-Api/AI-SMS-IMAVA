
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 bg-card border border-border shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-primary">AI SMS Platform</h1>
        <p className="text-center text-muted-foreground">
          Manage and automate your SMS communications with ease
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="default" className="bg-primary hover:bg-primary/90" asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            View History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
