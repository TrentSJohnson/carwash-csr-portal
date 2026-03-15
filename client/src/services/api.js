import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export async function pingServer() {
  await api.get('/ping')
}

export async function getActivities() {
  const { data } = await api.get('/api/activities')
  return data
}

export async function getTransactions() {
  const { data } = await api.get('/api/transactions')
  return data
}

export async function getMembers() {
  const { data } = await api.get('/api/members')
  return data
}

export async function getMember(id) {
  const { data } = await api.get(`/api/members/${id}`)
  return data
}

export async function getMemberVehicles(id) {
  const { data } = await api.get(`/api/members/${id}/vehicles`)
  return data
}

export async function getMemberSubscriptions(id) {
  const { data } = await api.get(`/api/members/${id}/subscriptions`)
  return data
}

export async function getMemberTransactions(id) {
  const { data } = await api.get(`/api/members/${id}/transactions`)
  return data
}

export async function getMemberActivities(id) {
  const { data } = await api.get(`/api/members/${id}/activities`)
  return data
}
