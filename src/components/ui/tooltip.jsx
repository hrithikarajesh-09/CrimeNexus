import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export function TooltipProvider({ children }) {
  return <div className="inline-block relative">{children}</div>;
}

export function Tooltip({ children, content, className, side = 'top' }) {
  const [open, setOpen] = useState(false);

  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {open && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 px-2.5 py-1 text-[11px] font-mono text-[#F4EFE6] bg-[#181C24] border border-[#2B313D] rounded-[4px] shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-100",
            sideClasses[side],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
