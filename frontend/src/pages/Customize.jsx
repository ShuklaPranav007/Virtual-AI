import React from 'react'
import Card from '../components/Card'
import img1 from "../assets/ai1.jpg"
import img2 from "../assets/ai2.jpg"
import img3 from "../assets/ai3.jpg"
import img4 from "../assets/ai4.jpg"

const Customize = () => {
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t form-[black] to-[#030353]'>
      <div className='w-[90%] max-w-[60%] flex justify-center items-center flex-wrap'>
      <Card image={img1}/>
      <Card image={img2}/>  
      <Card image={img3}/>
      <Card image={img4}/>
      </div>
    </div>
  )
}

export default Customize