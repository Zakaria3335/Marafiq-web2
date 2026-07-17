import { Route, Routes, useLocation } from 'react-router-dom'
import Navebar from './components/Navebar/Navebar'
import Home from './pages/home/home'
import Aboute from './pages/Aboute/Aboute'
import Services from './pages/Services/Services'
import Media from './pages/Media/Media'
import Faq from './pages/Faq/Faq'
import Dashboard from './pages/Dashboard/Dashboard'
import RequestDetails from './pages/RequestDetails/RequestDetails'
import Inquiry from './pages/Inquiry/Inquiry'
import WaterLeakageComplaint from './pages/Complaints/WaterLeakageComplaint'
import Notifications from './pages/Notifications/Notifications'
import Auth from './pages/Auth/Auth'
import Footer from './components/Footer/Footer'

function App() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  return (
    <>
      {!isAuthPage && <Navebar variant={isHome ? 'transparent' : 'light'} />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Aboute />} />
          <Route path="/services" element={<Services />} />
          <Route path="/media" element={<Media />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/complaints/water-leakage" element={<WaterLeakageComplaint />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/requests/:id" element={<RequestDetails />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer wide={isHome} />}
    </>
  )
}

export default App
