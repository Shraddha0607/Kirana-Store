import React, { useEffect, useState } from 'react'
import { Button, createTheme, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, ThemeProvider } from '@mui/material';
import ManageAddresses from '../ManageAddresses/ManageAddresses'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { indianStates } from '../../HelperFiles/StateList';
import backendRoutesAPI from '../../BackendAPI/API';
import { setCustomerDetail } from '../../Store/customerSlice';;

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

function AddingNewAddress({ close }) {
            const user = useSelector((state) => state?.customer?.customer)
            const [isSubmitting, setIsSubmitting] = useState(false)
            const [addressFormError, setAddressFormError] = useState({})
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
            const handleChange = (e) => {
                        const { name, value } = e.target
                        setAddressData({ ...addressData, [name]: value })
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
                              close()
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
                              close()
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
            useEffect(() => {
                        if (Object.keys(addressFormError).length === 0 && isSubmitting) {
                              addNewAddressToDb()
                        }
                  }, [addressFormError])
            return (
                        <div className='flex justify-center items-center absolute top-32 bottom-0 right-0 left-0 h-fit bg-slate-300 bg-opacity-30 p-5'>
                                    <div className='bg-white rounded-lg p-5 gap-2 flex flex-col '>
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
                                                                        ADD
                                                            </button>
                                                            <button
                                                                        className='bg-red-500 px-6 text-xl py-2 font-semibold rounded-md hover:shadow-xl 
                                                                              text-[#fff] hover:text-red-500 hover:bg-[#fff]'
                                                                        onClick={() => close()}
                                                            >
                                                                        CLOSE
                                                            </button>
                                                </div>
                                    </div>
                        </div>
            )
}

export default AddingNewAddress
