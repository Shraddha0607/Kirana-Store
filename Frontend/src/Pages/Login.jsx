import React, { useEffect, useState, useContext } from 'react'
import loginGif from "../assets/login-nobg.gif"
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import backendRoutesAPI from "../BackendAPI/API.js";
import { toast } from 'react-toastify';
import customerContext from '../Context/index.js';
import Loader from '../Components/loaderComponent/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUserCartDetail, resetProductDetail } from '../Store/cartSlice';

function Login() {
	const customer = useSelector((state) => state?.customer?.customer)
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: ""
	});
	const [formErrors, setFormErrors] = useState({});
	const [isSubmit, setIsSubmit] = useState(false);
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const custContext = useContext(customerContext)

	const handleChnage = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	}
	const handlingFormSubmit = async (e) => {
		e.preventDefault();
		setFormErrors(validateFormData(formData));
		setIsSubmit(true);
		const serializedState = localStorage.getItem('addTocart');
		try {
			const backendAPIResponse = await fetch(
				backendRoutesAPI.signin.url, {
				method: backendRoutesAPI.signin.method,
				credentials: "include",
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(formData)
			}
			)
			const finalData = await backendAPIResponse.json();
			if (finalData.success) {
				toast.success(finalData.message)
				await custContext.getCustomerDetail()
				dispatch(getCurrentUserCartDetail())
				try {
					if (serializedState !== null) {
						//saveCartDataToDB(serializedState,finalData.data.customerData?._id)
					}
				} catch (err) {
					console.error('Could not load state', err);
				}
			}
			else {
				if (finalData.message.includes("You are Not Registered")) {
					toast.error(finalData.message);
					navigate("/signup");
				}
				else {
					toast.error(finalData.message)
					setIsSubmit(false)
				}

			}
		} catch (error) {
			toast.error("Server Is Not Responding")
			setIsSubmit(false)
		}
	}

	// If the user want to add the product to cart and the logged in so this function
	// save the cart data in the data base 
	const saveCartDataToDB = async (data, id) => {
		const backendAPIResponse = await fetch(backendRoutesAPI.guestCustomerCartDetail.url, {
			method: backendRoutesAPI.guestCustomerCartDetail.method,
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ cartData: data, _id: id })
		})
		const finalRes = await backendAPIResponse.json()
		if (finalRes.success) {
			localStorage.removeItem('addTocart')
			dispatch(resetProductDetail())
			getCustomerCartData()

		}
		else {
			toast.error(finalRes.message)
			navigate('/')
		}
	}

	const validateFormData = (values) => {
		const error = {};
		if (!values.email) { error.email = "Email is required" }
		if (!values.password) { error.password = "Password is required" }
		else if (values.password.length < 4) { error.password = "Password should be atleast of 4 character" }
		else if (values.password.length > 20) { error.password = "Password should not exceeds 10 character" }
		return error;
	}

	useEffect((() => {
		if (Object.keys(formErrors).length === 0 && isSubmit) {
			return
		}
	}), [formErrors, formData])


	useEffect((() => {
		if (customer) {
			navigate("/")
		}
	}), [customer])

	return (

		<>
			{
				isSubmit ?
					<div className=' text-xl sm:text-3xl py-44 h-full w-full text-center flex justify-center items-center align-middle'>
						<Loader text={'LOGGING.....'} />
					</div>

					: (
						<div className="container mx-auto p-4">
							<div className='p-6 w-full max-w-xl mx-auto rounded-2xl shadow-2xl' style={{ backgroundColor: "#fff" }}>
								<div className='h-20 w-20 mx-auto flex items-center mt-8 mb-4'>
									<img src={loginGif} alt='login-gif' />
								</div>
								<form className='flex flex-col' onSubmit={handlingFormSubmit}>
									<div className="grid credentials mt-8 mb-8 ">
										<label className="text-xl" htmlFor='email'>Email Id:&nbsp;&nbsp;  </label>
										<div className='bg-slate-100 p-2'>
											<input type='email' id='email' placeholder='Enter Your email'
												className='w-full h-full outline-none bg-transparent' value={formData.email}
												onChange={handleChnage} name='email' />
										</div>
										<p className='text-red-600 px-2'>{formErrors.email}</p>
									</div>

									<div className=" grid credentials mt-8 mb-8">
										<label className="text-xl" htmlFor='password'>Password:&nbsp; &nbsp;  </label>
										<div className='bg-slate-100 p-2 flex items-center'>
											<input type={showPassword ? 'text' : 'password'} id='password' placeholder='Enter Your Password'
												className='w-full h-full outline-none bg-transparent' value={formData.password}
												onChange={handleChnage} name='password' />
											<div onClick={() => setShowPassword((prevState) => !prevState)}
												className='cursor-pointer text-xl'>
												{showPassword ? <FaEyeSlash /> : <FaEye />}
											</div>
										</div>
										<p className='text-red-600 px-2'>{formErrors.password}</p>
										<Link to={"/forgotPassword"}>
											<p className='block w-fit ml-auto hover:text-blue-500 hover:underline'>
												Forget Password ? </p>
										</Link>
									</div>
									<button className="credential-btn mt-8 mb-4 px-5 py-2 rounded-full w-full 
                                                      max-w-[150px] hover:scale-110 transition-all text-lg block mx-auto"
										style={{ backgroundColor: "#006D77", color: '#fff' }} type='submit'>Login</button>
								</form>
								<p className='mt-5 text-sm w-full '>
									Don't have Account ? <Link to={"/signup"} className="hover:underline" style={{ color: "blue" }}>Sign-Up</Link>
								</p>
							</div>
						</div>
					)
			}
		</>

	)
}

export default Login
