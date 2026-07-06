import { useState, useEffect } from 'react'
import { getAllResults } from '../services/adminService'

function AdminResultsPage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await getAllResults()
        setResults(response.data.results)
      } catch {
        setError('Failed to load results. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 text-lg">Loading results...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-1">Hostel Seat Allocation</h1>
        <p className="text-gray-400 mb-8">Admin Panel</p>

        <h2 className="text-xl font-semibold text-white mb-6">All Allocation Results</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {results.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl p-8 text-center">
            <p className="text-gray-400">No allocations found. Run Round 1 first.</p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Student</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Email</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Hostel</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Round</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {results.map((result) => (
                  <tr key={result._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="text-white px-6 py-4">{result.student.name}</td>
                    <td className="text-gray-400 px-6 py-4">{result.student.email}</td>
                    <td className="text-white px-6 py-4">{result.room.hostelName}</td>
                    <td className="text-gray-300 px-6 py-4">Round {result.round}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-500/20 text-green-400 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                        {result.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminResultsPage