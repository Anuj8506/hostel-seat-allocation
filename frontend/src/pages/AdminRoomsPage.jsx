import { useState, useEffect } from 'react'
import { getAllRooms, createRoom, updateRoom, deleteRoom } from '../services/adminService'

function AdminRoomsPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingRoom, setEditingRoom] = useState(null)
  const [formData, setFormData] = useState({ hostelName: '', category: 'senior', capacity: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchRooms = async () => {
    try {
      const response = await getAllRooms()
      setRooms(response.data.rooms)
    } catch {
      setError('Failed to load rooms. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleEditClick = (room) => {
    setEditingRoom(room)
    setFormData({ hostelName: room.hostelName, category: room.category, capacity: room.capacity })
  }

  const handleNewClick = () => {
    setEditingRoom('new')
    setFormData({ hostelName: '', category: 'senior', capacity: '' })
  }

  const handleCancel = () => {
    setEditingRoom(null)
    setFormData({ hostelName: '', category: 'senior', capacity: '' })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const payload = {
      hostelName: formData.hostelName,
      category: formData.category,
      capacity: Number(formData.capacity),
    }
    try {
      if (editingRoom === 'new') {
        await createRoom(payload)
      } else {
        await updateRoom(editingRoom._id, payload)
      }
      setEditingRoom(null)
      setFormData({ hostelName: '', category: 'senior', capacity: '' })
      await fetchRooms()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save room.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return
    try {
      await deleteRoom(roomId)
      await fetchRooms()
    } catch {
      setError('Failed to delete room. Please try again.')
    }
  }

  const inputClass = "w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
  const labelClass = "block text-sm font-medium text-gray-300 mb-1"

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 text-lg">Loading rooms...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-1">Hostel Seat Allocation</h1>
        <p className="text-gray-400 mb-8">Admin Panel</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {editingRoom === null && (
          <button
            onClick={handleNewClick}
            className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            + Add New Room
          </button>
        )}

        {editingRoom !== null && (
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">
              {editingRoom === 'new' ? 'Add New Room' : 'Edit Room'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Hostel Name</label>
                <input type="text" name="hostelName" value={formData.hostelName} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                  <option value="senior">Senior</option>
                  <option value="first-year">First Year</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Capacity</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} min="1" required className={inputClass} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
                  {submitting ? 'Saving...' : 'Save Room'}
                </button>
                <button type="button" onClick={handleCancel} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {rooms.length === 0 ? (
          <p className="text-gray-400">No rooms found. Add a room to get started.</p>
        ) : (
          <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Hostel Name</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Category</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Capacity</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Occupancy</th>
                  <th className="text-left text-gray-300 font-medium px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="text-white px-6 py-4">{room.hostelName}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${room.category === 'senior' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                        {room.category}
                      </span>
                    </td>
                    <td className="text-gray-300 px-6 py-4">{room.capacity}</td>
                    <td className="text-gray-300 px-6 py-4">{room.currentOccupancy}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(room)} className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1.5 rounded-lg transition-colors">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(room._id)} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm px-3 py-1.5 rounded-lg transition-colors">
                          Delete
                        </button>
                      </div>
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

export default AdminRoomsPage