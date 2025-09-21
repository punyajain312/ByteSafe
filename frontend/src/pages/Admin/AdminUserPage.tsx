import { useEffect, useState } from "react";
import { fetchAdminUsers } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    if (!token) return;
    fetchAdminUsers(token)
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Failed to load users"));
  }, [token]);

  return (
    <div>
      <h2>All Users</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}