import type { QuoteConfig } from './pricing'

/**
 * Holds an in-progress quote while a visitor signs up, so they land back on
 * the same part and configuration. Kept in memory: it survives client-side
 * navigation, which is all the signup flow needs.
 */
export interface QuoteDraft {
  file: File
  config: QuoteConfig
}

let draft: QuoteDraft | null = null

export const saveDraft = (d: QuoteDraft) => {
  draft = d
}

export const takeDraft = (): QuoteDraft | null => {
  const d = draft
  draft = null
  return d
}
