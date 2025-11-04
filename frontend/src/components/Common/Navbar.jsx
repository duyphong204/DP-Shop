  import React, { useState, useMemo } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { HiOutlineUser, HiOutlineShoppingBag, HiMagnifyingGlass, HiBars3BottomRight } from "react-icons/hi2";
  import { IoMdClose } from "react-icons/io";
  import { useSelector, shallowEqual } from "react-redux";
  import { Heart } from "lucide-react";

  import SearchBar from "./SearchBar";
  import CartDrawer from "../Layout/CartDrawer";
  import WishlistBar from "./WishlistBar";

  const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const [toggleWishlist, setToggleWishlist] = useState(false);

    const { cart } = useSelector((state) => state.cart, shallowEqual);
    const { user } = useSelector((state) => state.auth, shallowEqual);
    const { items: wishlistItems } = useSelector((state) => state.wishList, shallowEqual);

    const navigate = useNavigate();

    const cartItemCount = useMemo(() => cart?.products?.reduce((t, p) => t + p.quantity, 0) || 0, [cart]);
    const wishListItemCount = useMemo(() => wishlistItems?.length || 0, [wishlistItems]);

    const handleSearch = (term) => {
      navigate(`/collections/all?search=${term}`);
    };

    return (
      <>
        {/* ================= Navbar ================= */}
        <nav className="container mx-auto flex items-center justify-between py-2 md:py-4 px-4 sm:px-6 gap-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-medium flex-shrink-0">
            ROBIN
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            {[
              { path: "/collections/all?gender=Men", label: "Men" },
              { path: "/collections/all?gender=Women", label: "Women" },
              { path: "/collections/all?category=Top Wear", label: "Top" },
              { path: "/collections/all?category=Bottom Wear", label: "Bottom" },
              { path: "/about", label: "About us" },
              { path: "/", label: "Contact" },
            ].map((link) => (
              <Link key={link.label} to={link.path} className="text-sm font-medium text-gray-700 hover:text-black uppercase">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Icons + Search (Desktop + Mobile Search) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Admin */}
            {user?.role === "admin" && (
              <Link to="/admin" className="bg-black text-white text-xs px-2 py-1 rounded hidden md:block">
                Admin
              </Link>
            )}

            {/* Search - Mobile & Desktop */}
            <div className="flex-1 min-w-0">
                <SearchBar onSearch={handleSearch} />
            </div>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/profile" className="text-gray-700 hover:text-black">
                <HiOutlineUser className="w-6 h-6" />
              </Link>

              {user && (
                <button onClick={() => setToggleWishlist(!toggleWishlist)} className="relative text-gray-700 hover:text-black">
                  <Heart className="w-6 h-6" />
                  {wishListItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishListItemCount > 9 ? "9+" : wishListItemCount}
                    </span>
                  )}
                </button>
              )}

              <button onClick={() => setDrawerOpen(!drawerOpen)} className="relative text-gray-700 hover:text-black">
                <HiOutlineShoppingBag className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            <button onClick={() => setNavDrawerOpen(true)} className="md:hidden text-gray-700">
              <HiBars3BottomRight className="w-6 h-6" />
            </button>
          </div>
        </nav>

        {/* ================= Mobile Floating Bottom Bar (Admin, User, Wishlist, Cart) ================= */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 z-40 md:hidden">
          <div className="flex items-center justify-around">

            {/* Admin */}
            {user?.role==="admin" &&(
              <Link to='admin' className="flex flex-col items-center text-gray-700">
                <div className="w-5 h-5 text-white rounded-2xl bg-black flex items-center justify-center font-bold text-[10px]">
                  A
                </div>
                <span className="text-xs mt-1">Admin</span>
              </Link>
            )}

            {/* User */}
            <Link to="/profile" className="flex flex-col items-center text-gray-700">
              <HiOutlineUser className="w-5 h-5" />
              <span className="text-xs mt-1">Tài khoản</span>
            </Link>

            {/* Wishlist */}
            {user && (
              <button onClick={() => setToggleWishlist(!toggleWishlist)} className="flex flex-col items-center text-gray-700 relative">
                <Heart className="w-5 h-5" />
                {wishListItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {wishListItemCount > 9 ? "9+" : wishListItemCount}
                  </span>
                )}
                <span className="text-xs mt-1">Yêu thích</span>
              </button>
            )}

            {/* Cart */}
            <button onClick={() => setDrawerOpen(!drawerOpen)} className="flex flex-col items-center text-gray-700 relative">
              <HiOutlineShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
              <span className="text-xs mt-1">Giỏ hàng</span>
            </button>
          </div>
        </div>

        {/* ================= Drawers ================= */}
        <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={setDrawerOpen} />
        <WishlistBar toggleWishlist={toggleWishlist} setToggleWishlist={setToggleWishlist} />

        {/* Mobile Nav Drawer */}
        <div className={`fixed inset-y-0 left-0 w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex justify-end p-4">
            <button onClick={() => setNavDrawerOpen(false)}>
              <IoMdClose className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <nav className="px-6 space-y-4">
            {[
              { path: "/collections/all?gender=Men", label: "Men" },
              { path: "/collections/all?gender=Women", label: "Women" },
              { path: "/collections/all?category=Top Wear", label: "Top Wear" },
              { path: "/collections/all?category=Bottom Wear", label: "Bottom Wear" },
              { path: "/about", label: "About Us" },
            ].map((link) => (
              <Link key={link.label} to={link.path} onClick={() => setNavDrawerOpen(false)} className="block text-lg font-medium text-gray-700 hover:text-black">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </>
    );
  };

  export default Navbar;