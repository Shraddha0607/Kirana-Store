import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";
import { toast } from 'react-toastify'
import backendRoutesAPI from '../BackendAPI/API'
import { FaCartArrowDown } from "react-icons/fa6";
import { BsFillBagHeartFill } from "react-icons/bs";
import { IoStar } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux"
import { setProductDetail, saveCartItems } from '../Store/cartSlice';
import { formattedCurrency, formatDate } from '../HelperFiles/HelperFunction';
import ReviewForm from '../Components/ReviewForm/ReviewForm';
import { setSteeperProgress } from '../Store/steeperStepSlice';

function ProductDetailPage() {
  const params = useParams()
  const dispatch = useDispatch()
  const naviagte = useNavigate()
  const currentCustomer = useSelector((state) => state?.customer?.customer)
  const cart = useSelector((state) => state?.addTocart?.items)
  const [productInfo, setProductInfo] = useState({})
  const [isLoading, setIsloading] = useState(false)
  const [openReviewForm, setOpenReviewForm] = useState(false)
  const [showMoreDescription, setShowMoreDescription] = useState(false)
  const [activeImage, setActiveImage] = useState('')
  const sideImage = new Array(5).fill(null)
  const navigate = useNavigate()
  const id = params.id
  
  const getCurrentProductData = async () => {
    setIsloading(true)
    const backendResponse = await fetch(backendRoutesAPI.admin.getCurrentProduct.url, {
      method: backendRoutesAPI.admin.getCurrentProduct.method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ _id: id })
    })
    const finalRes = await backendResponse.json()
    if (finalRes.success) {
      setProductInfo({ ...finalRes.data })
      setActiveImage(finalRes.data.productImage[0])
      setIsloading(false)
    }
    else {
      toast.error(finalRes.message)
      navigate('/')
    }
  }
  const addToCartButtonAction = async (e) => {
    e.preventDefault()
    if (currentCustomer) {
      if (cart.length > 0) {
        const conatinsProduct = cart.find((item) => item.product._id.toString() === productInfo._id.toString())
        if (conatinsProduct === undefined) {
          dispatch(setProductDetail(productInfo))
          dispatch(saveCartItems(productInfo))
        }
        else {
          toast.warning(`${productInfo.productName} is already in the cart`)
          naviagte('/yourcart')
        }
      }
      else {
        dispatch(setProductDetail(productInfo))
        dispatch(saveCartItems(productInfo))
      }
    }
    else {
      naviagte('/login')
    }
  }

  const handleBuyProductBtn = () => {
    if (currentCustomer) {
      dispatch(setProductDetail(productInfo))
      dispatch(saveCartItems(productInfo))
      dispatch(setSteeperProgress(1))
      navigate('/yourcart/checkout')
    }
    else {
      navigate('/login')
    }
  }

  useEffect(() => {
    getCurrentProductData()
  }, [])

  useEffect(() => {
    getCurrentProductData()
  }, [id, openReviewForm])

  return (
    <div className='px-6 py-8 bg-[#EDF6F9] '>
      <div className='flex justify-evenly w-full  gap-4 displayMainConatinare'>
        <div className='flex lg:flex-row-reverse gap-4 justify-evenly imageDisplayDiv relative'>
          {/* Image View  Section */}
          <>
            {
              isLoading ? (
                <div className='h-[30rem] w-full max-w-[30rem] rounded-xl shadow-xl bg-slate-200 animate-pulse p-1'>
                </div>
              ) : (
                <div className='h-full max-h-[30rem] w-full max-w-[30rem] rounded-xl shadow-xl activeImageDiv'>
                  <img src={activeImage} className='h-full w-full transition-all object-scale-down mix-blend-multiply 
                                                      rounded-xl cursor-pointer' />
                </div>
              )
            }
          </>
          {/* Side Images Section */}
          <div className=' h-full max-h-[30rem] w-fit p-2 flex flex-col gap-2 hidden-scrollbar2 overflow-scroll  rounded-md sideImasgesDisplay'>
            {
              isLoading ? (
                sideImage.map((_, index) => {
                  return (
                    <div className='h-20 w-20 bg-slate-200 p-1 animate-pulse' key={index}></div>
                  )
                })
              ) : (
                productInfo?.productImage?.map((imageUrl, index) => {
                  return (
                    <div className='h-24 w-24  cursor-pointer group allSideImages' key={index}
                      onMouseEnter={() => { setActiveImage(imageUrl) }}
                      onTouchMove={() => { setActiveImage(imageUrl) }} >
                      <img src={imageUrl} className='h-full w-full object-scale-down' />
                    </div>
                  )
                })
              )
            }
          </div>
        </div>
        {/* Image Zoom Display */}

        {/* Product Detail's */}
        <div className='w-full max-w-[44rem] px-2 productDescriptionConatiner'>
          <p className='bg-[#006D77] inline-block mb-1 text-white text-center px-3 py-1 capitalize text-2xl rounded-full font-semibold productBrand'>{productInfo.productBrand}</p>
          <p className='productName text-4xl capitalize font-bold mb-1'>{productInfo.productName}</p>
          <p className='text-lg text-slate-400 font-semibold mb-1 caiptalize'>{productInfo.subcategory}</p>
          {/* Total Rating Section */}
          <div className='flex justify-start items-center'>
            Rating:{productInfo?.rating}
            <p className='text-slate-400 text-sm'>({productInfo?.numReviews > 1 ? `${productInfo?.numReviews} customers reviewed` : `${productInfo?.numReviews} customer reviewed`})</p>
          </div>
          <div className="flex flex-col justify-start align-middle mt-3 mb-2">
            <div className='flex align-middle gap-2 items-center mb-2'>
              <p className='text-3xl font-light text-[red]'>{-Math.round(((productInfo.productListingPrice - productInfo.productSellingPrice) / productInfo.productListingPrice) * 100)}%</p>
              <p className='text-3xl font-bold '>{productInfo.productSellingPrice !== undefined ? formattedCurrency(productInfo.productSellingPrice) : null}</p>
            </div>
            <p className='text-sm font-medium text-slate-400'>
              <span className='mr-1 '>M.R.P:</span>
              <span className='line-through'>{productInfo.productListingPrice !== undefined ? formattedCurrency(productInfo.productListingPrice) : null}</span></p>
          </div>
          {/* Action Button Section */}
          <div className='w-full mt-4'>
            <div className='w-full flex justify-between gap-2 p-2'>
              <button className='w-full flex justify-evenly items-center p-2 text-xl font-medium text-[#fff]
                                                 bg-green-500 rounded-xl border-2 border-[#fff]  addToCartBtn
                                                 hover:bg-white hover:text-green-500 hover:border-2 hover:border-green-500'
                onClick={addToCartButtonAction}>
                <p>Add To Cart</p><span className='text-2xl'><FaCartArrowDown /></span>
              </button>
              <button className='w-full flex justify-evenly items-center p-2 text-xl font-medium text-[#fff]
                                                 bg-blue-500 rounded-xl border-2 border-[#fff]  buyTheProductBtn
                                                 hover:bg-white hover:text-blue-500 hover:border-2 hover:border-blue-500'
                onClick={(e) => {
                  e.preventDefault()
                  handleBuyProductBtn()
                }}
              >
                <p>Buy The Product</p> <span className='text-2xl'><BsFillBagHeartFill /></span>
              </button>
            </div>
          </div>
          {/* Product Description */}
          <p className={`mt-2 flex flex-col  text-sm mb-2 text-justify`}>
            {
              showMoreDescription ? productInfo.productDescription : productInfo?.productDescription?.slice(0, 100)
            }
            {
              productInfo?.productDescription?.length > 100 &&
              (showMoreDescription ? <span className='cursor-pointer font-bold hover:text-blue-600 select-none' onClick={() => { setShowMoreDescription(!showMoreDescription) }}>Show Less...</span>
                : <span className='cursor-pointer font-bold hover:text-blue-600 select-none' onClick={() => { setShowMoreDescription(!showMoreDescription) }}>Read More...</span>)
            }
          </p>
          {/* Add Review section */}
        </div>
      </div>
      <div className='w-full p-2 mt-3 gap-4'>
        <div className='w-full flex justify-between items-center'>
          <h1 className='text-3xl font-semibold'>Product Reviews</h1>
          <button className='px-3 py-1  font-medium bg-slate-200 text-[#006D77]'
            onClick={(e) => {
              e.preventDefault()
              console.log(currentCustomer)
              if (currentCustomer === null) {
                toast.warning('Login To Add Review')
                naviagte('/login')
              }
              else {
                setOpenReviewForm(!openReviewForm)
              }
            }}
          >
            Add Review
          </button>
        </div>
        <div className='flex flex-col p-3 gap-3 w-full h-96 bg-[#EDF6F9]'>
          {
            productInfo?.productReview?.map((review, index) => {
              return (
                <div className='flex h-fit flex-col px-2 py-2 border rounded-md shadow-md select-none' key={index}>
                  <div className='flex justify-between  items-center py-1'>
                    <div className='flex gap-3 items-center justify-center'>
                      <span className='text-3xl text-[#006D77]'><FaUserCircle /></span>
                      <span>
                        <p className='text-md font-semibold capitalize'>{review.customer?.firstName} {review.customer?.middleName}{review.customer?.lastName}</p>
                        <p className='text-sm'>{formatDate(review.reviewDate)}</p>
                      </span>
                    </div>
                    <p className='text-xl flex text-yellow-400'>
                      {
                        [...Array(review.rating)].map((_, index) => {
                          return (
                            <IoStar key={index} />
                          )
                        })
                      }
                    </p>
                  </div>
                  <hr></hr>
                  <p className='mt-2 px-5 text-lg capitalize'>{review.comment}</p>
                </div>
              )
            })
          }
        </div>
      </div>
      {
        openReviewForm && <ReviewForm onClose={() => setOpenReviewForm(option => !option)} productId={productInfo._id}
        />
      }
    </div>
  )
}

export default ProductDetailPage
