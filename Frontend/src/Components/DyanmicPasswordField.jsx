import React, { useState } from 'react'
import { FaCheckDouble } from "react-icons/fa6";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";

function DyanmicPasswordField({
    placeholderText='Enter Password',
    onChangeText = ()=>{},
    value='',
    showPasswordStrengthBar=true,
    showRequiredList=true
  }
  ) {

  const [passwordStrength, setPasswordStrength] = useState('')
  const [strengthvalue, setStrengthvalue] = useState(0)
  const [showPassword, setShowPassword] = useState(false)

  const checkStrength = (password) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (value.length >= 8) {
      if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars) {
        return 'Strong'
      }
      else if (hasUpperCase && hasLowerCase && (hasNumbers || hasSpecialChars)) {
        return 'Medium'
      }
      else {
        return 'Weak'
      }
    }
    else {
      return 'Too-Short'
    }

  }

  const checkStrengthParameter = () => {
    if (value.length > 0 && passwordStrength !== '') {
      if (passwordStrength.toLowerCase() === 'strong') {
        setStrengthvalue(100)
      }
      else if (passwordStrength.toLowerCase() === 'medium') {
        setStrengthvalue(66)
      }
      else if (passwordStrength.toLowerCase() === 'weak') {
        setStrengthvalue(33)
      }
      else {
        setStrengthvalue(0)
      }
    }
  }

  const handleChange = (e) => {
    const newPassword = e.target.value
    onChangeText(newPassword)
    setPasswordStrength(checkStrength(newPassword))
  }

  return (
    <div className='w-full mx-auto'>
      <div className='flex flex-col gap-4 w-full rounded-lg max-w-lg mx-auto justify-start'>
        <div className=' w-full h-full flex flex-col px-2 py-2 justify-start gap-2'>
          <div className='w-full flex  mt-4  justify-between align-middle items-center rounded-xl bg-slate-200'>
            <input type={showPassword ? 'text' : 'password'} placeholder={placeholderText} name='password' value={value}
              className='w-full max-w-sm px-4 py-2 rounded-xl focus:outline-none bg-slate-200 font-semibold text-black' onChange={handleChange} onKeyUp={checkStrengthParameter} />
            <p className='font-semibold underline cursor-pointer hover:text-blue-400 mr-2' onClick={() => { setShowPassword((prev) => !prev) }}>{showPassword ?'Hide':'Show'}</p>
          </div>

          {/* Strength Meter */}
          {showPasswordStrengthBar && <div className={`strength-meter ${passwordStrength?.toLowerCase()} flex items-center px-2 gap-3 justify-center`} >
            <progress className='h-1 mt-2' value={value === '' ? null : strengthvalue} max='100'
              style={{
                width: `${value === '' ? '100%' : '75%'}`
              }} />
            <p className='font-bold text-lg '>{value === '' ? null : passwordStrength}</p>
          </div>}

          {/* Password Required CheckList */}
          {showRequiredList && <div className='w-full px-3 mt-2'>
            <ul>
              <li className={value.length >= 8 ? 'text-green-500 flex gap-2 items-center' : 'text-slate-400 flex gap-2 items-center'}>
                {
                  value.length >= 8 ? <FaCheckDouble /> : <MdOutlineRadioButtonUnchecked />
                }
                Minimum 8 Characters
              </li>
              <li className={/[A-Z]/.test(value) ? 'text-green-500 flex gap-2 items-center' : 'text-slate-400 flex gap-2 items-center'}>
                {
                  /[A-Z]/.test(value) ? <FaCheckDouble /> : <MdOutlineRadioButtonUnchecked />
                }
                Contains an uppercase letter
              </li>
              <li className={/[a-z]/.test(value) ? 'text-green-500 flex gap-2 items-center' : 'text-slate-400 flex gap-2 items-center'}>
                {
                  /[a-z]/.test(value) ? <FaCheckDouble /> : <MdOutlineRadioButtonUnchecked />
                }
                Contains an lowercase letter
              </li>
              <li className={/\d/.test(value) ? 'text-green-500 flex gap-2 items-center' : 'text-slate-400 flex gap-2 items-center'}>
                {
                  /\d/.test(value) ? <FaCheckDouble /> : <MdOutlineRadioButtonUnchecked />
                }
                Contains a digit or number
              </li>
              <li className={`${/[!@#$%^&*(),.?":{}|<>]/.test(value) ? 'text-green-500 items-center' : 'text-slate-400  items-center'} flex gap-2`}>
                {/[!@#$%^&*(),.?":{}|<>]/.test(value) ? <FaCheckDouble /> : <MdOutlineRadioButtonUnchecked />}
                Contains special character
              </li>
            </ul>
          </div>}
          {/* <button className='mx-auto px-16 py-1 rounded-md text-white font-semibold' onClick={(e) => e.preventDefault()}
            disabled={
              (passwordStrength !== '' && (passwordStrength.toLowerCase() === 'strong' || passwordStrength.toLowerCase() === 'medium')) ? false : true}
            style={
              {
                backgroundColor: `${(passwordStrength !== '' && (passwordStrength.toLowerCase() === 'strong' || passwordStrength.toLowerCase() === 'medium')) ? '#7e22ce' : 'gray'}`,
                cursor: `${(passwordStrength !== '' && (passwordStrength.toLowerCase() === 'strong' || passwordStrength.toLowerCase() === 'medium')) ? 'pointer' : 'not-allowed'}`
              }
            }
          >
            Continue
          </button> */}
        </div>
      </div>
    </div>
  )
}

export default DyanmicPasswordField
