import React, { useEffect, useState } from 'react'
import { IoMdCloudUpload } from "react-icons/io";
import productCategories from "../../HelperFiles/Productcategories.js"
import { toast } from "react-toastify"
import backendRoutesAPI from "../../BackendAPI/API.js"
import { useNavigate } from "react-router-dom"
import { MdDelete } from "react-icons/md";
import LoaderTwo from '../../Components/Loader/SecondLoader/LoaderTwo.jsx';

function AddProducts() {
  const [productData, setProductData] = useState({
    productName: "",
    productBrand: "",
    productDescription: "",
    productListingPrice: 0,
    productSellingPrice: 0,
    category: "",
    subcategory: "",
    productImage: [],
  })
  const [productCategory, setProductcategory] = useState([])
  const [productSubCategory, setProductSubCategory] = useState([])
  const [image, setImage] = useState({})
  const [imageuploadedCount, setImageUploadedCount] = useState(0)
  const [isImageUploading, setImageUploading] = useState(false)
  const [isImageDeleting, setIsImageDeleting] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [formError, setFormError] = useState({})
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { id, value } = e.target
    setProductData({ ...productData, [id]: value })
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

  const handleFirstImageSelectChange = (e) => {
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

  const uploadImageOne = async (e) => {
    e.preventDefault()
    if (validateImage()) {
      setImageUploading(true)
      if (productData.productImage.length < 3) {
        const formData = new FormData()
        formData.append("file", image)
        const backendResponse = await fetch(backendRoutesAPI.admin.uploadImage.url, {
          method: backendRoutesAPI.admin.uploadImage.method,
          credentials: "include",
          body: formData
        })
        const fianlRes = await backendResponse.json();
        if (fianlRes.success) {
          setImageUploading(false)
          toast.success(fianlRes.message)
          setImageUploadedCount(imageuploadedCount + 1)
          setProductData((prevData) => {
            return {
              ...prevData,
              productImage: [...prevData.productImage, fianlRes.data]
            }
          })
          setImage({})
        }
      }
      else {
        toast.error("At Max three Images Will be uploaded")
      }
    }
  }

  const checkError = (data) => {
    const error = {}
    if (!data.productName) { error.productName = "Product Name is required" }

    if (!data.productDescription) { error.productDescription = "product description is required" }
    else if ((data.productDescription).length < 25) { error.productDescription = "The description must have atleast 25 charachter long" }
    else if ((data.productDescription.trim).length > 250) { error.productDescription = "The description should not be more than 250 charachter long" }

    if (!data.productBrand) { error.productBrand = "Product Brand is required" }

    if (data.productListingPrice <= 0) { error.productListingPrice = "Listing Price can not be equal to 0 or below it" }
    if (data.productSellingPrice <= 0) { error.productSellingPrice = "Selling Price can not be equal to 0 or below it" }

    if (!data.category) { error.category = "Main category required" }
    if (!data.subcategory) { error.subcategory = "Sub Category required" }

    if (data.productImage.length < 3) {
      if (data.productImage.length === 0) {
        error.productImage = "Uplaod 3 Product Images"
      }
      else if (data.productImage.length === 1) {
        error.productImage = "Uplaod 2 more Product Images"
      }
      else if (data.productImage.length === 2) {
        error.productImage = "Uplaod 1 more Product Images"
      }
    }

    return error;
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError(checkError(productData))
    setIsSubmit(true)
  }

  const sendProductDetailToBackend = async () => {
    console.log("Sending.....")
    const backendResponse = await fetch(backendRoutesAPI.admin.addProduct.url, {
      method: backendRoutesAPI.admin.addProduct.method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(productData)
    })
    const finalResponse = await backendResponse.json()
    console.log(finalResponse);
    if (finalResponse.success) {
      setProductData({
        productName: "",
        productBrand: "",
        productDescription: "",
        productListingPrice: 0,
        productSellingPrice: 0,
        category: "",
        subcategory: "",
        productImage: [],
      })
      setProductSubCategory([])
      toast.success(finalResponse.message)
      setIsSubmit(false)
      setImageUploadedCount(0)
      navigate("/admin-pannel/add-products")
    }
    else {
      toast.error(finalResponse.message)
      window.location.href = "/admin-pannel/add-products"
    }
  }

  const handleDelete = async (imageURL) => {
    setIsImageDeleting(true)
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
    console.log(productData.productImage)
    if (finalResponse.success) {
      const deletedimageIndex = copyOFImageURl.indexOf(imageURL)
      setImageUploadedCount(imageuploadedCount - 1)
      copyOFImageURl.splice(deletedimageIndex, 1)
      setProductData((prevData) => {
        return {
          ...prevData,
          productImage: copyOFImageURl
        }
      })
      setIsImageDeleting(false)
      toast.success("Image Deleted Successfully")
    }
  }

  useEffect(() => {
    const categoriesArray = Object.keys(productCategories)
    setProductcategory(categoriesArray);
  }, [])

  useEffect(() => {
    if (Object.keys(formError).length === 0 && isSubmit) {
      sendProductDetailToBackend()
    }
    else {
      setIsSubmit(false)
    }
  }, [formError])


  return (
    <>
      {
        isSubmit ? (<LoaderTwo />) : (
          <div className='w-full  px-4  flex flex-col justify-center items-center' style={{ backgroundColor: "#EDF6F9" }}>
            {/*  Heading */}

            <div className="head text-4xl py-2 font-bold">
              <h1>Add New Product To List</h1>
            </div>
            {/* Form Section */}

            <div className="form-div w-full max-w-4xl rounded-lg bg-white" >
              <form className='grid ml-28 mr-28 p-4 gap-2'>

                {/* Product Name */}

                <label htmlFor='productName' className='text-xl font-semibold mt-4'>Name of Product :</label>
                <input
                  type='text'
                  id='productName'
                  value={productData.productName}
                  className='border bg-white px-2 py-2 rounded-sm'
                  placeholder='Enter the name of the Product'
                  onChange={handleChange} />
                <p className='text-red-500'>{formError.productName}</p>

                {/* Product Brand */}

                <label htmlFor='productBrand' className='text-xl font-semibold mt-4'>Brand of Product :</label>
                <input
                  type='text'
                  id='productBrand'
                  value={productData.productBrand}
                  className='border bg-white px-2 py-2 rounded-sm'
                  placeholder='Enter the Brand of the Product'
                  onChange={handleChange}
                />
                <p className='text-red-500'>{formError.productBrand}</p>

                {/* Product Description */}

                <label htmlFor='productDescription' className='text-xl font-semibold mt-4'>Product Description :</label>
                <textarea
                  type='text'
                  id='productDescription'
                  value={productData.productDescription}
                  className='border bg-white px-2 py-2 rounded-sm'
                  placeholder='Description About Product' onChange={handleChange}></textarea>
                <p className='text-red-500'>{formError.productDescription}</p>

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
                <p className='text-red-500'>{formError.category}</p>

                {/* Product Sub Category */}

                <label htmlFor='subcategory' className='text-xl font-semibold mr-10'>Sub-Category:</label>
                <select value={productData.subcategory} className='border bg-white px-2 py-2 rounded-sm'
                  disabled={productData.category ? false : true}
                  onChange={handleSubCategoryChange} name="subcategory">
                  {
                    productSubCategory.length > 0 ? (productSubCategory.map((el, index) => {
                      return <option value={el} key={index}>{el}</option>
                    })) : <option>Choose The Main Category</option>
                  }
                </select>
                <p className='text-red-500'>{formError.subcategory}</p>

                {/* Product Listing Price */}

                <div className="pricing flex items-center mt-4">
                  <label htmlFor='productListingPrice' className='text-xl font-semibold mr-10'>Product Listing Price :</label>
                  <input
                    type='number'
                    id='productListingPrice'
                    value={productData.productListingPrice}
                    className='border bg-white px-2 py-2 rounded-sm w-full max-w-sm'
                    placeholder='Enter Product List Price'
                    onChange={handleChange}
                  />
                </div>
                <p className='text-red-500'>{formError.productListingPrice}</p>

                {/* Product Selling Price */}

                <div className="pricing flex items-center mt-4">
                  <label htmlFor='productSellingPrice' className='text-xl font-semibold mr-10'>Product Selling Price :</label>
                  <input
                    type='number'
                    id='productSellingPrice'
                    value={productData.productSellingPrice}
                    className='border bg-white px-2 py-2 rounded-sm w-full max-w-sm'
                    placeholder='Enter Product Selling Price'
                    onChange={handleChange}
                  />
                </div>
                <p className='text-red-500'>{formError.productSellingPrice}</p>

                {/* Upload Image Section */}

                <div className="upload-images mt-4 bg-white py-2 px-2 flex  flex-col gap-3">
                  <h1 className='text-xl font-semibold mr-10'>Upload Product Image :</h1>
                  <div className="product-image px-4 flex flex-col gap-4">
                    {
                      isImageUploading ? (<LoaderTwo />) : (
                        <div className="image1 flex justify-between items-center">
                          <label htmlFor='image1'
                            className='text-lg py-4 w-full cursor-pointer max-w-[400px] px-4 font-semibold flex flex-col rounded-xl justify-center items-center'
                            style={{ backgroundColor: "#83C5BE89" }}>
                            <span className='text-4xl'><IoMdCloudUpload /></span>
                            <h1 className='text-xs'>{image?.name ? `${image.name}` : "Choose Image"}</h1>
                            <input
                              name='image1'
                              id='image1'
                              className='border hidden bg-slate-200 rounded-sm w-full max-w-sm'
                              type="file" onChange={handleFirstImageSelectChange}
                              disabled={productData.productImage.length === 3 ? true : false} />
                          </label>
                          <div>
                            <button
                              className='border max-w-28 py-2 rounded-lg bg- mx-auto block px-4'
                              disabled={productData.productImage.length === 3 ? true : false}
                              style={{ backgroundColor: "#006D77", color: "#fff" }} onClick={uploadImageOne}>Upload</button>
                          </div>
                        </div>
                      )
                    }

                  </div>
                </div>
                <p className='text-red-500'>{formError.productImage}</p>

                {/* Image Preview Section */}

                {
                  isImageDeleting ? <LoaderTwo /> :
                    (
                      <div className="image-preview flex flex-col  gap-2">
                        <p className='text-xl font-semibold'>Image Priview :<span className='ml-1 text-lg'>{imageuploadedCount}/3</span></p>
                        <div className="images flex justify-evenly items-center z-50" style={isImageUploading ? {display:"none"}: {display:"flex"}}>
                          {
                            productData.productImage.length > 0
                              ? (
                                productData.productImage.map((el, index) => {
                                  return (
                                    <div className='relative group' key={index} >
                                      {/* Preview Image */}
                                      <img src={el} key={index} style={{ height: "150px", width: "150px" }} />
                                      {/* Delete Image Button */}
                                      <div className='text-2xl rounded-xl cursor-pointer p-1 absolute  bottom-0 right-0 hidden group-hover:block'
                                        style={{ backgroundColor: "#83C5BE", color: "#ff0054" }}  >
                                        <MdDelete key={index + 0.1} onClick={() => handleDelete(el)} />
                                      </div>
                                    </div>
                                  )
                                })
                              )
                              : null
                          }
                        </div>


                      </div>
                    )
                }

                {/* Submit Button */}

                <button
                  className='border text-xl font-medium mt-4 max-w-fit mx-auto block py-2 px-4 rounded-xl'
                  onClick={handleSubmit}
                  style={{ backgroundColor: "#006D77", color: "#EDF6F9" }}>
                  Confirm</button>
              </form >
            </div >
          </div >
        )
      }
    </>


  )
}

export default AddProducts
