import React, { useMemo, useState } from 'react';
import { Search, Users, DollarSign } from 'lucide-react';
import { useAdminData } from '../../hooks/useAdminData';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../UI/Input';

const AdminUsersList: React.FC = () => {
  const { isAdminAuthenticated } = useAuth();
  const { users, loading } = useAdminData(isAdminAuthenticated);
  const [term, setTerm] = useState('');

  const filtered = users.filter(u =>
    `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase().includes(term.toLowerCase()) ||
    u.id.toLowerCase().includes(term.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-800 rounded"></div>
        <div className="h-96 bg-slate-800 rounded-2xl"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <img src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/ec1e8e78-e8e4-4f4d-a225-181630b1f3cd-ChatGPT_Image_Aug_28__2025__12_07_34_AM-removebg-preview.png" alt="ApexFX" className="h-8" />
        <h1 className="text-2xl font-semibold text-white">All Users</h1>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="mb-6">
          <Input icon={Search} placeholder="Search by name or email" value={term} onChange={(e) => setTerm(e.target.value)} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-300 font-medium">User</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Balance</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Transactions</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                  <td className="py-3 px-4 text-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center overflow-hidden">
                        {u.avatar_url ? (
                          <img src={u.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-sm text-slate-400 font-semibold">
                            {u.first_name?.[0]}{u.last_name?.[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{u.first_name} {u.last_name}</div>
                        <div className="text-xs text-slate-400">ID: {u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{u.id}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-white">${u.balance.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400">-</td>
                  <td className="py-3 px-4">
                    <a 
                      href={`/admin/users/${u.id}`} 
                      className="inline-flex items-center px-3 py-1 bg-neon-green/10 text-neon-green border border-neon-green/20 rounded-lg hover:bg-neon-green/20 transition-colors font-medium"
                    >
                      Manage
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No users match your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersList;
