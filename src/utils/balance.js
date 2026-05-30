/**
 * balance.js — Net balance and suggested amount computation
 */

/**
 * Calculate net balance for a person.
 * net > 0 means they owe us
 * net < 0 means we owe them
 */
export function netBalance(gifts, personId) {
  const received = gifts
    .filter(g => g.person_id === personId && g.direction === 'received')
    .reduce((sum, g) => sum + Number(g.amount), 0)

  const given = gifts
    .filter(g => g.person_id === personId && g.direction === 'given')
    .reduce((sum, g) => sum + Number(g.amount), 0)

  return received - given
}

/**
 * Calculate overall totals across all gifts
 */
export function overallTotals(gifts) {
  const totalReceived = gifts
    .filter(g => g.direction === 'received')
    .reduce((sum, g) => sum + Number(g.amount), 0)

  const totalGiven = gifts
    .filter(g => g.direction === 'given')
    .reduce((sum, g) => sum + Number(g.amount), 0)

  return { totalReceived, totalGiven, net: totalReceived - totalGiven }
}

/**
 * Calculate suggested gift amount for a person.
 * Uses 10% annual inflation on the most recent gift amount.
 * Rounds to nearest ₹100.
 * Returns null if no previous gifts given to this person.
 */
export function suggestedAmount(gifts, personId) {
  const givenGifts = gifts
    .filter(g => g.person_id === personId && g.direction === 'given')
    .sort((a, b) => new Date(b.gift_date || b.created_at) - new Date(a.gift_date || a.created_at))

  if (givenGifts.length === 0) return null

  const lastGift = givenGifts[0]
  const lastDate = new Date(lastGift.gift_date || lastGift.created_at)
  const now = new Date()
  const yearsSince = (now - lastDate) / (1000 * 60 * 60 * 24 * 365.25)

  if (yearsSince < 0) return Number(lastGift.amount)

  const suggested = Number(lastGift.amount) * Math.pow(1.1, yearsSince)
  // Round to nearest ₹100
  return Math.ceil(suggested / 100) * 100
}

/**
 * Get top givers (people who gave the most to us — received direction)
 */
export function topGivers(gifts, people, limit = 5) {
  const totals = {}
  gifts
    .filter(g => g.direction === 'received')
    .forEach(g => {
      totals[g.person_id] = (totals[g.person_id] || 0) + Number(g.amount)
    })

  return Object.entries(totals)
    .map(([personId, amount]) => ({
      person: people.find(p => p.id === personId),
      amount,
    }))
    .filter(x => x.person)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit)
}
