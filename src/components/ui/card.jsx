import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-[5px] border border-[#2B313D] bg-[#181C24] text-[#E8EAEE] shadow-none transition-colors duration-150",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-4 sm:p-5 border-b border-[#2B313D]/70", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("font-serif text-base font-bold leading-none tracking-tight text-[#E8EAEE]", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-xs text-[#9AA3B2] leading-relaxed", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return (
    <div className={cn("p-4 sm:p-5 pt-3 sm:pt-4", className)} {...props} />
  );
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center p-4 sm:p-5 pt-0 border-t border-[#2B313D]/70", className)}
      {...props}
    />
  );
}
