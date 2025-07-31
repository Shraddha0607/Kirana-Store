import React from 'react'
import { FaEdit } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setProductDetail, setIsUpdating } from '../../Store/productSlice.js';
function ProductCard({ product, index }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const formattedCurrency = (number) => {
    return (
      number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'INR', // Change to your desired currency code
      }))
  }
  const handleUpdateClick = () => {
    dispatch(setProductDetail(product))
    navigate(`/${product._id}/update-product`)

  }
  return (
    <div key={index} className="relative group flex gap-2 flex-col justify-center rounded-xl shadow-xl items-center h-fit w-[20rem]"
      style={{ background: "white" }}>
      <div className='h-72 w-52 flex mt-2 mb-2justify-center items-center rounded-lg' >
        <img src={product.productImage[0]} className="object-fill" />
      </div>
      <div className=' details w-[20rem] p-1 text-center  ' style={{ userSelect: "none" }}>
        <div className="p-2">
          <h1 className='capitalize text-md text-ellipsis line-clamp-1 font-bold'>{product.productName}</h1>

        </div>
        <div className="p-2">
          <h1 className='capitalize flex gap-4 font-semibold text-sm'><p className=''>Listing Price:</p> <b>{formattedCurrency(product.productListingPrice)}</b></h1>
        </div>

        <div className="p-2">
          <h1 className='capitalize flex gap-4 font-semibold text-sm'><p className=''>Selling Price:</p> <b>{formattedCurrency(product.productSellingPrice)}</b></h1>
        </div>
      </div>
      <div className=" absolute top-2 right-0 text-2xl edit-icon rounded-full
        mr-1 p-2 justify-center items-center ml-auto cursor-pointer hidden group-hover:flex"
        style={{ color: "#006D77", backgroundColor: "#EDF6F9" }} onClick={handleUpdateClick}>
        <FaEdit />
      </div>
    </div>
  )
}

export default ProductCard
