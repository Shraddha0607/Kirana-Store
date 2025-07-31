import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import backendRoutesAPI from '../../BackendAPI/API'
import { formatDate, formattedCurrency } from '../../HelperFiles/HelperFunction'
import { setSteeperProgress } from '../../Store/steeperStepSlice'


function OrderStatus() {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [orderDetail, setOrderDetail] = useState({})
  const getOrderData = async () => {
    const response = await fetch(backendRoutesAPI.specificOrderDetail.url, {
      method: backendRoutesAPI.specificOrderDetail.method,
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ orderId: params.id })
    })
    const data = await response.json()
    console.log(data)
    if (data.success) {
      setOrderDetail(data.data)
      dispatch(setSteeperProgress(5))
    }
    else {
      toast.error(data.message)
      navigate('/')
      dispatch(setSteeperProgress(0))
    }
  }

  useEffect(() => {
    getOrderData()
  }, [])
  return (
    <div className="mx-auto my-4 sm:max-w-4xl md:my-6">
      <div className="overflow-hidden rounded-xl border border-gray-100 shadow">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product List */}
          <div className="px-5 py-6 md:border-r md:border-r-gray-200 md:px-8">
            <div className="flow-root">
              <ul className="-my-7 divide-y divide-gray-200">
                {orderDetail?.orderItems?.map((product) => (
                  <li
                    key={product.productId._id}
                    className="flex items-stretch justify-between space-x-5 py-7"
                  >
                    <div className="flex flex-1 items-stretch">
                      <div className="flex-shrink-0">
                        <img
                          className="h-24 w-24 rounded-lg border border-gray-200 object-contain"
                          src={product.productId.productImage[0]}
                          alt={product.imageSrc}
                        />
                      </div>

                      <div className="ml-5 flex flex-col justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900">{product.productId.productName}</p>
                        </div>
                        <p className="mt-4 text-sm font-medium text-gray-500">x{product.quantity}</p>
                      </div>
                    </div>
                    <div className="ml-auto flex flex-col items-end justify-between">
                      <p className="text-right text-sm font-bold text-gray-900">{formattedCurrency(product?.productId.productSellingPrice)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <hr className="mt-6 border-gray-600" />
              <ul className="mt-6 space-y-3">
                <li className="flex items-center justify-between">
                  <p className="text-base font-medium text-black">Total Order Price :</p>
                  <p className="text-sm font-bold ">{formattedCurrency(orderDetail?.totalAmount)}</p>
                </li>
              </ul>
            </div>
          </div>
          {/* Contact Info */}
          <div className="px-5 py-6 md:px-8">
            <div className="flow-root">
              <div className="-my-6 divide-y divide-gray-200">
                <div className="py-6 gap-3">
                  <h2 className="text-lg font-bold text-black">Contact Information</h2>
                  <p className="mt-3 text-sm text-gray-700"><b>Order Id : {orderDetail?._id}</b></p>
                  <p className="text-sm mt-1 font-bold text-gray-700">Date: {formatDate(orderDetail?.createdAt)}</p>
                </div>
                <div className="py-6 gap-2">
                  <h2 className="mb-2 text-lg font-bold text-black">Shipping Information</h2>
                  <p className="px-2 mt-3 text-sm text-gray-700 capitalize"><b>{orderDetail?.shippingAddress?.name.toLowerCase()}</b></p>
                  <p className="px-3 mt-1 text-sm font-semibold text-gray-700">+91-{orderDetail?.shippingAddress?.mobileNumber}</p>
                  <p className="px-3 mt-1 text-sm font-medium text-gray-700 capitalize gap-3">{orderDetail?.shippingAddress?.address}-&nbsp;&nbsp;&nbsp;<b>{orderDetail?.shippingAddress?.pincode}</b></p>
                  <p className="px-3 mt-1 text-sm font-medium text-gray-700 capitalize">{orderDetail?.shippingAddress?.city},&nbsp;{orderDetail?.shippingAddress?.state},&nbsp;{orderDetail?.shippingAddress?.country.toLowerCase()}</p>
                </div>
                <div className="py-6">
                  <h2 className="text-lg font-bold text-black">Payment Information</h2>
                  <p className="mt-3 text-sm font-medium text-gray-700 capitalize"><b>Via {orderDetail?.paymentDetails?.paymentMethod}&nbsp;&nbsp;-&nbsp;&nbsp;{orderDetail?.paymentDetails?.paymentMethodName.toUpperCase()}</b></p>
                  <p className="mt-1 text-sm font-medium text-gray-700"><b>TransactionID : {orderDetail?.paymentDetails?.paymettransId}</b></p>
                  <p className="mt-1 text-sm font-medium text-gray-700"><b>Date: {formatDate(orderDetail?.paymentDetails?.paymentTime)}</b></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className='ml-4 mr-4 bg-slate-400'></hr>
        <button
          className='flex py-1.5 font-semibold px-4 bg-[#006D77] text-[#EDF6F9] text-lg mx-auto mb-3 mt-2 rounded-lg
                    hover:text-[#006D77] hover:bg-[#EDF6F9] hover:shadow-lg'
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
            dispatch(setSteeperProgress(0))
          }}
        >
          Go to Home Page
        </button>
      </div>
    </div>
  )

}

export default OrderStatus
