import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function UsersIndex({ users }) {
    const toggleActive = (user) => {
        if (!confirm(`${user.is_active ? 'Deactivate' : 'Activate'} ${user.name}?`)) return;
        router.patch(route('users.toggle-active', user.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <Link href={route('users.create')} className="btn-primary">
                        + Add User
                    </Link>
                </div>
            }
        >
            <Head title="Users" />

            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Role</Th>
                            <Th>Status</Th>
                            <Th>Actions</Th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(user => (
                            <tr key={user.id} className={`hover:bg-gray-50 ${!user.is_active ? 'opacity-60' : ''}`}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <RoleBadge role={user.role} />
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                        ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm space-x-4">
                                    <Link href={route('users.edit', user.id)} className="text-indigo-600 hover:text-indigo-800 font-medium">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => toggleActive(user)}
                                        className={`font-medium ${user.is_active ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'}`}
                                    >
                                        {user.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`.btn-primary { @apply px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors; }`}</style>
        </AuthenticatedLayout>
    );
}

function Th({ children }) {
    return <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{children}</th>;
}

function RoleBadge({ role }) {
    const cls = {
        admin:   'bg-red-100 text-red-700',
        manager: 'bg-blue-100 text-blue-700',
        staff:   'bg-green-100 text-green-700',
    }[role] ?? 'bg-gray-100 text-gray-700';

    return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${cls}`}>
            {role}
        </span>
    );
}
