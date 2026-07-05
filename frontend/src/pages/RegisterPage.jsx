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

    return (
      <div>
        <h1>Hostel Seat Allocation</h1>
        <h2>Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <label>Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)} required>
              <option value="">Select year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
          <div>
            <label>Branch</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="e.g. CSE, ECE, ME"
              required
            />
          </div>
          {year === '1' && (
            <div>
              <label>12th Percentage</label>
              <input
                type="number"
                value={twelfthPercentage}
                onChange={(e) => setTwelfthPercentage(e.target.value)}
                placeholder="Enter your 12th percentage"
                min="0"
                max="100"
                required
              />
            </div>
          )}
          {year !== '' && year !== '1' && (
            <div>
              <label>CGPA</label>
              <input
                type="number"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="Enter your CGPA"
                min="0"
                max="10"
                step="0.01"
                required
              />
            </div>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    )
}

export default RegisterPage