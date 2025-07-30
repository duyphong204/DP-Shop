import { useEffect, useRef, useState } from "react"
import {FaFilter} from "react-icons/fa"
import FilterSlideBar from "../components/Products/FilterSlideBar"
import SortOptions from "../components/Products/SortOptions"
import ProductGrid from "../components/Products/ProductGrid"
import { useParams, useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchProductsByFilters } from "../redux/slices/productsSlice"


const CollectionPage = () => {
  const {collection} = useParams()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const {products,loading, error} = useSelector((state)=>state.products)
  const queryParams = Object.fromEntries([...searchParams])

  // const [products,setProducts]=useState([])
  const slidebarRef = useRef(null)

  useEffect(()=>{
    dispatch(fetchProductsByFilters({collection, ...queryParams}))
  },[dispatch,collection,searchParams])

  const [isSlidebarOpen,setIsSlidebarOpen] = useState(false)
  const toggleSlidebar = () =>{
    setIsSlidebarOpen(!isSlidebarOpen)
  }

  const handleClickOutside = (e)=>{
    // close slidebar if clicked outside 
    if(slidebarRef.current && ! slidebarRef.current.contains(e.target)){
      setIsSlidebarOpen(false)
    }
  }
  useEffect(()=>{
    // add event listner for clicks 
    document.addEventListener("mousedown",handleClickOutside)
    //clean event listener 
    return ()=>{
      document.removeEventListener("mousedown",handleClickOutside)
    }
  },[])

 

  return (
    <div className="flex flex-col lg:flex-row">
      {/* mobile filter button  */}      

      <button 
        onClick={toggleSlidebar} 
        className="lg:hidden border p-2 flex justify-center items-center">
        <FaFilter className="mr-2"/>
      </button>

      {/* filter slidebar  */}
      <div ref={slidebarRef} 
      className={`${isSlidebarOpen ? "translate-x-0" 
      : "-translate-x-full"} fixed inset-y-0 z-50 
      left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>
        <FilterSlideBar/>
      </div>

        <div className="flex-grow p-4">
          <h2 className="text-2xl uppercase mb-4">All Collection</h2>
          {/* sort option  */}
          <SortOptions/>
          {/* product grid */}
          <ProductGrid products={products} loading={loading} error={error}/>
        </div>

    </div>
  )
}

export default CollectionPage