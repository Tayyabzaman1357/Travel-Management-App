import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import AuthGuard from '@/components/common/AuthGuard'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { PageLoader } from '@/components/common/Skeletons'

// Lazy-loaded pages — code-split per route
const Home = lazy(() => import('@/pages/Home'))
const Flights = lazy(() => import('@/pages/Flights'))
const Hotels = lazy(() => import('@/pages/Hotels'))
const Destinations = lazy(() => import('@/pages/Destinations'))
const DestinationDetail = lazy(() => import('@/pages/DestinationDetail'))
const Tours = lazy(() => import('@/pages/Tours'))
const CarRental = lazy(() => import('@/pages/CarRental'))
const Cruises = lazy(() => import('@/pages/Cruises'))
const Visa = lazy(() => import('@/pages/Visa'))
const Insurance = lazy(() => import('@/pages/Insurance'))
const Offers = lazy(() => import('@/pages/Offers'))
const Blog = lazy(() => import('@/pages/Blog'))
const BlogDetail = lazy(() => import('@/pages/BlogDetail'))
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const FAQ = lazy(() => import('@/pages/FAQ'))
const Testimonials = lazy(() => import('@/pages/Testimonials'))
const Wishlist = lazy(() => import('@/pages/Wishlist'))
const Booking = lazy(() => import('@/pages/Booking'))
const Payment = lazy(() => import('@/pages/Payment'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const Login = lazy(() => import('@/pages/auth/Login'))
const Signup = lazy(() => import('@/pages/auth/Signup'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'))
const UserDashboard = lazy(() => import('@/pages/dashboard/UserDashboard'))
const AdminDashboard = lazy(() => import('@/pages/dashboard/AdminDashboard'))

const withLoader = (el) => <Suspense fallback={<PageLoader />}>{el}</Suspense>

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={withLoader(<Home />)} />
            <Route path="flights" element={withLoader(<Flights />)} />
            <Route path="hotels" element={withLoader(<Hotels />)} />
            <Route path="destinations" element={withLoader(<Destinations />)} />
            <Route path="destinations/:id" element={withLoader(<DestinationDetail />)} />
            <Route path="tours" element={withLoader(<Tours />)} />
            <Route path="cars" element={withLoader(<CarRental />)} />
            <Route path="cruises" element={withLoader(<Cruises />)} />
            <Route path="visa" element={withLoader(<Visa />)} />
            <Route path="insurance" element={withLoader(<Insurance />)} />
            <Route path="offers" element={withLoader(<Offers />)} />
            <Route path="blog" element={withLoader(<Blog />)} />
            <Route path="blog/:id" element={withLoader(<BlogDetail />)} />
            <Route path="about" element={withLoader(<About />)} />
            <Route path="contact" element={withLoader(<Contact />)} />
            <Route path="faq" element={withLoader(<FAQ />)} />
            <Route path="testimonials" element={withLoader(<Testimonials />)} />
            <Route path="wishlist" element={withLoader(<Wishlist />)} />
            <Route path="booking" element={withLoader(<Booking />)} />
            <Route path="payment" element={withLoader(<Payment />)} />
          </Route>

          {/* Auth pages */}
          <Route path="/login" element={<AuthLayout />}>
            <Route index element={withLoader(<Login />)} />
          </Route>
          <Route path="/signup" element={<AuthLayout />}>
            <Route index element={withLoader(<Signup />)} />
          </Route>
          <Route path="/forgot-password" element={<AuthLayout />}>
            <Route index element={withLoader(<ForgotPassword />)} />
          </Route>
          <Route path="/reset-password" element={<AuthLayout />}>
            <Route index element={withLoader(<ResetPassword />)} />
          </Route>

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <MainLayout>
                  <Suspense fallback={<PageLoader />}><UserDashboard /></Suspense>
                </MainLayout>
              </AuthGuard>
            }
          />
          <Route
            path="/admin"
            element={
              <AuthGuard adminOnly>
                <MainLayout>
                  <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>
                </MainLayout>
              </AuthGuard>
            }
          />

          <Route path="*" element={withLoader(<NotFound />)} />
        </Routes>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: '16px',
              background: '#0f172a',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              maxWidth: '420px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
