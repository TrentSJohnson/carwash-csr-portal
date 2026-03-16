import { useState, useEffect } from 'react'

export default function useFetch(fetchFn) {
  const [data, setData]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    fetchFn()
      .then((d) => setData(Array.isArray(d) ? d : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [fetchFn])

  return { data, setData, loading, error }
}
