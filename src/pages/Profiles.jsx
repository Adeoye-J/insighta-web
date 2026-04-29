import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api, getCurrentUser } from "../api/client";

export default function Profiles() {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState({
    gender: "",
    country_id: "",
    age_group: "",
    min_age: "",
    max_age: "",
    sort_by: "created_at",
    order: "desc",
    page: 1,
    limit: 10
  });

  async function loadProfiles(customFilters = filters) {
    const response = await api.get("/api/v1/profiles", {
      params: customFilters
    });

    setProfiles(response.data.data);
    setMeta(response.data.meta || {
      page: response.data.page,
      limit: response.data.limit,
      total: response.data.total
    });
  }

  useEffect(() => {
    async function load() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      await loadProfiles();
    }

    load();
  }, []);

  function handleChange(e) {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await loadProfiles({ ...filters, page: 1 });
  }

  async function handleExport() {
    const response = await api.get("/api/v1/profiles/export", {
      responseType: "blob"
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "profiles.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this profile?")) return;

    await api.delete(`/api/v1/profiles/${id}`);
    await loadProfiles();
  }

  async function nextPage() {
    const next = Number(meta.page) + 1;
    const updated = { ...filters, page: next };
    setFilters(updated);
    await loadProfiles(updated);
  }

  async function prevPage() {
    const prev = Math.max(Number(meta.page) - 1, 1);
    const updated = { ...filters, page: prev };
    setFilters(updated);
    await loadProfiles(updated);
  }

  return (
    <>
      <Navbar user={user} />

      <main className="container">
        <div className="header-row">
          <h1>Profiles</h1>
          <button onClick={handleExport}>Export CSV</button>
        </div>

        <form className="filters" onSubmit={handleSubmit}>
          <input name="gender" placeholder="gender" value={filters.gender} onChange={handleChange} />
          <input name="country_id" placeholder="country_id" value={filters.country_id} onChange={handleChange} />
          <input name="age_group" placeholder="age_group" value={filters.age_group} onChange={handleChange} />
          <input name="min_age" placeholder="min_age" value={filters.min_age} onChange={handleChange} />
          <input name="max_age" placeholder="max_age" value={filters.max_age} onChange={handleChange} />

          <select name="sort_by" value={filters.sort_by} onChange={handleChange}>
            <option value="created_at">created_at</option>
            <option value="age">age</option>
            <option value="gender_probability">gender_probability</option>
          </select>

          <select name="order" value={filters.order} onChange={handleChange}>
            <option value="desc">desc</option>
            <option value="asc">asc</option>
          </select>

          <button type="submit">Apply</button>
        </form>

        <p>Total: {meta.total}</p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Age Group</th>
                <th>Country</th>
                <th>Probability</th>
                {user?.role === "admin" && <th>Action</th>}
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
                  <td>{profile.country_probability}</td>
                  {user?.role === "admin" && (
                    <td>
                      <button className="danger" onClick={() => handleDelete(profile.id)}>
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button onClick={prevPage} disabled={Number(meta.page) <= 1}>
            Previous
          </button>

          <span>Page {meta.page}</span>

          <button
            onClick={nextPage}
            disabled={Number(meta.page) * Number(meta.limit) >= Number(meta.total)}
          >
            Next
          </button>
        </div>
      </main>
    </>
  );
}