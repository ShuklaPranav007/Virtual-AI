import React from 'react'

const Card = ({ image }) => {
  return (
    <div className='w-[150px] h-[250px] bg-[#030326] border-2 border-blue-500 rounded-2xl cursor-pointer hover:scale-105 transition'>
      <img 
        src={image} 
        className='h-full w-full object-cover rounded-2xl' 
        alt="assistant" 
      />
    </div>
  )
}

export default Card