import { Link } from 'react-router-dom'
import mensCollectionImg from '../../../assets/mens-collection1.webp'
import womensCollectionImg from '../../../assets/womens-collection2.webp'

const GenderCollectionSection = () => {
  return (
    <section className='py-16 px-4 lg:px-0'>
      <div className='container mx-auto flex flex-row gap-4 sm:gap-8'>
        {/* women's collection */}
        <div className='relative w-1/2'>
          <img
            src={womensCollectionImg}
            alt="womens collection"
            className='w-full h-[400px] sm:h-[500px] lg:h-[700px] object-cover rounded-3xl'
          />
          <div className='absolute bottom-4 sm:bottom-8 left-4 sm:left-8 bg-white bg-opacity-90 p-3 sm:p-4 rounded-2xl'>
            <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3'>
              Women's Collection
            </h2>
            <Link to="/collections/all?gender=Women" className='text-gray-900 underline'>
              Shop Now
            </Link>
          </div>
        </div>
        {/* men's collection */}
        <div className='relative w-1/2'>
          <img
            src={mensCollectionImg}
            alt="mens collection"
            className='w-full h-[400px] sm:h-[500px] lg:h-[700px] object-cover rounded-3xl'
          />
          <div className='absolute bottom-4 sm:bottom-8 left-4 sm:left-8 bg-white bg-opacity-90 p-3 sm:p-4 rounded-2xl'>
            <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3'>
              Men's Collection
            </h2>
            <Link to="/collections/all?gender=Men" className='text-gray-900 underline'>
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GenderCollectionSection