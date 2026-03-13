import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ServicesIndex({ services }) {
    const destroy = (service) => {
        if (!confirm(`Delete "${service.name}"? This cannot be undone.`)) return;
        router.delete(route('services.destroy', service.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Services</h1>
                    <Link href={route('services.create')} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                        + Add Service
                    </Link>
                </div>
            }
        >
            <Head title="Services" />

            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <Th>Name</Th>
                            <Th>Description</Th>
                            <Th>Status</Th>
                            <Th>Actions</Th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {services.map(service => (
                            <tr key={service.id} className={`hover:bg-gray-50 ${!service.is_active ? 'opacity-60' : ''}`}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{service.description ?? '—'}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                        ${service.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {service.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm space-x-4">
                                    <Link href={route('services.edit', service.id)} className="text-indigo-600 hover:text-indigo-800 font-medium">
                                        Edit
                                    </Link>
                                    <button onClick={() => destroy(service)} className="text-red-500 hover:text-red-700 font-medium">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {services.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">No services found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}

function Th({ children }) {
    return <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{children}</th>;
}
