import React from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = {
  default: "bg-[#1A2332] text-[#94A3B8] border-[#222D3F]",
  brass: "bg-[#D4A359]/15 text-[#D4A359] border-[#D4A359]/35 font-semibold",
  amber: "bg-[#D4A359]/15 text-[#D4A359] border-[#D4A359]/35 font-semibold",
  steel: "bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/35",
  blue: "bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/35",
  teal: "bg-[#14B8A6]/15 text-[#14B8A6] border-[#14B8A6]/35",
  violet: "bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/35 font-semibold",
  purple: "bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/35 font-semibold",
  red: "bg-[#E05252]/15 text-[#E05252] border-[#E05252]/35",
  green: "bg-[#34D399]/15 text-[#34D399] border-[#34D399]/35",
  outline: "border-[#222D3F] text-[#F1F5F9]",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[4px] border px-2 py-0.5 text-[10px] font-mono tracking-wide transition-colors",
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    />
  );
}
