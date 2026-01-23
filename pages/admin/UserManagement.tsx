import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Search, UserCircle, Mail, Calendar, Shield, Trash2 } from 'lucide-react';
import { Button } from '../../components/Button';

export const UserManagement: React.FC = () => {
    const users = useQuery(api.users.listAll) ?? [];
    const updateRole = useMutation(api.users.updateRole);
    const deleteUser = useMutation(api.users.deleteUser);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'user' | 'farmer' | 'admin'>('all');
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleRoleUpdate = async (userId: any, newRole: any) => {
        try {
            await updateRole({ userId, role: newRole });
            setSelectedUser(null);
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const handleDeleteUser = async (userId: any) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser({ userId });
                setSelectedUser(null);
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const getRoleBadge = (role: string) => {
        const styles = {
            user: 'bg-blue-100 text-blue-700',
            farmer: 'bg-lime-100 text-lime-700',
            admin: 'bg-purple-100 text-purple-700',
        };
        return styles[role as keyof typeof styles] || styles.user;
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-stone-900">User Management</h1>
                <p className="text-stone-500 mt-1">Manage user accounts and roles</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-stone-100">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100 transition-all"
                        />
                    </div>

                    {/* Role Filter */}
                    <div className="flex gap-2">
                        {['all', 'user', 'farmer', 'admin'].map((role) => (
                            <button
                                key={role}
                                onClick={() => setFilterRole(role as any)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${filterRole === role
                                        ? 'bg-lime-500 text-white'
                                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                    }`}
                            >
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-4 border border-stone-100">
                    <p className="text-sm text-stone-500">Total Users</p>
                    <p className="text-2xl font-bold text-stone-900">{users.length}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-stone-100">
                    <p className="text-sm text-stone-500">Regular Users</p>
                    <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'user').length}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-stone-100">
                    <p className="text-sm text-stone-500">Farmers</p>
                    <p className="text-2xl font-bold text-lime-600">{users.filter(u => u.role === 'farmer').length}</p>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-stone-50 border-b border-stone-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">User</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">Role</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-stone-400">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user._id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center">
                                                <UserCircle className="h-6 w-6 text-lime-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-stone-900">{user.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-stone-600">
                                            <Mail className="h-4 w-4" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadge(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setSelectedUser(user)}
                                                className="rounded-lg"
                                            >
                                                <Shield className="h-4 w-4 mr-1" />
                                                Manage
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-stone-900 mb-6">Manage User</h2>

                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="text-sm font-semibold text-stone-500">Name</p>
                                <p className="text-lg font-bold text-stone-900">{selectedUser.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-stone-500">Email</p>
                                <p className="text-stone-900">{selectedUser.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-stone-500 mb-2">Role</p>
                                <select
                                    value={selectedUser.role}
                                    onChange={(e) => handleRoleUpdate(selectedUser._id, e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border-2 border-stone-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100"
                                >
                                    <option value="user">Regular User</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={() => setSelectedUser(null)}
                                variant="outline"
                                fullWidth
                                className="rounded-xl"
                            >
                                Close
                            </Button>
                            <Button
                                onClick={() => handleDeleteUser(selectedUser._id)}
                                className="bg-red-500 hover:bg-red-600 rounded-xl"
                                fullWidth
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
