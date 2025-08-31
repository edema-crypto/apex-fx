import React, { useState } from 'react';
import { Users, DollarSign, TrendingUp, Activity, Search, Edit, Plus, Trash2 } from 'lucide-react';
import { useAdminData } from '../../hooks/useAdminData';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import UserEditModal from './UserEditModal';
import TransactionAddModal from './TransactionAddModal';

const AdminDashboard: React.FC = () => {
  const { isAdminAuthenticated } = useAuth();
  const { users, allTransactions, loading, updateUserProfile, addTransactionForUser } = useAdminData(isAdminAuthenticated);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
  const totalTransactions = allTransactions.length;
  const pendingTransactions = allTransactions.filter(t => t.status === 'pending').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredUsers = users.filter(user =>
    (user.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateUser = async (userData: any) => {
    if (!editingUser) return;
    
    await updateUserProfile(editingUser.id, {
      first_name: userData.firstName,
      last_name: userData.lastName,
      balance: userData.balance
    });
    setEditingUser(null);
  };

  const handleAddTransaction = async (transactionData: any) => {
    if (!selectedUserId) return;
    
    await addTransactionForUser(selectedUserId, {
      amount: transactionData.amount,
      description: transactionData.description,
      status: transactionData.status,
      type: transactionData.type,
      currency: transactionData.currency,
      wallet_address: transactionData.walletAddress
    });
    
    setShowAddTransaction(false);
    setSelectedUserId('');
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-800 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-96 bg-slate-800 rounded-2xl"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <img src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/ec1e8e78-e8e4-4f4d-a225-181630b1f3cd-ChatGPT_Image_Aug_28__2025__12_07_34_AM-removebg-preview.png" alt="ApexFX" className="h-8" />
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <p className="text-slate-400">Manage users, transactions, and system overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-slate-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-slate-400 text-sm">Total Balance</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalBalance)}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-slate-400 text-sm">Transactions</p>
              <p className="text-2xl font-bold text-white">{totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500/10 rounded-xl">
              <Activity className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-slate-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">{pendingTransactions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">User Management</h2>
          <Button 
            onClick={() => setShowAddTransaction(true)} 
            icon={Plus}
            size="sm"
          >
            Add Transaction
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            icon={Search}
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-300 font-medium">User</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Balance</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-slate-700 rounded-lg mr-3">
                        <Users className="w-4 h-4 text-slate-300" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-sm text-slate-400">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{user.id}</td>
                  <td className="py-4 px-4">
                    <span className="text-green-400 font-semibold">
                      {formatCurrency(user.balance)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Edit}
                        onClick={() => setEditingUser(user)}
                      >
                        Edit
                      </Button>
                      <a
                        href={`/admin/users/${user.id}`}
                        className="inline-flex items-center px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg text-sm border border-slate-600"
                      >
                        Manage
                      </a>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Plus}
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setShowAddTransaction(true);
                        }}
                      >
                        Add Transaction
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No users found matching your search</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {editingUser && (
        <UserEditModal
          user={{
            id: editingUser.id,
            firstName: editingUser.first_name,
            lastName: editingUser.last_name,
            balance: editingUser.balance
          }}
          onSave={handleUpdateUser}
          onClose={() => setEditingUser(null)}
        />
      )}

      {showAddTransaction && (
        <TransactionAddModal
          users={users.map(u => ({
            id: u.id,
            firstName: u.first_name || '',
            lastName: u.last_name || ''
          }))}
          selectedUserId={selectedUserId}
          onSave={handleAddTransaction}
          onClose={() => {
            setShowAddTransaction(false);
            setSelectedUserId('');
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;