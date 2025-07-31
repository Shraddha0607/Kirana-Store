import React, { useEffect, useState } from 'react'
import Razorpay from 'razorpay';
import { createTheme, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, ThemeProvider, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSteeperProgress } from '../../Store/steeperStepSlice'
import { toast } from 'react-toastify';
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import ManageAddresses from '../../Components/ManageAddresses/ManageAddresses';
import AddingNewAddress from '../../Components/AddingNewAdress/AddingNewAddress';
import backendRoutesAPI from '../../BackendAPI/API';
import { formattedCurrency } from '../../HelperFiles/HelperFunction';
import { getCurrentUserCartDetail} from '../../Store/cartSlice';
const razaorpaykey = import.meta.env.VITE_RAZORPAY_KEY_ID

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

function ChecckOutpage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let cartData = useSelector((state) => state?.addTocart)
  let allProduct = cartData?.items
  const customer = useSelector((state) => state?.customer?.customer)
  const fullName = `${customer?.firstName !== undefined ? customer?.firstName : 'User'} 
                    ${customer?.middleName !== undefined ? customer?.middleName : ''} 
                    ${customer?.lastName !== undefined ? customer?.lastName : ''}`
  const [totalCartPrice, setTotalCartPrice] = useState(0)
  const [totalCostPrice, setTotalCostPrice] = useState(0)
  const [addingAddress, setaddingAddress] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState('')
  const [paymentInitiated,setPaymentInitiated] = useState(false)


  const formatAddress = (address) => {
    const getAddressComponent = address.split('&');
    const fromatedAddress = {}
    getAddressComponent.map((item) => {
      const [key, value] = item.split('=')
      fromatedAddress[key] = value
    })
    return fromatedAddress;
  }

  // handle Payment Button
  const handlePaymentBtn = async () => {
    if (selectedAddress !== '') {
      const addressforDelivery = formatAddress(selectedAddress);
      if (addressforDelivery) {
        const response = await fetch(backendRoutesAPI.createOrder.url, {
          method: backendRoutesAPI.createOrder.method,
          credentials: 'include',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({ cartItems: allProduct })
        })
        const data = await response.json()
        if (data.success) {
          dispatch(setSteeperProgress(2))
          setPaymentInitiated(true)
          toast.success(data.message)
          const options = {
            key_id: `${razaorpaykey}`,
            amount: data.data.amount, // Amount in paise
            currency: "INR",
            name: "KIRANA-STORE",
            description: "THE PAYMENT YOU MADE IS NOT OFFICIAL",
            order_id: data.data.id,
            callback_url: backendRoutesAPI.verifyPayment.url,
            prefill: {
              name: fullName,
              email: customer.email,
              contact: addressforDelivery.mobileNumber,
            },
            notes: {
              fullAddress: addressforDelivery.fullAddress,
              pincode:addressforDelivery.pincode,
              name:addressforDelivery.name,
              mobileNumber:addressforDelivery.mobileNumber,
              alternateNumber:addressforDelivery?.alternateNumber,
              locality:addressforDelivery.locality,
              city:addressforDelivery.city,
              state:addressforDelivery.state,
            },
            theme: {
              color: "#006D77",
            },
            modal: {
              ondismiss: function () {
                setPaymentInitiated(false)
                dispatch(setSteeperProgress(1))
                toast.warning('Payment process was interrupted or canceled');
              },
            },
          }
          // Create Razorpay instance
          const rzp = new window.Razorpay(options);  
          rzp.open();
          rzp.on('payment.failed', function (response) {
            setPaymentInitiated(false)
            dispatch(setSteeperProgress(1))
            toast.error('Payment failed');
          });
        }
      }
    }
    else {
      toast.warning('Please Select the address')
    }
  }
  // Update the prices when product list changes
  useEffect(() => {

    if (allProduct?.length > 0) {
      setTotalCartPrice(allProduct.reduce((acc, item) => acc + item.product.productSellingPrice * item.quantity, 0))
      setTotalCostPrice(allProduct.reduce((acc, item) => acc + item.product.productListingPrice * item.quantity, 0))
    }
    else {
      setTotalCartPrice(0)
      setTotalCostPrice(0)
    }
  }, [allProduct])

  useEffect(() => {
    if (allProduct.length === 0) {
      toast.warning('Add Some Items to Cart')
      navigate('/')
    }
    if(customer){
      dispatch(getCurrentUserCartDetail())
    }
  }, [])


  return (
    <>
      <div className='relative flex flex-col gap-4px-32 py-5 rounded-lg'>
        <div className="mx-auto my-4 w-full md:my-6">
          <div className="overflow-hidden  rounded-xl shadow">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Contact Info */}
              <div className="px-3 py-6 text-gray-900 md:px-8">
                <div className="flow-root">
                  <div className="-my-6 divide-y divide-gray-200">
                    <div className="py-6">
                      <div className="mx-auto max-w-2xl lg:max-w-none lg:px-0">
                        <div className='flex  items-start justify-start bg-[#fff] w-full shadow-md rounded-md p-2'>
                          <div className='p-1'>
                            <span className='bg-[#006D77] py-0.15 px-2 rounded-md shadow-lg text-white font-semibold'>
                              1
                            </span>
                          </div>
                          <section className='flex justify-between items-center align-middle w-full'>
                            <h1 className='w-full text-lg font-bold flex flex-col mx-0 gap-1'>
                              <div className='flex gap-2 items-center px-2 text-slate-400'>
                                LOGIN
                                {
                                  customer && <span className='text-base font-normal text-green-500' ><FaCheck /></span>
                                }
                              </div>
                              <div className='w-full px-2 capitalize text-sm text-black/60 font-bold'>
                                <p>{fullName.toUpperCase()}</p>
                              </div>
                            </h1>
                          </section>
                        </div>
                        <div className='flex mt-3 items-start justify-start bg-[#fff] w-full shadow-md rounded-md p-2'>
                          <div className='p-1'>
                            <span className='bg-[#006D77] py-0.15 px-2 rounded-md shadow-lg text-white font-semibold'>
                              2
                            </span>
                          </div>
                          {
                            customer?.address.length === 0 ? <ManageAddresses /> :
                              <section className='flex flex-col justify-between items-center align-middle w-full'>
                                <h1 className='w-full text-lg font-bold flex flex-col mx-0 gap-1 mb-2'>
                                  <div className='flex justify-between items-center gap-2  px-2 text-slate-400'>
                                    <section className='flex justify-start items-center gap-2'>
                                      ADDRESS DETAILS
                                      {
                                        customer?.address.length > 0 && <span className='text-base font-normal text-green-500' ><FaCheck /></span>
                                      }
                                    </section>
                                    <section>
                                      <Tooltip title="Add New Address">
                                        <IconButton className='group' onClick={() => setaddingAddress(true)}>
                                          <IoMdAddCircleOutline className='bg-[#006D77] rounded-full text-2xl cursor-pointer text-white hover:scale-125 transition-all' />
                                        </IconButton>
                                      </Tooltip>
                                    </section>
                                  </div>
                                </h1>
                                {customer?.address.length > 0 &&
                                  <div className='w-full px-2 capitalize text-sm text-black/60 font-bold'>
                                    <ThemeProvider theme={themeforRadioButton}>
                                      <FormControl className='gap-2 mt-2 w-full'>
                                        <FormLabel id="demo-controlled-radio-buttons-group">{customer?.address.length > 1 ? 'Choose One Adsress' : null}</FormLabel>
                                        <RadioGroup
                                          row
                                          aria-labelledby="demo-controlled-radio-buttons-group"
                                          name="selectedAddress"
                                          className='flex gap-4 mt-2 w-full'
                                          value={selectedAddress}
                                          onChange={(e) => setSelectedAddress(e.target.value)}
                                        >
                                          {
                                            customer?.address.map((address, index) => {
                                              return (
                                                <FormControlLabel key={index}
                                                  className='w-full'
                                                  value={
                                                    `name=${address.name}&mobileNumber=${address.mobileNumber}&${address.alternateNumber !== undefined ? `alternateNumber=${address?.alternateNumber}&` : ''}fullAddress=${address.fullAddress}&locality=${address.locality}&city=${address.city}&state=${address.state}&pincode=${address.pincode}`}
                                                  control={<Radio />}
                                                  label={
                                                    <>
                                                      <div className='flex flex-col w-full p-2'>
                                                        <p><b>{address.name}</b> - <b>{address.mobileNumber}</b><b>{address.alternateNumber !== undefined ? `/${address?.alternateNumber}` : ''}</b></p>
                                                        {`${address.fullAddress}, ${address.locality}, ${address.city}, ${address.state} - `}
                                                        <b>{address.pincode}</b>
                                                      </div>
                                                    </>
                                                  }
                                                />)

                                            })}
                                        </RadioGroup>
                                      </FormControl>
                                    </ThemeProvider>
                                  </div>}
                              </section>
                          }
                        </div>
                        <div className="mt-10 flex justify-between items-center border-t border-gray-200 pt-6">
                          <button
                            type="button"
                            onClick={() => {
                              dispatch(setSteeperProgress(0))
                              navigate('/yourcart')
                            }}
                            className="rounded-md bg-[#006D77] px-3 py-2 text-sm font-semibold flex gap-2 items-center justify-center
                              text-[#EDF6F9] shadow-sm hover:bg-[#fff] hover:text-[#006D77] focus-visible:outline 
                                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006D77]"
                          >
                            <FaArrowLeft /> Go To Cart
                          </button>
                          <button
                            type="button"
                            onClick={handlePaymentBtn}
                            className="rounded-md bg-[#006D77] px-3 py-2 text-sm font-semibold flex justify-center items-center gap-2
                                    text-[#EDF6F9] shadow-sm hover:bg-[#fff] hover:text-[#006D77] focus-visible:outline 
                                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006D77]"
                          >
                            Make payment <FaArrowRight />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Product List */}
              <div className="bg-[#b5e7e4b4] px-5 py-6 md:px-8">
                <h1 className='mb-4 text-xl gap-3 font-bold flex mx-0'><span className='bg-white py-0.15 px-2 rounded-md shadow-lg text-[#006D77] font-semibold'>
                  3
                </span>Order Summary
                </h1>
                <hr className='py-0.5 mb-4' />
                <div className="flow-root px-6">
                  <ul className="-my-7 divide-y divide-gray-200">
                    {allProduct.map((product) => (
                      <li
                        key={product?.product?._id}
                        className="flex items-stretch justify-between space-x-5 py-7"
                      >
                        <div className="flex flex-1 items-stretch">
                          <div className="flex-shrink-0">
                            <img
                              className="h-24 w-24 rounded-lg border border-gray-200 bg-white object-contain"
                              src={product?.product?.productImage[0]}
                              alt={product?.product?.productName}
                            />
                          </div>
                          <div className="ml-5 flex flex-col justify-between">
                            <div className="flex-1">
                              <p className="text-base capitalize font-medium">{product?.product?.productName}</p>
                            </div>
                            <p className="mt-4 text-xs font-medium ">x {product.quantity}</p>
                          </div>
                        </div>
                        <div className="ml-auto flex flex-col items-end justify-between">
                          <p className="text-base font-medium text-gray-500 line-through">
                            {formattedCurrency(product.product.productListingPrice)}
                          </p>
                          <p className="text-lg font-medium text-[#000]">
                            &nbsp;&nbsp;{formattedCurrency(product.product.productSellingPrice)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <hr className='mt-4 bg-black' />
                <ul className="mt-6 space-y-3 px-6">
                  <li className="flex items-center justify-between text-black">
                    <p className="text-base font-medium">Total Cost Price</p>
                    <p className="text-lg text-[#000] font-medium">{formattedCurrency(totalCostPrice)}</p>
                  </li>
                  <li className="flex items-center justify-between text-black">
                    <p className="text-base font-medium">Discount Applied</p>
                    <p className="text-base text-red-500 font-medium"> -{formattedCurrency(totalCostPrice - totalCartPrice)}</p>
                  </li>
                  <li><hr className='my-2' /></li>
                  <li className="flex items-center justify-between text-black">
                    <p className="text-base font-medium ">Total</p>
                    <p className="text-lg text-[#000] font-bold ">{formattedCurrency(totalCartPrice)}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        addingAddress && <AddingNewAddress close={() => setaddingAddress(false)} />
      }
      {
        paymentInitiated && <div className='absolute top-0 bottom-0 right-0 left-0 bg-slate-400 opacity-30'></div>
      }
    </>
  )
}

export default ChecckOutpage
