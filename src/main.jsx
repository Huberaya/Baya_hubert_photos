import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import './styles/system.css'
import './styles/app.css'

const Portfolio = lazy(() => import('./pages/Portfolio'))
const Photography = lazy(() => import('./pages/Photography'))
const Services = lazy(() => import('./pages/Services'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Legal = lazy(() => import('./pages/Legal'))
const Privacy = lazy(() => import('./pages/Privacy'))
const NotFound = lazy(() => import('./pages/NotFound'))

function Loading() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <span className="route-loading__ring" />
      <span className="sr-only">Chargement…</span>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/portfolio" element={<Suspense fallback={<Loading />}><Portfolio /></Suspense>} />
          <Route path="/photographie" element={<Suspense fallback={<Loading />}><Photography /></Suspense>} />
          <Route path="/services" element={<Suspense fallback={<Loading />}><Services /></Suspense>} />
          <Route path="/apropos" element={<Suspense fallback={<Loading />}><About /></Suspense>} />
          <Route path="/contact" element={<Suspense fallback={<Loading />}><Contact /></Suspense>} />
          <Route path="/legal" element={<Suspense fallback={<Loading />}><Legal /></Suspense>} />
          <Route path="/confidentialite" element={<Suspense fallback={<Loading />}><Privacy /></Suspense>} />
          <Route path="*" element={<Suspense fallback={<Loading />}><NotFound /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
