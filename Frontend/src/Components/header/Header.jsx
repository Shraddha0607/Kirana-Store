import React, { useState, useContext, useEffect } from 'react'
import Search from '../Search/Search'
import { FaRegCircleUser } from "react-icons/fa6";
import { BsCart2 } from "react-icons/bs";
import "./header.css"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import backendRoutesAPI from "../../BackendAPI/API.js"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { setCustomerDetail } from "../../Store/customerSlice.js";
import { FaAngleUp } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { resetProductDetail } from '../../Store/cartSlice';
import { setSteeperProgress } from '../../Store/steeperStepSlice';

function Header() {

  const customer = useSelector((state) => state?.customer?.customer)
  const addToCart = useSelector((state) => state.addTocart)
  const step = useSelector((state) => state?.steeperStep?.currentStep)
  const [showCustomerOption, setShowCustomerOption] = useState(false)
  const [showMobileOption, setShowMobileOption] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const actionUrl = ['/yourcart', '/yourcart/checkout', '/yourcart/payment', '/yourcart/orderStatus']

  const handleLogout = async () => {
    setShowCustomerOption(false)
    const backendApiResponse = await fetch(backendRoutesAPI.signout.url, {
      method: backendRoutesAPI.signout.method,
      credentials: "include"
    })
    const finalResponse = await backendApiResponse.json()
    if (finalResponse.success) {
      toast.success(finalResponse.message)
      dispatch(setCustomerDetail(null))
      dispatch(setSteeperProgress(0))
      dispatch(resetProductDetail())
      localStorage.removeItem('addTocart')
      localStorage.removeItem('steeperStep')
      navigate("/");
    }
  }
  const handleCartClick = () => {
    navigate(`${actionUrl[step]}`)
  }

  useEffect(() => {
    if (showMobileOption) {
      document.body.classList.add('no-scroll');
    }
    else {
      document.body.classList.remove('no-scroll');
    }
  }, [showMobileOption])

  useEffect(() => {
    setShowMobileOption(false)
  }, [location])

  return (
    <section className='header h-[4rem]  py-1 w-screen flex bg-[#006d77]'>
      <div className=" container grid grid-cols-10 sm:grid-cols-12 header-box sm:gap-4">
        {/* left most Company logo */}
        <div className="logo  py-2 col-span-2  lg:col-span-2 sm:col-span-1">
          <Link to={'/'} className='w-full px-3 flex justify-center'>
            <i className="fa-brands fa-shopware" onClick={() => {
              setShowCustomerOption(false)
              const cartStorage = JSON.parse(localStorage.getItem('addTocart'))
              if (cartStorage.totalNumberOfProduct === 0) {
                dispatch(setSteeperProgress(0))
              }
            }}></i>
            <h4 className='text-lg xl:flex hidden'>K-STORE</h4>
          </Link>
        </div>


        {/* Search bar */}

        <Search />

        {/* MObile view */}
        <div className='w-full sm:hidden  col-span-2 text-3xl text-[#EDF6F9] font-bold flex justify-center align-middle items-center'>
          {!showMobileOption ?
            <div className={`hamburger-icon ${showMobileOption && 'icon-active'}`} id="hamburger-icon" onClick={() => setShowMobileOption((prev) => !prev)}>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
            :
            <div className={`hamburger-icon icon-active`} id="hamburger-icon" onClick={() => setShowMobileOption((prev) => !prev)}>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          }
        </div>

        {/* Right Most Part Of the Header */}

        <div className='links hidden sm:flex-row-reverse justify-evenly gap-2 sm:flex items-center sm:col-span-3 lg:col-span-2'>
          {/* Add To Cart Logo */}
          <div className="cart-icon  text-[1.45rem] sm:text-[1.75rem]  font-semibold  cursor-pointer relative group" onClick={handleCartClick}>
            <span><BsCart2 /></span>
            <p className='text-xs bg-red-500 w-4 h-4 text-white absolute -top-1.5 -right-2 cart-value select-none
            flex items-center justify-center rounded-full'>{addToCart?.totalNumberOfProduct}</p>
          </div>

          {
            customer?._id
              ? (
                <div className="user-icon text-3xl right-5 mr-5 relative gap-3 flex justify-center items-center cursor-pointer"
                >
                  <FaRegCircleUser onMouseOver={() => setShowCustomerOption(true)} />
                  {
                    showCustomerOption && (
                      <div className='user-option absolute text-lg w-fit rounded bg-white bottom-0 h-fit top-11 mx-auto text-black '>
                        <FaAngleUp className='mx-auto' />
                        {
                          customer
                            ?
                            (
                              <nav className='flex flex-col text-xl mt-1 justify-start items-start text-black font-semibold gap-3 '
                                onMouseOver={() => setShowCustomerOption(true)} onMouseOut={() => setShowCustomerOption(false)}>
                                {
                                  customer.role === "ADMIN"
                                    ? (
                                      <Link to={"/admin-pannel"} className='whitespace-nowrap flex items-center gap-6 w-full px-4 py-2 link'
                                        onClick={() => setShowCustomerOption(false)}>
                                        <FaRegUser /> Admin Pannel</Link>
                                    ) :
                                    (
                                      <Link to={"/customer-profile"} className='whitespace-nowrap flex items-center gap-6 w-full px-4 py-2 link'
                                        onClick={() => setShowCustomerOption(false)}>
                                        <FaRegUser /> My Profile</Link>
                                    )
                                }
                                <Link to={'/customer-order-detail'} className='whitespace-nowrap flex items-center gap-6 w-full px-4 py-2 link'
                                  onClick={() => setShowCustomerOption(false)}>
                                  <FaClipboardList /> My Orders</Link>

                                <h2 className='flex items-center gap-6 w-full  px-4 py-2  link' onClick={handleLogout}><TbLogout /> Logout</h2>
                              </nav>
                            )
                            : null
                        }
                      </div>
                    )
                  }
                </div>
              )
              : (
                <Link to={"/login"}
                  className={`flex flex-shrink-0 text-[1.35rem] font-semibold text-[#EDF6F9] items-center gap-1.5 ${location.pathname === '/login' && 'hidden'}`}>
                  <FaRegCircleUser />Login
                </Link>
              )
          }
        </div>
      </div>
      {
        showMobileOption &&
        (
          <div className={`${showMobileOption && 'mobile_menu_active'} mobile_menu`}>
            <ul className='w-full flex flex-col justify-end py-2'>
              {customer?._id &&
                <li className='w-full'>
                  <span className='flex capitalize flex-shrink-0 gap-3 flex-row text-3xl justify-start px-2 font-semibold text-[#EDF6F9] items-center'>
                    <FaRegCircleUser />{`Hello,${customer?.firstName}`}
                  </span>
                  <hr className='h-1 my-1 bg-opacity-100 bg-[#fff]' />
                </li>}
              <li className={`w-full px-4 py-2 ${location.pathname === '/login' && 'hidden'}`}>
                {
                  customer?._id ?
                    (
                      <div className='w-full flex flex-col gap-4'>
                        <section>
                          {
                            customer.role === "ADMIN"
                              ? (
                                <Link to={"/admin-pannel"} className={`flex flex-shrink-0 gap-3 flex-row-reverse text-3xl font-semibold text-[#EDF6F9] items-center `}>
                                  <FaRegUser /> Admin Pannel</Link>
                              ) :
                              (
                                <Link to={"/customer-profile"} className={`flex flex-shrink-0 gap-3 flex-row-reverse text-3xl font-semibold text-[#EDF6F9] items-center `}>
                                  <FaRegUser /> My Profiles</Link>
                              )
                          }
                        </section>
                        <Link to={"/customer-order-detail"} className={`flex flex-shrink-0 gap-3 flex-row-reverse text-3xl font-semibold text-[#EDF6F9] items-center `}>
                          <FaClipboardList /> My Orders</Link>

                        <div onClick={handleLogout} className={`flex group cursor-pointer flex-shrink-0 gap-3 flex-row-reverse text-3xl font-semibold text-[#EDF6F9] items-center `}>
                        <TbLogout />Logout</div>
                      </div>
                    )
                    :
                    (
                      <Link to={"/login"}
                        className={`flex flex-shrink-0 gap-3 flex-row-reverse text-3xl font-semibold text-[#EDF6F9] items-center `}>
                        <FaRegCircleUser />Login
                      </Link>
                    )
                }
              </li>
              <li className='w-full p-4'>
                {/* Add To Cart Logo */}
                <div className="flex flex-row-reverse items-center gap-3  text-3xl font-semibold  cursor-pointer relative group"
                  onClick={handleCartClick}>
                  <span><BsCart2 /></span>Your Cart
                  <p className='text-sm bg-red-500 w-6 h-6 text-white absolute -top-2 -right-2  select-none
                      flex items-center justify-center rounded-full'>{addToCart?.totalNumberOfProduct}</p>
                </div>
              </li>
            </ul>
          </div>
        )
      }
    </section>
  )
}

export default Header