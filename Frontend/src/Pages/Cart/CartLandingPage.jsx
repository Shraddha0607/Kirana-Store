import React from 'react'
import { Outlet } from 'react-router-dom'
import Steeper from '../../Components/Steeper/Steeper.jsx'

function CartLandingPage() {
  return (
    <div className='container flex flex-col'>
      <Steeper/>
      <Outlet/>
    </div>
  )
}

export default CartLandingPage
