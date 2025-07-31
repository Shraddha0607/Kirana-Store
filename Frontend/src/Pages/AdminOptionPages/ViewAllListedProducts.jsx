import React, { useEffect, useState } from 'react'
import backendRoutesAPI from "../../BackendAPI/API.js"
import { toast } from "react-toastify"
import ProductCard from '../../Components/ProductCard/ProductCard.jsx'


function ViewAllListedProducts() {

  const [products, setProducts] = useState([])

  const getAllProductData = async () => {
    const data = await fetch(backendRoutesAPI.admin.showProduct.url, {
      method: backendRoutesAPI.admin.showProduct.method
    })
    const products = await data.json()
    if (products.success) {
      setProducts(products.data)
    }
    else {
      toast.error(products.message)
    }
  }

  useEffect(() => {
    getAllProductData()
  }, [])
  return (
    <div>
      <h1 className='bg-[#EDF6F9] flex justify-center items-center text-3xl mb-2'>
        <b className='mr-2 underline'>Total Number Of Listing Products : </b>
        <p className='text-5xl text-red-600'>{products.length}</p>
      </h1>
      <div className='p-10 h-[100vh] overflow-y-auto border shadow-2xl flex justify-evenly items-center align-middle   gap-10 flex-wrap'
        style={{ backgroundColor: "#EDF6F9" }}>
        {
          products.map((product, index) => {
            return <ProductCard product={product} index={index} key={index} />
          })
        }
      </div>
    </div>


  )
}

export default ViewAllListedProducts
