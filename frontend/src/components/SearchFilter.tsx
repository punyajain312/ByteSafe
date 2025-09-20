import { useState } from "react";
import { searchFiles } from "../api/files";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./styles/SearchFilter.css";

export default function SearchFilter({
  onResults,
  setLoading,
}: {
  onResults: (files: any[]) => void;
  setLoading?: (loading: boolean) => void;
}) {
  const { token } = useAuth();
  const [filters, setFilters] = useState({
    filename: "",
    mime: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    if (!token) return;
    try {
      setLoading?.(true); // ✅ notify parent
      const res = await searchFiles(filters, token);
      const files = res.data?.files || [];
      onResults(files);
      console.log("Search results:", files);
    } catch (err) {
      console.error(err);
      toast.error("Search failed ❌");
      onResults([]);
    } finally {
      setLoading?.(false); // ✅ stop loading state
    }
  };

  return (
    <div className="search-filter">
      <h2 className="filter-title">Search & Filters</h2>
      <input
        name="filename"
        placeholder="Filename"
        value={filters.filename}
        onChange={handleChange}
        className="filter-input"
      />
      <input
        name="mime"
        placeholder="MIME Type"
        value={filters.mime}
        onChange={handleChange}
        className="filter-input"
      />
      <button onClick={handleSearch} className="filter-btn">
        🔍 Search
      </button>
    </div>
  );
}