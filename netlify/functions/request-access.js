// netlify/functions/request-access.js
// STATUS: stable | UPDATED: 2026-08-02
// LOG:
//   2026-08-02  Header standardized; Phase 1 checkpoint committed (e765830).
// =============================================================
// Handles the Login "Request access" modal. The J13 Dealer Academy
// is invite-only, so this captures a request, stores it, and
// notifies Jazz and JJ so they can grant access manually.
//
// Flow:
//   1. Validate payload (name dealership email role, honeypot)
//   2. Insert into access_requests (service_role, bypasses RLS)
//   3. Email admins (Jazz + JJ) a branded notification
//   4. Email the requester a branded confirmation
//   5. Return 200
//
// Style matches the marketing submit-lead function and the academy
// lookup-email function. Clean black brand in the email HTML.
//
// Env:
//   VITE_SUPABASE_URL (or SUPABASE_URL)
//   SUPABASE_SERVICE_ROLE_KEY
//   RESEND_API_KEY
//   RESEND_FROM_EMAIL          e.g. "J13 Dealer Academy <hello@jandatraining.com>"
//   ADMIN_EMAILS               comma-separated, defaults to jazz + jj
// =============================================================

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const REQUIRED_FIELDS = ['name', 'dealership', 'email', 'role']
const SUPABASE_TIMEOUT_MS = 7000

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(body),
  }
}

