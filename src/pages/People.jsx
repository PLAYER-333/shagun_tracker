import { useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import useAppStore from '../store/useAppStore'
import PersonRow from '../components/PersonRow'
import { netBalance } from '../utils/balance'

export default function People() {
  const { people, gifts } = useAppStore()
  const navigate = useNavigate()

  return (
    <div className="page" id="people-page">
      <div className="page-header">
        <h1 className="page-title">People</h1>
        <button
          id="people-add-gift-btn"
          className="btn-primary"
          style={{ width: 'auto', padding: '8px 14px', fontSize: 13 }}
          onClick={() => navigate('/gifts/new')}
        >
          + Gift
        </button>
      </div>

      {people.length === 0 ? (
        <div className="empty-state">
          <Users size={40} />
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No people yet</div>
          <div style={{ fontSize: 13 }}>People are added when you record a gift</div>
          <button
            id="people-add-first-gift"
            className="btn-primary"
            style={{ marginTop: 16, width: 'auto', padding: '10px 20px' }}
            onClick={() => navigate('/gifts/new')}
          >
            Add First Gift
          </button>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>
            {people.length} {people.length === 1 ? 'person' : 'people'}
          </div>
          {people.map(person => (
            <PersonRow
              key={person.id}
              person={person}
              net={netBalance(gifts, person.id)}
            />
          ))}
        </>
      )}
    </div>
  )
}
