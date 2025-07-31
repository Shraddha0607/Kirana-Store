import React, { useEffect } from 'react'
import { useState } from 'react'
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import {useSelector} from 'react-redux'
import './Steeper.css'

function Steeper() {
      const labels = ['Added To Cart', 'Verification', 'Payment', 'Order Detail']
      const step = useSelector((state)=>state?.steeperStep?.currentStep)
      let cartData = useSelector((state) => state?.addTocart)
      let allProduct = cartData?.items
      const [currentStep, setcurrentStep] = useState(step+1)

      useEffect(()=>{
            setcurrentStep(step+1)
      },[step])
      useEffect(()=>{
            setcurrentStep(step+1)
      },[allProduct])
      
      return (
            <div className='container py-1'>
                  <div className='w-full  py-2 flex justify-between '>
                        {
                              labels.map((label, i) => {
                                    return (
                                          <div
                                                className={`label-item ${i + 1 < currentStep && 'complete-label'} ${currentStep === i + 1 && 'active-label'} transition-colors `} key={i}
                                          >
                                                <div className={` item  ${currentStep === i + 1 && 'active'}
                                                                        ${(i + 1 < currentStep || (currentStep === labels.length)) && 'complete'}`}>
                                                      {i + 1 < currentStep || (currentStep === labels.length)? <span className='text-2xl font-bold'><IoCheckmarkDoneOutline /></span> : i + 1}
                                                </div>
                                                <h1 className={`text-sm sm:text-lg font-bold 
                                                      ${(i + 1 < currentStep || (currentStep === labels.length)) && 'text-green-600'}
                                                      ${currentStep === i + 1 && 'text-blue-600'}`}
                                                >
                                                      {label}
                                                </h1>
                                          </div>
                                    )
                              })
                        }
                  </div>
            </div>
      )
}

export default Steeper
