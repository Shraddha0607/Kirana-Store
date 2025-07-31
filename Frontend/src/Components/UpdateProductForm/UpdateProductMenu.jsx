import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MdOutlineArrowBackIos } from "react-icons/md";
import productCategories from "../../HelperFiles/Productcategories.js"
import backendRoutesAPI from "../../BackendAPI/API.js"
import { toast } from "react-toastify"
import { setProductDetail } from '../../Store/productSlice.js';
import { MdDelete } from "react-icons/md";
import { IoCloseCircleSharp } from "react-icons/io5";
import { IoMdCloudUpload } from "react-icons/io";
import { FaFileUpload } from "react-icons/fa";

function UpdateProductMenu() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const product = useSelector((state) => state?.product?.product)
  const customer = useSelector((state) => state?.customer?.customer)
  const params = useParams()
  const [image, setImage] = useState({})
  const [formFieldError, setFormFieldError] = useState({});
  const [isProductImageUpdating, setisProductImageUpdating] = useState(false)
  const [isNewImageAdded, setisNewImageAdded] = useState(false)
  const [productData, setProductData] = useState(product)
  const [productCategory, setProductcategory] = useState([])
  const [productSubCategory, setProductSubCategory] = useState([])


  const getCurrentProduct = async () => {
    const currentProductID = params.id
    const data = await fetch(backendRoutesAPI.admin.getCurrentProduct.url, {
      method: backendRoutesAPI.admin.getCurrentProduct.method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ _id: currentProductID })
    })
    const currentProduct = await data.json()
    if (currentProduct.success) {
      setProductData(currentProduct.data)
      dispatch(setProductDetail(currentProduct.data))
      const categoriesArray = Object.keys(productCategories)
      setProductcategory(categoriesArray);
      setProductSubCategory(productCategories[currentProduct.data.category])
    }
    else {
      toast.error(currentProduct.message)
    }
  }

  const handleMainCategoryChange = (e) => {
    const { name, value } = e.target
    if (value === "NONE") {
      setProductData({ ...productData, [name]: "" })
      setProductSubCategory([])
    }
    else {
      setProductData({ ...productData, [name]: value })
      setProductSubCategory(productCategories[value]);
    }
  }

  const handleSubCategoryChange = (e) => {
    const { name, value } = e.target
    setProductData({ ...productData, [name]: value })
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setProductData({ ...productData, [id]: value })
  }

  const handleImageSelectChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
  }
  const validateImage = () => {
    if (image === undefined) {
      toast.warning("Please Select Image to Upload first")
      return false
    }
    else {
      const ImageExtension = image.type.replace("image/", "")
      if (ImageExtension.toLowerCase() === 'jpeg' || ImageExtension.toLowerCase() === 'webp' || ImageExtension.toLowerCase() === 'jpg' || ImageExtension.toLowerCase() === 'png') {
        setImage({})
        return true
      }
      else {
        toast.warning("Uploaded Image should be in either 'JPEG', 'JPG','PNG'")
        setImage({})
        return false
      }
    }
  }

  const uploadImage = async (e) => {
    e.preventDefault()
    if (validateImage()) {
      const formData = new FormData()
      formData.append("file", image)
      const backendResponse = await fetch(backendRoutesAPI.admin.uploadImage.url, {
        method: backendRoutesAPI.admin.uploadImage.method,
        credentials: "include",
        body: formData
      })
      const finalRes = await backendResponse.json();
      if (finalRes.success) {
        setisNewImageAdded(true)
        setProductData((prevData) => {
          return {
            ...prevData,
            productImage: [...prevData.productImage, finalRes.data]
          }
        })
        toast.success(finalRes.message)
        setImage({})
      }
    }
  }
  const updateImageInDatabase = async () => {
    if (isNewImageAdded) {
      const backendResponse = await fetch(backendRoutesAPI.admin.updateImageInfo.url, {
        method: backendRoutesAPI.admin.updateImageInfo.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ productImage: productData?.productImage, productId: productData._id })
      })
      const finalRes = await backendResponse.json();
      if (finalRes.success) {
        console.log(finalRes.data)
        setProductData(finalRes.data)
        setisNewImageAdded(false)
        toast.success(finalRes.message)
        setisProductImageUpdating(false)
      }
      else {
        toast.error(finalRes.message)
      }
    }
    else {
      toast.warning("No Update was Made by You")
    }
  }
  const handleDelete = async (imageURL) => {
    //setIsImageDeleting(true)
    const urlSection = imageURL.split("/")
    const imageFullName = urlSection[urlSection.length - 1]
    const imageInitialName = imageFullName.split(".")[0]
    const data = { imagename: imageInitialName }
    const backendResponse = await fetch(backendRoutesAPI.admin.deleteProductImage_WhileUploading.url, {
      method: backendRoutesAPI.admin.deleteProductImage_WhileUploading.method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
    const finalResponse = await backendResponse.json()
    const copyOFImageURl = productData.productImage
    if (finalResponse.success) {
      const deletedimageIndex = copyOFImageURl.indexOf(imageURL)
      copyOFImageURl.splice(deletedimageIndex, 1)
      setProductData((prevData) => {
        return {
          ...prevData,
          productImage: copyOFImageURl
        }
      })
      toast.success("Image Deleted Successfully")
    }
  }
  const handleImageUpdatePage = () => {
    if (isNewImageAdded) {
      const res = prompt('You uploaded Some images, Type : "Y" to discard Changes and "N" to save it')
      if (res.toLowerCase() === 'y') {

      }
      else {
        updateInDatabase()
      }
    }
    else {
      setisProductImageUpdating(false)
    }


  }
  const handleFinalSubmit = async (e) => {
    e.preventDefault()
    const dataToUpdate = {}
    const error = {}
    if (product.productName !== productData.productName) {
      if (productData.productName !== "") {
        dataToUpdate.productName = productData.productName
      }
      else {
        error.productName = 'Product Name should not be Empty'
      }
    }
    if (product.productBrand !== productData.productBrand) {
      if (productData.productBrand !== "") {
        dataToUpdate.productBrand = productData.productBrand
      }
      else {
        error.productBrand = 'Product Brand should not be Empty'
      }
    }
    if (product.productDescription !== productData.productDescription) {
      if (productData.productDescription !== "") {
        dataToUpdate.productDescription = productData.productDescription
      }
      else {
        error.productDescription = 'Product Description should not be Empty'
      }
    }
    if (product.productListingPrice !== productData.productListingPrice) {
      if (productData.productListingPrice !== "") {
        dataToUpdate.productListingPrice = productData.productListingPrice
      }
      else {
        error.productListingPrice = 'Product Listing Price should not be Empty'
      }
    }
    if (product.productSellingPrice !== productData.productSellingPrice) {
      if (productData.productSellingPrice !== "") {
        dataToUpdate.productSellingPrice = productData.productSellingPrice
      }
      else {
        error.productSellingPrice = 'Product Selling Price should not be Empty'
      }
    }
    if (product.category !== productData.category) {
      if (productData.category !== "") {
        dataToUpdate.category = productData.category
      }
      else {
        error.category = 'Product category should not be Empty'
      }
    }
    if (product.subcategory !== productData.subcategory) {

      if (productData.subcategory !== "") {
        dataToUpdate.subcategory = productData.subcategory
      }
      else {
        error.subcategory = 'Product Sub-Category should not be Empty'
      }
    }
    if (Object.keys(dataToUpdate).length > 0) {
      if (Object.keys(error).length === 0) {
        dataToUpdate._id = product._id
        const backendResponse = await fetch(backendRoutesAPI.admin.updateProductInfoData.url, {
          method: backendRoutesAPI.admin.updateProductInfoData.method,
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(dataToUpdate)
        })
        const finalRes = await backendResponse.json()
        if (finalRes.success) {
          toast.success(finalRes.message)
          navigate("/admin-pannel/view-all-listed-products")
        }
        else {
          toast.error(finalRes.message)
          navigate("/admin-pannel/view-all-listed-products")
        }
      }
      else {
        setFormFieldError(error)
      }
    }
    else {
      toast.warning(`You haven't update any information about the ${product.productName}`)
    }

  }
  useEffect(() => {
    getCurrentProduct()
  }, [])

  return (
    productData && customer?.role.toLowerCase() === "admin" ?
      (<div className='lg:max-w-[70%] mx-auto realtive py-4' >
        <div className=' mx-auto rounded-2xl py-4 shadow-xl' style={{ backgroundColor: "#006D7740" }}>
          <Fragment >
            <Link to={"/admin-pannel/view-all-listed-products"}><MdOutlineArrowBackIos className='text-2xl ml-4 cursor-pointer' /></Link>
          </Fragment>
          {/*  Heading */}
          <hr className='my-2'/>
          <div className=" text-2xl sm:text-3xl mx-2 md:text-center text-left font-semibold">
            <i><u>Update Product Id:  {productData._id}</u></i>
          </div>
          {/* Form Section */}
          <form className='grid w-full p-8 mt-2 gap-3'>
            {/* Product Images */}
            <div className='flex justify-between items-center'>
              <label htmlFor='productDescription' className='text-2xl font-semibold '>Product Images:</label>
              <div
                className='text-lg text-[#EDF6F9] font-semibold cursor-pointer bg-[#006D77]  px-3 rounded-lg hover:bg-white hover:text-blue-500 hover:border-2 hover:border-[#006D77]'
                onClick={() => { setisProductImageUpdating(true) }}
              > Add More or Update </div>
            </div>
            <div className='flex justify-evenly items-center mt-2 gap-5'>
              {
                (productData?.productImage).map((image, index) => {
                  return (
                    <div className='flex flex-col justify-center items-center ' key={index}>
                      <img src={image} height='250px' width='250px' />
                    </div>
                  )
                })
              }
            </div>
            {/* Updating PRoduct images section */}
            {
              isProductImageUpdating ? (
                <div className='absolute bg-slate-600 bg-opacity-30 p-5 top-0 left-0 h-full w-full'>
                  <div className='bg-white flex flex-col p-4 mx-auto w-full h-fit lg:w-fit shadow-xl rounded-xl'>
                    <div className='flex p-2 justify-between items-center'>
                      <h1 className='text-2xl font-bold '>Add More Images/ Update</h1>
                      <span className='text-3xl text-red-600 h-fit w-fit cursor-pointer' onClick={() => { handleImageUpdatePage() }}><IoCloseCircleSharp /></span>
                    </div>
                    <div className="upload-images mt-4 bg-white py-2 px-2 flex  flex-col gap-3">
                      <div className="product-image px-4 flex flex-col gap-4">
                        {
                          (
                            <div className="image1 flex  gap-3 justify-center items-center">
                              <label htmlFor='image1'
                                className='text-lg py-3 w-full cursor-pointer max-w-[400px] px-3 font-semibold flex gap-4 rounded-xl justify-center items-center'
                                style={{ backgroundColor: "#83C5BE89" }}>
                                <span className='text-4xl'><IoMdCloudUpload /></span>
                                <h1 className='text-sm'>{image?.name ? `${image.name}` : "Choose Image"}</h1>
                                <input
                                  name='image1'
                                  id='image1'
                                  className='border hidden bg-slate-200 rounded-sm w-full max-w-sm'
                                  type="file" onChange={handleImageSelectChange}
                                />
                              </label>
                              <div>
                                <button
                                  className='p-3 rounded-xl  mx-auto block text-2xl'
                                  style={{ backgroundColor: "#006D77", color: "#fff" }} onClick={uploadImage}><FaFileUpload /></button>
                              </div>
                            </div>
                          )
                        }

                      </div>
                    </div>
                    <div className='flex justify-evenly items-center p-4 mt-2 gap-5'>
                      {
                        (productData?.productImage).map((image, index) => {
                          return (
                            <div className='border flex flex-col  justify-center items-center group relative ' key={index}>
                              <img src={image} height='250px' width='250px' />
                              {/* Delete Image Button */}
                              <div className='text-2xl rounded-xl cursor-pointer p-1 absolute  bottom-0 right-0 hidden  group-hover:block'
                                style={{ backgroundColor: "#83C5BE", color: "#ff0054" }}  >
                                <MdDelete key={index + 0.1} onClick={() => handleDelete(image)} />
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                    <div
                      className='py-2 px-8 rounded-md text-xl cursor-pointer shadow-xl text-[#EDF6F9] bg-[#006D77] 
                                                                  font-semibold mt-4 flex mx-auto hover:scale-105' onClick={updateImageInDatabase}>
                      Confirm Save
                    </div>
                  </div>
                </div>
              ) : null
            }
            {/* Product Name */}

            <label htmlFor='productName' className='text-2xl font-semibold '>Name of Product :</label>
            <input type='text'
              id='productName'
              value={productData.productName}
              onChange={handleChange}
              className='border hidden-scrollbar bg-white p-2 rounded-sm w-full capitalize'
              placeholder='Enter the name of the Product' />
            <p className='text-red-500'>{formFieldError?.productName}</p>

            {/* PRoduct Barnd Name */}
            <label htmlFor='productBrand' className='text-2xl font-semibold '>Product Brand :</label>
            <input type='text'
              id='productBrand'
              value={productData.productBrand}
              onChange={handleChange}
              className='border bg-white p-2 rounded-sm w-full '
              placeholder='Enter the name of the Product' />
            <p className='text-red-500'>{formFieldError?.productBrand}</p>

            {/* Product Description */}
            <label htmlFor='productDescription' className='text-2xl font-semibold '>Product Description:</label>
            <textarea type='text'
              id='productDescription'
              rows={5}
              value={productData.productDescription}
              onChange={handleChange}
              className='border hidden-scrollbar bg-white p-2 rounded-sm w-full h-fit'
              placeholder='Enter the name of the Product'></textarea>
            <p className='text-red-500'>{formFieldError?.productDescription}</p>


            <div className='flex gap-4 w-full mt-4 justify-between items-center '>
              {/* Product Listing Price */}
              <div className='flex flex-col justify-center items-center align-middle w-full max-w-96 gap-2'>
                <label htmlFor='productListingPrice' className='text-2xl font-semibold '>Product Listing Price</label>
                <input type='number'
                  id='productListingPrice'
                  value={productData.productListingPrice}
                  onChange={handleChange}
                  className='border bg-white p-2 rounded-lg w-full text-center'
                  placeholder='Enter the name of the Product' />
                <p className='text-red-500'></p>
              </div>

              {/* Product Selling Price */}
              <div className='flex flex-col justify-center items-center w-full max-w-96 gap-2'>
                <label htmlFor='productSellingPrice' className='text-2xl font-semibold '>Product Selling Price</label>
                <input type='number'
                  id='productSellingPrice'
                  value={productData.productSellingPrice}
                  onChange={handleChange}
                  className='border bg-white p-2 rounded-lg w-full text-center  '
                  placeholder='Enter the name of the Product' />
                <p className='text-red-500'></p>
              </div>
            </div>
            {/* Product Main Category */}

            <label htmlFor='category' className='text-xl font-semibold mr-10'>Main Category:</label>
            <select value={productData.category} name="category" className='border bg-white px-2 py-2 rounded-sm'
              onChange={handleMainCategoryChange}>
              <option>NONE</option>
              {
                productCategory.map((el, index) => {
                  return <option value={el} key={index}>{el}</option>
                })
              }
            </select>
            <p className='text-red-500'>{formFieldError?.category}</p>

            {/* Product Sub Category */}

            <label htmlFor='subcategory' className='text-xl font-semibold mr-10'>Sub-Category:</label>
            <select value={productData.subcategory} className='border bg-white px-2 py-2 rounded-sm'
              onChange={handleSubCategoryChange} name="subcategory">
              {
                productSubCategory?.length > 0 ? (productSubCategory.map((el, index) => {
                  return <option value={el} key={index}>{el}</option>
                })) : null
              }
            </select>
            <p className='text-red-500'>{formFieldError?.subcategory}</p>

            <button
              className='py-2 px-8 rounded-md text-xl cursor-pointer  text-[#EDF6F9] bg-[#006D77] 
                                                      font-semibold mt-4 flex mx-auto hover:scale-110 transition-all' onClick={handleFinalSubmit}>
              Confirm Save
            </button>
          </form>
        </div>
      </div>) : (null)
  )
}
export default UpdateProductMenu
