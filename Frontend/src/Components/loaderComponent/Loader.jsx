import React from 'react'
import './Loader.css'

function Loader({text='Loading...'}) {
      return (
            <div className="pl">
                  <div className="pl__dot"></div>
                  <div className="pl__dot"></div>
                  <div className="pl__dot"></div>
                  <div className="pl__dot"></div>
                  <div className="pl__dot"></div>
                  <div className="pl__dot"></div>
                  <div className="pl__dot"></div>
                  <div className="pl__dot"></div>
                  <div className="pl__dot"></div>
                  <div className="pl__dot"></div>
                  <div className="pl__dot"></div>
                  <div className="pl__dot"></div>
                  <div className="pl__text">{text}</div>
            </div>
      )
}

export default Loader
