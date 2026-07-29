import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { MetricCard } from '../components/dashboard/MetricCard';
import { Users, Shield, UserCheck, UserX, Search, UserPlus, Filter, MoreVertical, Edit2, Trash2, CheckCircle, XCircle, X } from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Saranga Wickramasingha',
      username: 'saranga_admin',
      email: 'saranga@stockflow.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2026-07-29 18:45',
      avatarColor: 'bg-blue-600',
    },
    {
      id: 2,
      name: 'Manuja Jayasinghe',
      username: 'manuja_dev',
      email: 'manuja@stockflow.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2026-07-29 20:10',
      avatarColor: 'bg-indigo-600',
    },
    {
      id: 3,
      name: 'Ashan Silva',
      username: 'ashan_staff',
      email: 'ashan@stockflow.com',
      role: 'staff',
      status: 'active',
      lastLogin: '2026-07-29 14:20',
      avatarColor: 'bg-emerald-600',
    },
    {
      id: 4,
      name: 'Tharindu Fernando',
      username: 'tharindu_staff',
      email: 'tharindu@stockflow.com',
      role: 'staff',
      status: 'active',
      lastLogin: '2026-07-28 11:05',
      avatarColor: 'bg-amber-600',
    },
    {
      id: 5,
      name: 'Dileepa Perera',
      username: 'dileepa_staff',
      email: 'dileepa@stockflow.com',
      role: 'staff',
      status: 'inactive',
      lastLogin: '2026-07-20 09:30',
      avatarColor: 'bg-slate-500',
    },
    {
      id: 6,
      name: 'Sashika Ratnayake',
      username: 'sashika_staff',
      email: 'sashika@stockflow.com',
      role: 'staff',
      status: 'active',
      lastLogin: '2026-07-29 16:15',
      avatarColor: 'bg-purple-600',
    },
    {
      id: 7,
      name: 'Pemila Rodrigo',
      username: 'pemila_staff',
      email: 'pemila@stockflow.com',
      role: 'staff',
      status: 'active',
      lastLogin: '2026-07-29 19:00',
      avatarColor: 'bg-rose-600',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    role: 'staff',
    status: 'active',
  });

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleToggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'active' ? 'inactive' : 'active';
          showNotification(`User status for ${u.name} changed to ${newStatus.toUpperCase()}`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleToggleRole = (id) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newRole = u.role === 'admin' ? 'staff' : 'admin';
          showNotification(`Role for ${u.name} updated to ${newRole.toUpperCase()}`);
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to remove user "${name}"?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showNotification(`User "${name}" deleted successfully.`);
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.username) return;

    const created = {
      id: Date.now(),
      ...newUser,
      lastLogin: 'Never',
      avatarColor: newUser.role === 'admin' ? 'bg-blue-600' : 'bg-emerald-600',
    };

    setUsers((prev) => [created, ...prev]);
    setShowAddModal(false);
    setNewUser({ name: '', username: '', email: '', role: 'staff', status: 'active' });
    showNotification(`New ${newUser.role.toUpperCase()} account created for ${newUser.name}`);
  };

  // Filtered list
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const staffCount = users.filter((u) => u.role === 'staff' && u.status === 'active').length;
  const inactiveCount = users.filter((u) => u.status === 'inactive').length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="p-4 bg-slate-900 text-white rounded-xl shadow-lg flex items-center justify-between animate-fade-in text-sm font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage('')} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Top Title & Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User & Staff Management</h1>
              <p className="text-sm text-slate-500 font-medium">
                Admin control panel for managing user accounts, permissions, and status toggles.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" /> Add New User
            </button>
          </div>

          {/* User Stat Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{totalUsers}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Administrators</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{adminCount}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Staff</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{staffCount}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <UserX className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inactive Accounts</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{inactiveCount}</h3>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase">Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin Only</option>
                  <option value="staff">Staff Only</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">User Account</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Last Login</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${user.avatarColor} text-white font-extrabold flex items-center justify-center shadow-xs text-sm`}>
                              {user.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{user.name}</p>
                              <p className="text-xs text-slate-400">@{user.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-600">{user.email}</td>
                        <td className="py-4 px-6">
                          <span
                            onClick={() => handleToggleRole(user.id)}
                            title="Click to toggle role"
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer transition-transform hover:scale-105 ${
                              user.role === 'admin'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            <Shield className="w-3.5 h-3.5" />
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            onClick={() => handleToggleStatus(user.id)}
                            title="Click to toggle active status"
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer transition-transform hover:scale-105 ${
                              user.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                            {user.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500 font-medium">{user.lastLogin}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className={`p-2 rounded-lg border transition-colors ${
                                user.status === 'active'
                                  ? 'border-rose-200 hover:bg-rose-50 text-rose-600'
                                  : 'border-emerald-200 hover:bg-emerald-50 text-emerald-600'
                              }`}
                              title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                            >
                              {user.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="p-2 rounded-lg border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Delete Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                        No user accounts match your search or filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add New User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900">Add New System User</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Fernando"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. kasun_staff"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="kasun@stockflow.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
                >
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;

