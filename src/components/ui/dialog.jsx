import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-lg p-4">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ className, children, onClose, ...props }) {
  return (
    <div
      className={cn(
        "relative bg-[#181C24] border border-[#2B313D] rounded-[8px] p-6 shadow-2xl text-[#E8EAEE] depth-floating animate-in fade-in zoom-in-95 duration-150",
        className
      )}
      {...props}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-[4px] text-[#6B7382] hover:text-[#E8EAEE] hover:bg-[#1F2430] border border-transparent hover:border-[#2B313D] transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {children}
    </div>
  );
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5 pb-3 border-b border-[#2B313D]", className)} {...props} />;
}

export function DialogTitle({ className, ...props }) {
  return <h2 className={cn("text-base font-serif font-bold text-[#E8EAEE] tracking-tight", className)} {...props} />;
}

export function DialogDescription({ className, ...props }) {
  return <p className={cn("text-xs text-[#9AA3B2] leading-relaxed font-sans", className)} {...props} />;
}
