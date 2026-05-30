import { formatINR, formatDate, getGiftTypeLabel } from '../utils/formatters'

export default function GiftRow({ gift, personName, eventTitle }) {
  const isReceived = gift.direction === 'received'
  return (
    <div className="row-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <div>
          {personName && <div className="row-title">{personName}</div>}
          {eventTitle && <div className="row-subtitle">{eventTitle}</div>}
          <div className="row-subtitle">{formatDate(gift.gift_date)} · {getGiftTypeLabel(gift.gift_type)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className={`row-amount ${isReceived ? 'received' : 'given'}`}>
            {isReceived ? '+' : '−'}{formatINR(gift.amount)}
          </div>
          <span className={`badge ${isReceived ? 'badge-received' : 'badge-given'}`}>
            {isReceived ? 'Received' : 'Given'}
          </span>
        </div>
      </div>
      {gift.notes && (
        <div className="row-subtitle" style={{ fontStyle: 'italic' }}>"{gift.notes}"</div>
      )}
    </div>
  )
}
