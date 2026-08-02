// src/content/manager.js
// The J13 manager and trainer layer, extracted from the 2026 Trainer Edition
// master manual. Powers manager checkpoints, role-play labs, sign-off criteria
// and the management operating system views.

import manager from './manager.json'

export const MANAGER_PER_STEP = manager.perStep

export const MANAGEMENT_SYSTEM = manager.managementSystem

export const CERTIFICATION = manager.certification

export const FACILITATION = manager.facilitation

export function getManagerLayerForStep(number) {
  return MANAGER_PER_STEP.find((s) => s.number === number) || null
}
