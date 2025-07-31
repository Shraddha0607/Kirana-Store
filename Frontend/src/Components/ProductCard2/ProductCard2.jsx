import { formattedCurrency } from "../../HelperFiles/HelperFunction";
import { MdArrowOutward } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { saveCartItems, setProductDetail } from "../../Store/cartSlice";
import { useDispatch, useSelector } from "react-redux";


export default function ProductCard2({ product }) {
  const currentCustomer = useSelector((state) => state?.customer?.customer)
  const dispatch = useDispatch()
  const naviagte = useNavigate()
  const cart = useSelector((state) => state?.addTocart?.items)
  const addToCartButtonAction = async () => {
    if (currentCustomer) {
      if (cart.length > 0) {
        const conatinsProduct = cart.find((item) => item.product._id.toString() === product._id.toString())
        if (conatinsProduct === undefined) {
          dispatch(setProductDetail(product))
          dispatch(saveCartItems(product))
        }
        else {
          toast.warning(`${product.productName} is already in the cart`)
          naviagte('/yourcart')
        }
      }
      else {
        dispatch(setProductDetail(product))
        dispatch(saveCartItems(product))
      }
    }
    else {
      naviagte('/login')
    }
  }
  return (
    <div className="w-full group grid grid-cols-12 md:flex flex-col gap-2  md:gap-4 justify-center 
                    items-center rounded-xl shadow-xl h-fit md:w-[24rem] sm:w-[20rem] px-2
                    bg-white transition-all duration-300 hover:shadow-2xl">
      {/* Product Image */}
      <div className="relative h-36 w-36 sm:h-40 sm:w-32 md:h-48 md:w-36 lg:h-56 lg:w-44 xl:h-64 
                      xl:w-52 flex md:mt-4 justify-center items-center rounded-lg shadow-lg 
                      transition-transform duration-300 hover:scale-105 p-2 col-span-5">
        <img
          src={product.productImage[0]}
          alt="Product"
          className="object-cover rounded-md h-full w-full transition-opacity 
                    duration-300 hover:opacity-90"
        />
      </div>

      {/* Product Info */}
      <div className="w-full text-start p-2 col-span-7">
        {/* Product Name */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center">
          <h1 className="w-full capitalize text-ellipsis line-clamp-1 items-start text-lg md:text-xl 
            font-bold text-gray-800  hover:cursor-pointer hover:underline"
            onClick={() => { window.open(`/productDetail/${product._id}/view`) }}
          >
            {product.productName}
          </h1>
          <span className="md:flex  hidden text-lg font-bold text-black">{formattedCurrency(product.productSellingPrice)}</span>
        </div>
        <h1 className="w-full capitalize items-start text-sm font-semibold text-gray-400">
          {product.subcategory}
        </h1>
        <span className="md:hidden text-lg font-bold text-black">{formattedCurrency(product.productSellingPrice)}</span>
        <div
          className=" w-full mt-4 text-lg font-semibold text-[#006D77] bg-[#EDF6F9] hover:text-[#EDF6F9]  hover:bg-[#006D77]
          border-2 border-[#006D77]
          transition-colors duration-300 rounded-full py-2 mx-auto px-8 cursor-pointer flex justify-center items-center"
          onClick={() => { addToCartButtonAction() }}
        >
          Add To Cart
        </div>
      </div>
    </div>

  );
}
