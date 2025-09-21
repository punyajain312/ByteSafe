import { useEffect, useState } from "react";
import { fetchAdminStats, fetchAdminUsers } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface AdminStats {
  total_files: number;
  total_downloads: number;
}

export default function StatsPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    if (!token) return;
    fetchAdminStats(token)
      .then((res) => setStats(res.data))
      .catch(() => toast.error("Failed to load stats"));
    fetchAdminUsers(token)
      .then((res) => setTotalUsers(res.data.length))
      .catch(() => toast.error("Failed to load users"));
  }, [token]);

  return (
    <div>
      <h2>System Stats</h2>
      {stats ? (
        <ul>
          <li>Total Users: {totalUsers}</li>
          <li>Total Files: {stats.total_files}</li>
          <li>Total Downloads: {stats.total_downloads}</li>
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}