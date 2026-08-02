// netlify/functions/coach.js
// The J13 Coach. Calls the Anthropic API with a system prompt grounded in the
// master J13 curriculum. Per Jazz's guardrails the coach never invents product
// facts, rates, approvals, legal rules or dealership policy, and it always
// coaches toward the approved 13-step process.
//
// Requires ANTHROPIC_API_KEY in Netlify env vars. Without it the function
// returns a friendly not-configured message so the UI stays usable.
//
// System prompt layout is cache-stable: persona + knowledge first (cached),
// per-user context appended after the cache breakpoint via a separate block.

import Anthropic from '@anthropic-ai/sdk'
import { J13_KNOWLEDGE } from './lib/coachKnowledge.js'

const MODEL = process.env.COACH_MODEL || 'claude-opus-5'
const MAX_HISTORY = 24

const PERSONA = `You are the J13 Coach, the in-app training coach for the J13 Dealer Academy by Janda Dealer Training. You coach dealership salespeople, finance managers and sales managers on the J13 sales system built by Jazz Janda.

Your voice: direct, experienced, professional, accountable and encouraging without being corny. You speak from real dealership situations, not abstract theory. You keep answers short and practical, usually under 150 words, because the person is often on the sales floor between customers. You use the J13 vocabulary exactly as defined: Manager Introduction, Trial Close, FFB (Feature, Function and Benefit), Two-Way Contact, Save-a-Deal, PVR, the 300% Rule, the Objection Loop.

Your job, in priority order:
1. Keep the person on task. If they have a next step in their training, steer them toward completing it.
2. Help them practice: run word tracks with them, play the customer in short role-play exchanges, quiz them on the process.
3. Answer questions about the J13 method using the knowledge below.
4. Encourage real application: end coaching moments by asking what they will do with their next customer.

Hard rules you never break:
- Never invent product facts, prices, rates, payments, lender outcomes, approvals, inventory, legal rules or dealership policy. If asked, say that comes from their manager or dealership systems and offer to practice the conversation instead.
- Never coach manipulative or high-pressure tactics. The J13 standard is professional, ethical and customer-focused.
- Compliance topics (disclosures, advertising, privacy, Safeguards): describe the J13 professional standard, then tell them to verify specifics with their manager and dealership counsel. You are not a lawyer and say so plainly when it matters.
- If a question is outside dealership sales training, redirect briefly and kindly back to training.
- Stay grounded in the knowledge below. If something is not covered there, say you want to be accurate and suggest they ask their manager or Jazz.

When role-playing, play a realistic customer, keep exchanges to a few lines, then break character and give feedback scored against specific J13 behaviors: discovery quality, sequence, listening, building value before price, asking for commitment and CRM next action.

No em dashes or en dashes in your responses. No Oxford commas.`

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' })
  }

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { error: 'Invalid request body' })
  }

  const { messages, context } = body
  if (!Array.isArray(messages) || messages.length === 0) {
    return json(400, { error: 'messages array required' })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return json(200, {
      reply:
        "I'm almost ready. The coach needs its ANTHROPIC_API_KEY set in Netlify before I can talk. Ask Tyler to flip that switch, then come back and we'll get to work.",
      configured: false,
    })
  }

  const history = messages
    .slice(-MAX_HISTORY)
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }))

  if (history.length === 0 || history[history.length - 1].role !== 'user') {
    return json(400, { error: 'last message must be from the user' })
  }

  const contextBlock = buildContextBlock(context)

  const client = new Anthropic()

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 2048,
      output_config: { effort: 'medium' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [
        {
          type: 'text',
          text: `${PERSONA}\n\n=== APPROVED J13 KNOWLEDGE ===\n${J13_KNOWLEDGE}`,
          cache_control: { type: 'ephemeral' },
        },
        { type: 'text', text: contextBlock },
      ],
      messages: history,
    })

    if (response.stop_reason === 'refusal') {
      return json(200, {
        reply: "Let's keep this one on training. What part of the process do you want to work on?",
        configured: true,
      })
    }

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim()

    return json(200, { reply: text || "I didn't catch that. Try me again.", configured: true })
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return json(200, {
        reply: 'My API key is not valid right now. Ask Tyler to check the ANTHROPIC_API_KEY in Netlify.',
        configured: false,
      })
    }
    if (err instanceof Anthropic.RateLimitError) {
      return json(200, {
        reply: "I'm getting a lot of questions right now. Give me a few seconds and ask again.",
        configured: true,
      })
    }
    console.error('coach: API error', err.status || '', err.message)
    return json(200, {
      reply: 'I hit a snag talking to my brain. Try again in a moment.',
      configured: true,
    })
  }
}

function buildContextBlock(context) {
  const c = context || {}
  const parts = ['=== THIS USER, RIGHT NOW ===']
  if (c.firstName) parts.push(`Name: ${c.firstName}`)
  if (c.role) parts.push(`Role: ${c.role}`)
  if (c.currentStep) {
    parts.push(
      `Current training position: Step ${c.currentStep.number} of 13, ${c.currentStep.title}. Status: ${c.currentStep.status || 'in progress'}.`
    )
    parts.push('If the conversation gives you a natural opening, steer them toward finishing this step.')
  }
  if (typeof c.streakDays === 'number' && c.streakDays > 0) {
    parts.push(`Training streak: ${c.streakDays} day${c.streakDays === 1 ? '' : 's'}. Recognize it briefly if they are doing well.`)
  }
  if (Array.isArray(c.openCommitments) && c.openCommitments.length > 0) {
    parts.push(`Open next-customer commitments they have made: ${c.openCommitments.slice(0, 3).join(' | ')}. Ask how these went when relevant.`)
  }
  if (parts.length === 1) parts.push('No training context available yet. Welcome them and point them to Step 1, Meet and Greet.')
  return parts.join('\n')
}

function json(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }
}
