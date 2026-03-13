import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FormField, Input, Select, PrimaryButton } from '@/Components/FormComponents';

export default function UsersCreate() {
    const { data, setData, post, errors, processing } = useForm({
        name:      '',
        email:     '',
        password:  '',
        role:      'staff',
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-2 text-gray-500">
                <Link href={route('users.index')} className="hover:text-gray-700">Users</Link>
                <span>/</span>
                <span className="text-gray-900 font-semibold">Create</span>
            </div>
        }>
            <Head title="Create User" />

            <div className="max-w-2xl">
                <div className="bg-white shadow-sm rounded-xl p-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">New User</h2>
                    <form onSubmit={submit} className="space-y-5">
                        <FormField label="Full Name" error={errors.name} required>
                            <Input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                autoFocus
                            />
                        </FormField>

                        <FormField label="Email Address" error={errors.email} required>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Password" error={errors.password} required>
                            <Input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                autoComplete="new-password"
                            />
                        </FormField>

                        <FormField label="Role" error={errors.role} required>
                            <Select value={data.role} onChange={e => setData('role', e.target.value)}>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="staff">Staff</option>
                            </Select>
                        </FormField>

                        <FormField label="Status" error={errors.is_active}>
                            <label className="flex items-center gap-3 cursor-pointer mt-1">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">Active account</span>
                            </label>
                        </FormField>

                        <div className="flex items-center gap-4 pt-2">
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Creating…' : 'Create User'}
                            </PrimaryButton>
                            <Link href={route('users.index')} className="text-sm text-gray-500 hover:text-gray-700">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
