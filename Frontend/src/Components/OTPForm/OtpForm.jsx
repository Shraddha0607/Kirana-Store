import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import './OTPForm.css'

const OtpFrom = ({ length, onSubmitOtp, resendOtpFunctionHandle, email }) => {
  const [otpData, setOtpData] = useState('')
  const [otpInputs, setOtpInputs] = useState(new Array(length).fill(''))
  const [showVerifybtn, setshowVerifybtn] = useState(false)

  //For storing the references of the input fields
  const allInputRefs = useRef([])

  const handleOtpInputChange = (index, e) => {
    const value = e.target.value

    if (isNaN(value)) {
      toast.warning('Enter the Valid digit from 0-9')
    }
    else {
      const newOtp = [...otpInputs]

      //allow only one input data in input
      newOtp[index] = value.substring(value.length - 1)
      setOtpInputs(newOtp)

      const combinedOtp = newOtp.join('')

      if (combinedOtp.length === length) {
        setOtpData(combinedOtp)
        setshowVerifybtn(true)
      }
      else {
        setshowVerifybtn(false)
      }

      //Move to next input field if the current field is filled
      if (value && index < length - 1 && allInputRefs.current[index + 1]) {
        allInputRefs.current[index + 1].focus()
      }

    }
  }

  const handleInputClick = (index) => {
    allInputRefs.current[index].setSelectionRange(1, 1)

    if (index > 0 && !otpInputs[index - 1]) {
      allInputRefs.current[otpInputs.indexOf('')].focus()
    }
    if (index < length - 1 && allInputRefs.current[index + 1]) {
      allInputRefs.current[otpInputs.indexOf('')].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpInputs[index] && index > 0 && allInputRefs.current[index - 1]) {
      allInputRefs.current[index - 1].focus()
    }

    // Restrict the Tab movement untill input have not get some value
    if (e.key === 'Tab') {
      if (e.target.value.length === 0) {
        e.preventDefault();
      }
    }
  }

  useEffect(() => {
    if (allInputRefs.current[0]) {
      allInputRefs.current[0].focus()
    }
  }, [])



  return (
    <div className=' w-full bg-white flex flex-shrink-0 justify-center items-center'>
      <form className='otpform w-fit h-fit sm:p-3 md:p-5 flex justify-center items-center flex-col sm:gap-7'>
        <h1 className='otp-heading w-full mt-3 text-left sm:text-xl md:text-2xl text-[#000]'>Enter the OTP sent to your Resgistered Email</h1>
        <div className='w-full flex otpdiv sm:gap-3'>
          {
            otpInputs.map((value, index) => {
              return (
                <input className='otpinputs sm:h-[3rem] sm:w-[3rem] md:h-[70px] md:w-[70px] text-xl mx-auto
                               bg-[#EDF6F9] rounded-xl text-[#006D77] text-center sm:text-2xl border-4 border-[#83C5BE]
                               md:text-4xl font-semibold focus:border-[#006D77] focus:border-4 focus:outline-none'
                  type='text'
                  ref={(input) => allInputRefs.current[index] = input}
                  value={value}
                  onChange={(e) => { handleOtpInputChange(index, e) }}
                  onClick={() => handleInputClick(index)}
                  onKeyDown={(e) => { handleKeyDown(e, index) }}
                  key={index} />
              )
            })
          }
        </div>
        <button className={`border-2 text-[#EDF6F9] bg-[#006D77] max-w-lg rounded-xl px-4  font-semibold py-2 transition-all text-xl mt-3`}
          onClick={(e) => {
            e.preventDefault()
            onSubmitOtp(otpData)
          }}
          disabled={showVerifybtn ? false : true}
        >
          VERIFY
        </button>
      </form>
    </div>
  )
}

export default OtpFrom
