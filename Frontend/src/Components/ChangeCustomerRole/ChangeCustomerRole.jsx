import React, { useState } from 'react'
import { IoCloseCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import backendRoutesAPI from '../../BackendAPI/API';
import { useSelector } from 'react-redux';

const Role = {
      Default: "Select Your Role",
      ADMIN: "ADMIN",
      GENRAL: "GENERAL"
}

function ChangeCustomerRole({ name = "", email = "", role = "", userId = "", onClose }) {
      const customer = useSelector((state) => state?.customer?.customer)
      const navigate = useNavigate()
      const [userRole, setUserRole] = useState("");
      const handleUserRoleChnage = (e) => {
            setUserRole(e.target.value);
      }

      const handleUpdateRoleinDataBase = async () => {
            if (customer._id === userId) {
                  if (customer.role.toLowerCase() !== userRole.toLowerCase()) {
                        const backendResponse = await fetch(backendRoutesAPI.admin.updateUserRole.url, {
                              method: backendRoutesAPI.admin.updateUserRole.method,
                              credentials: "include",
                              headers: {
                                    'content-type': 'application/json'
                              },
                              body: JSON.stringify({
                                    id: userId,
                                    role: userRole
                              })
                        })
                        const finalFeedback = await backendResponse.json()
                        if (finalFeedback.success) {
                              onClose()
                              window.location.href = '/'
                              toast.success(`${name.toUpperCase()} role is set to ${userRole}`);
                        }
                        else {
                              toast.error(`${finalFeedback.message}`)
                              onClose()
                              window.location.href = '/'
                        }
                  }
                  else{
                        onClose()
                        toast.warning("You are Already Admin")
                  }
            }
            else {
                  const backendResponse = await fetch(backendRoutesAPI.admin.updateUserRole.url, {
                        method: backendRoutesAPI.admin.updateUserRole.method,
                        credentials: "include",
                        headers: {
                              'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                              id: userId,
                              role: userRole
                        })
                  })
                  const finalFeedback = await backendResponse.json()

                  if (finalFeedback.success) {
                        toast.success(`${name.toUpperCase()} role is set to ${userRole}`);
                        onClose()
                        navigate('/admin-pannel')

                  }
                  else {
                        toast.error(`${finalFeedback.message}`)
                        onClose()
                        navigate('/admin-pannel')
                  }
            }

      }

      return (
            <div className='fixed w-full h-full z-10 top-0 bottom-0 right-0 left-0 flex justify-center items-center bg-slate-500 bg-opacity-50'>
                  <div className='mx-auto w-full max-w-md  p-4 grid rounded-lg' style={{ backgroundColor: "aliceblue" }}>
                        <div className="flex justify-between items-center mb-4">
                              <h1 className='text-xl font-bold'>Change User Role</h1>
                              <IoCloseCircleSharp className='text-red-600 text-2xl cursor-pointer' onClick={onClose} />
                        </div>
                        <div className="detail grid gap-2 " style={{ userSelect: "none" }}>
                              <div className="mb-2 flex justify-between items-center">
                                    <h1 className='font-bold text-lg ml-5'>UserId : </h1>
                                    <h1 className='text-lg'>{userId}</h1>
                              </div>
                              <div className="mb-2 flex justify-between items-center">
                                    <h1 className='font-bold text-lg ml-5'>Name : </h1>
                                    <h1 className='text-lg capitalize'>{name}</h1>
                              </div>
                              <div className="mb-2 flex justify-between items-center">
                                    <h1 className='font-bold text-lg ml-5'>Email : </h1>
                                    <h1 className='text-lg'>{email}</h1>
                              </div>
                              <div className="mb-2 flex justify-between items-center">
                                    <p className='ml-5 font-bold text-lg'>Role:</p>
                                    <select className=' text-center' value={userRole} onChange={handleUserRoleChnage}>
                                          {
                                                Object.values(Role).map((el) => {
                                                      return <option key={el} id={el}>{el}</option>
                                                })
                                          }
                                    </select>
                              </div>
                              <button className="w-fit px-3 py-2 rounded-full text-md font-semibold mx-auto block"
                                    style={{ backgroundColor: "#83C5BE", color: "#EDF6F9" }}
                                    onClick={handleUpdateRoleinDataBase}>
                                    Change</button>
                        </div>
                  </div>
            </div>
      )
}

export default ChangeCustomerRole
