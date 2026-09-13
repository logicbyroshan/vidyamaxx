import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  VFPageContainer,
  VFCard,
  VFButton,
  VFBadge,
  VFDialog,
  VFInput,
  cn,
} from '@vidyamaxx/ui';
import {
  ShieldCheck,
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  Download,
  CreditCard,
  Receipt,
  Edit3,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from '../hooks/useTranslation';

export const Route = createFileRoute('/license')({
  component: LicenseManagementPage,
});

interface InvoiceRecord {
  id: string;
  invoiceNo: string;
  date: string;
  amount: string;
  description: string;
  method: string;
  status: 'Paid' | 'Processing' | 'Scheduled';
  receiptUrl?: string;
}

const INVOICE_HISTORY: InvoiceRecord[] = [
  {
    id: '1',
    invoiceNo: 'INV-2026-0891',
    date: '01 Apr 2026',
    amount: '₹ 2,40,000',
    description: 'Annual Enterprise Tier Subscription (2026–2027)',
    method: 'Visa Corp •••• 4242',
    status: 'Paid',
  },
  {
    id: '2',
    invoiceNo: 'INV-2025-0742',
    date: '01 Apr 2025',
    amount: '₹ 2,10,000',
    description: 'Annual Enterprise Tier Subscription (2025–2026)',
    method: 'Visa Corp •••• 4242',
    status: 'Paid',
  },
  {
    id: '3',
    invoiceNo: 'INV-2024-0518',
    date: '01 Apr 2024',
    amount: '₹ 1,80,000',
    description: 'Standard Campus License (2024–2025)',
    method: 'Corporate NetBanking (HDFC)',
    status: 'Paid',
  },
];

function LicenseManagementPage() {
  const { schoolProfile, addNotification } = useGlobalStore();
  const { t, lang } = useTranslation();
  const isHindi = lang === 'hi';

  React.useEffect(() => {
    document.title = t('nav.license') + ' – VidyaMaxx';
  }, [t]);

  const [copied, setCopied] = React.useState(false);
  const [showKey, setShowKey] = React.useState(false);
  const [isUpdateCardModalOpen, setIsUpdateCardModalOpen] = React.useState(false);
  const [isPayEarlyModalOpen, setIsPayEarlyModalOpen] = React.useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);

  const [cardholderName, setCardholderName] = React.useState('VidyaMaxx International Academy');
  const [cardNumber, setCardNumber] = React.useState('•••• •••• •••• 4242');
  const [expiryDate, setExpiryDate] = React.useState('08/29');

  const licenseKey = 'VFL-2026-SA98-CBSE-9481-DELHI';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    addNotification({
      title: 'License Key Copied',
      description: 'Master enterprise key copied to clipboard.',
      type: 'success',
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadInvoice = (invoiceNo: string) => {
    addNotification({
      title: 'Invoice Downloaded',
      description: `Tax invoice ${invoiceNo} downloaded as PDF with GSTIN receipt.`,
      type: 'success',
    });
  };

  const handleProcessEarlyPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPayEarlyModalOpen(false);
      addNotification({
        title: isHindi ? 'भुगतान सफल' : 'Payment Successful',
        description: isHindi
          ? 'वार्षिक एंटरप्राइज रिन्यूअल ₹2,40,000 सफलतापूर्वक प्रोसेस किया गया। वैधता 31 मार्च 2028 तक बढ़ा दी गई है।'
          : 'Annual Enterprise Renewal of ₹2,40,000 successfully processed. Entitlement extended through March 31, 2028.',
        type: 'success',
      });
    }, 1200);
  };

  return (
    <VFPageContainer className="space-y-3 sm:space-y-3.5 lg:space-y-4">
      {/* 1. Subscription Status & Early Payment Hero Banner */}
      <VFCard
        className="bg-[#0d0d0d] border-border/90"
        bodyClassName="p-3.5 sm:p-4 space-y-3 sm:space-y-3.5"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          <div className="flex items-start sm:items-center gap-3">
            <div className="h-10 w-10 rounded-[4px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-foreground tracking-tight">
                  {schoolProfile.name}
                </h2>
                <VFBadge variant="success" className="text-[10px] font-bold font-mono py-0.5 rounded-[3px]">
                  Enterprise Active
                </VFBadge>
              </div>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                {schoolProfile.affiliation} · {isHindi ? 'वार्षिक संस्थागत लाइसेंस' : 'Annual Institutional Enterprise License'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <div className="h-8 px-3 rounded-[4px] bg-[#141414] border border-border flex items-center gap-2 text-xs">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                {isHindi ? 'वैधता:' : 'Valid Until:'}
              </span>
              <span className="font-mono font-bold text-foreground">March 31, 2027</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[2px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                225 Days
              </span>
            </div>

            {/* Early Payment / Renewal Button */}
            <VFButton
              size="sm"
              onClick={() => setIsPayEarlyModalOpen(true)}
              className="h-8 px-3 text-xs font-bold rounded-[4px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer"
              leftIcon={<Sparkles className="h-3.5 w-3.5" />}
            >
              {isHindi ? 'जल्दी भुगतान / रिन्यू करें' : 'Pay Early / Renew Plan'}
            </VFButton>
          </div>
        </div>

        {/* Quick Subscription Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-border/70 text-xs">
          <div className="p-2.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
              {isHindi ? 'वार्षिक प्लान दर' : 'Annual Rate'}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-foreground font-mono">₹ 2,40,000</span>
          </div>
          <div className="p-2.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
              {isHindi ? 'स्टूडेंट एनरोलमेंट कैपेसिटी' : 'Student Capacity'}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-foreground font-mono">1,248 / 2,500</span>
          </div>
          <div className="p-2.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
              {isHindi ? 'डिफ़ॉल्ट पेमेंट कार्ड' : 'Default Payment'}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-foreground font-mono">Visa •••• 4242</span>
          </div>
          <div className="p-2.5 rounded-[4px] bg-[#141414] border border-border/80 space-y-0.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
              {isHindi ? 'ऑटो-डेबिट स्थिति' : 'Auto-Debit'}
            </span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
              <Check className="h-3 w-3" /> Enabled
            </span>
          </div>
        </div>
      </VFCard>

      {/* 2. License Key & Corporate Payment Method (2-Col Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
        {/* Cryptographic Master License Key */}
        <VFCard
          title={
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              <span>{isHindi ? 'मास्टर लाइसेंस की' : 'Master License Key'}</span>
            </div>
          }
          description={
            isHindi
              ? 'संस्थागत प्रमाणीकरण व क्लस्टर सत्यापन के लिए उपयोग की जाने वाली क्रिप्टोग्राफिक की'
              : 'Institutional cryptographic key for cluster sync and offline node validation'
          }
          className="bg-[#0d0d0d] border-border/90"
          bodyClassName="p-3 sm:p-3.5 space-y-3"
        >
          <div className="p-3 rounded-[4px] bg-[#141414] border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                Enterprise Key Serial
              </span>
              <span className="text-xs sm:text-sm font-mono font-extrabold text-foreground tracking-wider">
                {showKey ? licenseKey : 'VFL-••••-••••-CBSE-••••-DELHI'}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <VFButton
                size="sm"
                variant="outline"
                onClick={() => setShowKey(!showKey)}
                className="h-8 px-2.5 text-xs font-bold rounded-[4px]"
                leftIcon={showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              >
                {showKey ? 'Hide' : 'Reveal'}
              </VFButton>
              <VFButton
                size="sm"
                variant={copied ? "success" : "outline"}
                onClick={handleCopyKey}
                className={cn(
                  "h-8 px-3 text-xs font-bold rounded-[4px]",
                  copied ? "" : "border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary"
                )}
                leftIcon={copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              >
                {copied ? 'Copied' : 'Copy'}
              </VFButton>
            </div>
          </div>
        </VFCard>

        {/* Corporate Payment Method */}
        <VFCard
          title={
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>{isHindi ? 'भुगतान विधि व कार्ड' : 'Payment Method & Card'}</span>
            </div>
          }
          description={isHindi ? 'सक्रिय कॉर्पोरेट कार्ड और बिलिंग संपर्क' : 'Active corporate payment method and billing details'}
          className="bg-[#0d0d0d] border-border/90"
          bodyClassName="p-3 sm:p-3.5 space-y-3"
        >
          <div className="p-3 rounded-[4px] bg-[#141414] border border-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-11 rounded-[4px] bg-[#1f1f1f] border border-[#2e2e2e] flex flex-col items-center justify-center text-[10px] font-black text-white font-mono shrink-0 shadow-xs">
                VISA
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs sm:text-sm font-bold text-foreground font-mono">{cardNumber}</p>
                  <VFBadge variant="success" className="text-[9px] font-extrabold uppercase py-0.5 rounded-[2px]">
                    Default
                  </VFBadge>
                </div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  Expires {expiryDate} · {cardholderName}
                </p>
              </div>
            </div>

            <VFButton
              size="sm"
              variant="outline"
              onClick={() => setIsUpdateCardModalOpen(true)}
              className="h-8 px-3 text-xs font-bold rounded-[4px]"
              leftIcon={<Edit3 className="h-3.5 w-3.5" />}
            >
              {isHindi ? 'कार्ड बदलें' : 'Manage Card'}
            </VFButton>
          </div>
        </VFCard>
      </div>

      {/* 3. Payment History & Tax Invoices Table */}
      <VFCard
        title={
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary" />
            <span>{isHindi ? 'भुगतान इतिहास व टैक्स इनवॉइस' : 'Payment History & Tax Invoices'}</span>
          </div>
        }
        description={
          isHindi
            ? 'जीएसटी अनुपालन रसीदें और पिछले भुगतानों का आधिकारिक रिकॉर्ड'
            : 'Official tax invoice receipts with itemized GSTIN breakdowns'
        }
        actions={
          <VFButton
            size="sm"
            variant="outline"
            className="h-8 px-3 text-xs font-bold rounded-[4px]"
            leftIcon={<Download className="h-3.5 w-3.5" />}
            onClick={() => {
              addNotification({
                title: 'Archive Export Started',
                description: 'All past invoices compiled into ZIP package.',
                type: 'success',
              });
            }}
          >
            {isHindi ? 'सभी डाउनलोड करें' : 'Download All Invoices'}
          </VFButton>
        }
        className="bg-[#0d0d0d] border-border/90"
        bodyClassName="p-0 overflow-hidden"
      >
        <div className="overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full min-w-full">
          <table className="w-full min-w-full text-left text-xs border-collapse table-auto">
            <thead>
              <tr className="border-b border-border bg-[#121212] text-muted-foreground font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">
                <th className="py-2.5 px-3">{isHindi ? 'इनवॉइस #' : 'Invoice #'}</th>
                <th className="py-2.5 px-3">{t('col.date')}</th>
                <th className="py-2.5 px-3">{t('col.description')}</th>
                <th className="py-2.5 px-3">{t('col.amount')}</th>
                <th className="py-2.5 px-3">{isHindi ? 'पेमेंट मेथड' : 'Payment Method'}</th>
                <th className="py-2.5 px-3">{t('col.status')}</th>
                <th className="py-2.5 px-3 text-right">{t('col.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground font-medium">
              {INVOICE_HISTORY.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#141414] transition-colors whitespace-nowrap">
                  <td className="py-2.5 px-3 font-mono font-bold text-foreground">{inv.invoiceNo}</td>
                  <td className="py-2.5 px-3 font-mono text-muted-foreground">{inv.date}</td>
                  <td className="py-2.5 px-3 text-foreground font-semibold max-w-[220px] sm:max-w-[280px] truncate" title={inv.description}>{inv.description}</td>
                  <td className="py-2.5 px-3 font-mono font-extrabold text-foreground">{inv.amount}</td>
                  <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground">{inv.method}</td>
                  <td className="py-2.5 px-3">
                    <VFBadge variant="success" className="font-mono text-[10px] font-bold rounded-[3px] py-0.5 gap-1">
                      <Check className="h-3 w-3" /> {inv.status}
                    </VFBadge>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <VFButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadInvoice(inv.invoiceNo)}
                      className="h-7 px-2.5 text-xs font-bold rounded-[4px] text-primary border-primary/40 hover:bg-primary/10"
                      leftIcon={<Download className="h-3 w-3" />}
                    >
                      PDF
                    </VFButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </VFCard>

      {/* 4. Pay Early / Renewal Modal */}
      <VFDialog
        isOpen={isPayEarlyModalOpen}
        onClose={() => setIsPayEarlyModalOpen(false)}
        title={isHindi ? 'वार्षिक प्लान का जल्दी भुगतान / रिन्यू करें' : 'Early License Renewal & Payment'}
        description={
          isHindi
            ? 'अपकमिंग एकेडमिक सेशन 2027–2028 के लिए पहले रिन्यू करें और अनइंटरप्टेड सर्विस सुनिश्चित करें।'
            : 'Pre-pay your institutional license renewal for Academic Year 2027–2028 with instant tax invoice generation.'
        }
        className="max-w-md rounded-[4px]"
        footerActions={
          <div className="flex items-center justify-end gap-2 w-full">
            <VFButton
              variant="outline"
              size="sm"
              className="rounded-[4px]"
              onClick={() => setIsPayEarlyModalOpen(false)}
              disabled={isProcessingPayment}
            >
              Cancel
            </VFButton>
            <VFButton
              size="sm"
              className="rounded-[4px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              onClick={handleProcessEarlyPayment}
              isLoading={isProcessingPayment}
              leftIcon={<Check className="h-3.5 w-3.5" />}
            >
              {isHindi ? 'भुगतान की पुष्टि करें (₹2,40,000)' : 'Confirm & Pay ₹2,40,000'}
            </VFButton>
          </div>
        }
      >
        <div className="space-y-3.5 py-2 text-xs">
          <div className="p-3 rounded-[4px] bg-[#141414] border border-[#242424] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Subscription Term:</span>
              <span className="font-extrabold text-foreground">April 2027 – March 2028</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Tier / License:</span>
              <span className="font-bold text-foreground">Annual Enterprise (K-12)</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#202020] pt-2">
              <span className="text-muted-foreground font-medium">Payment Charged To:</span>
              <span className="font-mono font-bold text-foreground">{cardNumber}</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#202020] pt-2 text-sm font-black">
              <span className="text-foreground">Total Payable Amount:</span>
              <span className="text-emerald-400 font-mono">₹ 2,40,000</span>
            </div>
          </div>

          <div className="p-2.5 rounded-[4px] bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2 text-[11px] text-emerald-400">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Early renewal extends license coverage uninterrupted without price fluctuations.</span>
          </div>
        </div>
      </VFDialog>

      {/* 5. Update Corporate Payment Method Modal */}
      <VFDialog
        isOpen={isUpdateCardModalOpen}
        onClose={() => setIsUpdateCardModalOpen(false)}
        title="Update Corporate Payment Method"
        description="Add or update corporate credit card for automatic license billing."
        className="max-w-md rounded-[4px]"
        footerActions={
          <div className="flex items-center justify-end gap-2 w-full">
            <VFButton
              variant="outline"
              size="sm"
              className="rounded-[4px]"
              onClick={() => setIsUpdateCardModalOpen(false)}
            >
              Cancel
            </VFButton>
            <VFButton
              size="sm"
              className="rounded-[4px]"
              onClick={() => {
                setIsUpdateCardModalOpen(false);
                addNotification({
                  title: 'Payment Method Updated',
                  description: `Corporate card ending in ${cardNumber.slice(-4)} set as default payment method.`,
                  type: 'success',
                });
              }}
            >
              Save Payment Method
            </VFButton>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <VFInput
            label="Cardholder Name"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="Official Institution / Trustee Name"
            className="rounded-[4px]"
          />
          <VFInput
            label="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="16-Digit Corporate Card Number"
            className="rounded-[4px]"
          />
          <div className="grid grid-cols-2 gap-3">
            <VFInput
              label="Expiry (MM/YY)"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
              className="rounded-[4px]"
            />
            <VFInput
              label="CVV / CVC"
              type="password"
              defaultValue="•••"
              placeholder="3 Digits"
              className="rounded-[4px]"
            />
          </div>
          <div className="p-2.5 rounded-[4px] bg-[#141414] border border-[#242424] flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>PCI-DSS Level 1 Encrypted Vault. Instant card verification.</span>
          </div>
        </div>
      </VFDialog>
    </VFPageContainer>
  );
}
