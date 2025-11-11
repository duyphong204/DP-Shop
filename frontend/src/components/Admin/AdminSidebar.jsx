// src/components/Admin/AdminSidebar.jsx
import { FaBoxOpen, FaClipboardList, FaSignOutAlt, FaStore, FaUser, FaGift } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import { logoutUser } from "../../redux/slices/authSlice";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
      : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2";

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin" className="text-2xl font-medium">
          Rabit
        </Link>
      </div>
      <h2 className="text-xl font-medium mb-6 text-center">Admin Dashboard</h2>

      <nav className="flex flex-col space-y-2">
        <NavLink to="/admin/users" className={linkClass}>
          <FaUser />
          <span>Users</span>
        </NavLink>

        <NavLink to="/admin/products" className={linkClass}>
          <FaBoxOpen />
          <span>Products</span>
        </NavLink>

        <NavLink to="/admin/coupon" className={linkClass}>
          <FaGift />
          <span>Coupons</span>
        </NavLink>

        <NavLink to="/admin/orders" className={linkClass}>
          <FaClipboardList />
          <span>Orders</span>
        </NavLink>

        <NavLink to="/" className={linkClass}>
          <FaStore />
          <span>Shop</span>
        </NavLink>
      </nav>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2"
          aria-label="Logout"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
