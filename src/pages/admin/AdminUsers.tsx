import React, { useState, useEffect } from 'react';
import { Users, Shield } from 'lucide-react';
import { User, UserRole } from '../../types/index.js';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        showToast(`Rôle mis à jour vers ${newRole}`, 'success');
        fetchUsers();
      }
    } catch (err: any) {
      showToast('Erreur lors de la mise à jour du rôle', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Gestion des Utilisateurs & Rôles</h1>
        <p className="text-xs text-slate-400">Gérez les comptes inscrits et attribuez les droits d'administration.</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-dark-900 text-gold-400 font-serif uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Utilisateur</th>
              <th className="p-4">E-mail</th>
              <th className="p-4">Rôle Actuel</th>
              <th className="p-4 text-right">Changer le Rôle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {users.map((u) => (
              <tr key={u._id || u.id} className="hover:bg-white/5">
                <td className="p-4 font-bold text-white">
                  {u.firstName} {u.lastName}
                </td>
                <td className="p-4 text-slate-400">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    u.role === 'SUPER_ADMIN'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : u.role === 'ADMIN'
                      ? 'bg-gold-400/20 text-gold-300 border border-gold-400/40'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id || u.id, e.target.value as UserRole)}
                    className="bg-dark-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-gold-400"
                  >
                    <option value="VOTER">VOTER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
