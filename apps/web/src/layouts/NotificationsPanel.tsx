import * as React from 'react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';
import { Bell, CheckCircle2, AlertCircle, Info, Trash2, X, CheckCheck } from 'lucide-react';

export function NotificationsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } =
    useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';

  const [drawerWidth, setDrawerWidth] = React.useState(520);
  const [isDragging, setIsDragging] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Lock body scrolling when notification drawer is open
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Drag handler for resizing drawer up to 60vw
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const maxAllowed = window.innerWidth * 0.6; // Max 60vw
      const minAllowed = 400;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= minAllowed && newWidth <= maxAllowed) {
        setDrawerWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = 'auto';
    };

    if (isDragging) {
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.body.style.userSelect = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0 z-10" onClick={onClose} />

      <div
        style={{ width: `${drawerWidth}px`, maxWidth: '60vw' }}
        className="bg-card border-l border-border h-full flex flex-col shadow-2xl animate-slide-in-right relative select-none z-20"
      >
        {/* Left Edge Drag Resizer (Clean, no harsh highlights) */}
        <div
          onMouseDown={() => setIsDragging(true)}
          className="absolute left-0 top-0 bottom-0 w-2 -ml-1 cursor-ew-resize flex items-center justify-center z-20 group"
        >
          <div className="w-1 h-8 rounded-md bg-border group-hover:bg-primary/70 transition-colors" />
        </div>

        {/* Header */}
        <div className="h-16 px-5 border-b border-border flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-primary/10 border border-primary/25 flex items-center justify-center">
              <Bell className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                {t('notif.title')}
                {unreadCount > 0 && (
                  <span className="text-[11px] font-mono bg-primary text-primary-foreground font-bold px-1.5 py-0.5 rounded">
                    {unreadCount}
                  </span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isHindi ? 'एक्टिविटी व सिस्टम अलर्ट्स' : 'Activity & system alerts'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Toolbar */}
        {notifications.length > 0 && (
          <div className="px-5 py-2.5 border-b border-border/60 bg-muted/30 flex items-center justify-between text-xs">
            <button
              onClick={markAllNotificationsRead}
              className="text-primary hover:underline font-semibold flex items-center gap-1 text-xs cursor-pointer"
            >
              <CheckCheck className="h-3.5 w-3.5" /> {isHindi ? 'सब मार्क रीड करें' : 'Mark all read'}
            </button>
            <button
              onClick={clearNotifications}
              className="text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 text-xs cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" /> {isHindi ? 'सब क्लियर करें' : 'Clear all'}
            </button>
          </div>
        )}

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 no-scrollbar">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground p-6 space-y-3">
              <div className="h-12 w-12 rounded-md bg-muted border border-border flex items-center justify-center">
                <Bell className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {isHindi ? 'सब अप-टू-डेट है!' : 'All caught up!'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isHindi ? 'इस समय कोई नया नोटिफिकेशन नहीं है।' : 'No pending notifications at this moment.'}
                </p>
              </div>
            </div>
          ) : (
            notifications.map((notif) => {
              const icons = {
                success: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
                error: <AlertCircle className="h-4 w-4 text-rose-400" />,
                warning: <AlertCircle className="h-4 w-4 text-amber-400" />,
                info: <Info className="h-4 w-4 text-sky-400" />,
              };

              return (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-3 rounded-md border transition-all cursor-pointer flex gap-3 ${
                    !notif.read
                      ? 'bg-card border-border shadow-xs hover:border-zinc-700'
                      : 'bg-muted/30 border-border/70 hover:bg-muted/60 opacity-80'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">{icons[notif.type]}</div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs ${!notif.read ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                        {notif.title}
                      </p>
                      {!notif.read && <span className="h-1.5 w-1.5 rounded-xs bg-primary shrink-0 mt-1" />}
                    </div>
                    {notif.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {notif.description}
                      </p>
                    )}
                    <span className="text-[11px] font-mono text-muted-foreground/70 block pt-0.5">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
