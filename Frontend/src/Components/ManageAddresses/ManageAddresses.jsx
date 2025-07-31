import { Button, createTheme, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, ThemeProvider } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import backendRoutesAPI from '../../BackendAPI/API';
import { indianStates } from '../../HelperFiles/StateList';
import { setCustomerDetail } from '../../Store/customerSlice';
import { BsThreeDotsVertical } from "react-icons/bs";

const theme = createTheme({
      components: {
            MuiTextField: {
                  styleOverrides: {
                        root: {
                              '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                          borderColor: 'black', // Default border color
                                    },
                                    '&:hover fieldset': {
                                          borderColor: '#006D77', // Border color on hover
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

const themeforRadioButton = createTheme({
      components: {
            MuiRadio: {
                  styleOverrides: {
                        root: {
                              color: 'defaultColor', // Default color
                        },
                  },
            },
      },
      palette: {
            primary: {
                  main: '#006D77', // Change the primary color
            }
      },
});

function ManageAddresses() {
      const user = useSelector((state) => state?.customer?.customer)
      const dispatch = useDispatch()
      const [addressData, setAddressData] = useState({
            name: '',
            mobileNumber: '',
            pincode: '',
            locality: '',
            address: '',
            city: '',
            state: '',
            landmark: '',
            alternatePhoneNumber: '',
            addressType: ''
      })
      const [addressFormError, setAddressFormError] = useState({})
      const [addressEditFormError, setAddressEditFormError] = useState({})
      const [addingNewAddress, setAddingNewAddress] = useState(false)
      const [isSubmitting, setIsSubmitting] = useState(false)
      const [isEditting, setIsEditting] = useState(false)
      const [showEditMenu, setShowEditMenu] = useState(null)
      const [cuurentEditingIndex, setCurrentEditingIndex] = useState(null)
      const [cuurentEditingAddress, setCurrentEditingAddress] = useState()

      const handleChange = (e) => {
            const { name, value } = e.target
            setAddressData({ ...addressData, [name]: value })
      }
      const handleEditChange = (e) => {
            const { name, value } = e.target
            setCurrentEditingAddress({ ...cuurentEditingAddress, [name]: value })
      }
      const handleCancelBtn = () => {
            setIsSubmitting(false)
            setAddressFormError({})
            setAddingNewAddress((prevOption) => !prevOption)
            setAddressData({
                  name: '',
                  mobileNumber: '',
                  pincode: '',
                  locality: '',
                  address: '',
                  city: '',
                  state: '',
                  landmark: '',
                  alternatePhoneNumber: '',
                  addressType: ''
            })
      }
      const validate = (data) => {
            const error = {}
            if (data.pincode.length === 0 || data.pincode.length > 6 || data.pincode.length < 6) {
                  error.pincode = 'Enter the valid Pincode'
            }
            if (data.mobileNumber.length === 0 || data.mobileNumber.length > 10 || data.mobileNumber.length < 10) {
                  error.mobileNumber = 'Enter the valid Mobile Number'
            }
            if (!indianStates.includes(data.state)) {
                  error.state = 'Enter the Valid State Which is in INDIA'
            }
            if (data.name === '') {
                  error.name = 'Enter the valid name'
            }
            if (data.locality === '') {
                  error.locality = 'Enter the valid Locality'
            }
            if (data.address === '') {
                  error.address = 'Enter the valid Address'
            }
            if (data.city === '') {
                  error.city = 'Enter the valid City'
            }
            if (data.alternatePhoneNumber !== '' && data.alternatePhoneNumber !== undefined) {
                  if (data.alternatePhoneNumber.length < 10 || data.alternatePhoneNumber.length > 10) {
                        error.alternatePhoneNumber = 'Enter the valid Alternate Mobile Number'
                  }
            }
            if (data.addressType === '') {
                  error.addressType = 'Choose Any One Option'
            }
            return error
      }
      const handleUpdateBtn = async (e) => {
            e.preventDefault()
            setAddressFormError(validate(addressData))
            setIsSubmitting(true)
      }
      const addNewAddressToDb = async () => {
            const backendResponse = await fetch(backendRoutesAPI.addNewAddress.url, {
                  method: backendRoutesAPI.addNewAddress.method,
                  credentials: 'include',
                  headers: {
                        'content-type': 'application/json'
                  },
                  body: JSON.stringify(addressData)
            })
            const finalData = await backendResponse.json()
            if (finalData.success) {
                  dispatch(setCustomerDetail(finalData.data))
                  setIsSubmitting(false)
                  toast.success(finalData.message)
                  setAddingNewAddress(false)
                  setAddressFormError({})
                  setAddressData({
                        name: '',
                        mobileNumber: '',
                        pincode: '',
                        locality: '',
                        address: '',
                        city: '',
                        state: '',
                        landmark: '',
                        alternatePhoneNumber: '',
                        addressType: ''
                  })
            }
            else {
                  toast.success(finalData.message)
                  setAddingNewAddress(false)
                  setAddressFormError({})
                  setAddressData({
                        name: '',
                        mobileNumber: '',
                        pincode: '',
                        locality: '',
                        address: '',
                        city: '',
                        state: '',
                        landmark: '',
                        alternatePhoneNumber: '',
                        addressType: ''
                  })
            }
      }
      const handleEditAddress = (address, index) => {
            setCurrentEditingAddress(address)
            setCurrentEditingIndex(index)
            setAddingNewAddress(false)
      }
      const checkingmodification = (oldAdd, newAdd) => {
            let countUpdation = 0
            if (oldAdd.name.toLowerCase() !== newAdd.name.toLowerCase()) {
                  countUpdation++
            }
            if (oldAdd.locality.toLowerCase() !== newAdd.locality.toLowerCase()) {
                  countUpdation++
            }
            if (oldAdd.fullAddress.toLowerCase() !== newAdd.fullAddress.toLowerCase()) {
                  countUpdation++
            }
            if (oldAdd.city.toLowerCase() !== newAdd.city.toLowerCase()) {
                  countUpdation++
            }
            if (oldAdd.state.toLowerCase() !== newAdd.state.toLowerCase()) {
                  countUpdation++
            }
            if (oldAdd.landmark.toLowerCase() !== newAdd.landmark.toLowerCase()) {
                  countUpdation++
            }
            if (oldAdd.mobileNumber !== newAdd.mobileNumber) {
                  countUpdation++
            }
            if (Object.keys(newAdd).includes('alternatePhoneNumber')) {
                  if (Object.keys(oldAdd).includes('alternatePhoneNumber')) {
                        if (oldAdd.alternatePhoneNumber !== newAdd.alternatePhoneNumber) {
                              countUpdation++
                        }
                  }
                  else {
                        countUpdation++
                  }
            }
            if (countUpdation !== 0) return true
            else return false
      }
      const handleModifyBtn = (prevAddress) => {
            if (checkingmodification(prevAddress, cuurentEditingAddress)) {
                  setAddressEditFormError(validate(cuurentEditingAddress))
                  setIsEditting(true)
            }
            else {
                  toast.warning('No Modification made')
                  setCurrentEditingIndex(null)
                  setShowEditMenu(null)
            }

      }
      const modifyAddressToDb = async () => {
            const backendResponse = await fetch(backendRoutesAPI.modifyAddress.url, {
                  method: backendRoutesAPI.modifyAddress.method,
                  credentials: 'include',
                  headers: {
                        'content-type': 'application/json'
                  },
                  body: JSON.stringify(cuurentEditingAddress)
            })
            const finalData = await backendResponse.json()
            if (finalData.success) {
                  dispatch(setCustomerDetail(finalData.data))
                  setIsEditting(false)
                  toast.success(finalData.message)
                  setCurrentEditingIndex(null)
                  setAddressEditFormError({})
                  setCurrentEditingAddress({})
                  setShowEditMenu(null)
            }
            else {
                  setIsEditting(false)
                  toast.success(finalData.message)
                  setCurrentEditingIndex(null)
                  setAddressEditFormError({})
                  setCurrentEditingAddress({})
                  setShowEditMenu(null)
            }
      }
      const hadnleDelete = async (id) => {
            const backendResponse = await fetch(backendRoutesAPI.modifyAddress.url, {
                  method: backendRoutesAPI.modifyAddress.method,
                  credentials: 'include',
                  headers: {
                        'content-type': 'application/json'
                  },
                  body: JSON.stringify({ _id: id, action: 'del' })
            })
            const finalData = await backendResponse.json()
            if (finalData.success) {
                  dispatch(setCustomerDetail(finalData.data))
                  setIsEditting(false)
                  toast.success(finalData.message)
                  setCurrentEditingIndex(null)
                  setAddressEditFormError({})
                  setCurrentEditingAddress({})
                  setShowEditMenu(null)
            }
            else {
                  setIsEditting(false)
                  toast.success(finalData.message)
                  setCurrentEditingIndex(null)
                  setAddressEditFormError({})
                  setCurrentEditingAddress({})
                  setShowEditMenu(null)
            }
      }
      useEffect(() => {
            if (Object.keys(addressFormError).length === 0 && isSubmitting) {
                  addNewAddressToDb()
            }
      }, [addressFormError])
      useEffect(() => {
            if (Object.keys(addressEditFormError).length === 0 && isEditting) {
                  modifyAddressToDb()
            }
      }, [addressEditFormError])
      return (
            <div className=' w-full flex gap-4 flex-col items-baseline p-4'>
                  <div className='flex flex-col gap-4 w-full'>
                        <div className='flex items-baseline gap-8 w-full '>
                              <h1 className='text-3xl font-semibold'>Manage Addresses</h1>
                        </div>
                        <div className='flex w-full px-4'>
                              <div className='w-full gap-4 flex flex-col px-6 py-3'>
                                    <div className='border border-slate-500 flex flex-col px-4 py-3' style={{ backgroundColor: addingNewAddress ? "#9fded775" : "#fff" }}>
                                          {
                                                addingNewAddress
                                                      ?
                                                      <div className='flex flex-col gap-8 p-2 w-full'>
                                                            <div className='flex'>
                                                                  <h1 className='flex text-xl font-semibold gap-4 text-[#006D77]
                                                                  items-center group cursor-pointer'
                                                                  >
                                                                        Add New Address
                                                                  </h1>
                                                            </div>
                                                            <form className='w-full grid-cols-2 gap-3 lg:grid flex flex-col px-2'>
                                                                  <ThemeProvider theme={theme}>
                                                                        <div className='flex flex-col justify-center gap-2'>
                                                                              <TextField
                                                                                    id="outlined-basic"
                                                                                    label="Name"
                                                                                    variant="outlined"
                                                                                    type='text'
                                                                                    name='name'
                                                                                    value={addressData.name}
                                                                                    onChange={handleChange}
                                                                              />
                                                                              <p className='text-sm text-red-600 ml-2'>{addressFormError?.name}</p>
                                                                        </div>
                                                                        <div className='flex flex-col justify-center gap-2'>
                                                                              <TextField
                                                                                    id="outlined-basic"
                                                                                    label="10-digit mobile number"
                                                                                    variant="outlined"
                                                                                    type='number'
                                                                                    name='mobileNumber'
                                                                                    value={addressData.mobileNumber}
                                                                                    onChange={handleChange}
                                                                              />
                                                                              <p className='text-sm text-red-600 ml-2'>{addressFormError?.mobileNumber}</p>
                                                                        </div>
                                                                        <div className='flex flex-col justify-center gap-2'>
                                                                              <TextField
                                                                                    id="outlined-basic"
                                                                                    label="Pincode"
                                                                                    variant="outlined"
                                                                                    type='number'
                                                                                    name='pincode'
                                                                                    value={addressData.pincode}
                                                                                    onChange={handleChange}
                                                                              />
                                                                              <p className='text-sm  text-red-600 ml-2'>{addressFormError?.pincode}</p>
                                                                        </div>
                                                                        <div className='flex flex-col justify-center gap-2'>
                                                                              <TextField
                                                                                    id="outlined-basic"
                                                                                    label="Locality"
                                                                                    variant="outlined"
                                                                                    type='text'
                                                                                    name='locality'
                                                                                    value={addressData.locality}
                                                                                    onChange={handleChange}
                                                                              />
                                                                              <p className='text-sm text-red-600 ml-2'>{addressFormError?.locality}</p>
                                                                        </div>
                                                                        <div className='flex flex-col justify-center gap-2 col-span-2'>
                                                                              <TextField
                                                                                    id="outlined-basic"
                                                                                    label="Address (Area & Street)"
                                                                                    variant="outlined"
                                                                                    type='text'
                                                                                    className='col-span-2 bg-white'
                                                                                    multiline
                                                                                    rows={4}
                                                                                    name='address'
                                                                                    value={addressData.address}
                                                                                    onChange={handleChange}
                                                                              />
                                                                              <p className='text-sm  text-red-600 ml-2'>{addressFormError?.address}</p>
                                                                        </div>
                                                                        <div className='flex flex-col justify-center gap-2'>
                                                                              <TextField
                                                                                    id="outlined-basic"
                                                                                    label="City/District/Town"
                                                                                    variant="outlined"
                                                                                    type='text'
                                                                                    name='city'
                                                                                    value={addressData.city}
                                                                                    onChange={handleChange}
                                                                              />
                                                                              <p className='text-sm  text-red-600 ml-2'>{addressFormError?.city}</p>
                                                                        </div>
                                                                        <div className='flex flex-col justify-center gap-2'>
                                                                              <TextField
                                                                                    id="outlined-basic"
                                                                                    label="State"
                                                                                    variant="outlined"
                                                                                    type='text'
                                                                                    name='state'
                                                                                    value={addressData.state}
                                                                                    onChange={handleChange}
                                                                              />
                                                                              <p className='text-sm  text-red-600 ml-2'>{addressFormError?.state}</p>
                                                                        </div>
                                                                        <div className='flex flex-col justify-center gap-2'>
                                                                              <TextField
                                                                                    id="outlined-basic"
                                                                                    label="Landmark (optional)"
                                                                                    variant="outlined"
                                                                                    type='text'
                                                                                    name='landmark'
                                                                                    value={addressData.landmark}
                                                                                    onChange={handleChange}
                                                                              />
                                                                              <p className='text-sm  text-red-600 ml-2'>{addressFormError?.landmark}</p>
                                                                        </div>
                                                                        <div className='flex flex-col justify-center gap-2'>
                                                                              <TextField
                                                                                    id="outlined-basic"
                                                                                    label="Alternate Phone (Optional)"
                                                                                    variant="outlined"
                                                                                    type='text'
                                                                                    name='alternatePhoneNumber'
                                                                                    value={addressData.alternatePhoneNumber}
                                                                                    onChange={handleChange}
                                                                              />
                                                                              <p className='text-sm  text-red-600 ml-2'>{addressFormError?.alternatePhoneNumber}</p>
                                                                        </div>
                                                                  </ThemeProvider>
                                                                  <ThemeProvider theme={themeforRadioButton}>
                                                                        <FormControl className='gap-2 mt-2'>
                                                                              <FormLabel id="demo-controlled-radio-buttons-group">Address Type</FormLabel>
                                                                              <RadioGroup
                                                                                    row
                                                                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                                                                    name="addressType"
                                                                                    className='flex'
                                                                                    value={addressData.addressType}
                                                                                    onChange={handleChange}
                                                                              >
                                                                                    <FormControlLabel value="home" control={<Radio />} label="Home" />
                                                                                    <FormControlLabel value="office" control={<Radio />} label="Office" />
                                                                                    <p className='text-sm text-red-600 ml-2'>{addressFormError?.addressType}</p>
                                                                              </RadioGroup>

                                                                        </FormControl>
                                                                  </ThemeProvider>
                                                            </form>
                                                            <div className='flex items-center gap-9'>
                                                                  <button
                                                                        className='bg-[#006D77] px-6 text-xl py-2 font-semibold rounded-md hover:shadow-xl 
                                                                              text-[#fff] hover:text-[#006D77] hover:bg-[#fff]'
                                                                        onClick={handleUpdateBtn}
                                                                  >
                                                                        UPDATE
                                                                  </button>
                                                                  <button
                                                                        className='bg-red-500 px-6 text-xl py-2 font-semibold rounded-md hover:shadow-xl 
                                                                              text-[#fff] hover:text-red-500 hover:bg-[#fff]'
                                                                        onClick={handleCancelBtn}
                                                                  >
                                                                        CANCEL
                                                                  </button>
                                                            </div>
                                                      </div>
                                                      :
                                                      <div className='flex'>
                                                            <h1 className='flex text-xl font-semibold gap-4 text-blue-600
                                                                  items-center group cursor-pointer'
                                                                  onClick={() => {
                                                                        setAddingNewAddress(true)
                                                                        setCurrentEditingIndex(null)
                                                                        setShowEditMenu(null)
                                                                  }}
                                                            >
                                                                  {addingNewAddress ? null : <span><FiPlus /></span>}
                                                                  Add New Address
                                                            </h1>
                                                      </div>
                                          }
                                    </div>
                                    <div className='flex py-3'>
                                          <ul className='w-full flex flex-col gap-4'>
                                                {
                                                      user?.address.map((address, index) => {
                                                            return (
                                                                  cuurentEditingIndex === index ?
                                                                        (
                                                                              <li className='w-full gap-2 flex flex-col' key={index}>
                                                                                    <div className='flex gap-8 flex-col px-4 py-3 bg-[#9fded775]'>
                                                                                          <div className='flex'>
                                                                                                <h1 className='flex text-xl font-semibold gap-4 text-[#006D77]
                                                                                                            items-center group cursor-pointer'>
                                                                                                      Edit Address
                                                                                                </h1>
                                                                                          </div>
                                                                                          <form className='w-full grid-cols-2 gap-3 lg:grid flex flex-col px-2'>
                                                                                                <ThemeProvider theme={theme}>
                                                                                                      <div className='flex flex-col justify-center gap-2'>
                                                                                                            <TextField
                                                                                                                  id="outlined-basic"
                                                                                                                  label="Name"
                                                                                                                  variant="outlined"
                                                                                                                  type='text'
                                                                                                                  name='name'
                                                                                                                  value={cuurentEditingAddress?.name.toUpperCase()}
                                                                                                                  onChange={handleEditChange}
                                                                                                            />
                                                                                                            <p className='text-sm text-red-600 ml-2'>{addressEditFormError?.name}</p>
                                                                                                      </div>
                                                                                                      <div className='flex flex-col justify-center gap-2'>
                                                                                                            <TextField
                                                                                                                  id="outlined-basic"
                                                                                                                  label="10-digit mobile number"
                                                                                                                  variant="outlined"
                                                                                                                  type='number'
                                                                                                                  name='mobileNumber'
                                                                                                                  value={cuurentEditingAddress?.mobileNumber}
                                                                                                                  onChange={handleEditChange}
                                                                                                            />
                                                                                                            <p className='text-sm text-red-600 ml-2'>{addressEditFormError?.mobileNumber}</p>
                                                                                                      </div>
                                                                                                      <div className='flex flex-col justify-center gap-2'>
                                                                                                            <TextField
                                                                                                                  id="outlined-basic"
                                                                                                                  label="Pincode"
                                                                                                                  variant="outlined"
                                                                                                                  type='number'
                                                                                                                  name='pincode'
                                                                                                                  value={cuurentEditingAddress?.pincode}
                                                                                                                  onChange={handleEditChange}
                                                                                                            />
                                                                                                            <p className='text-sm  text-red-600 ml-2'>{addressEditFormError?.pincode}</p>
                                                                                                      </div>
                                                                                                      <div className='flex flex-col justify-center gap-2'>
                                                                                                            <TextField
                                                                                                                  id="outlined-basic"
                                                                                                                  label="Locality"
                                                                                                                  variant="outlined"
                                                                                                                  type='text'
                                                                                                                  name='locality'
                                                                                                                  value={cuurentEditingAddress?.locality.toUpperCase()}
                                                                                                                  onChange={handleEditChange}
                                                                                                            />
                                                                                                            <p className='text-sm text-red-600 ml-2'>{addressEditFormError?.locality}</p>
                                                                                                      </div>
                                                                                                      <div className='flex flex-col justify-center gap-2 col-span-2'>
                                                                                                            <TextField
                                                                                                                  id="outlined-basic"
                                                                                                                  label="Address (Area & Street)"
                                                                                                                  variant="outlined"
                                                                                                                  type='text'
                                                                                                                  className='col-span-2 bg-white'
                                                                                                                  multiline
                                                                                                                  rows={4}
                                                                                                                  name='fullAddress'
                                                                                                                  value={cuurentEditingAddress?.fullAddress.toUpperCase()}
                                                                                                                  onChange={handleEditChange}
                                                                                                            />
                                                                                                            <p className='text-sm  text-red-600 ml-2'>{addressEditFormError?.address}</p>
                                                                                                      </div>
                                                                                                      <div className='flex flex-col justify-center gap-2'>
                                                                                                            <TextField
                                                                                                                  id="outlined-basic"
                                                                                                                  label="City/District/Town"
                                                                                                                  variant="outlined"
                                                                                                                  type='text'
                                                                                                                  name='city'
                                                                                                                  value={cuurentEditingAddress?.city.toUpperCase()}
                                                                                                                  onChange={handleEditChange}
                                                                                                            />
                                                                                                            <p className='text-sm  text-red-600 ml-2'>{addressEditFormError?.city}</p>
                                                                                                      </div>
                                                                                                      <div className='flex flex-col justify-center gap-2'>
                                                                                                            <TextField
                                                                                                                  id="outlined-basic"
                                                                                                                  label="State"
                                                                                                                  variant="outlined"
                                                                                                                  type='text'
                                                                                                                  name='state'
                                                                                                                  value={cuurentEditingAddress?.state.toUpperCase()}
                                                                                                                  onChange={handleEditChange}
                                                                                                            />
                                                                                                            <p className='text-sm  text-red-600 ml-2'>{addressEditFormError?.state}</p>
                                                                                                      </div>
                                                                                                      <div className='flex flex-col justify-center gap-2'>
                                                                                                            <TextField
                                                                                                                  id="outlined-basic"
                                                                                                                  label="Landmark (optional)"
                                                                                                                  variant="outlined"
                                                                                                                  type='text'
                                                                                                                  name='landmark'
                                                                                                                  value={cuurentEditingAddress?.landmark.toUpperCase()}
                                                                                                                  onChange={handleEditChange}
                                                                                                            />
                                                                                                            <p className='text-sm  text-red-600 ml-2'>{addressEditFormError?.landmark}</p>
                                                                                                      </div>
                                                                                                      <div className='flex flex-col justify-center gap-2'>
                                                                                                            <TextField
                                                                                                                  id="outlined-basic"
                                                                                                                  label="Alternate Phone (Optional)"
                                                                                                                  variant="outlined"
                                                                                                                  type='number'
                                                                                                                  name='alternatePhoneNumber'
                                                                                                                  value={cuurentEditingAddress?.alternatePhoneNumber !== undefined ? cuurentEditingAddress?.alternatePhoneNumber : ''}
                                                                                                                  onChange={handleEditChange}
                                                                                                            />
                                                                                                            <p className='text-sm  text-red-600 ml-2'>{addressEditFormError?.alternatePhoneNumber}</p>
                                                                                                      </div>
                                                                                                </ThemeProvider>
                                                                                                <ThemeProvider theme={themeforRadioButton}>
                                                                                                      <FormControl className='gap-2 mt-2'>
                                                                                                            <FormLabel id="demo-controlled-radio-buttons-group">Address Type</FormLabel>
                                                                                                            <RadioGroup
                                                                                                                  row
                                                                                                                  aria-labelledby="demo-controlled-radio-buttons-group"
                                                                                                                  name="addressType"
                                                                                                                  className='flex'
                                                                                                                  value={cuurentEditingAddress?.addressType}
                                                                                                                  onChange={handleEditChange}
                                                                                                            >
                                                                                                                  <FormControlLabel value="home" control={<Radio />} label="Home" />
                                                                                                                  <FormControlLabel value="office" control={<Radio />} label="Office" />
                                                                                                                  <p className='text-sm text-red-600 ml-2'>{addressFormError?.addressType}</p>
                                                                                                            </RadioGroup>

                                                                                                      </FormControl>
                                                                                                </ThemeProvider>
                                                                                          </form>
                                                                                          <div className='flex items-center gap-9'>
                                                                                                <button
                                                                                                      className='bg-[#006D77] px-6 text-xl py-2 font-semibold rounded-md hover:shadow-xl 
                                                                                                      text-[#fff] hover:text-[#006D77] hover:bg-[#fff]'
                                                                                                      onClick={() => handleModifyBtn(address)}
                                                                                                >
                                                                                                      MODIFY
                                                                                                </button>
                                                                                                <button
                                                                                                      className='bg-red-500 px-6 text-xl py-2 font-semibold rounded-md hover:shadow-xl 
                                                                                                      text-[#fff] hover:text-red-500 hover:bg-[#fff]'
                                                                                                      onClick={() => {
                                                                                                            setCurrentEditingIndex(null)
                                                                                                            setShowEditMenu(null)
                                                                                                            setCurrentEditingAddress(address)
                                                                                                            setAddressEditFormError({})
                                                                                                            setIsEditting(false)
                                                                                                      }}
                                                                                                >
                                                                                                      CANCEL
                                                                                                </button>
                                                                                          </div>
                                                                                    </div>
                                                                              </li>
                                                                        )
                                                                        :
                                                                        (<li className='border-2 w-full p-4 gap-2 flex flex-col' key={index}>
                                                                              <div className='flex w-full justify-between items-center px-2 mb-2 relative'>
                                                                                    <p className='bg-slate-100 px-[5px] py-[3px] rounded-sm text-sm text-slate-500 font-bold w-fit'>
                                                                                          {address.addressType.toUpperCase()}
                                                                                    </p>
                                                                                    <span className='text-xl text-slate-600 cursor-pointer group' onMouseEnter={() => setShowEditMenu(index)}>
                                                                                          <BsThreeDotsVertical />
                                                                                    </span>
                                                                                    {
                                                                                          showEditMenu === index ? (
                                                                                                <nav className=' flex flex-col absolute right-0 top-0 bg-white shadow-lg rounded-md py-2 px-3 gap-2 cursor-pointer'
                                                                                                      onMouseEnter={() => setShowEditMenu(index)} onMouseLeave={() => setShowEditMenu(null)}
                                                                                                >
                                                                                                      <p className='text-base cursor-pointer hover:text-blue-600'
                                                                                                            onClick={() => handleEditAddress(address, index)}
                                                                                                      >
                                                                                                            Edit
                                                                                                      </p>
                                                                                                      <p className='text-base cursor-pointer hover:text-blue-600'
                                                                                                            onClick={() => { hadnleDelete(address._id) }}
                                                                                                      >
                                                                                                            Delete
                                                                                                      </p>
                                                                                                </nav>
                                                                                          ) : null
                                                                                    }
                                                                              </div>
                                                                              <div className='flex gap-5 ml-2'>
                                                                                    <h1 className='font-bold'>{address.name.toUpperCase()}</h1>
                                                                                    <h1 className='font-bold'>{address.mobileNumber}</h1>
                                                                              </div>
                                                                              <p className='capitalize ml-2 mt-1'>
                                                                                    {address.fullAddress}, {address.locality}, {address.city}, {address.state} - <span className='font-bold'>{address.pincode}</span>
                                                                              </p>
                                                                        </li>)
                                                            )
                                                      })
                                                }
                                          </ul>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default ManageAddresses
