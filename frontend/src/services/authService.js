import api from './api'

export const register = (userData) => {
  return api.post('/auth/register', userData)
}

export const login = (userData) => {
  return api.post('/auth/login', userData)
}

export const logout = () => {
  localStorage.removeItem('token')
  return api.post('/auth/logout')
}