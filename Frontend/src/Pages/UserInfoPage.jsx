import React, { useEffect, useState } from 'react'
import { IoMdCloseCircle } from "react-icons/io";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import backendRoutesAPI from '../BackendAPI/API';
import { setCustomerDetail } from '../Store/customerSlice';
import ManageAddresses from '../Components/ManageAddresses/ManageAddresses';

const theme = createTheme({
      components: {
            MuiTextField: {
                  styleOverrides: {
                        root: {
                              '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                          borderColor: '#83C5BE', // Default border color
                                    },
                                    '&:hover fieldset': {
                                          borderColor: '#83C5BE', // Border color on hover
                                    },
                                    '&.Mui-focused fieldset': {
                                          borderColor: '#006D77', // Border color when focused
                                    },
                              },
                              '& .MuiInputLabel-root': {
                                    color: '#006D77', // Label color
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#006D77', // Label color when focused
                              },
                        },
                  },
            },
      },
});

function UserInfoPage() {
      const user = useSelector((state) => state?.customer?.customer)
      const dispatch = useDispatch()
      const [updatingPersonalInfo, setUpdatingPersonalInfo] = useState(false)
      const [updatingEmailAddress, setUpdatingEmailAddress] = useState(false)
      const [updatingMobileNumber, setUpdatingMobileNumber] = useState(false)
      const [isUpdating, setIsUpdating] = useState(false)
      const [isEmailUpdating, setIsEmailUpdating] = useState(false)
      const [isOTPRecived, setIsOTPRecived] = useState(false)
      const [userData, setUserData] = useState(user)
      const [otpEntered, setOtpEntered] = useState('')
      const [isOtpVerified, setIsOtpVerified] = useState(false)
      const handleChange = (e) => {
            const { name, value } = e.target
            setUserData({ ...userData, [name]: value })
            if (name === 'otp') {
                  setOtpEntered(value)
            }
      }
      const handlePersonalInfoSave = async () => {
            setIsUpdating(true)
            const dataToUpdate = {}
            if (userData.firstName.toLowerCase() !== user.firstName.toLowerCase()) {
                  if (userData.firstName !== '') {
                        dataToUpdate.firstName = userData.firstName.toLowerCase()
                  }
                  else {
                        toast.warning("First Name Can't be empty")
                        setIsUpdating(false)
                        setUserData(user)
                  }
            }
            if (userData.middleName.toLowerCase() !== user.middleName.toLowerCase()) {
                  dataToUpdate.middleName = userData.middleName.toLowerCase()
            }
            if (userData.lastName.toLowerCase() !== user.lastName.toLowerCase()) {
                  if (userData.lastName !== '') {
                        dataToUpdate.lastName = userData.lastName.toLowerCase()
                  }
                  else {
                        toast.warning("Last Name Can't be empty")
                        setIsUpdating(false)
                        setUserData(user)
                  }
            }
            if (Object.keys(dataToUpdate).length > 0) {
                  updatePersonalInfoToDB(dataToUpdate)
            } else {
                  toast.warning('No Updation Made')
                  setUpdatingEmailAddress(false)
                  setUpdatingPersonalInfo(false)
                  setIsUpdating(false)
            }
      }
      const updatePersonalInfoToDB = async (data) => {
            //console.log('Time Api Called',new Date(Date.now()).toLocaleString())
            const backendAPIResponse = await fetch(backendRoutesAPI.customerUpdateInfo.url, {
                  method: backendRoutesAPI.customerUpdateInfo.method,
                  credentials: 'include',
                  headers: {
                        'content-type': 'application/json'
                  },
                  body: JSON.stringify(data)
            })
            const finalRes = await backendAPIResponse.json()
            if (finalRes.success) {
                  //console.log('Time Response Recieved',new Date(Date.now()).toLocaleString())
                  toast.success(finalRes.message)
                  dispatch(setCustomerDetail(finalRes.data))
                  setIsUpdating(false)
                  setUpdatingPersonalInfo(false)
                  setUpdatingEmailAddress(false)
            }
            else {
                  toast.error(finalRes.message)
            }
      }
      const updateEmail = async () => {
            setIsEmailUpdating(true)
            const dataToUpdate = {}
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (userData.email.toLowerCase() !== user.email.toLowerCase()) {
                  if (userData.email !== '' && emailRegex.test(userData.email)) {
                        dataToUpdate.email = userData.email.toLowerCase()
                  }
                  else if (!emailRegex.test(userData.email)) {
                        toast.error('Please enter the Valid Mail')
                        setIsEmailUpdating(false)
                        setUpdatingEmailAddress(false)
                        setUserData(user)
                        return
                  }
                  else {
                        toast.warning("Email Can't be empty")
                        setIsEmailUpdating(false)
                        setUserData(user)
                  }
            }
            if (Object.keys(dataToUpdate).length > 0) {
                  VerifyEmailFromBackend(dataToUpdate)
            } else {
                  toast.warning('No Updation Made')
                  setUpdatingEmailAddress(false)
                  setUpdatingPersonalInfo(false)
                  setIsEmailUpdating(false)
            }
      }
      const VerifyEmailFromBackend = async (data) => {
            console.log('Time Api Called', new Date(Date.now()).toLocaleString())
            const backendAPIResponse = await fetch(backendRoutesAPI.updatingCustomerEmailPhase1.url, {
                  method: backendRoutesAPI.updatingCustomerEmailPhase1.method,
                  credentials: 'include',
                  headers: {
                        'content-type': 'application/json'
                  },
                  body: JSON.stringify(data)
            })
            const finalRes = await backendAPIResponse.json()
            if (finalRes.success) {
                  console.log('Time Response Recieved', new Date(Date.now()).toLocaleString())
                  toast.success(finalRes.message)
                  setIsOTPRecived(true)
            }
            else {
                  toast.error(finalRes.message)
            }
      }
      const verifyOtp = async () => {
            if (otpEntered === '') {
                  toast.error("Enter the 6 digit Otp sent to your Email ")
            }
            else if (otpEntered.length > 6) {
                  toast.error('Otp Should not be Exceed 6 digit')
            }
            else if (otpEntered.length < 6) {
                  toast.error('Otp Should not be less than 6 digit')
            }
            else {
                  const backendResponse = await fetch(backendRoutesAPI.verifyOtp.url, {
                        method: backendRoutesAPI.verifyOtp.method,
                        credentials: 'include',
                        headers: {
                              'content-type': 'application/json'
                        },
                        body: JSON.stringify({ otp: otpEntered, customerId: user._id })
                  })
                  const finalRes = await backendResponse.json()
                  if (finalRes.success) {
                        toast.success(finalRes.message)
                        updatingEmailToBackend()
                        setIsOtpVerified(true)
                  }
                  else {
                        toast.error(finalRes.message)
                  }
            }
      }
      const updatingEmailToBackend = async () => {
            console.log(userData.email)
            const backendResponse = await fetch(backendRoutesAPI.updatingCustomerEmailPhase2.url, {
                  method: backendRoutesAPI.updatingCustomerEmailPhase2.method,
                  credentials: 'include',
                  headers: {
                        'content-type': 'application/json'
                  },
                  body: JSON.stringify({ newEmail: userData.email })
            })
            const finalRes = await backendResponse.json()
            if (finalRes.success) {
                  console.log(finalRes)
                  toast.success(finalRes.message)
                  setUserData(finalRes.data)
                  setIsOTPRecived(false)
                  setIsEmailUpdating(false)
                  setIsOtpVerified(false)
                  setUpdatingEmailAddress(false)
            }
            else {
                  toast.error(finalRes.message)
                  setUserData(user)
                  isOTPRecived(false)
                  setIsEmailUpdating(false)
                  setIsOtpVerified(false)
                  setUpdatingEmailAddress(false)
            }
      }
      useEffect(() => {
            setUserData(user)
      }, [user])
      return (
            <div className='py-4 flex w-full'>
                  <div className='flex flex-col w-full bg-[#fff] rounded-sm py-2'>
                        {/* Info Section */}
                        <div className=' w-full flex gap-4 flex-col items-baseline p-4'>
                              <div className='flex flex-col gap-4 w-full'>
                                    <div className='flex items-baseline gap-8 w-full '>
                                          <h1 className='text-3xl font-semibold'>Profile Informations</h1>
                                    </div>
                                    <div className='flex w-full px-4'>
                                          <div className='w-full gap-4 flex flex-col px-6 py-3'>
                                                {/* Personal Information */}
                                                <div className='w-full flex flex-col gap-3 px-2'>
                                                      <div className='flex items-baseline gap-8 w-full '>
                                                            <h1 className='text-2xl'>Personal Information</h1>
                                                            <span className='text-sm font-semibold  cursor-pointer text-blue-600'
                                                                  onClick={() => {
                                                                        if (!isUpdating) {
                                                                              setUserData(user)
                                                                        }
                                                                        return setUpdatingPersonalInfo((prevOption) => !prevOption)
                                                                  }
                                                                  }
                                                            >
                                                                  {updatingPersonalInfo ? 'Cancel' : 'Edit'}
                                                            </span>
                                                      </div>
                                                      {
                                                            isUpdating ? <h1 className='text-3xl font-bold'>Upating....</h1> : <div className='flex gap-3'>

                                                                  <ThemeProvider theme={theme}>
                                                                        <TextField
                                                                              id={updatingPersonalInfo ? "outlined-basic" : "outlined-basic-disabled"}
                                                                              label={updatingPersonalInfo ? "First Name" : ""}
                                                                              variant="outlined"
                                                                              value={userData?.firstName !== undefined ? userData?.firstName.toUpperCase() : ''}
                                                                              disabled={updatingPersonalInfo ? false : true}
                                                                              name='firstName'
                                                                              onChange={handleChange}
                                                                        />
                                                                        {
                                                                              userData?.middleName !== '' && userData?.middleName !== undefined ? (
                                                                                    <TextField
                                                                                          id={updatingPersonalInfo ? "outlined-basic" : "outlined-basic-disabled"}
                                                                                          label={updatingPersonalInfo ? "Middle Name" : ""}
                                                                                          variant="outlined"
                                                                                          value={userData?.middleName !== undefined ? userData?.middleName.toUpperCase() : ''}
                                                                                          disabled={updatingPersonalInfo ? false : true}
                                                                                          name='middleName'
                                                                                          onChange={handleChange}
                                                                                    />
                                                                              ) : null
                                                                        }
                                                                        <TextField
                                                                              id={updatingPersonalInfo ? "outlined-basic" : "outlined-basic-disabled"}
                                                                              label={updatingPersonalInfo ? "Last Name" : ""}
                                                                              variant="outlined"
                                                                              value={userData?.lastName !== undefined ? userData?.lastName.toUpperCase() : ''}
                                                                              disabled={updatingPersonalInfo ? false : true}
                                                                              name='lastName'
                                                                              onChange={handleChange}
                                                                        />
                                                                  </ThemeProvider>
                                                                  {updatingPersonalInfo ? <Button id='formsavebtn' variant="contained" onClick={() => { handlePersonalInfoSave() }}>SAVE</Button> : null}

                                                            </div>
                                                      }

                                                </div>
                                                {/* Email Address */}
                                                <div className='w-full flex flex-col gap-3 px-2'>
                                                      <div className='flex items-baseline w-full gap-8'>
                                                            <h1 className='text-2xl'>Email Address</h1>
                                                            <span className='text-sm font-semibold cursor-pointer text-blue-500'
                                                                  onClick={() => {
                                                                        if (!isUpdating) {
                                                                              setUserData(user)
                                                                        }
                                                                        return setUpdatingEmailAddress((prevOption) => !prevOption)
                                                                  }}
                                                            >
                                                                  {updatingEmailAddress ? 'Cancel' : 'Edit'}
                                                            </span>
                                                      </div>
                                                      <div>
                                                            {
                                                                  isEmailUpdating ? <h1 className='text-3xl font-bold'>Upating....</h1> :
                                                                        <div className='flex gap-3'>
                                                                              <ThemeProvider theme={theme}>
                                                                                    <TextField
                                                                                          id={updatingEmailAddress ? "outlined-basic" : "outlined-basic-disabled"}
                                                                                          label={updatingEmailAddress ? "Email Address" : ""}
                                                                                          variant="outlined"
                                                                                          value={userData?.email !== undefined ? userData.email : ''}
                                                                                          disabled={updatingEmailAddress ? false : true}
                                                                                          name='email'
                                                                                          onChange={handleChange}
                                                                                          type='email'
                                                                                    />
                                                                              </ThemeProvider>
                                                                              {updatingEmailAddress ? <Button id='formsavebtn' variant="contained" onClick={updateEmail}>SAVE</Button> : null}
                                                                        </div>
                                                            }
                                                      </div>
                                                </div>
                                                {/* Mobile Number */}
                                                <div className='w-full flex flex-col gap-3 px-2'>
                                                      <div className='flex items-baseline w-full gap-8'>
                                                            <h1 className='text-2xl'>Mobile Number</h1>
                                                            <span className='text-sm font-semibold cursor-pointer text-blue-500'
                                                                  onClick={() => {
                                                                        if (!isUpdating) {
                                                                              setUserData(user)
                                                                        }
                                                                        return setUpdatingMobileNumber((prevOption) => !prevOption)
                                                                  }}
                                                            >
                                                                  {updatingMobileNumber ? 'Cancel' : 'Edit'}
                                                            </span>
                                                      </div>
                                                      <div className='flex gap-3'>
                                                            <ThemeProvider theme={theme}>
                                                                  <TextField
                                                                        id={updatingMobileNumber ? "outlined-basic" : "outlined-basic-disabled"}
                                                                        label={updatingMobileNumber ? "Mobile Number" : ""}
                                                                        variant="outlined"
                                                                        defaultValue='9140626611'
                                                                        disabled={updatingMobileNumber ? false : true}
                                                                        type='number'
                                                                  />
                                                            </ThemeProvider>
                                                            {updatingMobileNumber ? <Button id='formsavebtn' variant="contained">SAVE</Button> : null}
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                        {/* Horizontal line */}
                        <div className=' w-full flex px-3 mb-1'>
                              <div className='flex bg-slate-400 w-full py-[1px]'></div>
                        </div>
                        {/* Address */}
                        <ManageAddresses theme={theme} />
                  </div>

                  {/* Email OTP Verification Page */}
                  {
                        isOTPRecived
                              ? (
                                    <div className='flex justify-center items-center absolute bg-slate-500 bg-opacity-25 p-10 top-0 bottom-0 left-0 right-0'>
                                          <div className='flex flex-col h-fit w-fit bg-[#fff] p-4'>
                                                <div className='flex justify-between items-baseline w-full '>
                                                      <h1 className='text-2xl'>Email Updation Otp Verification</h1>
                                                      <span className='text-2xl h-fit w-fit group font-semibold  cursor-pointer text-red-600'
                                                            onClick={() => {
                                                                  setIsOTPRecived(false)
                                                                  setUserData(user)
                                                                  setUpdatingEmailAddress(false)
                                                                  setIsEmailUpdating(false)
                                                            }
                                                            }
                                                      >
                                                            <IoMdCloseCircle />
                                                      </span>
                                                </div>
                                                <div className='flex p-4' disabled={isOtpVerified ? true : false}>

                                                      <ThemeProvider theme={theme}>
                                                            <TextField
                                                                  id="outlined-basic-otp"
                                                                  placeholder={`Enter the OTP sent ${userData?.email}`}
                                                                  variant="outlined"
                                                                  value={otpEntered}
                                                                  name='otp'
                                                                  disabled={isOtpVerified ? true : false}
                                                                  onChange={handleChange}
                                                                  type='number'
                                                                  maxLength='6'
                                                            />
                                                      </ThemeProvider>
                                                      <Button id='otpVerifyBtn' variant="contained" onClick={verifyOtp}
                                                            disabled={isOtpVerified ? true : false}
                                                      >
                                                            Verify
                                                      </Button>

                                                </div>
                                          </div>
                                    </div>
                              )
                              : null
                  }
            </div>
      )
}

export default UserInfoPage
