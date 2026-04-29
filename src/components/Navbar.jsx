import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/client";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div>
        <strong>Insighta Labs+</strong>
      </div>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profiles">Profiles</Link>
        <Link to="/search">Search</Link>

        {user && (
          <span className="role">
            {user.username} · {user.role}
          </span>
        )}

        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}