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
      className={cn("border-b border-[#222D3F] text-[#64748B] font-mono text-[11px]", className)}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }) {
  return (
    <tbody
      className={cn("divide-y divide-[#222D3F] text-[#94A3B8]", className)}
      {...props}
    />
  );
}

export function TableFooter({ className, ...props }) {
  return (
    <tfoot
      className={cn("border-t border-[#222D3F] font-medium text-[#F1F5F9]", className)}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn(
        "border-b border-[#222D3F]/40 transition-colors hover:bg-[#1A2332]/70 data-[state=selected]:bg-[#1A2332]",
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
        "h-8 px-3 text-left align-middle font-mono font-medium text-[#64748B] tracking-wider text-[11px]",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }) {
  return (
    <td
      className={cn("p-3 align-middle font-sans text-xs text-[#94A3B8]", className)}
      {...props}
    />
  );
}
