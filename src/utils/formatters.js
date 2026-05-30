/**
 * formatters.js — Indian currency & date formatting utilities
 */

/**
 * Format a number in Indian currency format: ₹1,10,000
 */
export function formatINR(amount) {
  if (amount === null || amount === undefined) return '₹0'
  const num = Number(amount)
  if (isNaN(num)) return '₹0'

  // Indian number system formatting
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  })
  return formatter.format(Math.abs(num))
}

/**
 * Format a date as "12 Jun 2025"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Get event type display label
 */
export function getEventTypeLabel(type) {
  const labels = {
    wedding: 'Wedding',
    mundan: 'Mundan',
    griha_pravesh: 'Griha Pravesh',
    funeral: 'Funeral',
    other: 'Other',
  }
  return labels[type] || type || 'Event'
}

/**
 * Get gift type display label
 */
export function getGiftTypeLabel(type) {
  const labels = {
    cash: 'Cash',
    upi: 'UPI',
    gift_item: 'Gift Item',
  }
  return labels[type] || type || 'Cash'
}
