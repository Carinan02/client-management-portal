import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FormField, Input, Select, PrimaryButton } from '@/Components/FormComponents';

export default function ClientsEdit({ client, services, staffUsers }) {
    // Seed services from existing pivot data
    const initialServices = (client.services ?? []).map(s => ({
        id:     s.id,
        status: s.pivot?.status ?? 'Pending',
    }));

    const { data, setData, patch, errors, processing } = useForm({
        full_name:    client.full_name,
        email:        client.email,
        phone:        client.phone ?? '',
        company_name: client.company_name ?? '',
        status:       client.status,
        staff_id:     client.staff_id ?? '',
        services:     initialServices,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('clients.update', client.id));
    };

    const toggleService = (serviceId) => {
        const exists = data.services.find(s => s.id === serviceId);
        if (exists) {
            setData('services', data.services.filter(s => s.id !== serviceId));
        } else {
            setData('services', [...data.services, { id: serviceId, status: 'Pending' }]);
        }
    };

    const updateServiceStatus = (serviceId, status) => {
        setData('services', data.services.map(s => s.id === serviceId ? { ...s, status } : s));
    };

    const isSelected = (id) => data.services.some(s => s.id === id);
    const getStatus  = (id) => data.services.find(s => s.id === id)?.status ?? 'Pending';

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-2 text-gray-500">
                <Link href={route('clients.index')} className="hover:text-gray-700">Clients</Link>
                <span>/</span>
                <span className="text-gray-900 font-semibold">Edit</span>
            </div>
        }>
            <Head title={`Edit ${client.full_name}`} />

            <div className="max-w-3xl">
                <form onSubmit={submit} className="space-y-6">
                    {/* ── Basic info ─────────────────────────────────────────── */}
                    <div className="bg-white shadow-sm rounded-xl p-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Client Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <FormField label="Full Name" error={errors.full_name} required>
                                <Input type="text" value={data.full_name} onChange={e => setData('full_name', e.target.value)} />
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
                        <p className="text-sm text-gray-500 mb-5">
                            Inactive services already assigned to this client are shown but cannot be added to new clients.
                        </p>

                        <div className="space-y-3">
                            {services.map(service => {
                                const selected  = isSelected(service.id);
                                const inactive  = !service.is_active;
                                return (
                                    <div key={service.id} className={`flex items-center gap-4 p-4 rounded-lg border transition-colors
                                        ${selected ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}
                                        ${inactive && !selected ? 'opacity-50' : ''}`}>
                                        <input
                                            type="checkbox"
                                            id={`svc-${service.id}`}
                                            checked={selected}
                                            onChange={() => toggleService(service.id)}
                                            // Cannot assign inactive services to a client that doesn't have them yet
                                            disabled={inactive && !selected}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                                        />
                                        <label htmlFor={`svc-${service.id}`} className={`flex-1 ${inactive && !selected ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                            <span className="text-sm font-medium text-gray-900">{service.name}</span>
                                            {inactive && (
                                                <span className="ml-2 text-xs text-gray-400 italic">(inactive)</span>
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
                    </div>

                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Saving…' : 'Save Changes'}
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
