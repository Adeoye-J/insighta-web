import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getCurrentUser, api } from "../api/client";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      const response = await api.get("/api/v1/profiles", {
        params: { page: 1, limit: 1 }
      });

      setTotal(response.data.meta?.total || response.data.total || 0);
    }

    load();
  }, []);

  return (
    <>
      <Navbar user={user} />

      <main className="container">
        <h1>Dashboard</h1>

        <div className="grid">
          <div className="card">
            <h3>Total Profiles</h3>
            <p className="big">{total}</p>
          </div>

          <div className="card">
            <h3>Role</h3>
            <p className="big">{user?.role}</p>
          </div>

          <div className="card">
            <h3>User</h3>
            <p className="big">{user?.username}</p>
          </div>
        </div>
      </main>
    </>
  );
}