import { useNavigate, Link } from 'react-router-dom'
import { logout } from '../services/authService'
import { getUser } from '../utils/auth'

function Navbar() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to={user?.isAdmin ? '/admin/rooms' : '/preferences'} className="text-white font-bold text-lg">
          Hostel Seat Allocation
        </Link>

        <div className="flex items-center gap-6">
          {user?.isAdmin ? (
            <>
              <Link to="/admin/rooms" className="text-gray-400 hover:text-white text-sm transition-colors">Rooms</Link>
              <Link to="/admin/run" className="text-gray-400 hover:text-white text-sm transition-colors">Run Allocation</Link>
              <Link to="/admin/results" className="text-gray-400 hover:text-white text-sm transition-colors">Results</Link>
              <Link to="/admin/unmatched" className="text-gray-400 hover:text-white text-sm transition-colors">Unmatched</Link>
            </>
          ) : (
            <>
              <Link to="/preferences" className="text-gray-400 hover:text-white text-sm transition-colors">Preferences</Link>
              <Link to="/allocation" className="text-gray-400 hover:text-white text-sm transition-colors">My Allocation</Link>
            </>
          )}

          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-700">
            <span className="text-gray-400 text-sm">{user?.name || 'User'}</span>
            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-1.5 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar