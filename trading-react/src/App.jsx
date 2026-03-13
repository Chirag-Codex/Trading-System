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
  const {auth}=useSelector(store=>store)
  const dispatch=useDispatch()
  console.log("auth---",auth);
  
  useEffect(()=>{
    dispatch(getUser(auth.jwt || localStorage.getItem("jwt")))
  },[auth.jwt])
  return (
    <>
    
    {auth.user ? <div className='w-full'>
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
        <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: 'green',
              secondary: 'white',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: 'red',
              secondary: 'white',
            },
          },
        }}
      />
     </div>:<Auth />}
    </>
  )
}

export default App
