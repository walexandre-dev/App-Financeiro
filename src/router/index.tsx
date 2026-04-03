import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppLayout } from '../layouts/AppLayout'
import { PrivateRoute } from '../components/auth/PrivateRoute'
import { LoginPage } from '../pages/LoginPage'

const DashboardPage = lazy(() => import('../pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const TransactionsPage = lazy(() => import('../pages/TransactionsPage').then((m) => ({ default: m.TransactionsPage })))
const CategoriesPage = lazy(() => import('../pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage })))
const ReportsPage = lazy(() => import('../pages/ReportsPage').then((m) => ({ default: m.ReportsPage })))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          {
            path: 'dashboard',
            element: (
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: 'transactions',
            element: (
              <Suspense fallback={<PageLoader />}>
                <TransactionsPage />
              </Suspense>
            ),
          },
          {
            path: 'categories',
            element: (
              <Suspense fallback={<PageLoader />}>
                <CategoriesPage />
              </Suspense>
            ),
          },
          {
            path: 'reports',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ReportsPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
