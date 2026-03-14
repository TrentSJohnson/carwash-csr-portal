import { useState, useEffect } from 'react'
import { pingServer } from '../services/api'

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
    <div className="fixed inset-0 bg-[rgba(26,26,46,0.75)] flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-[10px] py-10 px-12 flex flex-col items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.25)] min-w-[260px]">
        <div className="w-10 h-10 rounded-full border-4 border-[#e0daea] border-t-[#7c5cbf] animate-spin [animation-duration:0.8s]" />
        <p className="text-base font-semibold text-[#1a1a2e]">Connecting to server…</p>
        <p className="text-[13px] text-[#888]">
          {status === 'retrying' ? 'Retrying… this may take up to a minute' : 'This may take up to a minute'}
        </p>
      </div>
    </div>
  )
}
