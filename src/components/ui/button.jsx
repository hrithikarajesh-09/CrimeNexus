import React from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = {
  default: "bg-[#C68A46] text-[#12151B] font-semibold hover:bg-[#D49855] border border-transparent shadow-none",
  brass: "bg-[#C68A46] text-[#12151B] font-semibold hover:bg-[#D49855] border border-transparent shadow-none",
  secondary: "bg-[#1F2430] text-[#E8EAEE] hover:bg-[#282F3F] border border-[#2B313D]",
  outline: "border border-[#2B313D] bg-transparent text-[#9AA3B2] hover:text-[#E8EAEE] hover:border-[#4A5468]",
  ghost: "text-[#9AA3B2] hover:text-[#E8EAEE] hover:bg-[#1F2430] border border-transparent",
  destructive: "bg-[#C1655A] text-white hover:bg-[#D1766B] border border-transparent",
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
          "inline-flex items-center justify-center gap-1.5 rounded-[5px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C68A46] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
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
