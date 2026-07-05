import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../services/authService'
import { setToken } from '../utils/auth'

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await login({ email, password })
            setToken(response.data.token)
            const user = JSON.parse(atob(response.data.token.split('.')[1]))
            if (user.isAdmin) {
                navigate('/admin/rooms')
            } else {
                navigate('/preferences')
            }
        } 
        catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.')
        } 
        finally {
            setLoading(false)
        }
    }

    return (
        <div>
        <h1>Hostel Seat Allocation</h1>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
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
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    )
}

export default LoginPage