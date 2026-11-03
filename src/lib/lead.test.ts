import { describe, expect, it, vi } from 'vitest';
import { emptyLead, submitLead, validateLead } from './lead';

const lead = { name: 'נועה כהן', email: 'noa@company.co.il', company: 'חברה', message: '' };
const send = (response: Response | Promise<Response>) =>
  submitLead({
    endpoint: 'https://forms.test/x',
    lead,
    attribution: {},
    fetchFn: vi.fn(() => Promise.resolve(response)),
  });

describe('validateLead', () => {
  it('asks for the required fields, not the message', () => {
    expect(Object.keys(validateLead(emptyLead)).sort()).toEqual(['company', 'email', 'name']);
    expect(validateLead(lead)).toEqual({});
  });
  it('rejects a malformed email', () => {
    expect(validateLead({ ...lead, email: 'noa@company' }).email).toBeTruthy();
    expect(validateLead({ ...lead, email: 'no a@company.co.il' }).email).toBeTruthy();
  });
});

describe('submitLead reports success only on a real success', () => {
  it('succeeds on 2xx with JSON', async () => {
    expect(await send(new Response('{"ok":true}', { status: 200 }))).toEqual({ ok: true });
  });
  it('fails without an endpoint, and sends nothing', async () => {
    const fetchFn = vi.fn();
    expect(await submitLead({ endpoint: '', lead, attribution: {}, fetchFn })).toEqual({
      ok: false,
      reason: 'not_configured',
    });
    expect(fetchFn).not.toHaveBeenCalled();
  });
  it.each([
    ['a server error', () => new Response('{}', { status: 500 })],
    ['a rejected request', () => new Response('{"error":"nope"}', { status: 422 })],
    ['2xx that is not JSON', () => new Response('<html>thanks</html>', { status: 200 })],
    ['2xx with an empty body', () => new Response(null, { status: 204 })],
    ['2xx stating ok: false', () => new Response('{"ok":false}', { status: 200 })],
    ['2xx stating success: false', () => new Response('{"success":false}', { status: 200 })],
    ['2xx with an error field', () => new Response('{"error":"quota"}', { status: 200 })],
  ])('fails on %s', async (_, response) => {
    expect(await send(response())).toEqual({ ok: false, reason: 'rejected' });
  });
  it('fails on a network error', async () => {
    const fetchFn = vi.fn(() => Promise.reject(new TypeError('offline')));
    const result = await submitLead({ endpoint: 'https://forms.test/x', lead, attribution: {}, fetchFn });
    expect(result).toEqual({ ok: false, reason: 'network' });
  });
  it('fails when the service never answers', async () => {
    const fetchFn = vi.fn(
      (_url: unknown, init?: RequestInit) =>
        new Promise<Response>((_, reject) =>
          init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError'))),
        ),
    );
    const result = await submitLead({
      endpoint: 'https://forms.test/x',
      lead,
      attribution: {},
      fetchFn: fetchFn as unknown as typeof fetch,
      timeoutMs: 5,
    });
    expect(result).toEqual({ ok: false, reason: 'timeout' });
  });
  it('sends the lead and its campaign to the form service', async () => {
    const fetchFn = vi.fn((_url: unknown, _init?: RequestInit) => Promise.resolve(new Response('{"ok":true}')));
    await submitLead({
      endpoint: 'https://forms.test/x',
      lead,
      attribution: { utm_source: 'linkedin' },
      fetchFn: fetchFn as unknown as typeof fetch,
    });
    expect(JSON.parse(fetchFn.mock.calls[0]![1]!.body as string)).toMatchObject({
      email: lead.email,
      utm_source: 'linkedin',
    });
  });
});
