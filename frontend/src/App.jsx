import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'
import Home from './pages/Home'
import {Toaster} from 'sonner'
// import { TbRuler2 } from 'react-icons/tb'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CollectionPage from './pages/CollectionPage'
import ProductDetail from './components/Products/ProductDetail'
import Checkout from './components/Cart/Checkout'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
const App = () => {
  return (
    <BrowserRouter>
    <Toaster position="top-right"/>
    <Routes>
      <Route path="/" element ={<UserLayout/>}>
        <Route index element={<Home/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="register" element={<Register/>}/>
        <Route path="profile" element={<Profile/>}/>
        <Route path="collections/:collection" element={<CollectionPage/>}/>
        <Route path="product/:id"element={<ProductDetail/>}/>
        <Route path="checkout" element={<Checkout/>}/>
        <Route path="order-confirmation" element={<OrderConfirmationPage/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App