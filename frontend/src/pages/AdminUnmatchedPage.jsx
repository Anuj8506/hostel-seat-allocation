import { useState, useEffect } from 'react'
import { getUnmatchedStudents } from '../services/adminService'

function AdminUnmatchedPage() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUnmatched = async () => {
      try {
        const response = await getUnmatchedStudents()
        setStudents(response.data.unmatched)
      } catch {
        setError('Failed to load unmatched students. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchUnmatched()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 text-lg">Loading unmatched students...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-1">Hostel Seat Allocation</h1>
        <p className="text-gray-400 mb-8">Admin Panel</p>

        <h2 className="text-xl font-semibold text-white mb-6">Unmatched Students</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {students.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl p-8 text-center">
            <p className="text-green-400 font-medium mb-1">All students have been allocated!</p>
            <p className="text-gray-400 text-sm">No unmatched students remaining.</p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-yellow-500/10 border-b border-yellow-500/30 px-6 py-3">
              <p className="text-yellow-400 text-sm font-medium">
                {students.length} student{students.length > 1 ? 's' : ''} still unmatched — manual review required
              </p>
            </div>
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Name</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Email</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Year</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Branch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="text-white px-6 py-4">{student.name}</td>
                    <td className="text-gray-400 px-6 py-4">{student.email}</td>
                    <td className="text-gray-300 px-6 py-4">Year {student.year}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-500/20 text-blue-400 text-xs font-medium px-2.5 py-1 rounded-full">
                        {student.branch}
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

export default AdminUnmatchedPage