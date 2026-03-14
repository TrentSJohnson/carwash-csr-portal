import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export async function getActivities() {
  const { data } = await api.get('/api/activities')
  return data
}
