import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyAllocation } from '../services/studentService'

function AllocationResultPage() {
  const [allocation, setAllocation] = useState(null)
  const [hasSubmittedRound2, setHasSubmittedRound2] = useState(false)
  const [round1HasRun, setRound1HasRun] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAllocation = async () => {
      try {
        const response = await getMyAllocation()
        setAllocation(response.data.allocation)
        setRound1HasRun(response.data.round1HasRun)
        setHasSubmittedRound2(response.data.hasSubmittedRound2)
      } catch {
        setError('Failed to load allocation. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchAllocation()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 text-lg">Loading your allocation...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-1">Hostel Seat Allocation</h1>
        <p className="text-gray-400 mb-8">Your best room awaits.</p>

        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Your Allocation Result</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {!error && allocation === null && round1HasRun && !hasSubmittedRound2 && (
            <div className="bg-yellow-500/10 border border-yellow-500 rounded-xl p-6 text-center">
              <p className="text-yellow-400 font-semibold text-lg mb-1">Not Allocated Yet</p>
              <p className="text-gray-400 text-sm mb-4">
                You weren't matched in Round 1. Submit your Round 2 preferences to get another chance.
              </p>
              <Link
                to="/preferences/round2"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                Submit Round 2 Preferences
              </Link>
            </div>
          )}

          {!error && allocation === null && hasSubmittedRound2 && (
            <div className="bg-yellow-500/10 border border-yellow-500 rounded-xl p-6 text-center">
              <p className="text-yellow-400 font-semibold text-lg mb-1">Not Allocated Yet</p>
              <p className="text-gray-400 text-sm">
                Your Round 2 preferences have been submitted. Please wait for the allocation process to complete.
              </p>
            </div>
          )}

          {allocation && (
            <div className="bg-green-500/10 border border-green-500 rounded-xl p-6">
              <p className="text-green-400 font-semibold text-lg mb-4">🎉 Congratulations! You have been allocated a room.</p>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Hostel</span>
                  <span className="text-white font-medium">{allocation.room.hostelName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white font-medium capitalize">{allocation.room.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Round</span>
                  <span className="text-white font-medium">Round {allocation.round}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 font-medium capitalize">{allocation.status}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllocationResultPage