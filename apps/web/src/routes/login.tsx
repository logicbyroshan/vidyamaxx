import * as React from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import {
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  KeyRound,
  Smartphone,
  School,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Building2,
  Award,
  Calendar,
  Languages,
  HelpCircle,
  X,
} from 'lucide-react';
import { apiClient, ApiError, setAuthToken, setTenantHeaders } from '@vidyafloww/api';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/login')({
  component: ProfessionalAuthPage,
});

type AuthMode = 'login' | 'forgot-choice' | 'forgot-password' | 'forgot-username';

const TRUSTED_INSTITUTIONS = [
  { name: 'Delhi Public School', short: 'DPS', icon: Award },
  { name: 'Springdales School', short: 'SPRD', icon: School },
  { name: 'The Heritage School', short: 'HERITAGE', icon: Building2 },
  { name: 'St. Xavier High School', short: 'ST. XAVIER', icon: Award },
  { name: 'Ryan International', short: 'RYAN', icon: School },
  { name: 'Kendriya Vidyalaya', short: 'KVS', icon: Building2 },
  { name: 'Modern School', short: 'MODERN', icon: Award },
  { name: 'Amity International', short: 'AMITY', icon: School },
  { name: 'Bal Bharati Public', short: 'BBPS', icon: Building2 },
  { name: 'The Doon School', short: 'DOON', icon: Award },
  { name: 'Mayo College', short: 'MAYO', icon: School },
  { name: 'Sanskriti School', short: 'SANSKRITI', icon: Building2 },
];

