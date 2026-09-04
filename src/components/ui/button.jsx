import React from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = {
  default: "bg-[#D4A359] text-[#0B0F17] font-semibold hover:bg-[#E0B268] border border-transparent shadow-none",
  brass: "bg-[#D4A359] text-[#0B0F17] font-semibold hover:bg-[#E0B268] border border-transparent shadow-none",
  amber: "bg-[#D4A359] text-[#0B0F17] font-semibold hover:bg-[#E0B268] border border-transparent shadow-none",
  secondary: "bg-[#1A2332] text-[#F1F5F9] hover:bg-[#1D2738] border border-[#222D3F]",
  outline: "border border-[#222D3F] bg-transparent text-[#94A3B8] hover:text-[#F1F5F9] hover:border-[#2E3D55]",
  ghost: "text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1A2332] border border-transparent",
  destructive: "bg-[#E05252] text-white hover:bg-[#EF4444] border border-transparent",
};

const buttonSizes = {
  default: "h-8 px-3 py-1.5 text-xs",
  sm: "h-7 px-2.5 py-1 text-[11px]",
  lg: "h-9 px-4 py-2 text-xs font-semibold",
  icon: "h-7 w-7 p-0 flex items-center justify-center",
};

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-[6px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4A359] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
          buttonVariants[variant] || buttonVariants.default,
          buttonSizes[size] || buttonSizes.default,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
