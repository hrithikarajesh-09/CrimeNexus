import React from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = {
  default: "bg-[#1F2430] text-[#9AA3B2] border-[#2B313D]",
  brass: "bg-[#C68A46]/15 text-[#C68A46] border-[#C68A46]/35 font-semibold",
  steel: "bg-[#6C93B8]/15 text-[#6C93B8] border-[#6C93B8]/35",
  teal: "bg-[#4E9C93]/15 text-[#4E9C93] border-[#4E9C93]/35",
  violet: "bg-[#8B81C4]/15 text-[#8B81C4] border-[#8B81C4]/35 font-semibold",
  red: "bg-[#C1655A]/15 text-[#C1655A] border-[#C1655A]/35",
  green: "bg-[#5FA876]/15 text-[#5FA876] border-[#5FA876]/35",
  outline: "border-[#2B313D] text-[#E8EAEE]",
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
