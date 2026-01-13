import { useEffect, useState } from "react";
import { searchFiles, suggestFilenames, suggestUploaders } from "../api/files";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import toast from "react-hot-toast";
import "./styles/SearchFilter.css";

type Filters = {
  filename: string;
  mime: string;
  min_size: string;
  max_size: string;
  date_from: string;
  date_to: string;
  uploader: string;
};

export default function SearchFilter({
  onResults,
  setLoading,
}: {
  onResults: (files: any[]) => void;
  setLoading?: (loading: boolean) => void;
}) {
  const { token } = useAuth();

  const [filters, setFilters] = useState<Filters>({
    filename: "",
    mime: "",
    min_size: "",
    max_size: "",
    date_from: "",
    date_to: "",
    uploader: "",
  });

  /* ---------------- Autocomplete state ---------------- */
  const [fileSuggestions, setFileSuggestions] = useState<string[]>([]);
  const [uploaderSuggestions, setUploaderSuggestions] = useState<string[]>([]);

  const debouncedFilename = useDebounce(filters.filename, 300);
  const debouncedUploader = useDebounce(filters.uploader, 300);

  /* ---------------- Fetch filename suggestions ---------------- */
  useEffect(() => {
    if (!token || debouncedFilename.length < 2) {
      setFileSuggestions([]);
      return;
    }

    suggestFilenames(debouncedFilename, token)
      .then((res) => setFileSuggestions(res.data || []))
      .catch(() => setFileSuggestions([]));
  }, [debouncedFilename, token]);

  /* ---------------- Fetch uploader suggestions ---------------- */
  useEffect(() => {
    if (!token || debouncedUploader.length < 2) {
      setUploaderSuggestions([]);
      return;
    }

    suggestUploaders(debouncedUploader, token)
      .then((res) => setUploaderSuggestions(res.data || []))
      .catch(() => setUploaderSuggestions([]));
  }, [debouncedUploader, token]);

  /* ---------------- Input handler ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFilters((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "date_from" && value && !prev.date_to) {
        updated.date_to = formatDateLocal(new Date());
      }

      if (name === "date_to" && value && !prev.date_from) {
        updated.date_from = "1970-01-01";
      }

      return updated;
    });
  };

  /* ---------------- Date helpers ---------------- */
  const formatDateLocal = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const validateDates = () => {
    if (filters.date_from && filters.date_to && filters.date_from > filters.date_to) {
      toast.error("Date From cannot be after Date To");
      return false;
    }
    return true;
  };

  /* ---------------- Search ---------------- */
  const handleSearch = async () => {
    if (!token || !validateDates()) return;

    try {
      setLoading?.(true);
      const res = await searchFiles(filters, token);
      onResults(res.data?.files || []);
    } catch {
      toast.error("Search failed ❌");
      onResults([]);
    } finally {
      setLoading?.(false);
    }
  };

  /* ---------------- Quick dates ---------------- */
  const setLastDays = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);

    setFilters((prev) => ({
      ...prev,
      date_from: formatDateLocal(from),
      date_to: formatDateLocal(to),
    }));
  };

  const setThisYear = () => {
    const y = new Date().getFullYear();
    setFilters((prev) => ({
      ...prev,
      date_from: `${y}-01-01`,
      date_to: `${y}-12-31`,
    }));
  };

  return (
    <div className="search-filter">
      <h2 className="filter-title">Search & Filters</h2>

      {/* Filename with suggestions */}
      <div className="suggest-wrapper">
        <input
          name="filename"
          placeholder="File Name"
          value={filters.filename}
          onChange={handleChange}
          className="filter-input"
        />

        {fileSuggestions.length > 0 && (
          <div className="suggestions">
            {fileSuggestions.map((name) => (
              <div
                key={name}
                className="suggestion-item"
                onClick={() => {
                  setFilters((p) => ({ ...p, filename: name }));
                  setFileSuggestions([]);
                }}
              >
                {name}
              </div>
            ))}
          </div>
        )}
      </div>

      <input
        name="mime"
        placeholder="File Type"
        value={filters.mime}
        onChange={handleChange}
        className="filter-input"
      />

      {/* Date filters */}
      <div className="date-row">
        <input
          type="date"
          name="date_from"
          value={filters.date_from}
          onChange={handleChange}
          className="filter-input"
        />
        <span className="date-separator">→</span>
        <input
          type="date"
          name="date_to"
          value={filters.date_to}
          onChange={handleChange}
          className="filter-input"
        />
      </div>

      <div className="quick-dates">
        <button onClick={() => setLastDays(7)}>Last 7 days</button>
        <button onClick={() => setLastDays(30)}>Last 30 days</button>
        <button onClick={setThisYear}>This year</button>
      </div>

      {/* Uploader with suggestions */}
      <div className="suggest-wrapper">
        <input
          name="uploader"
          placeholder="Uploader Name"
          value={filters.uploader}
          onChange={handleChange}
          className="filter-input"
        />

        {uploaderSuggestions.length > 0 && (
          <div className="suggestions">
            {uploaderSuggestions.map((name) => (
              <div
                key={name}
                className="suggestion-item"
                onClick={() => {
                  setFilters((p) => ({ ...p, uploader: name }));
                  setUploaderSuggestions([]);
                }}
              >
                {name}
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleSearch} className="filter-btn">
        🔍 Search
      </button>
    </div>
  );
}