import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineShoppingBag } from "react-icons/hi";
import { HiBars3BottomRight } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { useSelector, shallowEqual } from "react-redux";
import { Heart } from "lucide-react";

import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import WishlistBar from "./WishlistBar";

const Navbar = () => {
  // --- State quản lý ---
  const [drawerOpen, setDrawerOpen] = useState(false); // Cart drawer
  const [navDrawerOpen, setNavDrawerOpen] = useState(false); // Mobile nav
  const [toggleWishlist, setToggleWishlist] = useState(false); // Wishlist drawer

  // --- Redux state ---
  const { cart } = useSelector((state) => state.cart, shallowEqual);
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const { items: wishlistItems } = useSelector(
    (state) => state.wishList,
    shallowEqual
  );

  // --- useMemo counts để tránh rerender không cần thiết ---
  const cartItemCount = useMemo(
    () => cart?.products?.reduce((total, p) => total + p.quantity, 0) || 0,
    [cart]
  );

  const wishListItemCount = useMemo(() => wishlistItems?.length || 0, [
    wishlistItems,
  ]);

  return (
    <>
      {/* ================= Navbar Desktop ================= */}
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* --- Logo --- */}
        <div>
          <Link to="/" className="text-2xl font-medium">
            STORE
          </Link>
        </div>

        {/* --- Navigation Links Desktop --- */}
        <div className="hidden md:flex space-x-6">
          {[
            { path: "/collections/all?gender=Men", label: "Men" },
            { path: "/collections/all?gender=Women", label: "Women" },
            { path: "/collections/all?category=Top Wear", label: "Top" },
            { path: "/collections/all?category=Bottom Wear", label: "Bottom" },
            { path: "/about", label: "About us" },
            { path: "/", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* --- Right Icons (User / Wishlist / Cart / Search / Mobile Menu) --- */}
        <div className="flex items-center space-x-5">
          {/* Admin link */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="block bg-black px-1 sm:px-2 rounded text-xs sm:text-sm text-white"
            >
              Admin
            </Link>
          )}

          {/* User profile */}
          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          {/* Wishlist */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setToggleWishlist((prev) => !prev)}
                className="relative h-6 w-6 text-gray-700 align-middle"
              >
                <Heart />
                {wishListItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-4 flex items-center justify-center">
                    {wishListItemCount > 9 ? "9+" : wishListItemCount}
                  </span>
                )}
              </button>
              {/* Wishlist drawer */}
              <WishlistBar
                toggleWishlist={toggleWishlist}
                setToggleWishlist={setToggleWishlist}
              />
            </div>
          )}

          {/* Cart */}
          <button
            onClick={() => setDrawerOpen((prev) => !prev)}
            className="relative hover:text-black"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-4 flex items-center justify-center">
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </span>
            )}
          </button>

          {/* Search */}
          <SearchBar />

          {/* Mobile Menu toggle */}
          <button
            onClick={() => setNavDrawerOpen((prev) => !prev)}
            className="md:hidden"
          >
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      {/* ================= Drawers ================= */}
      {/* Cart drawer */}
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={setDrawerOpen} />

      {/* Mobile navigation drawer */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button onClick={() => setNavDrawerOpen(false)}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile Links */}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-5">
            {[
              { path: "/collections/all?gender=Men", label: "Men" },
              { path: "/collections/all?gender=Women", label: "Women" },
              { path: "/collections/all?category=Top Wear", label: "Top Wear" },
              { path: "/collections/all?category=Bottom Wear", label: "Bottom Wear" },
              { path: "/about", label: "About Us" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setNavDrawerOpen(false)}
                className="block text-gray-600 hover:text-black"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
