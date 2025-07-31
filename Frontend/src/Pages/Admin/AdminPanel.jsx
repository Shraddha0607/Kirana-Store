import React, { useEffect, useState } from 'react'
import { FaUserCircle } from "react-icons/fa";
import { LuListTodo } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import "./AdminPannel.css"
import UserInfoPage from '../UserInfoPage';
import { TbLogout } from "react-icons/tb";
import backendRoutesAPI from '../../BackendAPI/API';
import { setCustomerDetail } from '../../Store/customerSlice';
import { toast } from 'react-toastify';
import { resetProductDetail } from '../../Store/cartSlice';


function AdminPanel() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [optionEnabled, setOptonEnabled] = useState(false)
  const admin = useSelector((state) => state?.customer?.customer)
  const fullName = `${admin?.firstName !== undefined ? admin?.firstName : 'User'} 
                    ${admin?.middleName !== undefined ? admin?.middleName : ''} 
                    ${admin?.lastName !== undefined ? admin?.lastName : ''}`
  const handleLogout = async () => {
    const backendApiResponse = await fetch(backendRoutesAPI.signout.url, {
      method: backendRoutesAPI.signout.method,
      credentials: "include"
    })
    const finalResponse = await backendApiResponse.json()
    if (finalResponse.success) {
      toast.success(finalResponse.message)
      dispatch(setCustomerDetail(null))
      dispatch(resetProductDetail())
      navigate("/");
    }
  }
  return (
    <div className='lg:min-h-[calc(100vh-148px)] flex flex-col lg:flex-row mb-10'>
      {/* //For Screen Below 1024px */}
      <div className='grid grid-cols-12 gap-4 lg:hidden min-h-full w-full py-4'>
        <div className="col-span-4 flex items-center gap-6 mt-4 p-2 flex-col rounded-md shadow-sm bg-white cursor-pointer group" onClick={() => setOptonEnabled(false)}>
          <FaUserCircle className='text-4xl' style={{ color: "#E29578" }} />
          <div className="greeting">
            <p className='text-base' style={{ margin: "0px" }}>Hello,</p>
            <h3 className='capitalize md:text-xl text-lg  font-semibold' style={{ margin: "0px" }}>{fullName}</h3>
            <div className="role flex items-end justify-end">
              <h6 className='text-sm capitalize item-end'>({admin?.role.toLowerCase()})</h6>
            </div>
          </div>
        </div>
        {/* Admin Action - Mobile View */}
        <div className="flex col-span-8 flex-col justify-evenly mt-4 rounded-md shadow-sm bg-white py-2 px-2">
          <div className="header-info w-full flex items-center md:gap-4 gap-2 md:justify-normal justify-between">
            <LuListTodo className='header-info-logo flex md:text-2xl text-xl md:ml-2 md:mr-3' />
            <p className='capitalize md:text-lg text-base font-bold'>Admin task</p>
          </div>
          <div className="admin-links mt-2">
            <nav className='grid text-md '>
              <div className="admin-action w-full  py-2 cursor-pointer"
                onClick={() => {
                  setOptonEnabled(true)
                  navigate("/admin-pannel/view-all-customer")
                }}>
                <Link to={"/admin-pannel/view-all-customer"} className=' md:ml-16 text-sm  '>View All Customers</Link>
              </div>
              <div className="admin-action w-full  py-2 cursor-pointer"
                onClick={() => {
                  setOptonEnabled(true)
                  navigate("/admin-pannel/view-all-listed-products")
                }}>
                <Link to={"/admin-pannel/view-all-listed-products"} className='md:ml-16 text-sm  '>View All Products</Link>
              </div>
              <div className="admin-action w-full  py-2 cursor-pointer"
                onClick={() => {
                  setOptonEnabled(true)
                  navigate("/admin-pannel/add-products")
                }}>
                <Link to={"/admin-pannel/add-products"} className=' md:ml-16 text-sm  '>Add Product</Link>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* //For screen Size Width 1024px or more */}
      <aside className='hidden flex-shrink-0 lg:block min-h-full w-full max-w-72 p-4'>
        <div className="top flex items-center gap-6 mt-4 p-2 md:flex-row flex-col rounded-md shadow-sm bg-white cursor-pointer group" onClick={() => setOptonEnabled(false)}>
          <FaUserCircle className='text-4xl' style={{ color: "#E29578" }} />
          <div className="greeting">
            <p className='text-base' style={{ margin: "0px" }}>Hello,</p>
            <h3 className='capitalize md:text-xl text-lg  font-semibold' style={{ margin: "0px" }}>{fullName}</h3>
            <div className="role flex items-end justify-end">
              <h6 className='text-sm capitalize item-end'>({admin?.role.toLowerCase()})</h6>
            </div>
          </div>
        </div>
        {/* Admin Action - Desktop View */}
        <div className="flex flex-col justify-evenly mt-4 rounded-md shadow-sm bg-white py-2 px-2">
          <div className="header-info w-full flex items-center md:gap-4 gap-2 md:justify-normal justify-between">
            <LuListTodo className='header-info-logo flex md:text-2xl text-xl md:ml-2 md:mr-3' />
            <p className='capitalize md:text-lg text-base font-bold'>Admin task</p>
          </div>
          <div className="admin-links mt-2">
            <nav className='grid text-md '>
              <div className="admin-action w-full  py-2 cursor-pointer"
                onClick={() => {
                  setOptonEnabled(true)
                  navigate("/admin-pannel/view-all-customer")
                }}>
                <Link to={"/admin-pannel/view-all-customer"} className=' md:ml-16 text-sm  '>View All Customers</Link>
              </div>
              <div className="admin-action w-full  py-2 cursor-pointer"
                onClick={() => {
                  setOptonEnabled(true)
                  navigate("/admin-pannel/view-all-listed-products")
                }}>
                <Link to={"/admin-pannel/view-all-listed-products"} className='md:ml-16 text-sm  '>View All Products</Link>
              </div>
              <div className="admin-action w-full  py-2 cursor-pointer"
                onClick={() => {
                  setOptonEnabled(true)
                  navigate("/admin-pannel/add-products")
                }}>
                <Link to={"/admin-pannel/add-products"} className=' md:ml-16 text-sm  '>Add Product</Link>
              </div>
            </nav>
          </div>
        </div>
      </aside>
      <main className='lg:mt-7 rounded-md h-fit w-full ml-1'>
        {
          optionEnabled ? <Outlet /> : <UserInfoPage />
        }
      </main>
    </div>
  )
}

export default AdminPanel
