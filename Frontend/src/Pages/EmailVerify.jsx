import React, { useState, useEffect, Fragment } from 'react'
import verified from "../assets/verified.gif"
import failed from "../assets/Fail.gif"
import { Link, useParams } from "react-router-dom";

function EmailVerify() {
      const [validUrl, setValidUrl] = useState(false);
      const params = useParams();

      const verifyEmailUrl = async () => {
            try {
                  const url = `http://localhost:3000/api/v1/customer/${params.id}/verify/${params.token}`
                  const res = await fetch(url,
                        {
                              method: "post",
                              headers: {
                                    "content-type": "application/json"
                              }
                        })
                  const data = await res.json();
                  if (data.success) {
                        setValidUrl(true);
                  }
            } catch (error) {
                  console.log(error)
                  setValidUrl(false);
            }
      }

      useEffect(() => {
            verifyEmailUrl()
      }, [params]);

      return (
            <Fragment >
                  {
                        validUrl
                              ? (
                                    <div className="flex flex-col items-center mx-auto gap-5">
                                          <img src={verified} alt='verified image'style = {{ marginTop: "2rem" ,border: "5px solid black", filter:"drop-shadow(0px 4px 16px black)"}} />
                                          <h1 className='text-4xl text-green-500 px-4'>Email Verified Successfully</h1>
                                          {/* <Link to={"/login"} className='px-6 text-center text-2xl rounded-xl mb-4'
                                                style={{ backgroundColor: "#006D77" ,color:"white"}}>
                                                <button>Click to Login</button>
                                          </Link> */}
                                    </div>

                              ) : (
                              <div className='flex flex-col items-center mx-auto gap-5'>
                                    <h1 className='text-6xl text-red-600'>404 : Page Not Found</h1>
                                    <img src={failed} alt='failed image' style = {{border: "5px solid black", filter:"drop-shadow(0px 4px 16px black)"}}/>
                                    <h2 className='text-4xl text-blue-600 px-4'>The Verification Link Is Expired </h2>
                                    {/* <Link to={"/login"}>
                                                <button className='px-6 text-center text-2xl rounded-xl mb-4'
                                                style={{ backgroundColor: "#006D77" ,color:"white"}}>
                                                      Click here to go Login Page</button>
                                    </Link> */}
                              </div>
                              
                              )
                  }
            </Fragment>
      )
}

export default EmailVerify