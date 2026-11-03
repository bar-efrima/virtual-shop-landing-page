/*
 * The demo request form's logic: validation and the submission to the form service.
 *
 * submitLead reports success only when the service answered 2xx with a JSON body that doesn't
 * state a failure. Anything else (an HTML page, a redirect, a network error) counts as failed,
 * because the visitor would otherwise be told their request arrived when it may not have.
 */
import type { Attribution } from './attribution';

export interface LeadFields {
  name: string;
  email: string;
  company: string;
  message: string;
}

export const emptyLead: LeadFields = { name: '', email: '', company: '', message: '' };
export const MESSAGE_MAX = 2000;

export type LeadErrors = Partial<Record<keyof LeadFields, string>>;

export function validateLead(lead: LeadFields): LeadErrors {
  const errors: LeadErrors = {};
  if (lead.name.trim().length < 2) errors.name = 'נא להזין שם מלא';
  if (!lead.email.trim()) errors.email = 'נא להזין אימייל בעבודה';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email.trim()))
    errors.email = 'כתובת האימייל לא תקינה. לדוגמה: name@company.co.il';
  if (!lead.company.trim()) errors.company = 'נא להזין את שם החברה';
  if (lead.message.length > MESSAGE_MAX) errors.message = `ההודעה ארוכה מדי. עד ${MESSAGE_MAX} תווים`;
  return errors;
}

export type SubmitResult = { ok: true } | { ok: false; reason: 'not_configured' | 'timeout' | 'network' | 'rejected' };

const TIMEOUT_MS = 15_000;

interface SubmitOptions {
  endpoint: string;
  lead: LeadFields;
  attribution: Attribution;
  /** the hidden spam-trap field: passed on for the service to judge, never acted on here */
  honeypot?: string;
  fetchFn?: typeof fetch;
  timeoutMs?: number;
}

export async function submitLead({
  endpoint,
  lead,
  attribution,
  honeypot = '',
  fetchFn = (...args) => fetch(...args),
  timeoutMs = TIMEOUT_MS,
}: SubmitOptions): Promise<SubmitResult> {
  if (!endpoint) return { ok: false, reason: 'not_configured' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchFn(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: lead.name.trim(),
        email: lead.email.trim(),
        company: lead.company.trim(),
        message: lead.message.trim(),
        _subject: 'Virtual-Shop: בקשה לתיאום הדגמה',
        _gotcha: honeypot,
        ...attribution,
      }),
      signal: controller.signal,
    });
    if (!response.ok || response.redirected) return { ok: false, reason: 'rejected' };
    const body: unknown = await response.json().catch(() => null);
    if (typeof body !== 'object' || body === null) return { ok: false, reason: 'rejected' };
    const { ok, success, error } = body as Record<string, unknown>;
    if (ok === false || success === false || error) return { ok: false, reason: 'rejected' };
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: (e as Error).name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}
