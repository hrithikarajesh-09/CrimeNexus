import React from 'react';
import { cn } from '../../lib/utils';

export function Table({ className, ...props }) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className={cn("w-full caption-bottom text-xs text-left border-collapse", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }) {
  return (
    <thead
      className={cn("border-b border-[#2B313D] text-[#6B7382] font-mono text-[11px]", className)}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }) {
  return (
    <tbody
      className={cn("divide-y divide-[#2B313D] text-[#9AA3B2]", className)}
      {...props}
    />
  );
}

export function TableFooter({ className, ...props }) {
  return (
    <tfoot
      className={cn("border-t border-[#2B313D] font-medium text-[#E8EAEE]", className)}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn(
        "border-b border-[#2B313D]/40 transition-colors hover:bg-[#1F2430]/70 data-[state=selected]:bg-[#1F2430]",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }) {
  return (
    <th
      className={cn(
        "h-8 px-3 text-left align-middle font-mono font-medium text-[#6B7382] tracking-wider text-[11px]",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }) {
  return (
    <td
      className={cn("p-3 align-middle font-sans text-xs text-[#9AA3B2]", className)}
      {...props}
    />
  );
}
