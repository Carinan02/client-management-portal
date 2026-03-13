import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FormField, Input, Select, PrimaryButton } from '@/Components/FormComponents';

export default function ClientsCreate({ services, staffUsers }) {
    const { data, setData, post, errors, processing } = useForm({
        full_name:    '',
        email:        '',
        phone:        '',
        company_name: '',
        status:       'lead',
        staff_id:     '',
        services:     [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('clients.store'));
    };

    const toggleService = (serviceId) => {
    const exists = data.services.find(s => s.id === serviceId);
    const updated = exists
        ? data.services.filter(s => s.id !== serviceId)
        : [...data.services, { id: serviceId, status: 'Pending' }];
    setData('services', updated);
};

    const updateServiceStatus = (serviceId, status) => {
        setData('services', data.services.map(s => s.id === serviceId ? { ...s, status } : s));
    };

    const isSelected = (id) => data.services.some(s => s.id === id);
    const getStatus = (id) => data.services.find(s => s.id === id)?.status ?? 'Pending';

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-2 text-gray-500">
                <Link href={route('clients.index')} className="hover:text-gray-700">Clients</Link>
                <span>/</span>
                <span className="text-gray-900 font-semibold">Create</span>
            </div>
        }>
            <Head title="Create Client" />

            <div className="max-w-3xl">
                <form onSubmit={submit} className="space-y-6">
                    {/* ── Basic info ─────────────────────────────────────────── */}
                    <div className="bg-white shadow-sm rounded-xl p-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Client Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <FormField label="Full Name" error={errors.full_name} required>
                                <Input type="text" value={data.full_name} onChange={e => setData('full_name', e.target.value)} autoFocus />
                            </FormField>
                            <FormField label="Email" error={errors.email} required>
                                <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                            </FormField>
                            <FormField label="Phone" error={errors.phone}>
                                <Input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                            </FormField>
                            <FormField label="Company Name" error={errors.company_name}>
                                <Input type="text" value={data.company_name} onChange={e => setData('company_name', e.target.value)} />
                            </FormField>
                            <FormField label="Status" error={errors.status} required>
                                <Select value={data.status} onChange={e => setData('status', e.target.value)}>
                                    <option value="lead">Lead</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Select>
                            </FormField>
                            <FormField label="Assigned Staff" error={errors.staff_id}>
                                <Select value={data.staff_id} onChange={e => setData('staff_id', e.target.value)}>
                                    <option value="">— None —</option>
                                    {staffUsers.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </Select>
                            </FormField>
                        </div>
                    </div>

                    {/* ── Service assignment ─────────────────────────────────── */}
                    <div className="bg-white shadow-sm rounded-xl p-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Services</h2>
                        <p className="text-sm text-gray-500 mb-5">Select services to assign and set a status for each.</p>

                        {services.length === 0 && (
                            <p className="text-sm text-gray-400">No active services available.</p>
                        )}

                        <div className="space-y-3">
                            {services.map(service => {
                                const selected = isSelected(service.id);
                                return (
                                    <div key={service.id} className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${selected ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input
                                            type="checkbox"
                                            id={`svc-${service.id}`}
                                            checked={selected}
                                            onChange={() => toggleService(service.id)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor={`svc-${service.id}`} className="flex-1 cursor-pointer">
                                            <span className="text-sm font-medium text-gray-900">{service.name}</span>
                                            {service.description && (
                                                <span className="ml-2 text-xs text-gray-500">{service.description}</span>
                                            )}
                                        </label>
                                        {selected && (
                                            <Select
                                                value={getStatus(service.id)}
                                                onChange={e => updateServiceStatus(service.id, e.target.value)}
                                                className="w-36"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </Select>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {errors['services'] && <p className="mt-2 text-sm text-red-600">{errors['services']}</p>}
                    </div>

                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Creating…' : 'Create Client'}
                        </PrimaryButton>
                        <Link href={route('clients.index')} className="text-sm text-gray-500 hover:text-gray-700">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
