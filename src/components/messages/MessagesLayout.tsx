
import { ReactNode } from "react";

interface MessagesLayoutProps {
  children: ReactNode;
}

export function MessagesLayout({ children }: MessagesLayoutProps) {
  return (
    <div className="w-[1000px] bg-white inline-flex flex-col justify-start items-start">
      {children}
    </div>
  );
}
