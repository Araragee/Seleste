import { lazy, Suspense } from 'react'
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from 'react-router-dom'
import { Spinner } from '@/components/ui/misc'
import { AppLayout } from '@/layouts/AppLayout'
import { MarketingLayout } from '@/layouts/MarketingLayout'
import Landing from '@/pages/marketing/Landing'

const MaterialsPage = lazy(() => import('@/pages/marketing/MaterialsPage'))
const PricingPage = lazy(() => import('@/pages/marketing/PricingPage'))
const ContactPage = lazy(() => import('@/pages/marketing/ContactPage'))
const QuotePage = lazy(() => import('@/pages/marketing/QuotePage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'))
const Dashboard = lazy(() => import('@/pages/app/Dashboard'))
const NewQuote = lazy(() => import('@/pages/app/NewQuote'))
const Orders = lazy(() => import('@/pages/app/Orders'))
const OrderDetail = lazy(() => import('@/pages/app/OrderDetail'))
const Settings = lazy(() => import('@/pages/app/Settings'))
const Admin = lazy(() => import('@/pages/app/Admin'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function Root() {
  return (
    <>
      <ScrollRestoration />
      <Suspense fallback={<Spinner className="h-[60vh]" />}>
        <Outlet />
      </Suspense>
    </>
  )
}

const routes = [
  {
    element: <Root />,
    children: [
      {
        element: <MarketingLayout />,
        children: [
          { path: '/', element: <Landing /> },
          { path: '/materials', element: <MaterialsPage /> },
          { path: '/pricing', element: <PricingPage /> },
          { path: '/contact', element: <ContactPage /> },
          { path: '/quote', element: <QuotePage /> },
          { path: '*', element: <NotFound /> },
        ],
      },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      {
        path: '/app',
        element: <AppLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'quote', element: <NewQuote /> },
          { path: 'orders', element: <Orders /> },
          { path: 'orders/:id', element: <OrderDetail /> },
          { path: 'settings', element: <Settings /> },
          { path: 'admin', element: <Admin /> },
        ],
      },
    ],
  },
]

const router = createBrowserRouter(routes)

export default function App() {
  return <RouterProvider router={router} />
}
