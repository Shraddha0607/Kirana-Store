import React, { useEffect, useState } from 'react'
import image1 from "../../assets/banner/image1.webp"
import image2 from "../../assets/banner/image2.webp"
import image3 from "../../assets/banner/image3.webp"
import image4 from "../../assets/banner/image4.webp"
import image5 from "../../assets/banner/image5.webp"
import image6 from "../../assets/banner/image6.webp"
import image7 from "../../assets/banner/image7.jpg"
import image8 from "../../assets/banner/image8.jpg"
import { IoChevronForward } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";


function Banner({ heading }) {
      const bannerImages = [image1, image2, image3, image4, image5, image6, image7, image8]
      const [bannerSlideCount, setBannerSlideCount] = useState(0)

      const handlePrevBannerImage = () => {
            if (bannerSlideCount === 0) {
                  setBannerSlideCount(bannerImages.length - 1)
            }
            else {
                  setBannerSlideCount(bannerSlideCount - 1)
            }
      }
      const handlenextBannerImage = () => {
            if (bannerSlideCount === bannerImages.length - 1) {
                  setBannerSlideCount(0)
            }
            else {
                  setBannerSlideCount(bannerSlideCount + 1)
            }
      }
      useEffect(() => {
            const imageSlideInterval = setInterval(() => {
                  if (bannerSlideCount < bannerImages.length - 1) {
                        handlenextBannerImage()
                  }
                  else {
                        setBannerSlideCount(0)
                  }
            }, 5000)
            return () => clearInterval(imageSlideInterval)
      })
      return (
            <div className='bannerDiv md:h-72 md:w-full h-64 sm:h-44 mt-4 rounded-2xl relative cursor-pointer'>
                  <div className=' z-30 h-fit w-full md:flex justify-between absolute top-[35%] items-center hidden'>
                        <div onClick={handlePrevBannerImage} className='text-2xl shadow-lg text-black h-24 w-8 flex justify-center items-center edgeRound-left bg-white'><IoIosArrowBack /></div>
                        <div onClick={handlenextBannerImage} className='text-2xl shadow-lg text-black h-24 w-8 flex justify-center items-center edgeRound-right bg-white'><IoChevronForward /></div>

                  </div>
                  <div className='absolute userSelectNone circleBubble  flex left-[46%] bg-slate-600 bg-opacity-30 px-2 rounded-full py-1 w-fit gap-1 items-center justify-center z-40 bottom-0'
                        >
                        {
                              bannerImages.map((_, index) => {
                                    return (
                                          <div key={index} style={{
                                                backgroundColor:`${bannerSlideCount === index ? 'white' : 'grey'}`,
                                                height:'0.5rem',
                                                width:`${bannerSlideCount === index ?'1rem':'0.5rem'}`,
                                                borderRadius:`${bannerSlideCount === index ?'20px':'50%'}`,
                                                transitionProperty:'all',
                                                transitionDuration:'0.8s',
                                                transitionTimingFunction:'cubic-bezier(0.4, 0, 1, 1)  ',
                                          }}>
                                                <div key={index}></div>
                                          </div>
                                    )
                              })
                        }
                  </div>
                  <div className=' flex h-full w-full overflow-hidden' >
                        {
                              bannerImages.map((image, index) => {
                                    return (
                                          <div key={index} className='h-full w-full min-h-full min-w-full'
                                                style={
                                                      {
                                                            transform: `translateX(-${bannerSlideCount * 100}%)`,
                                                            transitionProperty: 'transform',
                                                            transitionDuration: '0.8s',
                                                            transitionTimingFunction: 'ease-in-out',
                                                      }
                                                }>
                                                <img src={image} className=' h-full w-full rounded-2xl' key={index} />
                                          </div>
                                    )
                              })
                        }
                  </div>
            </div>
      )
}
export default Banner
