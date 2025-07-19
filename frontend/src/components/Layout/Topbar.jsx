import React from 'react'
import {TbBrandMeta} from 'react-icons/tb'
const Topbar = () => {
  return (
    <div className='bg-[#ea2e0e] text-white'>
        <div className='container mx-auto'>
            <div>
                <a href="#" className='hover:text-gray-300'>
                    <TbBrandMeta className='h-5 w-5'/>
                </a>
            </div>
        </div>
    </div>
  )
}

export default Topbar