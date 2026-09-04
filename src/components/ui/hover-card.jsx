import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export function HoverCard({ children, openDelay = 150, closeDelay = 150 }) {
  const [isOpen, setIsOpen] = useState(false);
  let timer = null;

  const handleMouseEnter = () => {
    clearTimeout(timer);
    timer = setTimeout(() => setIsOpen(true), openDelay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timer);
    timer = setTimeout(() => setIsOpen(false), closeDelay);
  };

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        if (child.type === HoverCardTrigger) {
          return child;
        }
        if (child.type === HoverCardContent && isOpen) {
          return child;
        }
        return null;
      })}
    </div>
  );
}

export function HoverCardTrigger({ children, className, ...props }) {
  return <div className={cn("inline-flex cursor-pointer", className)} {...props}>{children}</div>;
}

export function HoverCardContent({ className, side = 'bottom', children, ...props }) {
  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={cn(
        "absolute z-50 w-72 rounded-[6px] border border-[#2B313D] bg-[#181C24] p-3 text-xs text-[#E8EAEE] shadow-2xl depth-floating outline-none animate-in fade-in zoom-in-95 duration-100",
        sideClasses[side],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
