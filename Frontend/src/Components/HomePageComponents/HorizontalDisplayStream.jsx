import React, { useEffect, useState } from 'react'
import { IoChevronForwardCircle } from "react-icons/io5";
import backendRoutesAPI from '../../BackendAPI/API';
import { IoChevronForward } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

function HorizontalDisplayStream({ subcategory, heading }) {
  const [subCategoryWiseProduct, setSubCategoryWiseProduct] = useState([])
  const [horizontalSlideCount, setHorizontalSlideCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const loadingScreen = new Array(8).fill(null)
  const [isError, setIsError] = useState(false)
  const navigator = useNavigate()
  const[slideWidth,setSlideWidth]=useState(100)
  const [maxHorizontalSlideCount,setMaxHorizontaSlideCount]=useState(3)

  const getProductData = async () => {
    setIsLoading(true)
    const backendResponse = await fetch(backendRoutesAPI.homePageAPI.subCategoryWiseProduct.url, {
      method: backendRoutesAPI.homePageAPI.subCategoryWiseProduct.method,
      headers: {
        'content-type': "application/json"
      },
      body: JSON.stringify({ subcategory: subcategory })
    })
    const finalRes = await backendResponse.json()
    if (finalRes.success) {
      setSubCategoryWiseProduct(finalRes.data)
      setIsError(false)
      setIsLoading(false)
    }
    else {
      setIsError(true)
      setIsLoading(false)
    }
  }
  const formattedCurrency = (number) => {
    return (
      number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'INR', // Change to your desired currency code
      }))
  }
  const handleForwardMoveButtonInHorizontalSlide = () => {
    if (horizontalSlideCount !== maxHorizontalSlideCount) {
      setHorizontalSlideCount(horizontalSlideCount + 1)
    }
  }
  const handleBackwardMoveButtonInHorizontalSlide = () => {
    if (horizontalSlideCount !== 0) {
      setHorizontalSlideCount(horizontalSlideCount - 1)
    }
  }

  useEffect(() => {
    getProductData()
    if(window.innerWidth>=768 && window.innerWidth<=1023){
      setMaxHorizontaSlideCount(7)
    }
    else if(window.innerWidth>=1024 && window.innerWidth<=1279){
      setMaxHorizontaSlideCount(6)
    }
    else if(window.innerWidth>=1280  && window.innerWidth<=1535)
    {
      setMaxHorizontaSlideCount(5)
    }
    else if(window.innerWidth>=1536 ){
      setMaxHorizontaSlideCount(4)
    }
  }, [])

  return (
    <>
      {
        isError ? null :
          <div className='bg-white shadow mt-6'>
            <div className='py-4 relative'>
              <div className=' px-4 mb-3 flex justify-between items-center'>
                <div className='text-2xl font-semibold title select-none'>{heading}</div>
                <div className='text-3xl text-[#006D77] h-fit w-fit cursor-pointer hover:scale-125 transition-all'
                      onClick={()=>{window.open(`products/deals/${subcategory}`)}}
                >
                  <IoChevronForwardCircle />
                </div>
              </div>
              {/* Slide Buttons */}
              {
                isLoading ? null : (
                  subCategoryWiseProduct.length !== 9 ? null : (
                    <div className='z-30 h-fit w-full md:flex justify-between absolute top-[40%]  items-center hidden'>
                      <div onClick={handleBackwardMoveButtonInHorizontalSlide}
                        className='text-2xl text-white h-24 w-8 flex justify-center shadow-md cursor-pointer
                                                                  items-center edgeRound-left bg-[#006D77]'
                        style={{
                          visibility: `${horizontalSlideCount === 0 ? `hidden` : `visible`}`
                        }}
                      ><IoIosArrowBack /></div>
                      <div onClick={handleForwardMoveButtonInHorizontalSlide}
                        className='text-2xl text-white h-24 w-8 flex justify-center  shadow-md cursor-pointer
                                                                  items-center edgeRound-right bg-[#006D77]'
                        style={{
                          visibility: `${horizontalSlideCount === maxHorizontalSlideCount ? `hidden` : `visible`}`,
                          right: '0'
                        }}
                      > <IoChevronForward /></div>
                    </div>
                  )
                )
              }
              {/* Products List */}
              <div className='mainProductDivCinatiner bg-[#fff] h-[500px] md:h-fit hidden-scrollbar overflow-y-auto relative flex gap-6 px-4 py-2 overflow-hidden'>
                {
                  isLoading ? (
                    loadingScreen.map((_, index) => {
                      return (
                        <div key={index}>
                          <div className='flex flex-nowrap md:flex-col sm:flex-row  border p-[6px] justify-center items-center rounded-md transition-all group' key={index}>
                            <div id='productImage' className='w-full md:h-[220px] md:min-w-[200px] sm:h-[64px] sm:max-w-[64px] cursor-pointer'>
                              <img src='' className='h-full w-full object-scale-down cursor-pointer bg-slate-200 animate-pulse' />
                            </div>
                            <div id='productDetail' className=' ml-2 flex flex-col justify-center items-center p-4 gap-4'>
                              <div className='w-48 p-3 animate-pulse bg-slate-200 rounded-full'></div>
                              <div className='w-48 p-3 animate-pulse bg-slate-200 rounded-full'></div>
                            </div>
                          </div>
                        </div>)
                    })
                  ) : (
                    subCategoryWiseProduct.map((product, index) => {
                      return (
                        <div key={index}>
                          <div className='md:flex md:flex-nowrap md:justify-start md:flex-col border p-[6px] rounded-md grid grid-cols-12
                                          transition-all group select-none' 
                                onClick={() => { navigator(`/productDetail/${product._id}/view`) }} 
                                key={product._id}
                                style=
                                  {
                                    {
                                      transform: `translateX(-${horizontalSlideCount * 98}%)`,
                                      transitionProperty: 'transform',
                                    }
                                  }
                          >
                            <div id='productImage' className='md:h-[220px] md:min-w-[220px] sm:h-[102px] sm:max-w-[102px] h-[7rem] col-span-3 cursor-pointer'>
                              <img src={product.productImage[0]} className='h-full w-full object-scale-down hover:scale-110 transition-all cursor-pointer' />
                            </div>
                            <div id='productDetail' className='w-full ml-2 col-span-9 flex flex-col justify-start py-2 items-start gap-2 md:items-center'>
                              <div className='md:text-lg sm:text-base w-full select-none text-clip md:line-clamp-1  capitalize px-2'>{product.productName}</div>
                              <div className='md:text-lg sm:text-base w-full font-semibold select-none px-2'>Just {formattedCurrency(product.productSellingPrice)} </div>
                              <div className='md:text-lg sm:text-base w-full text-red-500 select-none px-2 animate-bounce'>Discount {Math.round(((product?.productListingPrice - product?.productSellingPrice)/product?.productListingPrice)*100)} % </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )
                }
              </div>
            </div>
          </div>
      }
    </>
  )
}

export default HorizontalDisplayStream
