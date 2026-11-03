/*
 * The demo request form, in a native modal <dialog>: it traps focus and closes on Escape by
 * itself. What was typed survives closing it; only a successful submission clears the form.
 */
import { useEffect, useId, useRef, useState, type FormEvent, type RefObject } from 'react';
import { track } from '../lib/analytics';
import { getAttribution } from '../lib/attribution';
import { config } from '../lib/config';
import { emptyLead, MESSAGE_MAX, submitLead, validateLead, type LeadErrors, type LeadFields } from '../lib/lead';

type Status = 'idle' | 'sending' | 'sent' | 'failed';

interface Props {
  open: boolean;
  onClose: () => void;
  returnFocusTo: RefObject<HTMLElement | null>;
}

const FIELD_ORDER: (keyof LeadFields)[] = ['name', 'email', 'company', 'message'];

export function ContactDialog({ open, onClose, returnFocusTo }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const failureRef = useRef<HTMLDivElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const [lead, setLead] = useState(emptyLead);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [failedOffline, setFailedOffline] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
      returnFocusTo.current?.focus();
    }
  }, [open, returnFocusTo]);

  useEffect(() => {
    if (status === 'sent') successRef.current?.focus();
    if (status === 'failed') failureRef.current?.focus();
  }, [status]);

  const close = () => {
    onClose();
    if (status === 'sent') {
      setLead(emptyLead);
      setErrors({});
      setStatus('idle');
    }
  };

  const change = (field: keyof LeadFields, value: string) => {
    const next = { ...lead, [field]: value };
    setLead(next);
    // an error shown goes away as soon as the field is right
    if (errors[field]) setErrors({ ...errors, [field]: validateLead(next)[field] });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    const found = validateLead(lead);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find(field => found[field]);
    if (firstInvalid) {
      setStatus('idle');
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus('sending');
    const result = await submitLead({
      endpoint: config.formEndpoint,
      lead,
      attribution: getAttribution(),
      honeypot: honeypotRef.current?.value,
    });
    if (result.ok) {
      setStatus('sent');
      track({ name: 'generate_lead', params: { form_id: 'demo_request' } });
    } else {
      if (result.reason === 'not_configured') console.error('VITE_FORM_ENDPOINT is not set: the form cannot send.');
      setFailedOffline(result.reason === 'network' || result.reason === 'timeout');
      setStatus('failed');
    }
  };

  const field = (name: keyof LeadFields) => ({
    id: `${id}-${name}`,
    name,
    value: lead[name],
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${id}-${name}-error` : undefined,
    onChange: (e: { target: { value: string } }) => change(name, e.target.value),
  });

  const fieldError = (name: keyof LeadFields) =>
    errors[name] && (
      <p className="field-error" id={`${id}-${name}-error`}>
        {errors[name]}
      </p>
    );

  const sending = status === 'sending';

  return (
    <dialog
      ref={dialogRef}
      className="contact"
      aria-labelledby={`${id}-title`}
      onClose={() => open && close()}
      onClick={e => {
        // a click on the dialog element itself landed on the backdrop
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="contact-body">
        <button type="button" className="contact-close" onClick={close} aria-label="סגירת הטופס">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {status === 'sent' ? (
          <div className="contact-sent" role="status">
            <h2 id={`${id}-title`} ref={successRef} tabIndex={-1}>
              הבקשה נשלחה
            </h2>
            <p>קיבלנו את הפרטים, וניצור איתכם קשר לתיאום ההדגמה.</p>
            <button type="button" className="cta cta-ink" onClick={close} data-autofocus>
              סגירה
            </button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={submit} noValidate aria-busy={sending}>
            <h2 id={`${id}-title`}>לתיאום הדגמה</h2>
            <p className="contact-lede">נשמח להראות לכם את החנות. נחזור אליכם כדי לקבוע מועד.</p>

            <div className="field">
              <label htmlFor={`${id}-name`}>שם מלא</label>
              <input {...field('name')} type="text" autoComplete="name" required data-autofocus />
              {fieldError('name')}
            </div>
            <div className="field">
              <label htmlFor={`${id}-email`}>אימייל בעבודה</label>
              <input {...field('email')} type="email" autoComplete="email" inputMode="email" dir="ltr" required />
              {fieldError('email')}
            </div>
            <div className="field">
              <label htmlFor={`${id}-company`}>חברה</label>
              <input {...field('company')} type="text" autoComplete="organization" required />
              {fieldError('company')}
            </div>
            <div className="field">
              <label htmlFor={`${id}-message`}>
                הודעה <span className="field-optional">(לא חובה)</span>
              </label>
              <textarea {...field('message')} rows={3} maxLength={MESSAGE_MAX} />
              {fieldError('message')}
            </div>

            {/* a trap for bots: people never see or reach this field */}
            <div className="trap" aria-hidden="true">
              <label>
                Leave empty
                <input ref={honeypotRef} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            {status === 'failed' && (
              <div className="contact-failed" role="alert" ref={failureRef} tabIndex={-1}>
                <b>הבקשה לא נשלחה.</b>{' '}
                {failedOffline
                  ? 'נראה שיש בעיית חיבור. הפרטים נשמרו כאן, אפשר לנסות שוב.'
                  : 'משהו השתבש אצלנו. הפרטים נשמרו כאן, אפשר לנסות שוב בעוד כמה דקות.'}
              </div>
            )}

            <button type="submit" className="cta cta-ink contact-submit" aria-disabled={sending}>
              {sending ? 'שולחים…' : status === 'failed' ? 'ניסיון נוסף' : 'שליחה'}
            </button>
            <p className="contact-fineprint">הפרטים ישמשו ליצירת קשר בנוגע להדגמה.</p>
          </form>
        )}
      </div>
    </dialog>
  );
}
