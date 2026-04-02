
import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Navbar from './page/Navbar/Navbar'
import Home from './page/Home/Home'
import { Route, Routes } from 'react-router-dom'
import Activity from './page/Activity/Activity'
import Wallet from './page/Wallet/Wallet'
import Withdrawal from './page/Withdrawal/Withdrawal'
import PaymentDetails from './page/Payment Details/PaymentDetails'
import StockDetails from './page/Stock Details/StockDetails'
import Watchlist from './page/Watchlist/Watchlist'
import Profile from './page/Profile/Profile'
import SearchCoin from './page/Search/SearchCoin'
import NotFound from './page/Not Found/NotFound'
import Portfolio from './page/Portfolio/Portfolio'
import Auth from './page/Auth/Auth'
import { useDispatch, useSelector } from 'react-redux'
import { store } from './State/Store'
import { getUser } from './State/Auth/Action'
import { Toaster } from 'react-hot-toast'

function App() {
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const jwt = auth.jwt || localStorage.getItem("jwt")
    if (jwt) {
      dispatch(getUser(jwt)).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [auth.jwt, dispatch])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <>
      {auth.user ? (
        <div className='w-full'>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/portfolio' element={<Portfolio />} />
            <Route path='/activity' element={<Activity />} />
            <Route path='/wallet' element={<Wallet />} />
            <Route path='/withdrawal' element={<Withdrawal />} />
            <Route path='/payment-details' element={<PaymentDetails />} />
            <Route path='/market/:coinId' element={<StockDetails />} />
            <Route path='/watchlist' element={<Watchlist />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/search' element={<SearchCoin />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      ) : (
        <Auth />
      )}
      
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a2236',
            color: '#fff',
            border: '1px solid #374151',
            borderRadius: '8px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  )
}

export default App