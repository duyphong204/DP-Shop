import {useNavigate } from 'react-router-dom'
import mensCollectionImg from '../../../assets/mens-collection1.webp'
import womensCollectionImg from '../../../assets/womens-collection2.webp'

const GenderCollectionSection = () => {

  const navigate = useNavigate()

  const handleWomenClick = () => {
       navigate('/collections/all?gender=Women')
    }
  const handleMenClick  = () => {
      navigate('/collections/all?gender=Men')
   }

  return (
    <section className='py-10 lg:py-16 px-4 lg:px-0'>
      <div className='container mx-auto flex flex-row gap-6 sm:gap-8 '>  
        
        {/* women's collection */}
        <div onClick={handleWomenClick} className='relative w-1/2 hover:scale-105 transition-transform duration-500 ease-out cursor-pointer rounded-2xl overflow-hidden'>
          <img
            src={womensCollectionImg}
            alt="womens collection"
            className='w-full h-[300px] sm:h-[500px] lg:h-[700px] object-cover rounded-2xl'
          />
          <div className='absolute bottom-4 sm:bottom-8 left-4 sm:left-8 bg-white bg-opacity-60 p-3 sm:p-4 rounded-2xl'>
            <h2 className='text-sm sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3'>
              Women's Collection
            </h2>
            <p className='text-gray-900 font-semibold underline text-sm mt-1 sm:mt-2'>
              Khám phá ngay →
            </p>
          </div>
        </div>

        {/* men's collection */}
        <div onClick={handleMenClick} className='relative w-1/2 hover:scale-105 transition-transform duration-500 ease-out cursor-pointer rounded-2xl overflow-hidden'>
          <img
            src={mensCollectionImg}
            alt="mens collection"
            className='w-full h-[300px] sm:h-[500px] lg:h-[700px] object-cover rounded-2xl'
          />
          <div className='absolute bottom-4 sm:bottom-8 left-4 sm:left-8 bg-white bg-opacity-60 p-3 sm:p-4 rounded-2xl'>
            <h2 className='text-sm sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3'>
              Men's Collection
            </h2>
            <p className='text-gray-900 font-semibold underline text-sm mt-1 sm:mt-2'>
              Khám phá ngay →
            </p>
          </div>
        </div>
      </div>

    </section>
  )
}

export default GenderCollectionSection