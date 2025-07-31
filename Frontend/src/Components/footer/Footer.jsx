import React from 'react'
import { FaCopyright } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { IoLogoGithub } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa";
function Footer() {
  return (
    <section className="absolute right-0 left-0 bottom-0 overflow-hidden py-2" 
      style={{backgroundColor:"#006D77"}}>
        <div className='container flex flex-col sm:grid sm:grid-cols-12 gap-4 px-2'>
          <p className='flex md:flex-row flex-shrink-0 justify-start items-start gap-2 sm:col-span-4 text-lg text-[#EDF6F9]'>
            Demo Project 
            <span className='flex flex-shrink-0 items-center gap-2'><FaCopyright/> Copyright 2024</span>
          </p>
          <div className='sm:col-span-4 flex justify-start sm:justify-center gap-3 items-center text-2xl text-[#EDF6F9]'>
            <FaLinkedin className='cursor-pointer' onClick={()=> window.open('https://www.linkedin.com/in/rishabh-gupta-83b991266')}/>
            <IoLogoGithub className='cursor-pointer' onClick={()=> window.open('https://github.com/143KRISHU/KIRANA-STORE')}/>
            <FaExternalLinkAlt/>
          </div>
          <p className='sm:col-span-4  text-left sm:text-right text-lg text-[#EDF6F9]'>Developed By : Rishabh Gupta</p>
        </div>
    </section>
  )
}

export default Footer
