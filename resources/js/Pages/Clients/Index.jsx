import { useState, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const STATUS_COLORS = {
    lead:     'bg-yellow-100 text-yellow-800',
    active:   'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-500',
};

const IMPORT_STATUS_COLORS = {
    Queued:    'bg-yellow-100 text-yellow-800',
    Processing: 'bg-blue-100 text-blue-800',
    Completed:  'bg-green-100 text-green-700',
    Failed:     'bg-red-100 text-red-700',
};

export default function ClientsIndex({ clients, filters, canImport }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isAdminOrManager = ['admin', 'manager'].includes(user.role);

    const [search, setSearch]       = useState(filters.search ?? '');
    const [imports, setImports]     = useState([]);
    const [showImport, setShowImport] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fileRef     = useRef();
    const searchTimer = useRef();

    const tableHeader = [
        'Name', 'Email', 'Company', 'Status', 'Staff', 'Services',
        ...(isAdminOrManager ? ['Actions'] : []),
    ];

    // ── Import fetch — called explicitly, never on a timer ───────────────────

    const fetchImports = async () => {
        try {
            const res = await fetch(route('imports.latest'), {
                headers: { Accept: 'application/json' },
            });
            if (res.ok) setImports(await res.json());
        } catch {}
    };

    // Open the panel and load the list for the first time.
    const handleTogglePanel = () => {
        const opening = !showImport;
        setShowImport(opening);
        if (opening && imports.length === 0) fetchImports();
    };

    // Manual refresh button inside the panel.
    // Runs both in parallel: fetchImports() updates the import status list,
    // router.reload() re-fetches the Inertia page props so the client table
    // reflects any rows that were just imported.
    const handleRefresh = async () => {
        setRefreshing(true);
        await Promise.all([
            fetchImports(),
            new Promise(resolve => router.reload({ onFinish: resolve })),
        ]);
        setRefreshing(false);
    };

    // ── File upload ───────────────────────────────────────────────────────────

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);

        router.post(route('imports.store'), { file }, {
            forceFormData: true,
            onSuccess: () => {
                // Fetch fresh status immediately after the redirect lands so
                // the user sees the new Pending row without pressing Refresh.
                fetchImports();
            },
            onFinish: () => {
                setUploading(false);
                if (fileRef.current) fileRef.current.value = '';
            },
        });
    };

    // ── Debounced search ──────────────────────────────────────────────────────

    const handleSearch = (value) => {
        setSearch(value);
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            router.get(
                route('clients.index'),
                { search: value || undefined },
                { preserveState: true, replace: true },
            );
        }, 400);
    };

    const destroy = (client) => {
        if (!confirm(`Delete ${client.full_name}? This cannot be undone.`)) return;
        router.delete(route('clients.destroy', client.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Clients</h1>

                    <div className="flex items-center gap-3">
                        {canImport && (
                            <>
                                <button
                                    onClick={handleTogglePanel}
                                    className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    📥 Import
                                </button>
                                <a
                                    href={route('imports.template')}
                                    className="text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                    ↓ Template
                                </a>
                            </>
                        )}
                        {isAdminOrManager && (
                            <Link
                                href={route('clients.create')}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                + Add Client
                            </Link>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Clients" />

            {/* ── Import panel ─────────────────────────────────────────────── */}
            {canImport && showImport && (
                <div className="mb-6 bg-white rounded-xl shadow-sm p-6 border border-indigo-100">
                    {/* Panel header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Client Import</h3>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 disabled:opacity-50 transition-colors"
                        >
                            <RefreshIcon spinning={refreshing} />
                            {refreshing ? 'Refreshing…' : 'Refresh'}
                        </button>
                    </div>

                    {/* File picker */}
                    <div className="flex items-center gap-4 mb-6">
                        <label
                            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-indigo-300 text-sm text-indigo-700 hover:bg-indigo-50 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            {uploading ? 'Uploading…' : '📂 Choose CSV or XLSX file'}
                            <input
                                ref={fileRef}
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                        <span className="text-xs text-gray-400">Max 20 MB</span>
                    </div>

                    {/* Import history */}
                    {imports.length > 0 ? (
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Imports</h4>
                            <div className="space-y-2">
                                {imports.map(imp => (
                                    <ImportRow key={imp.id} imp={imp} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">
                            No imports yet. Upload a file above to get started.
                        </p>
                    )}
                </div>
            )}

            {/* ── Search ───────────────────────────────────────────────────── */}
            <div className="mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="Search by name or email…"
                    className="w-full sm:w-80 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
            </div>

            {/* ── Clients table ─────────────────────────────────────────────── */}
            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            {tableHeader.map(h => (
                                <th
                                    key={h}
                                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {clients.data.map(client => (
                            <tr key={client.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                    {client.full_name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{client.email}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {client.company_name ?? '—'}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${STATUS_COLORS[client.status]}`}
                                    >
                                        {client.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {client.staff?.name ?? '—'}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {client.services?.slice(0, 2).map(s => (
                                            <span
                                                key={s.id}
                                                className="inline-flex px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-600"
                                            >
                                                {s.name}
                                            </span>
                                        ))}
                                        {client.services?.length > 2 && (
                                            <span className="text-xs text-gray-400">
                                                +{client.services.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                {isAdminOrManager && (
                                    <td className="px-4 py-3 text-sm space-x-3">
                                        <Link
                                            href={route('clients.edit', client.id)}
                                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => destroy(client)}
                                            className="text-red-500 hover:text-red-700 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {clients.data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={tableHeader.length}
                                    className="px-6 py-12 text-center text-gray-400"
                                >
                                    {search ? `No clients match "${search}".` : 'No clients yet.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Pagination ────────────────────────────────────────────────── */}
            {clients.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                    <span>
                        Showing {clients.from}–{clients.to} of {clients.total} clients
                    </span>
                    <div className="flex gap-1">
                        {clients.links.map((link, i) => (
                            <PaginationLink key={i} link={link} />
                        ))}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

// ── Import row ────────────────────────────────────────────────────────────────

function ImportRow({ imp }) {
    const style = IMPORT_STATUS_COLORS[imp.status] ?? 'bg-gray-100 text-gray-600';
    const inFlight = imp.status === 'Pending' || imp.status === 'Processing';

    return (
        <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-gray-50 text-sm">
            <span className="font-medium text-gray-800 truncate max-w-xs">{imp.file_name}</span>

            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${style}`}>
                {imp.status}
            </span>

            {imp.status === 'Completed' && (
                <span className="text-gray-600">
                    ✓ <strong>{imp.imported_count}</strong> imported,{' '}
                    <strong>{imp.skipped_count}</strong> skipped
                </span>
            )}

            {inFlight && (
                <span className="text-blue-600 text-xs italic">
                    Waiting for worker — press Refresh to update
                </span>
            )}

            {imp.status === 'Failed' && (
                <span className="text-red-600 text-xs">{imp.error_message ?? 'Unknown error'}</span>
            )}

            <span className="ml-auto text-xs text-gray-400">
                {new Date(imp.created_at).toLocaleString()}
            </span>
        </div>
    );
}

// ── Refresh icon (spins while loading) ───────────────────────────────────────

function RefreshIcon({ spinning }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-3.5 w-3.5 ${spinning ? 'animate-spin' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
        </svg>
    );
}

// ── Pagination link ───────────────────────────────────────────────────────────

function PaginationLink({ link }) {
    if (!link.url) {
        return (
            <span
                className="px-3 py-1 rounded border border-gray-200 text-gray-400 text-xs"
                dangerouslySetInnerHTML={{ __html: link.label }}
            />
        );
    }
    return (
        <Link
            href={link.url}
            className={`px-3 py-1 rounded border text-xs transition-colors ${
                link.active
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
            dangerouslySetInnerHTML={{ __html: link.label }}
        />
    );
}