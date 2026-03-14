import { useState, useEffect } from 'react'
import { pingServer } from '../services/api'
import './ServerGate.css'

const RETRY_INTERVAL_MS = 3000

export default function ServerGate({ children }) {
  const [status, setStatus] = useState('checking') // 'checking' | 'up' | 'retrying'

  useEffect(() => {
    let cancelled = false

    async function check() {
      try {
        await pingServer()
        if (!cancelled) setStatus('up')
      } catch {
        if (!cancelled) {
          setStatus('retrying')
          setTimeout(() => {
            if (!cancelled) {
              setStatus('checking')
              check()
            }
          }, RETRY_INTERVAL_MS)
        }
      }
    }

    check()
    return () => { cancelled = true }
  }, [])

  if (status === 'up') return children

  return (
    <div className="server-gate-overlay">
      <div className="server-gate-dialog">
        <div className="server-gate-spinner" />
        <p className="server-gate-title">Connecting to server…</p>
        <p className="server-gate-sub">
          {status === 'retrying' ? 'Retrying… this may take up to a minute' : 'This may take up to a minute'}
        </p>
      </div>
    </div>
  )
}
