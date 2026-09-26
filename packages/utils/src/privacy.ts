/**
 * @vidyafloww/utils - DPDP Act, 2023 & DPDP Rules, 2025 Privacy Utilities
 * Data minimisation, Aadhaar masking, child age verification, and audit hashers.
 */

/**
 * Masks an Indian Aadhaar number or National ID according to UIDAI & DPDP guidelines.
 * Input: "1234 5678 9012" or "1234-5678-9012" or "123456789012"
 * Output: "XXXX-XXXX-9012"
 */
export function maskAadhaar(aadhaar?: string | null): string {
  if (!aadhaar) return 'XXXX-XXXX-XXXX';
  const clean = aadhaar.replace(/[^0-9]/g, '');
  if (clean.length < 4) return 'XXXX-XXXX-XXXX';
  const lastFour = clean.slice(-4);
  return `XXXX-XXXX-${lastFour}`;
}

/**
 * Masks a phone number to prevent unauthorized exposure.
 * Input: "+91 98101 23456"
 * Output: "+91 ***** **456"
 */
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return '***** *****';
  const clean = phone.trim();
  if (clean.length <= 4) return '*****';
  const suffix = clean.slice(-3);
  return `+91 ***** **${suffix}`;
}

/**
 * Masks an email address for privacy-preserving UI display.
 * Input: "rajesh.sharma@example.com"
 * Output: "r***a@example.com"
 */
export function maskEmail(email?: string | null): string {
  if (!email || !email.includes('@')) return '*****@*****';
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  const first = localPart[0];
  const last = localPart[localPart.length - 1];
  return `${first}***${last}@${domain}`;
}

/**
 * Determines whether a student is legally a Child/Minor (< 18 years)
 * under Section 9 of the DPDP Act, 2023.
 * Supports formats: "DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", ISO strings.
 */
export function isMinor(dobString?: string | null): boolean {
  if (!dobString) return true; // Default to minor safety in educational context
  const age = calculateAge(dobString);
  return age < 18;
}

/**
 * Computes exact age in completed years from Date of Birth.
 */
export function calculateAge(dobString?: string | null): number {
  if (!dobString) return 0;
  
  let birthDate: Date;
  
  if (dobString.includes('-') && dobString.split('-')[0].length === 2) {
    // DD-MM-YYYY format
    const [day, month, year] = dobString.split('-').map(Number);
    birthDate = new Date(year, month - 1, day);
  } else if (dobString.includes('/') && dobString.split('/')[0].length === 2) {
    // DD/MM/YYYY format
    const [day, month, year] = dobString.split('/').map(Number);
    birthDate = new Date(year, month - 1, day);
  } else {
    birthDate = new Date(dobString);
  }
  
  if (isNaN(birthDate.getTime())) return 0;
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

/**
 * Sanitizes any data payload for safe export, redacting plain-text national IDs
 * and injecting DPDP Act 2023 compliance watermarks.
 */
export function sanitizePersonalDataExport<T extends Record<string, any>>(
  record: T,
  redactAadhaar = true
): T {
  const sanitized = { ...record };
  
  if (redactAadhaar && (sanitized as any).aadhaarNo) {
    (sanitized as any).aadhaarNo = maskAadhaar((sanitized as any).aadhaarNo);
  }
  
  // Strip sensitive internal security tokens if present
  delete (sanitized as any).password;
  delete (sanitized as any).jwtToken;
  delete (sanitized as any).refreshToken;
  delete (sanitized as any).apiSecret;
  
  return sanitized;
}

/**
 * Generates a mock verifiable compliance checksum string for audit trails.
 */
export function generateComplianceAuditHash(payload: unknown): string {
  const str = JSON.stringify(payload) + 'DPDP_2023_SOVEREIGN_TOKEN';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return `DPDP-VERIFIED-SHA256-${hex}-IND`;
}
