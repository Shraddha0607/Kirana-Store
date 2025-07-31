import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import backendRoutesAPI from '../BackendAPI/API'
import animation from '../assets/Animation .json'
import Lottie from "lottie-react";
import OtpFrom from '../Components/OTPForm/OtpForm'

function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: ''
  })
  const [otpSentFlag, setOtpSentFlag] = useState(false)
  const [validCustomerId, setvalidCustomerId] = useState({
    customerId: ''
  })
  const [startOtpTimerFlag, setStartOtpTimerFlag] = useState(false)
  const [resendOtpTimer, setResendOtpTimer] = useState(30)
  const navigate = useNavigate()

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckEmail = async (e) => {
    e.preventDefault()
    if (formData.email === '') {
      toast.error('Enter the Registered Email')
    }
    else {
      const backendResponse = await fetch(backendRoutesAPI.forgotPassword.url, {
        method: backendRoutesAPI.forgotPassword.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      const finalRes = await backendResponse.json()
      if (finalRes.success) {
        setvalidCustomerId({ ...validCustomerId, customerId: finalRes.data.id })
        toast.success(finalRes.message)
        setOtpSentFlag(true)
        setStartOtpTimerFlag(true)
        setResendOtpTimer(30)
      }
      else {
        toast.error(finalRes.message)
        setFormData({ email: '' })
      }
    }
  }

  const handleOTPVErification = async (otp) => {
    const _id = validCustomerId.customerId
    if (otp === '' || otp === undefined) {
      toast.error("Enter the 6 digit Otp sent to your Email ")
    }
    else if (otp?.length > 6) {
      toast.error('Otp Should not be Exceed 6 digit')
    }
    else if (otp?.length < 6) {
      toast.error('Otp Should not be less than 6 digit')
    }
    else {
      const backendResponse = await fetch(backendRoutesAPI.verifyOtp.url, {
        method: backendRoutesAPI.verifyOtp.method,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ otp: otp, customerId: _id })
      })
      const finalRes = await backendResponse.json()
      if (finalRes.success) {
        toast.success(finalRes.message)
        navigate(`/resetpassword/${finalRes.data._id}`)
      }
      else {
        toast.error(finalRes.message)
      }
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setResendOtpTimer((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer)
          setStartOtpTimerFlag(false)
          return 0
        }
        else {
          return prevTime - 1
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [startOtpTimerFlag])

  return (
    <div className='p-4 sm:p-8 w-full min-w-fit sm:min-w-[300px] flex justify-center items-center'>
  <div className='bg-white p-4 sm:p-6 text-base sm:text-lg w-full mx-auto max-w-[320px] sm:max-w-xl rounded-lg shadow-lg'>
    <div id='animation' className='h-[250px] sm:h-[300px] w-full flex flex-shrink justify-center'>
      <Lottie animationData={animation} loop={true} />
    </div>
    {
      otpSentFlag ? (
        <>
          <OtpFrom length={6} onSubmitOtp={handleOTPVErification} />
          <div className='flex cursor-pointer justify-start items-center mt-2 gap-2 w-full'>
            <h1 className={resendOtpTimer !== 0 ? 'text-[#a0a0a0] font-bold cursor-not-allowed'
              : 'text-blue-600 hover:font-semibold cursor-pointer'}
              disabled={resendOtpTimer !== 0 ? true : false} style={{
                fontSize: '0.875rem', // Adjusted for smaller screens
                lineHeight: '1rem',
                userSelect: 'none',
              }} onClick={(e) => handleCheckEmail(e)}>
              Resend OTP..??
            </h1>
            <span className='bg-[#006D77] h-6 sm:h-8 w-6 sm:w-8 flex items-center select-none cursor-not-allowed
                justify-center rounded-full text-base sm:text-lg text-white font-semibold'
              style={{
                visibility: `${resendOtpTimer === 0 ? 'hidden' : 'visible'}`,
              }}>
              {resendOtpTimer}
            </span>
          </div>
        </>
      ) : (
        <form className='w-full flex flex-col gap-3 sm:gap-4 p-2 sm:p-3'>
          <div className='grid gap-6 sm:gap-10 forgotPasswordForm'>
            <label htmlFor='email' className='text-base sm:text-lg md:text-2xl select-none'>Enter Your Registered Email</label>
            <input type='email' id='email' name='email' placeholder='example@gamil.com' value={formData.email} onChange={handleOnChange}
              className='text-sm sm:text-md md:text-xl p-2 bg-slate-200 text-black' disabled={otpSentFlag ? true : false} />
            <button className='border-2 border-[#006D77] max-w-full sm:max-w-lg rounded-xl transition-colors
                mx-auto px-3 sm:px-4 py-2 hover:text-white hover:bg-[#006D77] text-base sm:text-xl' onClick={(e) => handleCheckEmail(e)}
              disabled={otpSentFlag ? true : false}>
              Check
            </button>
          </div>
        </form>
      )
    }
  </div>
</div>

  )
}

export default ForgotPassword
