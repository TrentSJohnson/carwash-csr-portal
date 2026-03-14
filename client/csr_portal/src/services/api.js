const BASE_URL = import.meta.env.VITE_API_URL

export async function getActivities() {
  const res = await fetch(`${BASE_URL}/api/activities`)
  if (!res.ok) throw new Error('Failed to fetch activities')
  return res.json()
}
