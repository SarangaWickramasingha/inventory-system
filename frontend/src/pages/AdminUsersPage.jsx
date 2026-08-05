import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { MetricCard } from '../components/dashboard/MetricCard';
import { Users, Shield, UserCheck, UserX, Search, UserPlus, Filter, Trash2, CheckCircle, XCircle, X, Clock, Edit2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDiceBearAvatar } from '../utils/avatar';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const AdminUsersPage = () => {
  const { userList, setUserList, approveStaffUser, updateUserInfo } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);

  const [editFormData, setEditFormData] = useState({
    name: '',
    username: '',
    email: '',
    role: 'staff',
    status: 'active',
  });

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Handle selecting a user from the pre-approved/registered dropdown list
  const handleSelectUserFromDropdown = (e) => {
    const targetId = Number(e.target.value);
    setSelectedUserId(targetId);
    const foundUser = userList.find((u) => u.id === targetId);

    if (foundUser) {
      setEditFormData({
        name: foundUser.name,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        status: foundUser.status === 'pending' ? 'active' : foundUser.status,
      });
    } else {
      setEditFormData({ name: '', username: '', email: '', role: 'staff', status: 'active' });
    }
  };

  // Toggle active/inactive status
  const handleToggleStatus = (id) => {
    const targetUser = userList.find((u) => u.id === id);
    if (!targetUser) return;

    const newStatus = targetUser.status === 'active' ? 'inactive' : 'active';
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          showNotification(`Status for ${u.name} updated to ${newStatus.toUpperCase()}`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  // Approve a pending staff member
  const handleApproveStaff = (id, name) => {
    approveStaffUser(id);
    showNotification(`Staff account for "${name}" approved successfully! They can now sign in.`);
  };

  // Reject / Delete a user handler - triggers unified ConfirmModal
  const handleDeleteUser = (id, name) => {
    setDeleteConfirmTarget({ id, name });
  };

  // Submit modal to update User Name and Full Name for selected pre-approved user
  const handleSaveSelectedUser = (e) => {
    e.preventDefault();
    if (!selectedUserId) return;

    updateUserInfo(selectedUserId, {
      name: editFormData.name,
      username: editFormData.username,
      status: editFormData.status === 'pending' ? 'active' : editFormData.status,
    });

    showNotification(`User account updated: Name "${editFormData.name}", Username "@${editFormData.username}"`);
    setShowAddModal(false);
    setSelectedUserId('');
    setEditFormData({ name: '', username: '', email: '', role: 'staff', status: 'active' });
  };

  // Pending staff approval list
  const pendingUsers = userList.filter((u) => u.status === 'pending');

  // Filtered active & inactive users
  const filteredUsers = userList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Approved users list available in the modal dropdown
  const approvedDropdownList = userList.filter((u) => u.role === 'staff' || u.role === 'admin');

  const totalUsers = userList.length;
  const adminCount = userList.filter((u) => u.role === 'admin').length;
  const activeStaffCount = userList.filter((u) => u.role === 'staff' && u.status === 'active').length;
  const pendingCount = pendingUsers.length;

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

          {/* Top Title & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User & Staff Management</h1>
              <p className="text-sm text-slate-500 font-medium">
                Admin control panel for staff approvals, role permissions, user configuration, and status toggles.
              </p>
            </div>

            <button
              onClick={() => {
                setShowAddModal(true);
                if (approvedDropdownList.length > 0) {
                  const firstUser = approvedDropdownList[0];
                  setSelectedUserId(firstUser.id);
                  setEditFormData({
                    name: firstUser.name,
                    username: firstUser.username,
                    email: firstUser.email,
                    role: firstUser.role,
                    status: firstUser.status === 'pending' ? 'active' : firstUser.status,
                  });
                }
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" /> Select & Configure User
            </button>
          </div>

          {/* User Stat Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Accounts</p>
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
                <h3 className="text-2xl font-extrabold text-slate-900">{activeStaffCount}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${pendingCount > 0 ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-slate-100 text-slate-500'} flex items-center justify-center font-bold`}>
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Approval</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{pendingCount}</h3>
              </div>
            </div>
          </div>

          {/* Pending Staff Approvals Queue Section */}
          {pendingCount > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold shadow-xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Pending Staff Registrations ({pendingCount})
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      The following registered staff members are waiting for Admin approval to access the system.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingUsers.map((pUser) => (
                  <div key={pUser.id} className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getDiceBearAvatar(pUser.name)}
                        alt={pUser.name}
                        className="w-10 h-10 rounded-full object-cover border border-amber-300 shadow-xs bg-slate-100"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{pUser.name}</p>
                        <p className="text-xs text-slate-500">{pUser.email}</p>
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded mt-1">
                          Role: {pUser.role.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveStaff(pUser.id, pUser.name)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve Staff
                      </button>
                      <button
                        onClick={() => handleDeleteUser(pUser.id, pUser.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Reject & Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                  <option value="pending">Pending Approval</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">User Account</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Approval Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={getDiceBearAvatar(user.name)}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs bg-slate-100"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{user.name}</p>
                              <p className="text-xs text-slate-400">@{user.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-600">{user.email}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
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
                          {user.status === 'pending' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                              PENDING APPROVAL
                            </span>
                          ) : (
                            <span
                              onClick={() => handleToggleStatus(user.id)}
                              title="Click to toggle status"
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer transition-transform hover:scale-105 ${
                                user.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                              {user.status.toUpperCase()}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {user.status === 'pending' ? (
                              <button
                                onClick={() => handleApproveStaff(user.id, user.name)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
                              >
                                Approve
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setShowAddModal(true);
                                  setSelectedUserId(user.id);
                                  setEditFormData({
                                    name: user.name,
                                    username: user.username,
                                    email: user.email,
                                    role: user.role,
                                    status: user.status,
                                  });
                                }}
                                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                                title="Edit User Name & Full Name"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}

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
                      <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">
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

      {/* Dropdown Select & Configure User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900">Select & Configure User Account</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSelectedUser} className="space-y-4 text-xs">
              {/* 1. Dropdown List of Pre-Approved / Registered Users */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Registered / Pre-Approved User *
                </label>
                <select
                  value={selectedUserId}
                  onChange={handleSelectUserFromDropdown}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="" disabled>-- Select a Staff or Admin User --</option>
                  {approvedDropdownList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email}) [{u.role.toUpperCase()}] {u.status === 'pending' ? '• Pending Approval' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {selectedUserId && (
                <>
                  {/* Read-Only Email Badge */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-900 uppercase">Registered Email</span>
                      <p className="text-xs font-semibold text-blue-700">{editFormData.email}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-600 text-white rounded-md">
                      {editFormData.role}
                    </span>
                  </div>

                  {/* Admin Edits Full Name */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kasun Perera"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Admin Edits Username */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      User Name (Username) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">@</span>
                      <input
                        type="text"
                        required
                        placeholder="kasun_staff"
                        value={editFormData.username}
                        onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                        className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Account Status
                    </label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="active">Active (Approved)</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}

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
                  disabled={!selectedUserId}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
                >
                  Save Account Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unified System Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmTarget)}
        onClose={() => setDeleteConfirmTarget(null)}
        onConfirm={() => {
          if (deleteConfirmTarget) {
            setUserList((prev) => prev.filter((u) => u.id !== deleteConfirmTarget.id));
            showNotification(`User account "${deleteConfirmTarget.name}" deleted successfully.`);
          }
        }}
        title="Delete User Account"
        message={`Are you sure you want to delete user account "${deleteConfirmTarget?.name}"?`}
        confirmText="Delete Account"
      />
    </div>
  );
};

export default AdminUsersPage;
