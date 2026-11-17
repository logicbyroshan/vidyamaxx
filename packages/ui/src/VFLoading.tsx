import * as React from 'react';
import { cn } from './utils';

// Core skeleton component
export function VFLoadingSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted-foreground/15", className)}
      {...props}
    />
  );
}

// Table loading skeleton
export function VFLoadingTable({ rows = 5, cols = 4, className }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={cn("w-full border border-border rounded-[4px] bg-card overflow-hidden", className)}>
      <div className="flex border-b border-border/80 bg-muted/40 p-4 gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <VFLoadingSkeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <VFLoadingSkeleton key={c} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Card loading skeleton
export function VFLoadingCard({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 border border-border rounded-[4px] bg-card space-y-4", className)}>
      <div className="flex gap-4 items-center">
        <VFLoadingSkeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <VFLoadingSkeleton className="h-4 w-1/3" />
          <VFLoadingSkeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <VFLoadingSkeleton className="h-4 w-full" />
        <VFLoadingSkeleton className="h-4 w-5/6" />
        <VFLoadingSkeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

// Full page skeleton loader
export function VFLoadingPage({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6 p-6 max-w-7xl mx-auto w-full", className)}>
      <div className="flex justify-between items-center border-b border-border/60 pb-5">
        <div className="space-y-2 w-1/3">
          <VFLoadingSkeleton className="h-4 w-24" />
          <VFLoadingSkeleton className="h-8 w-full" />
          <VFLoadingSkeleton className="h-4 w-3/4" />
        </div>
        <VFLoadingSkeleton className="h-10 w-28" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <VFLoadingCard />
        <VFLoadingCard />
        <VFLoadingCard />
      </div>
      <VFLoadingTable />
    </div>
  );
}
