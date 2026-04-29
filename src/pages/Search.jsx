import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api, getCurrentUser } from "../api/client";

export default function Search() {
  const [user, setUser] = useState(null);
  const [q, setQ] = useState("young males from nigeria");
  const [profiles, setProfiles] = useState([]);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }

    loadUser();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await api.get("/api/v1/profiles/search", {
        params: {
          q,
          page: 1,
          limit: 10
        }
      });

      setProfiles(response.data.data);
      setMeta(response.data.meta || {
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total
      });
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    }
  }

  return (
    <>
      <Navbar user={user} />

      <main className="container">
        <h1>Natural Language Search</h1>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="young males from nigeria"
          />
          <button type="submit">Search</button>
        </form>

        {error && <p className="error">{error}</p>}

        {meta && <p>Total: {meta.total}</p>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Age Group</th>
                <th>Country</th>
              </tr>
            </thead>

            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id}>
                  <td>{profile.name}</td>
                  <td>{profile.gender}</td>
                  <td>{profile.age}</td>
                  <td>{profile.age_group}</td>
                  <td>{profile.country_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}