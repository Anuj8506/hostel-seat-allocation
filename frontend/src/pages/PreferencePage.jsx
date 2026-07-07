import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAvailableHostels, submitPreferences, getMyAllocation } from '../services/studentService'

function PreferencePage() {
  const [allHostels, setAllHostels] = useState([])
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [rankedHostels, setRankedHostels] = useState([])
  const [step, setStep] = useState('select') // 'select' | 'rank'
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const allocationResponse = await getMyAllocation()
        if (allocationResponse.data.allocation) {
          navigate('/allocation')
          return
        }
        if (allocationResponse.data.round1HasRun) {
          navigate('/preferences/round2')
          return
        }
        const response = await getAvailableHostels()
        setAllHostels(response.data.availableRooms)
      } catch {
        setError('Failed to load hostels. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchHostels()
  }, [])

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const proceedToRank = () => {
    if (selectedIds.size === 0) {
      setError('Please select at least one hostel.')
      return
    }
    setError('')
    setRankedHostels(allHostels.filter(h => selectedIds.has(h._id)))
    setStep('rank')
  }

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
    const rankedIds = rankedHostels.map(h => h._id)
    try {
      await submitPreferences(rankedIds)
      setSuccess('Preferences submitted successfully!')
      setTimeout(() => navigate('/allocation'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit preferences.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 text-lg">Loading hostels...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-1">Hostel Seat Allocation</h1>
        <p className="text-gray-400 mb-8">Your best room awaits.</p>

        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8">

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-400 rounded-lg px-4 py-3 mb-4 text-sm">
              {success}
            </div>
          )}

          {/* STEP 1 — SELECT */}
          {step === 'select' && (
            <>
              <h2 className="text-xl font-semibold text-white mb-2">Select Your Hostels</h2>
              <p className="text-gray-400 text-sm mb-6">Choose the hostels you are willing to live in. You will rank them in the next step.</p>

              {allHostels.length === 0 ? (
                <p className="text-gray-400">No hostels available for your category.</p>
              ) : (
                <div className="space-y-3 mb-6">
                  {allHostels.map(hostel => (
                    <div
                      key={hostel._id}
                      onClick={() => toggleSelect(hostel._id)}
                      className={`flex items-center gap-4 rounded-xl px-4 py-3 cursor-pointer transition-colors border ${
                        selectedIds.has(hostel._id)
                          ? 'bg-blue-600/20 border-blue-500'
                          : 'bg-gray-800 border-transparent hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedIds.has(hostel._id) ? 'bg-blue-600 border-blue-600' : 'border-gray-500'
                      }`}>
                        {selectedIds.has(hostel._id) && (
                          <span className="text-white text-xs font-bold">✓</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{hostel.hostelName}</p>
                        <p className="text-gray-400 text-sm">Capacity: {hostel.capacity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={proceedToRank}
                disabled={allHostels.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                Next: Rank Selected Hostels ({selectedIds.size} selected)
              </button>
            </>
          )}

          {/* STEP 2 — RANK */}
          {step === 'rank' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setStep('select')}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  ← Back
                </button>
                <div>
                  <h2 className="text-xl font-semibold text-white">Rank Your Hostels</h2>
                  <p className="text-gray-400 text-sm">Use arrows to rank. Top = first choice.</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {rankedHostels.map((hostel, index) => (
                  <div key={hostel._id} className="flex items-center gap-4 bg-gray-800 rounded-xl px-4 py-3">
                    <span className="text-blue-400 font-bold text-lg w-6">{index + 1}</span>
                    <div className="flex-1">
                      <p className="text-white font-medium">{hostel.hostelName}</p>
                      <p className="text-gray-400 text-sm">Capacity: {hostel.capacity}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >↑</button>
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === rankedHostels.length - 1}
                        className="bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >↓</button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Preferences'}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default PreferencePage