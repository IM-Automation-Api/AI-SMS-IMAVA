
import React from "react";
import { cn } from "@/lib/utils";

interface HeroCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const HeroCard = React.forwardRef<HTMLDivElement, HeroCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-gradient-to-br from-[#0a0a0f] via-[#121018] to-[#1b1226] border border-[#4b2a78]/40 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.05),0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md rounded-2xl p-6 text-white",
          className
        )}
        {...props}
      />
    );
  }
);

HeroCard.displayName = "HeroCard";

export const HeroCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 mb-4", className)}
    {...props}
  />
));

HeroCardHeader.displayName = "HeroCardHeader";

export const HeroCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-medium text-white",
      className
    )}
    {...props}
  />
));

HeroCardTitle.displayName = "HeroCardTitle";

export const HeroCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-400", className)}
    {...props}
  />
));

HeroCardDescription.displayName = "HeroCardDescription";

export const HeroCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));

HeroCardContent.displayName = "HeroCardContent";

export const HeroCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center mt-4", className)}
    {...props}
  />
));

HeroCardFooter.displayName = "HeroCardFooter";

