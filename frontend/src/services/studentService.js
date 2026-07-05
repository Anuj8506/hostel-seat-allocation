import api from './api'

export const submitPreferences = (rankedHostels) => {
  return api.post('/student/preferences', { rankedHostels })
}

export const submitRound2Preferences = (rankedHostels) => {
  return api.post('/student/preferences/round2', { rankedHostels })
}

export const getMyAllocation = () => {
  return api.get('/student/allocation')
}

export const getAvailableHostels = () => {
  return api.get('/student/hostels/available')
}