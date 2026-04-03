import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

export const PrivateRoute = () => {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <p className="text-slate-500 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}
