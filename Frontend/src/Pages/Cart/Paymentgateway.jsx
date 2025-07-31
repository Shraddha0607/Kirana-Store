import React, { useEffect } from 'react'
import paymentDone from '../../assets/paymentDone.json'
import Lottie from "lottie-react";
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { resetProductDetail } from '../../Store/cartSlice'
import { setSteeperProgress } from '../../Store/steeperStepSlice'
import { toast } from 'react-toastify';

function Paymentgateway() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()
  useEffect(() => {
    toast.success('Your Payment Is Successfull')
    dispatch(resetProductDetail())
  }, [])

  return (
    <div className='w-full py-7'>
      <div className='w-full h-[fit] py-10 bg-[#a2dcd78b] flex flex-col gap-5 justify-center items-center rounded-xl shadow-lg'>
        <div className='h-44 w-44'>
          <Lottie animationData={paymentDone} loop={true} />
        </div>
        <div className='text-lg'>
          <p className=''>Your Payment Id : <b>{params.id}</b></p>
        </div>
        <button className='bg-[#EDF6F9] font-medium hover:font-bold hover:underline text-[#006D77] hover:scale-110 hover:text-blue-500 rounded-md cursor-pointer transition-all px-4 py-2'
          onClick={() => {
            dispatch(setSteeperProgress(4))
            navigate(`/yourcart/orderStatus/${params.orderId}`)
          }}
        >Click To See Order Detail</button>
      </div>
    </div>
  )
}

export default Paymentgateway
