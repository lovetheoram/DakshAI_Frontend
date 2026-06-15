import React from 'react'
import Navbar from './Navbar'

export default function PageWrapper({ children }){
  return (
    <div>
      <Navbar />
      <div className="container" style={{paddingTop:16}}>
        {children}
      </div>
    </div>
  )
}
