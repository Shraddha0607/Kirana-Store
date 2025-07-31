import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import backendRoutesAPI from '../BackendAPI/API'
import OrderDetailView from '../Components/ShowProductDetailInOrderPage/OrderDetailView'
import { formatDate } from '../HelperFiles/HelperFunction'
import Lottie from "lottie-react";
import spinner from '../assets/orderDetialLoader.json'
import nodata from '../assets/NodataIsAvailaable.json'

function CustomerOrderPage() {
  const customer = useSelector((state) => state?.customer?.customer)
  const [orderDetail, setorderDetail] = useState()
  const [showCurrentProdctDetail, setShowCurrentProductDetail] = useState(null)
  const [fetchingData, setfetchingData] = useState(false)
  const getOrderDeatil = async () => {
    const response = await fetch(backendRoutesAPI.getCurrentCustOrderDetail.url, {
      method: backendRoutesAPI.getCurrentCustOrderDetail.method,
      credentials: 'include'
    })
    const data = await response.json()
    if (data.success) {
      if (data.data) {
        console.log('Deatil of Order', data.data)
        setorderDetail(data.data)
        setfetchingData(false)
      }
    }
    else {
      toast.error(data.message)
      setfetchingData(false)
    }
  }

  useEffect(() => {
    if (customer) {
      setfetchingData(true)
      getOrderDeatil()
    }
  }, [customer])
  return (
    <div className='container gap-4 p-4'>
      {
        fetchingData
          ?
          <div className='h-[80vh] flex justify-center items-center flex-col w-full bg-white p-4'>
            <div className='h-96 w-96'>
              <Lottie animationData={spinner} loop={true} />
            </div>
            <h1 className='w-full text-center text-5xl text-[#006D77] '>Fetching Your Data. Plaese Wait!..</h1>
          </div>
          :
          <div>
            {
              orderDetail?.length > 0
                ?
                <div className='w-full flex-shrink-0 flex flex-col p-5 rounded-lg shadow-lg bg-white gap-3'>
                  <h1 className='w-full flex justify-start text-5xl text-[#006D77] '>Your Orders</h1>
                  <hr className='mt-2' />
                  {
                    orderDetail?.map((order, index) => {
                      return (
                        <div className='flex flex-col w-full border p-2' key={index + order._id}>
                          <div className='grid grid-cols-12 sm:flex justify-between items-center px-2'>
                            <div className='flex flex-col col-span-10'>
                              <h1 className='md:text-lg gap-4 sm:text-sm font-semibold'>Order ID : {order?._id}</h1>
                              <span className='text-sm flex justify-start sm:justify-end'>{formatDate(order?.createdAt)}</span>
                            </div>

                            <p className='col-span-2 sm:text-center text-right text-blue-500 hover:underline text-sm font-semibold cursor-pointer hover:scale-105'
                              onClick={() => setShowCurrentProductDetail(index)}
                            >
                              Order Detail
                            </p>
                          </div>
                          <hr className='border-black mt-2'></hr>
                          <div className='mt-2 py-2 px-4 grid gap-2  grid-cols-12 items-center sm:flex h-fit justify-between'>
                            <div className='flex gap-6 md:flex-row flex-col col-span-4'>
                              {
                                order?.orderItems?.map((item, index) => {
                                  return (
                                    <div className='h-20 w-20 flex-shrink-0 ' key={index} >
                                      <img src={item?.productId?.productImage[0]} alt='Image' />
                                    </div>
                                  )
                                })
                              }
                            </div>
                            <ul className='grid-cols-2 sm:flex justify-center items-end flex-col col-span-8'>
                              <li className='text-left'>Status : <span className='text-green-600 font-semibold capitalize'>{order?.orderStatus}</span></li>
                              <li className='text-left'>Payment : <span className='text-green-600 font-semibold capitalize'>Prepaid</span></li>
                            </ul>
                          </div>
                          {
                            showCurrentProdctDetail === index &&
                            <OrderDetailView order={order} onClose={() => setShowCurrentProductDetail(null)} />
                          }
                        </div>
                      )
                    })
                  }
                </div>
                :
                <div className='h-[80vh] flex flex-col w-full bg-white p-4'>
                  <h1 className='w-full flex justify-start text-5xl text-[#006D77] '>Your Orders</h1>
                  <hr className='mt-2' />
                  <div className='h-[80%] flex justify-center items-center w-full mt-10'>
                    <div className='h-[36rem] w-[36rem] flex-shrink'>
                      <Lottie animationData={nodata} loop={true} />
                    </div>
                  </div>
                </div>
            }
          </div>

      }
    </div>
  )
}

export default CustomerOrderPage
