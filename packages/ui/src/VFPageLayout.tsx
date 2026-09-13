import * as React from 'react';
import { cn } from './utils';

// VFPage: Full layout shell container
export function VFPage({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("min-h-screen flex flex-col w-full bg-background animate-fade-in", className)}
      {...props}
    />
  );
}

export function VFPageContainer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("w-full max-w-[2000px] min-w-0 mx-auto flex-1 flex flex-col p-3 sm:p-3.5 lg:p-4 bg-background animate-fade-in space-y-3 sm:space-y-3.5 lg:space-y-4", className)}
      {...props}
    />
  );
}

// VFPageToolbar: Standardized unified top header toolbar box across modules
export function VFPageToolbar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-3 rounded-[4px] bg-[#141414] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-xs",
        className
      )}
      {...props}
    />
  );
}

// VFPageActions: standard flex list for actions in headers
export function VFPageActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-2 sm:ml-auto flex-wrap", className)}
      {...props}
    />
  );
}

// VFPageHeader: standard title, description, and breadcrumbs wrapper
export interface VFPageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
}

export function VFPageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
  ...props
}: VFPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3",
        className
      )}
      {...props}
    >
      <div className="space-y-1 min-w-0">
        {breadcrumbs && <div className="mb-1">{breadcrumbs}</div>}
        <h1 className="text-xl font-bold tracking-tight text-foreground leading-tight">{title}</h1>
        {description && <p className="text-xs text-muted-foreground font-normal">{description}</p>}
      </div>
      {actions && <VFPageActions>{actions}</VFPageActions>}
    </div>
  );
}

// VFSection: logical section blocks with clear typography and spacing
export interface VFSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function VFSection({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: VFSectionProps) {
  return (
    <section className={cn("space-y-3.5", className)} {...props}>
      {(title || description || actions) && (
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            {title && <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{title}</h2>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}
