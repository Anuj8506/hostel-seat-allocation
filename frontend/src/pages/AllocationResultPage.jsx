import { useState, useEffect } from 'react'
import { getMyAllocation } from '../services/studentService'

function AllocationResultPage() {
  const [allocation, setAllocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAllocation = async () => {
      try {
        const response = await getMyAllocation()
        setAllocation(response.data.allocation)
      } catch (err) {
        if (err.response?.status === 404) {
          setAllocation(null)
        } else {
          setError('Failed to load allocation. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAllocation()
  }, [])

  if (loading) return <div>Loading your allocation...</div>

  return (
    <div>
      <h1>Hostel Seat Allocation</h1>
      <h2>Your Allocation Result</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!error && allocation === null && (
        <div>
          <p>You have not been allocated a room yet.</p>
          <p>Please wait for the allocation process to complete.</p>
        </div>
      )}

      {allocation && (
        <div>
          <p>Congratulations! You have been allocated a room.</p>
          <p>Hostel: {allocation.room.hostelName}</p>
          <p>Category: {allocation.room.category}</p>
          <p>Round: {allocation.round}</p>
          <p>Status: {allocation.status}</p>
        </div>
      )}
    </div>
  )
}

export default AllocationResultPage