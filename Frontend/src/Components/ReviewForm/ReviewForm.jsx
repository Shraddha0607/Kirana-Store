import React, { useState } from 'react'
import { IoStarOutline } from "react-icons/io5";
import { IoStar } from "react-icons/io5";
import { toast } from 'react-toastify';
import backendRoutesAPI from '../../BackendAPI/API';

function ReviewForm({onClose,productId}) {
	const [rating, setRating] = useState(0)
	const [hover, setHover] = useState(0)
	const [review, setReview] = useState('')

	const handleReviewSubmit = async(e)=>{
		e.preventDefault()
		if(rating===0){
			toast.warning('Zero Star Rating is Not allowed')
		}
		else if(review === ''){
			toast.warning('Please Enter Some Review')
		}
		else if(review.length<10){
			toast.warning('Review Should be More Than 10 Character')
		}
		else{
			try {
				const configAPI = backendRoutesAPI.addProductReview(productId)
				console.log(configAPI)
				const response = await fetch(configAPI.url,{
					method:configAPI.method,
					credentials:"include",
					headers: {
						"content-type": "application/json"
					},
					body:JSON.stringify({rating:rating,review:review})
				})
				const data = await response.json()
				if(data.success){
					toast.success(data.message)
					onClose()
				}
				else{
					toast.error(data.message)
					onClose()
				}
			} catch (error) {
				toast.error(error)
			}
		}
	}

	return (
		<div className='absolute w-full top-0 bottom-0 right-0 left-0 bg-slate-400 bg-opacity-30 flex justify-center items-start sm:items-center px-2 py-10'>
			<div className='grid grid-cols-12 bg-white h-fit w-[32rem] md:w-[36rem] justify-start items-center shadow-lg rounded-3xl'>
				<div className='rounded-3xl col-span-4 w-full h-full px-2 text-center flex justify-center items-center bg-[#006D77]'>
					<h1 className='text-3xl font-semibold text-[#EDF6F9] animate-pulse'>
						<p>ADD</p>
						<p>YOUR</p>
						<p>REVIEW</p>
					</h1>
				</div>
				<form className='w-full  flex flex-col px-3 py-3 gap-6 col-span-8'>
					{/* Star Rating Component */}
						<div className='w-full flex gap-2'>
							{
								[...Array(5)].map((_,index)=>{
									return(
										<span 
											className={`text-4xl cursor-pointer 
																	${index+1 <= (rating || hover) ?'text-yellow-500':'text-[#000]'}`}
											key={index}
											onClick={()=>{setRating(index+1)}}
											onMouseOver={()=>{
												setRating(0)
												setHover(index+1)}}
											onMouseLeave={()=>setHover(0)}
										>
												{index+1 <= (rating || hover) ?<IoStar/>:<IoStarOutline/>}
										</span>
									)
								})
							}
						</div>
					{/* Type Your Review */}
					<div className='w-full'>
							<textarea  
								name='review' 
								value={review} 
								rows={5}
								onChange={(e)=>{setReview(e.target.value)}} 
								placeholder='Share Your Experience' 
								className='bg-white w-full p-2 border-2 rounded-lg'></textarea> 
						</div>
					<div className='w-full flex justify-between items-center px-4'>
					<button
						className='text-2xl px-4 py-1.5 border rounded-xl shadow-md bg-[#006D77] text-[#EDF6F9]'
						onClick={(e)=>handleReviewSubmit(e)}						
					>
						Post
					</button>
					<button 
						className='text-2xl px-4 py-1.5 border rounded-xl shadow-md bg-red-500 text-[#EDF6F9]'	
						onClick={(e)=>{
							e.preventDefault()
							onClose()}}
					>
							Close
					</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default ReviewForm
