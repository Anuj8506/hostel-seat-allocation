import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAvailableHostels, submitRound2Preferences } from '../services/studentService'

function Round2PreferencePage() {
  const [rankedHostels, setRankedHostels] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await getAvailableHostels()
        setRankedHostels(response.data.availableRooms)
      } catch {
        setError('Failed to load hostels. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchHostels()
  }, [])

  const moveUp = (index) => {
    if (index === 0) return
    const newRanked = [...rankedHostels]
    ;[newRanked[index], newRanked[index - 1]] = [newRanked[index - 1], newRanked[index]]
    setRankedHostels(newRanked)
  }

  const moveDown = (index) => {
    if (index === rankedHostels.length - 1) return
    const newRanked = [...rankedHostels]
    ;[newRanked[index], newRanked[index + 1]] = [newRanked[index + 1], newRanked[index]]
    setRankedHostels(newRanked)
  }

  const handleSubmit = async () => {
    setError('')
    setSubmitting(true)

    const rankedIds = rankedHostels.map(hostel => hostel._id)

    try {
      await submitRound2Preferences(rankedIds)
      setSuccess('Round 2 preferences submitted successfully!')
      setTimeout(() => navigate('/allocation'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit preferences.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div>Loading hostels...</div>

  return (
    <div>
      <h1>Hostel Seat Allocation</h1>
      <h2>Round 2 Preferences</h2>
      <p>Only hostels with remaining capacity are shown.</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {rankedHostels.length === 0 ? (
        <p>No hostels available for your category.</p>
      ) : (
        <div>
          {rankedHostels.map((hostel, index) => (
            <div key={hostel._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span>{index + 1}.</span>
              <span>{hostel.hostelName} (Capacity: {hostel.capacity})</span>
              <button onClick={() => moveUp(index)} disabled={index === 0}>↑</button>
              <button onClick={() => moveDown(index)} disabled={index === rankedHostels.length - 1}>↓</button>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleSubmit} disabled={submitting || rankedHostels.length === 0}>
        {submitting ? 'Submitting...' : 'Submit Round 2 Preferences'}
      </button>
    </div>
  )
}

export default Round2PreferencePage