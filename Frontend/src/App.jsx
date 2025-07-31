import { Outlet, useNavigate } from "react-router-dom"
import Header from "./Components/header/Header"
import Footer from "./Components/footer/Footer"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import backendRoutesAPI from "./BackendAPI/API.js"
import customerContext from "./Context/index.js";
import { useDispatch, useSelector } from "react-redux"
import { setCustomerDetail } from "./Store/customerSlice.js";
import { resetProductDetail, setCurrentCustomerCartDetail } from "./Store/cartSlice.js";

function App() {

  const dispatch = useDispatch()
  const user = useSelector((state)=>state?.customer?.customer)
  const getCustomerDetail = async () => {
    const backendAPIResponse = await fetch(backendRoutesAPI.current_user.url, {
      method: backendRoutesAPI.current_user.method,
      credentials: "include"
    })
    const finalResponse = await backendAPIResponse.json()
    if (finalResponse.success) {
      dispatch(setCustomerDetail(finalResponse.data))
      // getCustomerCartData()
      return
    }
    else {
      return
    }
  }
  const getCustomerCartData = async () => {
    const backendApiResponse = await fetch(backendRoutesAPI.getCustomerCartDetail.url, {
      method: backendRoutesAPI.getCustomerCartDetail.method,
      credentials: "include"
    })
    const finalResponse = await backendApiResponse.json()
    if (finalResponse.success) {
      dispatch(setCurrentCustomerCartDetail(finalResponse.data))
    }
  }

  useEffect(() => {
    getCustomerDetail()
  },[])

  return (
    <>
      <customerContext.Provider value={{ getCustomerDetail }}>
        <header className="header">
          <Header />
        </header>
        <main className="main">
          <section className="container w-full">
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnHover
              theme="dark"           />
            <Outlet />
          </section>
        </main>
        <footer className="footer">
          <Footer />
        </footer>
      </customerContext.Provider>
    </>

  )
}

export default App
