import React from 'react'
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { TbLogout } from "react-icons/tb";
import UserInfoPage from './UserInfoPage';
import backendRoutesAPI from '../BackendAPI/API';
import { toast } from 'react-toastify';
import { setCustomerDetail } from '../Store/customerSlice';
import { resetProductDetail } from '../Store/cartSlice';
import { useNavigate } from 'react-router-dom';

function CustomerProfile() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const customer = useSelector((state) => state?.customer?.customer)
  const fullName = `${customer?.firstName !== undefined ? customer?.firstName : 'User'} 
                    ${customer?.middleName !== undefined ? customer?.middleName : ''} 
                    ${customer?.lastName !== undefined ? customer?.lastName : ''}`
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
      {/* Mobile View */}
      <div className='grid grid-col-1 lg:hidden min-h-full w-full py-4'>
        <div className="flex items-center gap-6 mt-4 p-2  rounded-md shadow-sm bg-white cursor-pointer group" onClick={() => setOptonEnabled(false)}>
          <FaUserCircle className='text-4xl' style={{ color: "#E29578" }} />
          <div className="greeting">
            <p className='text-base' style={{ margin: "0px" }}>Hello,</p>
            <h3 className='capitalize md:text-xl text-lg  font-semibold' style={{ margin: "0px" }}>{fullName}</h3>
            <div className="role flex items-end justify-end">
              <h6 className='text-sm capitalize item-end'>({customer?.role.toLowerCase()})</h6>
            </div>
          </div>
        </div>
      </div>
      {/* Desktop View */}
      <aside className='hidden flex-shrink-0 lg:block min-h-full w-full max-w-72 p-4'>
        <div className="top flex items-center gap-6 mt-4 p-2 md:flex-row flex-col rounded-md shadow-sm bg-white cursor-pointer group" onClick={() => setOptonEnabled(false)}>
          <FaUserCircle className='text-4xl' style={{ color: "#E29578" }} />
          <div className="greeting">
            <p className='text-base' style={{ margin: "0px" }}>Hello,</p>
            <h3 className='capitalize md:text-xl text-lg  font-semibold' style={{ margin: "0px" }}>{fullName}</h3>
            <div className="role flex items-end justify-end">
              <h6 className='text-sm capitalize item-end'>({customer?.role.toLowerCase()})</h6>
            </div>
          </div>
        </div>
      </aside>
      <div className="lg:mt-7 rounded-md h-fit w-full ml-1">
        <UserInfoPage/>
      </div>
    </div>
  )
}

export default CustomerProfile
