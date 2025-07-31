import React, { useState } from 'react'
import { FaUserCircle } from "react-icons/fa";
import moment from "moment" // For data Format
import ChangeCustomerRole from '../../Components/ChangeCustomerRole/ChangeCustomerRole.jsx'

export default function Table({data}) {
  const [showUpdateRoleMenu,setShowUpdateRoleMenu]=useState(false)
  const [userToUpdate,setUserToUpdate]=useState({})
  return (
    <>
      <section className="mx-auto w-full  px-4 py-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h2 className="text-lg font-semibold">Registered User</h2>
          </div>
        </div>
        <div className="mt-6 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-bold text-gray-700"
                      >
                        <span>Customer Name</span>
                      </th>
                      <th
                        scope="col"
                        className=" py-3.5 text-left text-sm font-bold text-gray-700"
                      >
                        Email
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-bold text-gray-700"
                      >
                        UserName
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-bold text-gray-700"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-bold text-gray-700"
                      >
                        Registered At:
                      </th>
                      <th scope="col" className="px-4 py-4 text-center text-sm font-bold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody key="a" className="divide-y divide-gray-200 bg-white">
                    {data.map((person) => (
                      <tr key={person._id}>
                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                            <FaUserCircle className='text-4xl' style={{ color: "#E29578" }} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{person.fullname}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap  py-4">
                          <div className="text-sm text-gray-700">{person.email}</div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                            {person.userName}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                          {person.role}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                          {moment(person.createdAt).format('ll')}<br/>
                          {moment(person.createdAt).format('LT')}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium">
                          <a href="#" className="text-gray-700 hover:text-blue-600 text-lg" 
                            onClick={()=>{
                              setShowUpdateRoleMenu(true)
                              setUserToUpdate(person);
                            }}>
                            Edit
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
      {
        showUpdateRoleMenu &&(
          <ChangeCustomerRole 
            onClose={()=>setShowUpdateRoleMenu(false)} 
            name={userToUpdate.fullname}
            email={userToUpdate.email}
            userId={userToUpdate._id}
            />
        )
      }
    </>
  )
}

