import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/authService'
import { setToken } from '../utils/auth'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [year, setYear] = useState('')
  const [branch, setBranch] = useState('')
  const [twelfthPercentage, setTwelfthPercentage] = useState('')
  const [cgpa, setCgpa] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const userData = {
      name,
      email,
      password,
      year: Number(year),
      branch: branch.toUpperCase(),
    }

    if (year === '1') {
      userData.twelfthPercentage = Number(twelfthPercentage)
    } else {
      userData.cgpa = Number(cgpa)
    }

    try {
      const response = await register(userData)
      setToken(response.data.token)
      navigate('/preferences')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 placeholder-gray-500"
  const labelClass = "block text-sm font-medium text-gray-300 mb-1"

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-8">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-1">Hostel Seat Allocation</h1>
        <p className="text-gray-400 text-center mb-8">Your best room awaits.</p>

        <h2 className="text-xl font-semibold text-white mb-6">Create your account</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)} required className={inputClass}>
              <option value="">Select year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Branch</label>
            <input type="text" value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="e.g. CSE, ECE, ME" required className={inputClass} />
          </div>
          {year === '1' && (
            <div>
              <label className={labelClass}>12th Percentage</label>
              <input type="number" value={twelfthPercentage} onChange={(e) => setTwelfthPercentage(e.target.value)} placeholder="Enter your 12th percentage" min="0" max="100" required className={inputClass} />
            </div>
          )}
          {year !== '' && year !== '1' && (
            <div>
              <label className={labelClass}>CGPA</label>
              <input type="number" value={cgpa} onChange={(e) => setCgpa(e.target.value)} placeholder="Enter your CGPA" min="0" max="10" step="0.01" required className={inputClass} />
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors mt-2">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage