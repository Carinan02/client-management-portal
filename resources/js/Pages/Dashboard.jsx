import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ stats }) {
    const cards = [
        { label: 'Total Clients',    value: stats.total_clients,   color: 'indigo', sub: `${stats.lead_clients} leads` },
        { label: 'Active Clients',   value: stats.active_clients,  color: 'green',  sub: 'currently active' },
        { label: 'Active Services',  value: stats.active_services, color: 'purple', sub: `of ${stats.total_services} total` },
        { label: 'Active Users',     value: stats.active_users,    color: 'orange', sub: `of ${stats.total_users} total` },
    ];

    return (
        <AuthenticatedLayout header={<h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>}>
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map(card => (
                    <StatCard key={card.label} {...card} />
                ))}
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ label, value, color, sub }) {
    const accent = {
        indigo: 'border-indigo-500 text-indigo-600',
        green:  'border-green-500 text-green-600',
        purple: 'border-purple-500 text-purple-600',
        orange: 'border-orange-500 text-orange-600',
    }[color];

    return (
        <div className={`bg-white rounded-xl shadow-sm border-l-4 p-6 ${accent}`}>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className={`mt-1 text-4xl font-bold ${accent.split(' ')[1]}`}>{value}</p>
            <p className="mt-1 text-xs text-gray-400">{sub}</p>
        </div>
    );
}
