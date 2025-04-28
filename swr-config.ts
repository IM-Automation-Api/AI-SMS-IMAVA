import { SWRConfig } from 'swr';
import React from 'react';

export const swrOptions = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshInterval: 0,
  dedupingInterval: 2000,
};

export function SWRProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  return React.createElement(SWRConfig, { value: swrOptions }, children);
}
