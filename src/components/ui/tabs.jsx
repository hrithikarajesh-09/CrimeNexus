import React from 'react';
import { cn } from '../../lib/utils';

export function Tabs({ className, ...props }) {
  return <div className={cn("space-y-3", className)} {...props} />;
}

export function TabsList({ className, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-[5px] bg-[#1F2430] p-1 border border-[#2B313D] text-[#9AA3B2]",
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, isActive, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-[4px] px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-[#C68A46] text-[#12151B] font-semibold"
          : "text-[#9AA3B2] hover:text-[#E8EAEE] hover:bg-[#282F3F]",
        className
      )}
      {...props}
    />
  );
}
