import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  password?: string;
}

export default function SystemUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);


  const handleEditClick = (user: User) => {
    setEditUser(user);
    setShowEditModal(true);
  };

        const handleSaveEdit = () => {
        if (!editUser) return;

        // Create a copy to conditionally remove password if it's empty
        const payload = { ...editUser };

        // If password is blank, don't send it (keep current)
        if (!payload.password || payload.password.trim() === "") {
            delete payload.password;
        }

        axios.put(`http://localhost:3000/users/${editUser.id}`, payload)
            .then(() => {
            setUsers((prev) =>
                prev.map((u) => (u.id === editUser.id ? editUser : u))
            );
            setShowEditModal(false);
            });
        };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this user?")) {
            axios.delete(`http://localhost:3000/users/${id}`).then(() => {
            setUsers((prev) => prev.filter((u) => u.id !== id));
            });
        }
    };

  useEffect(() => {
    axios.get("http://localhost:3000/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All System Users</h1>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Is Admin</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{user.id}</td>
                <td className="px-4 py-2 border-b">{user.name}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">
                  {user.isAdmin ? "✅ Yes" : "❌ No"}
                </td>
                <td className="px-4 py-2 border-b space-x-2">
                <button onClick={() => handleEditClick(user)} className="text-green-500">
                    <Pencil className="w-4 h-4 inline" />
                </button>
                <button onClick={() => handleDelete(user.id)} className="text-red-500">
                    <Trash2 className="w-4 h-4 inline" />
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
                    {showEditModal && editUser && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
                <h2 className="text-xl font-bold">Edit User</h2>
                <div className="space-y-2">
                    <label className="block">
                    Name:
                    <input
                        type="text"
                        value={editUser.name}
                        onChange={(e) =>
                        setEditUser({ ...editUser, name: e.target.value })
                        }
                        className="w-full border px-3 py-1.5 rounded"
                    />
                    </label>
                    <label className="block">
                    Email:
                    <input
                        type="email"
                        value={editUser.email}
                        onChange={(e) =>
                        setEditUser({ ...editUser, email: e.target.value })
                        }
                        className="w-full border px-3 py-1.5 rounded"
                    />
                    </label>
                    <label className="block">
                    Password:
                    <input
                        type="text"
                        value={editUser.password || ""}
                        onChange={(e) =>
                        setEditUser({ ...editUser, password: e.target.value })
                        }
                        className="w-full border px-3 py-1.5 rounded"
                    />
                    <span className="text-sm text-gray-500">Leave empty to keep current password</span>
                    </label>
                    <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={editUser.isAdmin}
                        onChange={(e) =>
                        setEditUser({ ...editUser, isAdmin: e.target.checked })
                        }
                    />
                    <span>Is Admin</span>
                    </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border rounded"
                    >
                    Cancel
                    </button>
                    <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                    Save
                    </button>
                </div>
                </div>
            </div>
            )}

      </div>
    </div>
  );
}
