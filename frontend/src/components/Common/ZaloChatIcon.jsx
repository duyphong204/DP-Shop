import React from 'react'
import zaloIcon from "../../../assets/zaloicon.webp"

const ZaloChatIcon = () => {
    return (
        <div className='fixed z-50 lg:bottom-30 bottom-20 right-4 lg:right-6 group'>
            <a 
                href="https://zalo.me/0935452263"
                target="_blank"
                rel="noopener noreferrer"
                className='relative'>
                
                <span className='absolute right-full mr-3 translate-y-1/2 bottom-1/2
                                invisible opacity-0 group-hover:visible group-hover:opacity-100
                                bg-black text-white text-sm px-4 py-2 rounded-lg 
                                shadow-lg transition-opacity duration-300 whitespace-nowrap'>
                                Chat với chúng tôi qua Zalo
                </span>

                <img 
                src={zaloIcon} 
                alt="zaloIconChat" 
                className='rounded-full w-12 h-12 lg:w-16 lg:h-16 hover:shadow-2xl cursor-pointer 
                           hover:scale-110 transition-all duration-300 ease-in-out
                           animate-bounce'/> 
            </a>
        </div>
    )
}

export default ZaloChatIcon
