import { Routes, Route, Navigate } from 'react-router-dom'
import { isAuthenticated, getUser } from './utils/auth'
import Navbar from './components/Navbar'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PreferencePage from './pages/PreferencePage'
import Round2PreferencePage from './pages/Round2PreferencePage'
import AllocationResultPage from './pages/AllocationResultPage'
import AdminRoomsPage from './pages/AdminRoomsPage'
import AdminRunAllocationPage from './pages/AdminRunAllocationPage'
import AdminResultsPage from './pages/AdminResultsPage'
import AdminUnmatchedPage from './pages/AdminUnmatchedPage'

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

const AdminRoute = ({ children }) => {
  const user = getUser()
  if (!isAuthenticated() || !user?.isAdmin) return <Navigate to="/login" replace />
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/preferences" element={<ProtectedRoute><PreferencePage /></ProtectedRoute>} />
      <Route path="/preferences/round2" element={<ProtectedRoute><Round2PreferencePage /></ProtectedRoute>} />
      <Route path="/allocation" element={<ProtectedRoute><AllocationResultPage /></ProtectedRoute>} />

      <Route path="/admin/rooms" element={<AdminRoute><AdminRoomsPage /></AdminRoute>} />
      <Route path="/admin/run" element={<AdminRoute><AdminRunAllocationPage /></AdminRoute>} />
      <Route path="/admin/results" element={<AdminRoute><AdminResultsPage /></AdminRoute>} />
      <Route path="/admin/unmatched" element={<AdminRoute><AdminUnmatchedPage /></AdminRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App