import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { setUser } from "../redux/userSlice";

const ProtectedWrapper = ({ allowedRoles = [] }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // ✅ track route changes

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true); // start loading on every navigation
        const response = await axios.get("http://localhost:5000/api/me", {
          withCredentials: true,
        });
        dispatch(setUser(response.data.data));
      } catch (err) {
        console.error("Error fetching user info:", err.response?.data || err);
        dispatch(setUser(null)); // clear user if error
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, location.pathname]); // ✅ re-run on every route change

  if (loading) return <div>Loading...</div>;

  // Not logged in
  if (!user?.role) return <Navigate to="/login" replace />;

  // Role not allowed
  if (!allowedRoles.includes(user.role))
    return <Navigate to="/login" replace />;

  // Allowed → show page
  return <Outlet />;
};

export default ProtectedWrapper;
