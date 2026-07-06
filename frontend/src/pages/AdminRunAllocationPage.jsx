import { useState } from 'react'
import { runRound1, runRound2 } from '../services/adminService'

function AdminRunAllocationPage() {
  const [running1, setRunning1] = useState(false)
  const [running2, setRunning2] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleRound1 = async () => {
    setMessage('')
    setError('')
    setRunning1(true)
    try {
      const response = await runRound1()
      setMessage(response.data.message || 'Round 1 completed successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Round 1 failed. Please try again.')
    } finally {
      setRunning1(false)
    }
  }

  const handleRound2 = async () => {
    setMessage('')
    setError('')
    setRunning2(true)
    try {
      const response = await runRound2()
      setMessage(response.data.message || 'Round 2 completed successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Round 2 failed. Please try again.')
    } finally {
      setRunning2(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-1">Hostel Seat Allocation</h1>
        <p className="text-gray-400 mb-8">Admin Panel</p>

        {message && (
          <div className="bg-green-500/10 border border-green-500 text-green-400 rounded-lg px-4 py-3 mb-6 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <h2 className="text-xl font-semibold text-white mb-6">Run Allocation</h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8">
            <h3 className="text-lg font-semibold text-white mb-2">Round 1</h3>
            <p className="text-gray-400 text-sm mb-6">Runs allocation for all students in the system.</p>
            <button
              onClick={handleRound1}
              disabled={running1}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {running1 ? 'Running...' : 'Run Round 1'}
            </button>
          </div>

          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8">
            <h3 className="text-lg font-semibold text-white mb-2">Round 2</h3>
            <p className="text-gray-400 text-sm mb-6">Runs allocation for unmatched students only.</p>
            <button
              onClick={handleRound2}
              disabled={running2}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {running2 ? 'Running...' : 'Run Round 2'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminRunAllocationPage