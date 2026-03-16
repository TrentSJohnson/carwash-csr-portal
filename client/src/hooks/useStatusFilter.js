import { useState } from 'react'

export default function useStatusFilter() {
  const [selectedStatuses, setSelectedStatuses] = useState(new Set(['all']))

  function toggleStatus(id) {
    setSelectedStatuses((prev) => {
      const next = new Set(prev)
      if (id === 'all') return new Set(['all'])
      next.delete('all')
      if (next.has(id)) {
        next.delete(id)
        if (next.size === 0) return new Set(['all'])
      } else {
        next.add(id)
      }
      return next
    })
  }

  return { selectedStatuses, toggleStatus }
}
