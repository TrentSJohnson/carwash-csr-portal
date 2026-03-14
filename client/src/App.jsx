import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ActivityPage from './pages/ActivityPage'
import TransactionsPage from './pages/TransactionsPage'
import ServerGate from './components/ServerGate'

export default function App() {
  return (
    <ServerGate>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/activity" replace />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ServerGate>
  )
}
