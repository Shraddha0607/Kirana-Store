import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import backendRoutesAPI from '../BackendAPI/API';
import { toast } from 'react-toastify';
import DyanmicPasswordField from '../Components/DyanmicPasswordField';

function SetNewPAssword() {
  const params = useParams()
  const currentCustID = params.id
  const [formError, setFormError] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()


  const validate = (password,confirmPassword) => {
    const errors = {};
    const isStrongPassword = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/

    if (!password) { errors.password = 'Password is required' }
    else if (!isStrongPassword.test(password)) { errors.password = 'Password must contain at least one each of [Digit, Uppercase Letter, lowercase letter, and non-alphanumeric] and length of password should be of 8 character' }
    else if (password.length < 8) { errors.password = "Password should be atleast of 8 character" }

    if (!confirmPassword) { errors.confirmPassword = 'Confirm Password is required' }
    else if (confirmPassword.length < 8) { errors.confirmPassword = "Confirm Password  should be atleast of 8 character" }

    if (confirmPassword !== password) {
      errors.password = 'Confirm Password and Password should be Same'
      errors.confirmPassword = 'Confirm Password and Password should be Same'
    }
    return errors
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormError(validate(password,confirmPassword));
    setIsSubmit(true);
  }

  const updateThePasswordInDatabase = async () => {
    const dataToSend = { password:password, customerId: currentCustID }
    try {
      const backendResponse = await fetch(backendRoutesAPI.updatePassword.url, {
        method: backendRoutesAPI.updatePassword.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      })
      const finalRes = await backendResponse.json()
      if (finalRes.success) {
        toast.success(finalRes.message)
        navigate('/')
      }
      else {
        toast.error(`${finalRes.message},Try After Sometime`)
        navigate('/login')
      }
    } catch (error) {
      toast.error(`${error},Try After Sometime`)
    }
  }

  useEffect(() => {
    if (Object.keys(formError).length === 0 && isSubmit) {
      updateThePasswordInDatabase()
    }
  }, [formError])

  return (
    <div className='px-3 py-8'>
      <div className='w-full p-4  mx-auto min-w-[500px] max-w-[50%] bg-white rounded-xl shadow-xl'>
        <h1 className='w-full text-3xl text-center'>Reset Your Password</h1>
        <hr className='mt-2'/>
        <form className='flex flex-col px-2 gap-2'>
          <div className='flex flex-col gap-3 '>
            <DyanmicPasswordField 
              placeholderText={'Enter the New Password'}
              onChangeText = {(password)=>setPassword(password)}
              value={password}
            />
            <p className='text-red-600 font-bold text-lg px-2 capitalize'>{formError.password}</p>
          </div>
          <div className='flex flex-col gap-3 '>
            <DyanmicPasswordField 
              placeholderText={'Confirm the New Password'}
              onChangeText = {(confirmPassword)=>setConfirmPassword(confirmPassword)}
              value={confirmPassword}
              showPasswordStrengthBar={false}
              showRequiredList={false}
            />
            <p className='text-red-600 font-bold capitalize text-lg px-2'>{formError.confirmPassword}</p>
          </div>
          { password.length>8 && confirmPassword.length>8 && password === confirmPassword &&
            <button className='border-2 text-lg font-semibold hover:bg-[#006D77] hover:text-white 
              border-[#006D77] mx-auto px-4 py-2 rounded-xl' onClick={handleFormSubmit}>
            Confirm
          </button>}
        </form>
      </div>
    </div>
  )
}

export default SetNewPAssword
