import React from 'react'
import Header from '../header'




const Wrapper = ({ children }) => {
  return (
    <>
        <Header />
            <main>{children}</main>
    </>
  )
}

export default Wrapper