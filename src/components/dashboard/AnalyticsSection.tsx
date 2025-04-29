
import React from 'react';
import { UserSatisfactionCard } from './UserSatisfactionCard';
import { ConversationLengthCard } from './ConversationLengthCard';

export const AnalyticsSection = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <UserSatisfactionCard />
      <ConversationLengthCard />
    </div>
  );
};