function ProfessionalAuthPage() {
  const navigate = useNavigate();
  const { language, setLanguage, setAuthSession } = useGlobalStore();
  const { lang } = useTranslation();
  const isHindi = lang === 'hi' || language === 'hi';
  const [authMode, setAuthMode] = React.useState<AuthMode>('login');

  React.useEffect(() => {
    document.title = isHindi ? 'साइन इन – VidyaFlow' : 'Sign In – VidyaFlow';
  }, [isHindi]);

  // ─── LOGIN STATE ─────────────────────────────────────────────────────────────
  const [loginIdentifier, setLoginIdentifier] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const showToast = React.useCallback(
    (type: 'error' | 'success', message: string) => {
      const title =
        type === 'error'
          ? isHindi
            ? 'प्रमाणीकरण त्रुटि'
            : 'Authentication Error'
          : isHindi
            ? 'सफलता'
            : 'Success';

      toast.custom(
        (toastId) => (
          <div
            className={`w-[360px] max-w-[calc(100vw-2rem)] flex items-start gap-3 px-3.5 py-3 rounded-[6px] bg-[#121216]/95 backdrop-blur-md border shadow-[0_16px_40px_rgba(0,0,0,0.75)] text-xs ${
              type === 'error'
                ? 'border-red-500/40 text-zinc-100'
                : 'border-emerald-500/40 text-zinc-100'
            }`}
          >
            {type === 'error' ? (
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0 space-y-0.5">
              <p className={`font-bold text-xs ${type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                {title}
              </p>
              <p className="text-zinc-300 leading-relaxed select-text">{message}</p>
            </div>
            <button
              type="button"
              onClick={() => toast.dismiss(toastId)}
              className="text-zinc-500 hover:text-zinc-200 transition-colors p-0.5 cursor-pointer shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
        { id: 'auth-feedback', duration: 4500 }
      );
    },
    [isHindi]
  );

  // ─── FORGOT PASSWORD STATE ───────────────────────────────────────────────────
  const [fpStep, setFpStep] = React.useState<1 | 2 | 3 | 4>(1);
  const [fpIdentifier, setFpIdentifier] = React.useState('');
  const [fpOtp, setFpOt] = React.useState(['', '', '', '', '', '']);
  const [fpActionToken, setFpActionToken] = React.useState('');
  const [fpNewPassword, setFpNewPassword] = React.useState('');
  const [fpConfirmPassword, setFpConfirmPassword] = React.useState('');

  // ─── FORGOT USERNAME STATE ───────────────────────────────────────────────────
  const [fuStep, setFuStep] = React.useState<1 | 2 | 3>(1);
  const [fuPhone, setFuPhone] = React.useState('');
  const [fuDob, setFuDob] = React.useState('');
  const [fuOtp, setFuOtp] = React.useState(['', '', '', '', '', '']);
  const [recoveredUsername, setRecoveredUsername] = React.useState<{ name: string; username: string; role: string; campus: string } | null>(null);
  const [copiedText, setCopiedText] = React.useState(false);

  // Login Submit Handler (100% real backend authentication — zero offline bypass)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss('auth-feedback');
    setIsLoading(true);

    if (!loginIdentifier || !loginPassword) {
      showToast(
        'error',
        isHindi ? 'कृपया अपना स्कूल ईमेल / यूज़र आईडी और पासवर्ड दर्ज करें।' : 'Please enter your institutional email / user ID and password.'
      );
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiClient.post('/auth/login/', {
        identifier: loginIdentifier.trim(),
        password: loginPassword,
        remember_me: rememberMe,
        device_info: { platform: 'web' },
      });
      if (!res.data?.access_token) {
        throw new Error('Authentication server did not return an access token.');
      }
      setAuthToken(res.data.access_token);
      const memberships = res.data.memberships ?? [];
      const primaryMembership =
        memberships.find((m: { school_id?: string | null }) => m.school_id === res.data.user?.active_school_id) ??
        memberships.find((m: { school_id?: string | null }) => Boolean(m.school_id)) ??
        memberships[0] ??
        null;
      setTenantHeaders(primaryMembership?.school_id ?? res.data.user?.active_school_id ?? null, primaryMembership?.default_branch_id ?? null);
      setAuthSession({
        user: res.data.user,
        activeMembership: primaryMembership,
        memberships,
        responsibilities: [],
      });
      setIsLoading(false);
      sessionStorage.setItem('vidyafloww_just_logged_in', 'true');
      navigate({ to: '/' });
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.status === 0
            ? 'Cannot reach VidyaFloww backend API (http://localhost:8000). Please ensure the Django server is running.'
            : err.message
          : err instanceof Error
            ? err.message
            : 'Authentication failed.';
      showToast('error', msg);
      setIsLoading(false);
    }
  };

  // Google SSO Handler — requires configured OAuth provider credentials (never fakes login)
  const handleGoogleSSO = async () => {
    showToast(
      'error',
      isHindi
        ? 'Google Workspace SSO के लिए संस्थागत OAuth Client ID कॉन्फ़िगर होना आवश्यक है। कृपया अपने स्कूल ईमेल/पासवर्ड से साइन इन करें।'
        : 'Google Workspace SSO requires an institutional OAuth Client ID in environment configuration. Please sign in with your institutional email/phone and password.'
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#060607] text-foreground flex flex-col justify-between relative font-sans select-none">
      {/* Floating Auth Toast Notifications */}
      <Toaster
        position="top-right"
        offset={{ top: 68, right: 20 }}
        toastOptions={{
          className: 'font-sans border-0 bg-transparent p-0 shadow-none',
        }}
      />
      {/* Background Ambient Glow & Subtle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_-15%,rgba(234,88,12,0.16),transparent_68%)] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '42px 42px',
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          MINIMAL TOP NAVBAR: LOGO ON LEFT · WORKING LANGUAGE TOGGLE ON RIGHT
          ═══════════════════════════════════════════════════════════════════════ */}
      <header className="relative z-20 h-14 shrink-0 flex items-center justify-between px-5 sm:px-8 border-b border-[#1b1b1e] bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="VidyaFlow Logo"
            className="h-8 w-8 object-contain shrink-0"
          />
          <span className="text-[18px] font-black tracking-tight leading-none text-foreground">
            Vidya<span className="text-primary">Flow</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setLanguage(isHindi ? 'en' : 'hi')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#141417] hover:bg-[#1d1d22] border border-[#27272c] hover:border-primary/50 text-xs font-bold text-foreground transition-all cursor-pointer"
          title={isHindi ? 'Switch to English' : 'हिन्दी में बदलें'}
        >
          <Languages className="h-3.5 w-3.5 text-primary" />
          <span>{isHindi ? 'English' : 'हिन्दी'}</span>
        </button>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          CENTER AUTH CARD: ZERO SCROLL, THEME-ALIGNED OBSIDIAN & ORANGE
          ═══════════════════════════════════════════════════════════════════════ */}
      <main className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-4 py-3 overflow-y-auto no-scrollbar">
        <div className="w-full max-w-[440px]">
          <div className="relative rounded-[6px] bg-[#0e0e11]/95 backdrop-blur-md border border-[#232329] shadow-[0_24px_64px_rgba(0,0,0,0.75)] px-6 py-4 sm:px-7 sm:py-5 overflow-hidden">
            {/* Subtle top accent highlight */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/80 to-transparent pointer-events-none" />

            <AnimatePresence mode="wait">
              {/* ─────────────────────────────────────────────────────────────
                  1. LOGIN VIEW (COMPACT, SIDE-BY-SIDE SIGN IN + GOOGLE)
                  ───────────────────────────────────────────────────────────── */}
              {authMode === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                  className="space-y-3.5"
                >
                  <div className="text-center">
                    <h1 className="text-[21px] font-black text-foreground tracking-tight leading-tight">
                      {isHindi ? 'विद्याफ़्लो में साइन इन करें' : 'Sign In to VidyaFlow'}
                    </h1>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
                    {/* Identifier */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-zinc-200" htmlFor="identifier">
                        {isHindi ? 'ईमेल या यूज़र आईडी' : 'Institutional Email or User ID'}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                        <input
                          id="identifier"
                          type="text"
                          required
                          autoComplete="username"
                          placeholder={isHindi ? 'principal@vidyafloww.edu.in या ADM-2026' : 'principal@vidyafloww.edu.in or ADM-2026'}
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          className="w-full h-10 pl-10 pr-3.5 rounded-[4px] bg-[#141418] border border-[#28282f] text-sm font-medium text-foreground placeholder:text-zinc-500 focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition-all select-text"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-zinc-200" htmlFor="password">
                        {isHindi ? 'पासवर्ड' : 'Password'}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          autoComplete="current-password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full h-10 pl-10 pr-10 rounded-[4px] bg-[#141418] border border-[#28282f] text-sm font-medium text-foreground placeholder:text-zinc-500 focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition-all select-text"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground cursor-pointer p-1"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember me */}
                    <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 cursor-pointer pt-0.5">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded-[3px] border-[#32323a] bg-[#141418] h-3.5 w-3.5 accent-primary cursor-pointer"
                      />
                      <span>{isHindi ? 'इस डिवाइस को याद रखें' : 'Remember this trusted device'}</span>
                    </label>

                    {/* Side-by-Side Primary Sign In + Google Button (Single Row) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="h-10 px-4 rounded-[4px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>{isHindi ? 'साइन इन...' : 'Signing in...'}</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4 shrink-0" />
                            <span>{isHindi ? 'साइन इन करें' : 'Sign In'}</span>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleGoogleSSO}
                        disabled={isLoading}
                        className="h-10 px-4 rounded-[4px] bg-[#16161b] hover:bg-[#1e1e25] border border-[#2b2b33] hover:border-zinc-600 text-foreground font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          className="shrink-0"
                          style={{ width: '16px', height: '16px', minWidth: '16px', minHeight: '16px' }}
                        >
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                          />
                        </svg>
                        <span>{isHindi ? 'Google से जुड़ें' : 'Google SSO'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Single Unified Recovery Link */}
                  <div className="flex items-center justify-center pt-3 border-t border-[#1f1f24]">
                    <button
                      type="button"
                      onClick={() => {
                        toast.dismiss('auth-feedback');
                        setAuthMode('forgot-choice');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-primary transition-colors cursor-pointer leading-none"
                    >
                      <HelpCircle className="h-3.5 w-3.5 text-primary/80" />
                      <span>{isHindi ? 'यूज़र आईडी या पासवर्ड भूल गए?' : 'Forgot User ID or Password?'}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  2. UNIFIED RECOVERY CHOICE (FORGOT ID OR PASSWORD?)
                  ───────────────────────────────────────────────────────────── */}
              {authMode === 'forgot-choice' && (
                <motion.div
                  key="forgot-choice"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        toast.dismiss('auth-feedback');
                        setAuthMode('login');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-foreground cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>{isHindi ? 'साइन इन पर वापस जाएं' : 'Back to Sign In'}</span>
                    </button>
                  </div>

                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-black text-foreground tracking-tight">
                      {isHindi ? 'आप क्या रिकवर करना चाहते हैं?' : 'What do you need help with?'}
                    </h2>
                    <p className="text-xs text-zinc-400">
                      {isHindi ? 'आगे बढ़ने के लिए नीचे एक विकल्प चुनें' : 'Choose an option below to recover access'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        toast.dismiss('auth-feedback');
                        setFpStep(1);
                        setAuthMode('forgot-password');
                      }}
                      className="w-full p-3.5 rounded-[5px] bg-[#141418] hover:bg-[#1a1a20] border border-[#28282f] hover:border-primary/60 flex items-center gap-3.5 text-left transition-all cursor-pointer group"
                    >
                      <div className="h-9 w-9 rounded-[4px] bg-primary/15 border border-primary/30 text-primary flex items-center justify-center shrink-0">
                        <KeyRound className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {isHindi ? 'पासवर्ड भूल गए' : 'Forgot Password'}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {isHindi ? 'OTP के ज़रिए नया पासवर्ड सेट करें' : 'Reset your account password using OTP'}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-primary shrink-0 transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        toast.dismiss('auth-feedback');
                        setFuStep(1);
                        setAuthMode('forgot-username');
                      }}
                      className="w-full p-3.5 rounded-[5px] bg-[#141418] hover:bg-[#1a1a20] border border-[#28282f] hover:border-primary/60 flex items-center gap-3.5 text-left transition-all cursor-pointer group"
                    >
                      <div className="h-9 w-9 rounded-[4px] bg-primary/15 border border-primary/30 text-primary flex items-center justify-center shrink-0">
                        <UserCheck className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {isHindi ? 'यूज़र आईडी भूल गए' : 'Forgot User ID'}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {isHindi ? 'रजिस्टर्ड मोबाइल और जन्मतिथि से अपनी आईडी पाएं' : 'Find your institutional ID with phone & date of birth'}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-primary shrink-0 transition-colors" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  3. FORGOT PASSWORD FLOW
                  ───────────────────────────────────────────────────────────── */}
              {authMode === 'forgot-password' && (
                <motion.div
                  key="forgot-password"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        toast.dismiss('auth-feedback');
                        setAuthMode('forgot-choice');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>{isHindi ? 'रिकवरी विकल्प पर वापस' : 'Back'}</span>
                    </button>
                    <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                      {isHindi ? 'रिकवरी' : 'Recovery'}
                    </span>
                  </div>

                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-black text-foreground tracking-tight">
                      {fpStep === 1 && (isHindi ? 'पासवर्ड रीसेट करें' : 'Reset Password')}
                      {fpStep === 2 && (isHindi ? 'रिकवरी कोड एंटर करें' : 'Enter Recovery Code')}
                      {fpStep === 3 && (isHindi ? 'न्यू पासवर्ड' : 'New Password')}
                      {fpStep === 4 && (isHindi ? 'रीसेट कंप्लीट हुआ' : 'Reset Complete')}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {fpStep === 1 && (isHindi ? 'अपना स्कूल ईमेल या रजिस्टर्ड मोबाइल एंटर करें' : 'Enter your institutional email or registered phone')}
                      {fpStep === 2 && (isHindi ? `${fpIdentifier || 'आपके ईमेल'} पर भेजा गया 6-डिजिट कोड एंटर करें` : `Enter 6-digit code sent to ${fpIdentifier || 'your email'}`)}
                      {fpStep === 3 && (isHindi ? 'अपने अकाउंट के लिए न्यू सिक्योर पासवर्ड सेट करें' : 'Set a new secure password for your account')}
                      {fpStep === 4 && (isHindi ? 'आपका पासवर्ड सफलतापूर्वक अपडेट हो गया है।' : 'Your password has been updated successfully.')}
                    </p>
                  </div>

                  {fpStep === 1 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground">{isHindi ? 'रजिस्टर्ड ईमेल या मोबाइल' : 'Registered Email or Phone'}</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            required
                            placeholder="admin@vidyafloww.edu.in"
                            value={fpIdentifier}
                            onChange={(e) => setFpIdentifier(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-md bg-[#141414] border border-[#282828] text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={async () => {
                          if (!fpIdentifier) {
                            showToast(
                              'error',
                              isHindi ? 'कृपया अपना रजिस्टर्ड ईमेल या फोन एंटर करें।' : 'Please enter your registered email or phone.'
                            );
                            return;
                          }
                          setIsLoading(true);
                          toast.dismiss('auth-feedback');
                          try {
                            await apiClient.post('/auth/otp/request/', {
                              identifier: fpIdentifier.trim(),
                              purpose: 'password_reset',
                            });
                            showToast(
                              'success',
                              isHindi ? 'रिकवरी कोड सफलतापूर्वक भेजा गया।' : 'Recovery OTP sent successfully.'
                            );
                            setFpStep(2);
                          } catch (err) {
                            const msg = err instanceof ApiError ? err.message : 'Unable to send OTP.';
                            showToast('error', msg);
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        className="w-full h-11 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-1"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>{isHindi ? 'OTP भेजा जा रहा है...' : 'Sending code...'}</span>
                          </>
                        ) : (
                          <>
                            <KeyRound className="h-4 w-4" />
                            <span>{isHindi ? 'पासवर्ड रीसेट OTP भेजें' : 'Send Password Reset OTP'}</span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {fpStep === 2 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex justify-between gap-2">
                        {fpOtp.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`fp-otp-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              const newOtp = [...fpOtp];
                              newOtp[idx] = val;
                              setFpOt(newOtp);
                              if (val && idx < 5) {
                                const next = document.getElementById(`fp-otp-${idx + 1}`);
                                next?.focus();
                              }
                            }}
                            className="w-12 h-13 rounded-md bg-[#141414] border border-[#282828] text-center text-xl font-mono font-black text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={async () => {
                          const code = fpOtp.join('');
                          if (code.length !== 6) {
                            showToast('error', isHindi ? 'कृपया 6-डिजिट रिकवरी कोड दर्ज करें।' : 'Please enter the 6-digit recovery code.');
                            return;
                          }
                          setIsLoading(true);
                          toast.dismiss('auth-feedback');
                          try {
                            const res = await apiClient.post('/auth/otp/verify/', {
                              identifier: fpIdentifier.trim(),
                              otp: code,
                              purpose: 'password_reset',
                            });
                            setFpActionToken(res.data?.action_token || '');
                            setFpStep(3);
                          } catch (err) {
                            const msg = err instanceof ApiError ? err.message : 'Invalid or expired OTP code.';
                            showToast('error', msg);
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        className="w-full h-11 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                      >
                        <span>{isHindi ? 'OTP वेरिफाई करें और आगे बढ़ें' : 'Verify Code & Continue'}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {fpStep === 3 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground">{isHindi ? 'न्यू पासवर्ड' : 'New Password'}</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={fpNewPassword}
                            onChange={(e) => setFpNewPassword(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-md bg-[#141414] border border-[#282828] text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground">{isHindi ? 'कन्फर्म न्यू पासवर्ड' : 'Confirm New Password'}</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={fpConfirmPassword}
                            onChange={(e) => setFpConfirmPassword(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-md bg-[#141414] border border-[#282828] text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={async () => {
                          if (!fpNewPassword || fpNewPassword !== fpConfirmPassword) {
                            showToast(
                              'error',
                              isHindi ? 'पासवर्ड मैच होना चाहिए और खाली नहीं हो सकता।' : 'Passwords must match and cannot be empty.'
                            );
                            return;
                          }
                          setIsLoading(true);
                          toast.dismiss('auth-feedback');
                          try {
                            await apiClient.post('/auth/password/reset/', {
                              action_token: fpActionToken,
                              new_password: fpNewPassword,
                            });
                            showToast(
                              'success',
                              isHindi ? 'आपका पासवर्ड सफलतापूर्वक अपडेट हो गया है।' : 'Your password has been updated successfully.'
                            );
                            setFpStep(4);
                          } catch (err) {
                            const msg = err instanceof ApiError ? err.message : 'Failed to reset password.';
                            showToast('error', msg);
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        className="w-full h-11 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-1"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>{isHindi ? 'पासवर्ड अपडेट हो रहा है...' : 'Updating password...'}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>{isHindi ? 'न्यू पासवर्ड सेव करें' : 'Save New Password'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {fpStep === 4 && (
                    <div className="space-y-5 text-center animate-fade-in py-2">
                      <div className="h-12 w-12 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-foreground">
                          {isHindi ? 'पासवर्ड सफलतापूर्वक रीसेट हुआ!' : 'Password Reset Successfully!'}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {isHindi ? 'अब आप अपने न्यू क्रेडेंशियल्स के साथ साइन इन कर सकते हैं।' : 'You may now sign in with your updated credentials.'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('login');
                          setFpStep(1);
                        }}
                        className="w-full h-11 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                      >
                        <span>{isHindi ? 'साइन इन पर जाएं' : 'Proceed to Sign In'}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  4. FORGOT USERNAME FLOW
                  ───────────────────────────────────────────────────────────── */}
              {authMode === 'forgot-username' && (
                <motion.div
                  key="forgot-username"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        toast.dismiss('auth-feedback');
                        setAuthMode('forgot-choice');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>{isHindi ? 'रिकवरी विकल्प पर वापस' : 'Back'}</span>
                    </button>
                    <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                      {isHindi ? 'आईडी लुकअप' : 'ID Lookup'}
                    </span>
                  </div>

                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-black text-foreground tracking-tight">
                      {fuStep === 1 && (isHindi ? 'अपनी यूज़र आईडी खोजें' : 'Look Up Your User ID')}
                      {fuStep === 2 && (isHindi ? 'मोबाइल OTP वेरिफाई करें' : 'Verify Mobile OTP')}
                      {fuStep === 3 && (isHindi ? 'वेरिफाइड क्रेडेंशियल्स' : 'Verified Credentials')}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {fuStep === 1 && (isHindi ? 'अपना रजिस्टर्ड मोबाइल नंबर और जन्मतिथि एंटर करें' : 'Enter your registered mobile number & date of birth')}
                      {fuStep === 2 && (isHindi ? `${fuPhone || 'आपके मोबाइल'} पर भेजा गया 6-डिजिट OTP एंटर करें` : `Enter 6-digit code sent to ${fuPhone || 'your mobile'}`)}
                      {fuStep === 3 && (isHindi ? 'यहाँ आपके वेरिफाइड स्कूल क्रेडेंशियल्स हैं।' : 'Here are your verified institutional credentials.')}
                    </p>
                  </div>

                  {fuStep === 1 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground">{isHindi ? 'रजिस्टर्ड मोबाइल नंबर' : 'Registered Mobile Number'}</label>
                        <div className="relative">
                          <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={fuPhone}
                            onChange={(e) => setFuPhone(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-md bg-[#141414] border border-[#282828] text-sm font-mono text-foreground focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground">{isHindi ? 'डेट ऑफ बर्थ' : 'Date of Birth'}</label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="14 May 2011"
                            value={fuDob}
                            onChange={(e) => setFuDob(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-md bg-[#141414] border border-[#282828] text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={async () => {
                          if (!fuPhone || !fuDob) {
                            showToast(
                              'error',
                              isHindi ? 'कृपया अपना रजिस्टर्ड मोबाइल नंबर और जन्मतिथि (YYYY-MM-DD) एंटर करें।' : 'Please enter your registered mobile number and date of birth (YYYY-MM-DD).'
                            );
                            return;
                          }
                          setIsLoading(true);
                          toast.dismiss('auth-feedback');
                          try {
                            await apiClient.post('/auth/otp/request/', {
                              identifier: fuPhone.trim(),
                              purpose: 'username_lookup',
                            });
                            showToast(
                              'success',
                              isHindi ? 'मोबाइल OTP सफलतापूर्वक भेजा गया।' : 'Verification OTP sent successfully.'
                            );
                            setFuStep(2);
                          } catch (err) {
                            const msg = err instanceof ApiError ? err.message : 'Unable to send OTP.';
                            showToast('error', msg);
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        className="w-full h-11 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-1"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>{isHindi ? 'रिकॉर्ड्स सर्च हो रहे हैं...' : 'Searching records...'}</span>
                          </>
                        ) : (
                          <>
                            <HelpCircle className="h-4 w-4" />
                            <span>{isHindi ? 'मेरी यूज़र आईडी सर्च करें' : 'Find My User ID'}</span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {fuStep === 2 && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex justify-between gap-2">
                        {fuOtp.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`fu-otp-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              const newOtp = [...fuOtp];
                              newOtp[idx] = val;
                              setFuOtp(newOtp);
                              if (val && idx < 5) {
                                const next = document.getElementById(`fu-otp-${idx + 1}`);
                                next?.focus();
                              }
                            }}
                            className="w-12 h-13 rounded-md bg-[#141414] border border-[#282828] text-center text-xl font-mono font-black text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={async () => {
                          const code = fuOtp.join('');
                          if (code.length !== 6) {
                            showToast('error', isHindi ? 'कृपया 6-डिजिट OTP कोड दर्ज करें।' : 'Please enter the 6-digit OTP code.');
                            return;
                          }
                          setIsLoading(true);
                          toast.dismiss('auth-feedback');
                          try {
                            const verifyRes = await apiClient.post('/auth/otp/verify/', {
                              identifier: fuPhone.trim(),
                              otp: code,
                              purpose: 'username_lookup',
                            });
                            const lookupRes = await apiClient.post('/auth/username/lookup/', {
                              phone: fuPhone.trim(),
                              date_of_birth: fuDob.trim(),
                              action_token: verifyRes.data?.action_token,
                            });
                            const matched = lookupRes.data?.matched_user;
                            setRecoveredUsername({
                              name: matched?.name || 'Verified Account',
                              username: matched?.username || fuPhone.trim(),
                              role: matched?.user_type || 'Member',
                              campus: matched?.institution || 'VidyaFloww Institution',
                            });
                            setFuStep(3);
                          } catch (err) {
                            const msg = err instanceof ApiError ? err.message : 'Unable to verify OTP or find matching account.';
                            showToast('error', msg);
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        className="w-full h-11 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                      >
                        <span>{isHindi ? 'OTP वेरिफाई करें और आईडी देखें' : 'Verify Code & Reveal ID'}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {fuStep === 3 && recoveredUsername && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="p-4 rounded-md bg-[#141414] border border-[#262626] space-y-3 shadow-xs">
                        <div className="flex items-center gap-3 pb-3 border-b border-[#222222]">
                          <div className="h-9 w-9 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0">
                            <UserCheck className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{recoveredUsername.name}</p>
                            <p className="text-[11px] text-muted-foreground">{recoveredUsername.role} · {recoveredUsername.campus}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {isHindi ? 'ऑफिशियल स्कूल आईडी' : 'Official Institutional ID'}
                          </label>
                          <div className="flex items-center justify-between p-2.5 rounded-md bg-black border border-[#242424]">
                            <span className="font-mono font-black text-sm text-primary select-all">
                              {recoveredUsername.username}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(recoveredUsername.username);
                                setCopiedText(true);
                                setTimeout(() => setCopiedText(false), 2000);
                              }}
                              className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-md bg-[#181818] border border-[#262626] transition-colors cursor-pointer"
                            >
                              {copiedText ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                              <span>{copiedText ? (isHindi ? 'कॉपी हुआ' : 'Copied') : (isHindi ? 'कॉपी' : 'Copy')}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setLoginIdentifier(recoveredUsername.username);
                          setAuthMode('login');
                        }}
                        className="w-full h-11 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                      >
                        <span>{isHindi ? 'इस यूज़र आईडी से साइन इन करें' : 'Sign In With This User ID'}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          BOTTOM: COMPACT FLOATING SCHOOL LOGOS MARQUEE (FITS INSIDE 100VH)
          ═══════════════════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 shrink-0 w-full max-w-5xl mx-auto px-4 pb-4 pt-1 select-none space-y-1.5">
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono">
            {isHindi ? 'भारत भर के 150+ लीडिंग एजुकेशनल इंस्टीट्यूट्स द्वारा ट्रस्टेड' : 'Trusted by 150+ Leading Educational Campuses Across India'}
          </span>
        </div>

        {/* Floating Marquee Capsule with Soft Vanishing Fades */}
        <div
          className="relative w-full overflow-hidden py-0.5 group cursor-pointer"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-14 bg-gradient-to-r from-[#060607] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-[#060607] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex gap-2.5 items-center group-hover:[animation-play-state:paused] pr-2.5">
            {[
              ...TRUSTED_INSTITUTIONS,
              ...TRUSTED_INSTITUTIONS,
              ...TRUSTED_INSTITUTIONS,
              ...TRUSTED_INSTITUTIONS,
            ].map((inst, i) => {
              const Icon = inst.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#101014] border border-[#202026] text-xs font-semibold text-zinc-300 hover:border-zinc-700 hover:text-foreground transition-colors whitespace-nowrap shrink-0"
                >
                  <div className="h-4 w-4 rounded-[3px] bg-primary/15 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-2.5 w-2.5" />
                  </div>
                  <span className="font-bold text-[11px]">{inst.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
