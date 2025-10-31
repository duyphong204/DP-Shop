import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser, deleteUser, fetchUsers, updateUser, searchUser } from "../../../redux/slices/adminSlice";
import { NotificationService } from "../../../utils/notificationService";
import { FaUsers, FaUserShield, FaUser } from "react-icons/fa";
import SearchBar from "../../Common/SearchBar";

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { users: usersFromStore, loading, error } = useSelector((state) => state.admin);

  const [displayUsers, setDisplayUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  // fetch users
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchUsers());
    }
  }, [user, navigate, dispatch]);

  // update displayUsers khi store thay đổi
  useEffect(() => {
    setDisplayUsers(usersFromStore);
  }, [usersFromStore]);

  // Thống kê dựa trên master list
  const adminCount = usersFromStore.filter((u) => u.role === "admin").length;
  const customerCount = usersFromStore.filter((u) => u.role === "customer").length;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addUser(formData)).unwrap();
      NotificationService.success("Thêm user thành công");
      setFormData({ name: "", email: "", password: "", role: "customer" });
    } catch (err) {
      NotificationService.error(err?.message || "Thêm user thất bại");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateUser({ id: userId, role: newRole })).unwrap();
      NotificationService.success("Cập nhật role thành công");
    } catch (err) {
      NotificationService.error(err?.message || "Cập nhật role thất bại");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await dispatch(deleteUser(userId)).unwrap();
      NotificationService.success("Xóa user thành công");
    } catch (err) {
      NotificationService.error(err?.message || "Xóa user thất bại");
    }
  };

  // search chỉ thay đổi displayUsers
  const handleSearch = (term) => {
    if (term.trim()) {
      dispatch(searchUser(term))
        .unwrap()
        .then((result) => setDisplayUsers(result));
    } else {
      setDisplayUsers(usersFromStore);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl font-bold mb-6">Quản Lý Người Dùng</h2>
        <SearchBar onSearch={handleSearch} placeholder="Tìm tên, email" />
      </div>

      {/* === Dashboard Card thống kê === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-6 shadow-lg rounded-lg bg-blue-100 hover:shadow-xl transition-shadow flex items-center gap-4">
          <FaUsers className="text-4xl text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold">Tổng Tài Khoản</h3>
            <p className="text-2xl font-bold text-blue-700">{usersFromStore.length}</p>
          </div>
        </div>

        <div className="p-6 shadow-lg rounded-lg bg-green-100 hover:shadow-xl transition-shadow flex items-center gap-4">
          <FaUser className="text-4xl text-green-500" />
          <div>
            <h3 className="text-lg font-semibold">Khách Hàng</h3>
            <p className="text-2xl font-bold text-green-700">{customerCount}</p>
          </div>
        </div>

        <div className="p-6 shadow-lg rounded-lg bg-red-100 hover:shadow-xl transition-shadow flex items-center gap-4">
          <FaUserShield className="text-4xl text-red-500" />
          <div>
            <h3 className="text-lg font-semibold">Admin</h3>
            <p className="text-2xl font-bold text-red-700">{adminCount}</p>
          </div>
        </div>
      </div>

      {/* === Form thêm user === */}
      <div className="p-6 rounded-lg mb-6 shadow-lg bg-white">
        <h3 className="text-lg font-bold mb-4">Thêm Tài Khoản</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-2xl hover:bg-green-600">
            Thêm
          </button>
        </form>
      </div>

      {/* === Bảng danh sách user === */}
      <div className="overflow-x-auto sm:rounded-lg shadow-2xl">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(displayUsers) && displayUsers.length > 0 ? (
              displayUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{user.name}</td>
                  <td className="p-4">{new Date(user.createdAt).toLocaleString()}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="p-2 border rounded"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-rose-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
