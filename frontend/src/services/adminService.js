import api from './api'

export const createRoom = (roomData) => {
  return api.post('/admin/rooms', roomData)
}

export const getAllRooms = () => {
  return api.get('/admin/rooms')
}

export const updateRoom = (roomId, roomData) => {
  return api.patch(`/admin/rooms/${roomId}`, roomData)
}

export const deleteRoom = (roomId) => {
  return api.delete(`/admin/rooms/${roomId}`)
}

export const getAllStudents = () => {
  return api.get('/admin/students')
}

export const getUnmatchedStudents = () => {
  return api.get('/admin/students/unmatched')
}

export const runRound1 = () => {
  return api.post('/allocation/run/round1')
}

export const runRound2 = () => {
  return api.post('/allocation/run/round2')
}

export const getAllResults = () => {
  return api.get('/allocation/results')
}