import { formatINR } from '../utils/formatters'

export default function StatCard({ label, amount, color = 'gray', id }) {
  return (
    <div className="stat-card" id={id}>
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${color}`}>{formatINR(amount)}</div>
    </div>
  )
}
