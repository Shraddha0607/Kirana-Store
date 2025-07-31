import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import backendRoutesAPI from '../../BackendAPI/API';
import { toast } from 'react-toastify';
import CartAnimation from '../../assets/CartAnimation.json'
import Lottie from "lottie-react"
import { decProductCount, incProductCount, removeItemFromCart } from '../../Store/cartSlice';
import { useNavigate } from 'react-router-dom';
import { setSteeperProgress } from '../../Store/steeperStepSlice'
import { formattedCurrency } from '../../HelperFiles/HelperFunction';
import Typed from 'typed.js';
import { getCurrentUserCartDetail} from '../../Store/cartSlice';

function AddToCartPage() {
  const customer = useSelector((state) => state?.customer?.customer)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let cartData = useSelector((state) => state?.addTocart)
  let allProduct = cartData?.items
  const [totalCartPrice, setTotalCartPrice] = useState(0)
  const [totalCostPrice, setTotalCostPrice] = useState(0)
  const [isProductCoutUpdating, setIsProductCountUpdating] = useState()
  const el = useRef(null);
  const options = {
    strings: ['Your Cart Is Empty !!!', 'Add Items To See In Cart !!!', "Grab Exciting Deal's !!!"], // Words to type
    typeSpeed: 30, // Typing speed in milliseconds
    backSpeed: 20,  // Backspace speed
    loop: true,     // Loop infinitely
    backDelay: 1500, // Delay before backspacing
    showCursor: false,
  };

  const increaseProductCount = (currProduct) => {
    const product = currProduct.product
    updateQunatity({ productId: product._id, action: 'inc' })
  }

  const decreaseProductCount = (currProduct) => {
    const product = currProduct.product
    const quantity = currProduct.quantity
    if (quantity > 1) {
      updateQunatity({ productId: product._id, action: 'dec' })
    }
    else {
      console.log('Product Removed From The Cart')
    }
  }
  const updateQunatity = async (data) => {
    const backendResponse = await fetch(backendRoutesAPI.updateCartProductCount.url, {
      method: backendRoutesAPI.updateCartProductCount.method,
      credentials: 'include',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
    const finalRes = await backendResponse.json()
    if (finalRes.success) {
      toast.success(finalRes.message)
      if (data.action === 'inc') {
        dispatch(incProductCount(data))
      }
      else {
        dispatch(decProductCount(data))
      }
      setIsProductCountUpdating(false)
    }
    else {
      toast.error(finalRes.message)
      setIsProductCountUpdating(false)
    }
  }
  useEffect(() => {

    if (allProduct?.length > 0) {
      setTotalCartPrice(allProduct.reduce((acc, item) => acc + item.product.productSellingPrice * item.quantity, 0))
      setTotalCostPrice(allProduct.reduce((acc, item) => acc + item.product.productListingPrice * item.quantity, 0))
    }
    else {
      setTotalCartPrice(0)
      setTotalCostPrice(0)
      if (allProduct.length === 0) {
        const typed = new Typed(el.current, options);
      }
    }
  }, [allProduct])

  //Typing animation
  useEffect(() => {
    if (allProduct.length === 0) {
      const typed = new Typed(el.current, options);
    }
  }, []);

  useEffect(()=>{
    if(customer){
      dispatch(getCurrentUserCartDetail())
    }
  },[customer])


  return (
    <div className="w-full mx-auto max-w-7xl px-2 lg:px-0 ">
      <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl relative">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="rounded-lg bg-white lg:col-span-8">
            {
              allProduct?.length > 0 ? (
                <ul role="list" className="divide-y divide-gray-200 p-2">
                  {
                    allProduct.map((product, index) => (
                      <div key={product.product._id} className="grid grid-cols-12 sm:flex sm:flex-row sm:justify-between sm:items-center">
                        <li className="flex py-2 px-4 sm:px-2 sm:py-6 gap-2 w-full col-span-12">
                          <div className="flex-shrink-0 shadow-xl">
                            <img
                              src={product?.product?.productImage[0]}
                              alt={product?.product?.productName}
                              className="sm:h-38 sm:w-38 h-28 w-28 ml-2 mr-2 rounded-md object-contain object-center"
                            />
                          </div>
                          <div className="w-full flex-shrink-0 flex flex-1 flex-col justify-between sm:ml-6 col-span-8 gap-3">
                            <div className="w-full flex flex-shrink-0 flex-col px-3">
                              <div>
                                <div className="w-full justify-between">
                                  <h3 className="text-xl w-full">
                                    <a href={`productDetail/${product.product._id}/view/${product.product.productName}`} className="font-semibold text-black capitalize md:text-xl">
                                      {product.product.productName}
                                    </a>
                                  </h3>
                                </div>
                                <div className="flex justify-between">
                                  <h3 className="text-sm">
                                    <p className="font-semibold text-slate-400 capitalize md:text-lg">
                                      ( {product.product.productBrand} )
                                    </p>
                                  </h3>
                                </div>
                                <div className="mt-2 + flex  items-baseline">
                                  <p className="text-xs font-medium text-gray-500 line-through">
                                    {formattedCurrency(product.product.productListingPrice)}
                                  </p>
                                  <p className="text-lg font-medium text-gray-900">
                                    &nbsp;&nbsp;{formattedCurrency(product.product.productSellingPrice)}
                                  </p>
                                  &nbsp;&nbsp;
                                  <p className="text-sm font-medium text-green-500">{ }</p>
                                </div>
                              </div>
                            </div>
                            <div className="mb-2 flex mr-4 gap-2">
                              <div className="w-full flex items-start justify-start ">
                                {
                                  isProductCoutUpdating === index ? (<div className='text-base font-bold'>Updating....</div>) : (
                                    <>
                                      <button type="button" className="h-8 w-8 text-2xl flex items-center justify-center "
                                        onClick={() => {
                                          setIsProductCountUpdating(index)
                                          decreaseProductCount(product)
                                        }
                                        }
                                        style={{ visibility: product.quantity === 1 ? 'hidden' : 'visible' }}>
                                        -
                                      </button>
                                      <input
                                        type="text"
                                        className="mx-1 h-9 w-9 rounded-md border text-center"
                                        value={product.quantity}
                                        readOnly
                                      />
                                      <button type="button" className="h-8 w-8 text-2xl flex items-center justify-center "
                                        onClick={() => {
                                          setIsProductCountUpdating(index)
                                          increaseProductCount(product)
                                        }}>
                                        +
                                      </button>
                                    </>
                                  )
                                }
                              </div>
                              <div className="ml-6 flex text-sm">
                                <button type="button" className="flex items-center gap-2 space-x-1 px-2 py-1 pl-0"
                                  onClick={() => dispatch(removeItemFromCart(product.product._id))}>
                                  {/* <FaRegTrashAlt size={12} className="text-red-500" /> */}
                                  <span className="text-md font-medium text-red-500">Remove</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      </div>
                    ))
                  }
                </ul>
              ) : (
                <>
                  <div className='flex flex-col justify-center py-5 gap-2'>
                    <div id='animation' className='h-[300px] w-full flex justify-center'>
                      <Lottie animationData={CartAnimation} loop={true} />
                    </div>
                    <span />
                    <h1 ref={el} className=' w-full flex justify-center items-center text-2xl uppercase text-[#E29578] font-bold' />
                  </div>
                </>
              )
            }

          </section>
          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0 lg:p-0"
          >
            <h2
              id="summary-heading"
              className=" border-b border-gray-200 text-center py-3 text-xl font-medium text-gray-900 sm:p-4"
            >
              Price Details
            </h2>
            <div>
              <dl className="space-y-1 px-2 py-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-800">Price ({(allProduct?.length)} items)</dt>
                  <dd className="text-sm font-medium text-gray-900">{formattedCurrency(totalCartPrice)}</dd>
                </div>
                {/* <div className="flex items-center justify-between pt-4">
                  <dt className="flex items-center text-sm text-gray-800">
                    <span>Discount</span>
                  </dt>
                  <dd className="text-sm font-medium text-green-700"></dd>
                </div> */}
                <div className="flex items-center justify-between py-4">
                  <dt className="flex text-sm text-gray-800">
                    <span>Delivery Charges</span>
                  </dt>
                  <dd className="text-sm font-medium text-green-700">Free</dd>
                </div>
                <div className="flex items-center justify-between border-y border-dashed py-4 ">
                  <dt className="text-base font-medium text-gray-900">Total Amount</dt>
                  <dd className="text-base font-medium text-gray-900">{formattedCurrency(totalCartPrice)}</dd>
                </div>
              </dl>
              <div className="select-none px-2 flex justify-center items-center gap-2 pb-4 font-medium text-green-700 text-center">
                You will save <span className='text-red-500 text-xl'>{formattedCurrency(totalCostPrice - totalCartPrice)}</span> on this order
              </div>
            </div>
            <div className='bg-[#EDF6F9] p-4 mt-2'>
              <button className='bg-[#006D77] w-full p-2 text-2xl text-[#EDF6F9] rounded-xl hover:bg-[#fff] font-bold
                 hover:text-[#006D77] shadow-xl uppercase select-none'
                style={{
                  cursor: allProduct?.length > 0 ? 'pointer' : 'not-allowed',
                  pointerEvents: allProduct?.length > 0 ? 'auto' : 'none',
                }} onClick={(e) => {
                  e.preventDefault()
                  navigate('/yourcart/checkout')
                  dispatch(setSteeperProgress(1))
                }}>
                CheckOut
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  )
}

export default AddToCartPage