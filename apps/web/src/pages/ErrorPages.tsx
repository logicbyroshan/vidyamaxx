import * as React from 'react';
import { VFPage, VFEmptyState } from '@vidyafloww/ui';
import { ShieldAlert, Ban, FileQuestion, ServerCrash, WifiOff, Wrench } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface ErrorPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

function BaseErrorPage({ title, description, icon, actionLabel = "Return Home", onAction }: ErrorPageProps) {
  const navigate = useNavigate();
  return (
    <VFPage className="items-center justify-center">
      <VFEmptyState
        icon={icon}
        title={title}
        description={description}
        primaryAction={{
          label: actionLabel,
          onClick: onAction || (() => navigate({ to: '/' })),
        }}
      />
    </VFPage>
  );
}

export function Error401() {
  return (
    <BaseErrorPage
      icon={<ShieldAlert className="h-8 w-8 text-warning" />}
      title="401 - Unauthorized Access"
      description="You must be logged in to access this page. Please authenticate and try again."
      actionLabel="Go to Login"
    />
  );
}

export function Error403() {
  return (
    <BaseErrorPage
      icon={<Ban className="h-8 w-8 text-destructive" />}
      title="403 - Forbidden"
      description="You do not have the required permissions to view this resource. Contact your administrator if you believe this is a mistake."
    />
  );
}

export function Error404() {
  return (
    <BaseErrorPage
      icon={<FileQuestion className="h-8 w-8 text-muted-foreground" />}
      title="404 - Page Not Found"
      description="The page you are looking for doesn't exist, has been moved, or is temporarily unavailable."
    />
  );
}

export function Error500() {
  return (
    <BaseErrorPage
      icon={<ServerCrash className="h-8 w-8 text-destructive" />}
      title="500 - Internal Server Error"
      description="Something went wrong on our end. Our engineering team has been notified. Please try again later."
      actionLabel="Reload Page"
      onAction={() => window.location.reload()}
    />
  );
}

export function ErrorOffline() {
  return (
    <BaseErrorPage
      icon={<WifiOff className="h-8 w-8 text-muted-foreground" />}
      title="No Internet Connection"
      description="You appear to be offline. Please check your network connection and try again."
      actionLabel="Retry Connection"
      onAction={() => window.location.reload()}
    />
  );
}

export function ErrorMaintenance() {
  return (
    <BaseErrorPage
      icon={<Wrench className="h-8 w-8 text-primary" />}
      title="System Maintenance"
      description="VidyaFloww is currently undergoing scheduled maintenance to improve performance and reliability. We will be back shortly."
      actionLabel="Check Status"
      onAction={() => window.location.reload()}
    />
  );
}
