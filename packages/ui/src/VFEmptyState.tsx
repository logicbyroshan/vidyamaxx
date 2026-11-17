import * as React from 'react';
import { VFButton } from './VFButton';
import { cn } from './utils';

export interface VFEmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function VFEmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  ...props
}: VFEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-[4px] border border-dashed border-border bg-card/30 max-w-md mx-auto my-4 animate-scale-in",
        className
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        {icon || (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-6 leading-relaxed max-w-sm">{description}</p>
      
      {(primaryAction || secondaryAction) && (
        <div className="flex items-center gap-2">
          {secondaryAction && (
            <VFButton variant="outline" size="sm" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </VFButton>
          )}
          {primaryAction && (
            <VFButton variant="primary" size="sm" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </VFButton>
          )}
        </div>
      )}
    </div>
  );
}
