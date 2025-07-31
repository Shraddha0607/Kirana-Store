import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import backendRoutesAPI from '../BackendAPI/API'
import ProductCard2 from '../Components/ProductCard2/ProductCard2'

const SubCatehoryLandingPage = () => {
  const params = useParams()
  const [items, setitems] = useState([])
  const fetchProduct = async () => {
    try {
      const response = await fetch(backendRoutesAPI.homePageAPI.subCategoryWiseProduct.url, {
        method: backendRoutesAPI.homePageAPI.subCategoryWiseProduct.method,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({subcategory:params?.subcategory})
      })
      const data = await response.json()
      if(data.success){
        setitems(data.data)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error)
    }
  }

  useEffect(() => {
    fetchProduct()

  }, [])

  return (
    <div className='conatainer flex w-full mx-auto bg-[#EDF6F9] flex-col'>
      <div className='w-full mx-auto py-2 px-2 flex justify-evenly items-center flex-wrap gap-3'>
      {
        items?.map((item,index)=>{
          return <ProductCard2 product={item}/>
        })
      }
    </div>
    </div>
  )
}

export default SubCatehoryLandingPage
