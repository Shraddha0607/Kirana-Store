import React, { useEffect, useState } from 'react'
import Loader from "../../Components/Loader/Loader.jsx"
import backendRoutesAPI from '../../BackendAPI/API.js'
import Table from '../../Components/table/Table.jsx'
import { useNavigate } from 'react-router-dom'
function ViewAllCustomer() {
  const [customerData, setCustomerData] = useState([])
  const navigate = useNavigate()
  const getAllCustomerData = async () => {
    const backendAPIResponse = await fetch(backendRoutesAPI.admin.showAllUser.url, {
      method: backendRoutesAPI.admin.showAllUser.method,
      credentials: "include"
    })
    const finalData = await backendAPIResponse.json()
    if(finalData.success){
      setCustomerData(finalData.data)
    }
    else{
      navigate("/")
    }
  }

  useEffect(() => {
    getAllCustomerData()
  }, [])
  return (
    <>
      {
        customerData.length === 0
          ? (
            null
          )
          :(
            <>
            <div className='bg-white'>
              <Table data={customerData}/>
            </div>
            </>
          )
      }
    </>
  )
}

export default ViewAllCustomer