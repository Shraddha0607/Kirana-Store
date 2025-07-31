import React, { useEffect, useState } from 'react'
import { formatDate, formattedCurrency } from '../../HelperFiles/HelperFunction'
import { MdClose } from "react-icons/md";

function OrderDetailView({ order, onClose }) {
  const [costPrice, setCostPrice] = useState(0)
  const calculateCostPrice = () => {
    const price = order?.orderItems?.reduce((acc, item) => { return (acc + (item?.productId?.productListingPrice * item?.quantity)) }, 0)
    setCostPrice(price)
  }
  useEffect(() => {
    calculateCostPrice()
  }, [])
  return (
    <div className='absolute bg-slate-500 bg-opacity-30 top-0 right-0 left-0 bottom-0 flex justify-center items-start p-10'>
      <div className='bg-[#EDF6F9]  p-10 z-40 rounded-xl shadow-lg'>
        <div className='w-full flex justify-end mr-4 '>
          <MdClose className='bg-red-600 text-[#EDF6F9] text-xl cursor-pointer rounded-full' onClick={() => onClose()} />
        </div>
        <div className='flex flex-col gap-2 lg:gap-2 lg:grid lg:grid-cols-12 mt-3 bg-[#EDF6F9] rounded-lg shadow-md'>
          <div className='w-full min-w-[200px]px-1 col-span-6 rounded-lg bg-[#fff]'>
            <h1 className=' text-lg font-medium px-1'>Delivery Address</h1>
            <h1 className='font-medium text-sm mt-2 px-2 capitalize '>{order?.shippingAddress?.name.toLowerCase()}</h1>
            <h1 className='text-sm mt-2 px-2 capitalize '>{order?.shippingAddress?.address}</h1>
            <h1 className='text-sm  px-2 capitalize '>{order?.shippingAddress?.city}&nbsp;-{order?.shippingAddress?.pincode},&nbsp;{order?.shippingAddress?.state},&nbsp;{order?.shippingAddress?.country}</h1>
            <h1 className='font-medium text-sm mt-2 px-2 capitalize '>Phone Number</h1>
            <h1 className='text-sm px-2 capitalize '>{order?.shippingAddress?.mobileNumber}&nbsp;{order?.shippingAddress?.alternateNumber !== 'Not Given' ? `,${order?.shippingAddress?.alternateNumber}` : ''}</h1>
          </div>
          <div className=' col-span-6 bg-[#fff] rounded-lg'>
            <h1 className=' text-lg font-medium px-1'>Payment Detail</h1>
            <h1 className='font-medium text-sm mt-2 px-2 capitalize '>{order?.paymentDetails?.paymentMethod.toLowerCase()}</h1>
            <h1 className='text-sm mt-1 px-2 capitalize '>Via&nbsp; - &nbsp;{order?.paymentDetails?.paymentMethodName}</h1>
            <h1 className='text-sm px-2 capitalize '>Status&nbsp; - &nbsp;{order?.paymentDetails?.paymentStatus}</h1>
            <h1 className='font-medium text-sm mt-2 px-2 capitalize '>Payment Id & Date</h1>
            <h1 className='text-sm px-2 capitalize '>{order?.paymentDetails?.paymettransId}</h1>
            <h1 className='text-sm px-2 capitalize '>{formatDate(order?.paymentDetails?.paymentTime)}</h1>
          </div>

        </div>
        <div className='flex flex-col gap-2 mt-3'>
          <h1 className='text-base font-medium p-2'>Items Ordered</h1>
          {
            order?.orderItems?.map((item, index) => {
              return (
                <div className='p-2 w-full gap-1 flex justify-between ' key={index}>
                  <div className='h-20 w-20 object-cover flex-shrink-0 border'>
                    <img src={item?.productId?.productImage[0]} />
                  </div>
                  <div className='w-full p-1.5 gap-2'>
                    <p className='text-base text-ellipsis font-semibold line-clamp-1'>{item?.productId?.productName.toUpperCase()}</p>
                    <p className='text-sm  flex justify-between items-center font-normal text-slate-600'>x&nbsp;{item?.quantity}
                      <span className='text-base font-semibold text-red-600'>{formattedCurrency(item?.productId?.productSellingPrice)}</span>
                    </p>
                    <p className='text-sm flex justify-end font-semibold text-slate-600 line-through'>{formattedCurrency(item?.productId?.productListingPrice)}</p>
                  </div>
                </div>
              )
            })
          }
          <hr></hr>
          <div className='w-full px-2 flex flex-col justify-between'>
            <p className='w-full flex justify-between text-lg text-slate-600'><span>Cost Price :</span> <sapn className='line-through'>{formattedCurrency(costPrice)}</sapn></p>
            <p className='w-full flex justify-between text-base text-green-600'><span>Discount Price :</span> <sapn> - {formattedCurrency(costPrice - order?.totalAmount)}</sapn></p>
            <hr className='border-black px-4'></hr>
            <p className='w-full flex justify-between text-lg text-red-600'><span>Order Price :</span> <span className='font-bold'>{formattedCurrency(order?.totalAmount)}</span></p>

          </div>
        </div>
      </div>


    </div>
  )
}

export default OrderDetailView
