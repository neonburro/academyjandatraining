// src/content/steps.js
// The J13 Roadmap to the Sale, extracted verbatim from the 2026 Salesperson
// Workbook master edition. Structure mirrors the steps table in migration
// 0003 so this module can later seed Supabase without reshaping.

import curriculum from './steps.json'

export const STEPS = curriculum.steps

export const OBJECTION_LOOP = curriculum.objectionLoop

export const CLOSING_TECHNIQUES = curriculum.closingTechniques

export function getStepBySlug(slug) {
  return STEPS.find((s) => s.slug === slug) || null
}

export function getStepByNumber(number) {
  return STEPS.find((s) => s.number === number) || null
}
