import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FormField, Input, Textarea, PrimaryButton } from '@/Components/FormComponents';

export default function ServicesEdit({ service }) {
    const { data, setData, patch, errors, processing } = useForm({
        name:        service.name,
        description: service.description ?? '',
        is_active:   service.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('services.update', service.id));
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-2 text-gray-500">
                <Link href={route('services.index')} className="hover:text-gray-700">Services</Link>
                <span>/</span>
                <span className="text-gray-900 font-semibold">Edit</span>
            </div>
        }>
            <Head title={`Edit ${service.name}`} />

            <div className="max-w-2xl">
                <div className="bg-white shadow-sm rounded-xl p-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Edit Service</h2>

                    {!service.is_active && (
                        <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                            ⚠️ This service is inactive and cannot be assigned to new clients, but remains on existing ones.
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <FormField label="Service Name" error={errors.name} required>
                            <Input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Description" error={errors.description}>
                            <Textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Status" error={errors.is_active}>
                            <label className="flex items-center gap-3 cursor-pointer mt-1">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">Active (can be assigned to new clients)</span>
                            </label>
                        </FormField>

                        <div className="flex items-center gap-4 pt-2">
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Saving…' : 'Save Changes'}
                            </PrimaryButton>
                            <Link href={route('services.index')} className="text-sm text-gray-500 hover:text-gray-700">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