function escapeHtml(s) {
  if (s == null) return ''
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

function withTimeout(promise, ms, label) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

function validate(payload) {
  if (!payload || typeof payload !== 'object') return 'Invalid payload'
  for (const field of REQUIRED_FIELDS) {
    if (!payload[field] || String(payload[field]).trim().length === 0) {
      return `Missing required field: ${field}`
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return 'Invalid email address'
  }
  if (payload['bot-field'] && String(payload['bot-field']).trim().length > 0) {
    return 'SILENT_SPAM'
  }
  return null
}

function buildAdminEmail({ req }) {
  const subject = `Access request: ${req.name} at ${req.dealership}`
  const rows = [
    ['Name', req.name],
    ['Dealership', req.dealership],
    ['Role', req.role],
    ['Email', req.email],
  ]
  const rowHtml = rows.map(([label, value]) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid rgba(10,10,10,0.08);width:110px;vertical-align:top;">
        <p style="margin:0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#86868B;">${label}</p>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid rgba(10,10,10,0.08);font-size:15px;color:#0A0A0A;">${escapeHtml(value)}</td>
    </tr>`).join('')

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAFAF7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0A0A0A;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF7;"><tr><td align="center" style="padding:40px 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFFFF;border:1px solid rgba(10,10,10,0.08);border-radius:16px;overflow:hidden;">
  <tr><td style="padding:28px 32px 0;">
    <p style="margin:0;font-weight:700;font-size:15px;letter-spacing:0.14em;text-transform:uppercase;color:#0A0A0A;">J<span style="color:#9B2D2D;">13</span> Dealer Academy</p>
  </td></tr>
  <tr><td style="padding:20px 32px 8px;">
    <p style="margin:0 0 10px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#9B2D2D;">New Access Request</p>
    <h1 style="margin:0;font-size:24px;font-weight:600;line-height:1.2;letter-spacing:-0.015em;color:#0A0A0A;">${escapeHtml(req.name)} at ${escapeHtml(req.dealership)}</h1>
  </td></tr>
  <tr><td style="padding:20px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(10,10,10,0.08);">${rowHtml}</table>
  </td></tr>
  <tr><td style="padding:8px 32px 28px;">
    <a href="mailto:${escapeHtml(req.email)}?subject=${encodeURIComponent('J13 Dealer Academy access')}" style="display:inline-block;padding:11px 22px;background:#0A0A0A;color:#FFFFFF;border-radius:980px;font-size:14px;font-weight:500;text-decoration:none;">Reply to ${escapeHtml(req.name.split(' ')[0])}</a>
  </td></tr>
</table>
</td></tr></table></body></html>`

  const text = [`New access request`, '', `Name: ${req.name}`, `Dealership: ${req.dealership}`, `Role: ${req.role}`, `Email: ${req.email}`].join('\n')
  return { subject, html, text }
}

function buildRequesterEmail({ req }) {
  const firstName = (req.name || 'there').split(' ')[0]
  const subject = `Your J13 Dealer Academy access request`
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAFAF7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0A0A0A;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF7;"><tr><td align="center" style="padding:40px 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFFFF;border:1px solid rgba(10,10,10,0.08);border-radius:16px;overflow:hidden;">
  <tr><td style="padding:28px 32px 0;">
    <p style="margin:0;font-weight:700;font-size:15px;letter-spacing:0.14em;text-transform:uppercase;color:#0A0A0A;">J<span style="color:#9B2D2D;">13</span> Dealer Academy</p>
  </td></tr>
  <tr><td style="padding:24px 32px 8px;">
    <p style="margin:0 0 12px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#9B2D2D;">Request received</p>
    <h1 style="margin:0 0 14px;font-size:26px;font-weight:600;line-height:1.2;letter-spacing:-0.015em;color:#0A0A0A;">Got it, ${escapeHtml(firstName)}.</h1>
    <p style="margin:0;font-size:16px;line-height:1.6;color:#4A4A4F;">Thanks for your interest in the J13 Dealer Academy. Jazz will review your request and be in touch about getting your team set up. Usually within one business day.</p>
  </td></tr>
  <tr><td style="padding:24px 32px 28px;border-top:1px solid rgba(10,10,10,0.08);margin-top:16px;">
    <p style="margin:16px 0 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#86868B;">Janda Dealer Training</p>
    <p style="margin:4px 0 0;font-size:13px;color:#86868B;">Process. Leadership. Dealership growth.</p>
  </td></tr>
</table>
</td></tr></table></body></html>`
  const text = [`Got it, ${firstName}.`, '', 'Thanks for your interest in the J13 Dealer Academy. Jazz will review your request and be in touch, usually within one business day.', '', 'Janda Dealer Training', 'Process. Leadership. Dealership growth.'].join('\n')
  return { subject, html, text }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }, body: '' }
  }
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' })
  }

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON' })
  }

  const validationError = validate(payload)
  if (validationError === 'SILENT_SPAM') return jsonResponse(200, { ok: true })
  if (validationError) return jsonResponse(400, { error: validationError })

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'J13 Dealer Academy <hello@jandatraining.com>'
  const adminRaw = process.env.ADMIN_EMAILS || process.env.ACCESS_ADMIN_EMAILS || 'jazz@jandatraining.com,jj@neonburro.com'
  const adminEmails = adminRaw.split(',').map((s) => s.trim()).filter(Boolean)

  if (!supabaseUrl || !serviceKey) {
    console.error('request-access: missing Supabase env')
    return jsonResponse(500, { error: 'Server misconfigured. Email jazz@jandatraining.com directly.' })
  }
  if (!resendKey) {
    console.error('request-access: missing Resend env')
    return jsonResponse(500, { error: 'Server misconfigured. Email jazz@jandatraining.com directly.' })
  }

  let supabase
  try {
    supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { params: { eventsPerSecond: 0 } },
    })
  } catch (err) {
    console.error('request-access: supabase init failed:', err && err.message ? err.message : err)
    return jsonResponse(500, { error: 'Server misconfigured. Email jazz@jandatraining.com directly.' })
  }

  const resend = new Resend(resendKey)

  const row = {
    name: payload.name.trim(),
    dealership: payload.dealership.trim(),
    email: payload.email.trim().toLowerCase(),
    role: payload.role.trim(),
    source: 'login-modal',
    ip_address: event.headers['x-forwarded-for'] || event.headers['client-ip'] || null,
    user_agent: event.headers['user-agent'] || null,
  }

  let saved
  try {
    const insertPromise = supabase.from('access_requests').insert(row).select().single()
    const { data, error } = await withTimeout(insertPromise, SUPABASE_TIMEOUT_MS, 'Supabase insert')
    if (error) throw error
    saved = data
  } catch (err) {
    console.error('request-access insert failed:', JSON.stringify({
      message: err && err.message ? err.message : String(err),
      code: err && err.code ? err.code : null,
      details: err && err.details ? err.details : null,
      hint: err && err.hint ? err.hint : null,
    }))
    const isTimeout = err && typeof err.message === 'string' && err.message.includes('timed out')
    return jsonResponse(isTimeout ? 503 : 500, {
      error: isTimeout
        ? 'The database is waking up. Please try again in a minute, or email jazz@jandatraining.com directly.'
        : 'Could not submit your request. Please try again or email jazz@jandatraining.com directly.',
    })
  }

  const adminPromise = (async () => {
    try {
      const { subject, html, text } = buildAdminEmail({ req: saved })
      await resend.emails.send({ from: fromEmail, to: adminEmails, reply_to: saved.email, subject, html, text })
      await supabase.from('access_requests').update({ admin_notified_at: new Date().toISOString() }).eq('id', saved.id)
    } catch (err) {
      console.error('request-access admin email failed:', err && err.message ? err.message : err)
      await supabase.from('access_requests').update({ email_error: `admin: ${err.message}` }).eq('id', saved.id).catch(() => {})
    }
  })()

  const requesterPromise = (async () => {
    try {
      const { subject, html, text } = buildRequesterEmail({ req: saved })
      await resend.emails.send({ from: fromEmail, to: [saved.email], reply_to: adminEmails[0], subject, html, text })
    } catch (err) {
      console.error('request-access requester email failed:', err && err.message ? err.message : err)
    }
  })()

  await Promise.allSettled([adminPromise, requesterPromise])

  return jsonResponse(200, { ok: true, id: saved.id })
}