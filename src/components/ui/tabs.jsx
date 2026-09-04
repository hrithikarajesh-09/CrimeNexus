import React from 'react';
import { cn } from '../../lib/utils';

export function Tabs({ className, ...props }) {
  return <div className={cn("space-y-3", className)} {...props} />;
}

export function TabsList({ className, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-[6px] bg-[#1A2332] p-1 border border-[#222D3F] text-[#94A3B8]",
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
          ? "bg-[#D4A359] text-[#0B0F17] font-semibold"
          : "text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1D2738]",
        className
      )}
      {...props}
    />
  );
}
