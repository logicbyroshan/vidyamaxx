import * as React from 'react';
import {
  VFPageContainer,
  VFButton,
  VFBadge,
  VFCard,
} from '@vidyafloww/ui';
import {
  ExternalLink,
  Copy,
  Check,
  Server,
  FolderCode,
  ShieldCheck,
  Globe,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';

export interface SubsystemLaunchpadProps {
  id: string;
  title: string;
  hindiTitle: string;
  description: string;
  subdomainUrl: string;
  localPath: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  backendPort: number;
  apiDocsUrl?: string;
}

export function SubsystemLaunchpad({
  id: _id,
  title,
  hindiTitle,
  description,
  subdomainUrl,
  localPath,
  icon: Icon,
  features,
  backendPort,
  apiDocsUrl,
}: SubsystemLaunchpadProps) {
  const { addNotification } = useGlobalStore();
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(subdomainUrl);
    setCopied(true);
    addNotification({
      title: 'Link Copied',
      description: `Subdomain ${subdomainUrl} copied to clipboard.`,
      type: 'success',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunch = () => {
    window.open(subdomainUrl, '_blank', 'noopener,noreferrer');
    addNotification({
      title: 'Launching Subsystem',
      description: `Redirecting to dedicated portal: ${subdomainUrl}`,
      type: 'info',
    });
  };

  return (
    <VFPageContainer className="h-full min-h-0 flex-1 flex flex-col space-y-4">
      {/* ── UNIFIED SUB-NAV HEADER ── */}
      <div className="p-3.5 rounded-[4px] bg-[#141414] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-[4px] bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground">{title}</h2>
              <span className="text-xs text-muted-foreground font-medium">({hindiTitle})</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Decoupled Standalone Subsystem · Independent Backend & Micro-Frontend Architecture
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <VFBadge variant="success" className="text-xs rounded-[3px] px-2.5 py-0.5 flex items-center gap-1.5 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            Live Microservice
          </VFBadge>
          <VFButton
            size="sm"
            onClick={handleLaunch}
            className="h-8 px-3.5 text-xs font-bold rounded-[4px] shadow-xs"
            rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
          >
            Launch Portal
          </VFButton>
        </div>
      </div>

      {/* ── MAIN LAUNCHPAD CARD & ARCHITECTURAL SPECS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Subdomain Gateway & Redirection Card */}
        <div className="lg:col-span-2 space-y-4">
          <VFCard className="p-5 rounded-[4px] border border-border/80 bg-card space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Dedicated Subsystem Gateway
                </span>
                <h3 className="text-base font-extrabold text-foreground mt-0.5">
                  {title} Portal
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-xl">
                  {description}
                </p>
              </div>
              <div className="p-2 rounded-[4px] bg-[#1a1a1a] border border-border/70 text-muted-foreground shrink-0">
                <Globe className="h-5 w-5 text-primary" />
              </div>
            </div>

            {/* Subdomain URL Display Box */}
            <div className="p-3 rounded-[4px] bg-[#121212] border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-mono text-xs font-bold text-foreground truncate">
                  {subdomainUrl}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-[3px] bg-[#1c1c1c] hover:bg-[#252525] border border-border/80 text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? 'Copied' : 'Copy URL'}</span>
                </button>
                <VFButton
                  size="sm"
                  onClick={handleLaunch}
                  className="h-7 px-3 text-xs font-bold rounded-[3px]"
                  rightIcon={<ArrowRight className="h-3 w-3" />}
                >
                  Open Subdomain
                </VFButton>
              </div>
            </div>

            {/* Subsystem Capabilities List */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Integrated Capabilities & Workflows
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-[3px] bg-[#161616] border border-border/60 flex items-center gap-2 text-xs text-foreground/90 font-medium"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </VFCard>
        </div>

        {/* Right Col: Decoupled Source Code & Backend Configuration */}
        <div className="space-y-4">
          <VFCard className="p-4 rounded-[4px] border border-border/80 bg-card space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-border/60">
              <FolderCode className="h-4 w-4 text-primary" />
              <span className="font-bold text-foreground text-xs uppercase tracking-wider">
                Decoupled Source Code
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  Project Workspace Folder
                </span>
                <code className="font-mono text-[11px] text-primary bg-[#161616] px-2 py-1 rounded-[3px] border border-border/60 block mt-1 truncate">
                  {localPath}
                </code>
              </div>

              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  Dedicated Backend Microservice
                </span>
                <div className="flex items-center justify-between mt-1 font-mono text-[11px] bg-[#161616] p-2 rounded-[3px] border border-border/60">
                  <span className="text-foreground">Port {backendPort}</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-sans text-[10px]">
                    <Radio className="h-3 w-3 animate-pulse" />
                    Standalone API
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-[3px] bg-[#161616] border border-border/60 space-y-1.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block flex items-center gap-1">
                  <Server className="h-3 w-3 text-primary" />
                  Independent Deployment Model
                </span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  All UI components, design tokens, and domain logic reside in <strong className="text-foreground">{localPath}</strong> with an isolated <strong className="text-foreground">package.json</strong> and separate backend contracts.
                </p>
              </div>

              {apiDocsUrl && (
                <a
                  href={apiDocsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 rounded-[3px] bg-[#1a1a1a] hover:bg-[#222222] border border-border/80 text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>View Subsystem API Contract</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              )}
            </div>
          </VFCard>
        </div>
      </div>
    </VFPageContainer>
  );
}
