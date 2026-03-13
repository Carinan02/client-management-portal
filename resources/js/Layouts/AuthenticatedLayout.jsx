import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [notification, setNotification] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isAdmin = user.role === 'admin';
    const isAdminOrManager = ['admin', 'manager'].includes(user.role);

    // Show flash notifications
    useEffect(() => {
        if (flash?.success) setNotification({ type: 'success', message: flash.success });
        if (flash?.error)   setNotification({ type: 'error',   message: flash.error });
    }, [flash]);

    useEffect(() => {
        if (!notification) return;
        const t = setTimeout(() => setNotification(null), 4000);
        return () => clearTimeout(t);
    }, [notification]);

    const roleBadgeClass = {
        admin:   'bg-red-100 text-red-700',
        manager: 'bg-blue-100 text-blue-700',
        staff:   'bg-green-100 text-green-700',
    }[user.role] ?? 'bg-gray-100 text-gray-700';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ── Top bar ─────────────────────────────────────────────────── */}
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo + links */}
                        <div className="flex items-center gap-8">
                            <Link href={route('dashboard')} className="flex items-center gap-2">
                                <span className="text-indigo-600 font-bold text-lg tracking-tight">ClientPortal</span>
                            </Link>

                            {/* Desktop nav */}
                            <div className="hidden md:flex gap-1">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                                <NavLink href={route('clients.index')} active={route().current('clients.*')}>
                                    Clients
                                </NavLink>
                                {isAdminOrManager && (
                                    <NavLink href={route('services.index')} active={route().current('services.*')}>
                                        Services
                                    </NavLink>
                                )}
                                {isAdmin && (
                                    <NavLink href={route('users.index')} active={route().current('users.*')}>
                                        Users
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-4">
                            <span className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                                {user.name}
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${roleBadgeClass}`}>
                                    {user.role}
                                </span>
                            </span>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                            >
                                Logout
                            </Link>

                            {/* Mobile menu toggle */}
                            <button
                                className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
                                onClick={() => setMobileOpen(o => !o)}
                            >
                                ☰
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white px-4 py-2 space-y-1">
                        <MobileNavLink href={route('dashboard')}>Dashboard</MobileNavLink>
                        <MobileNavLink href={route('clients.index')}>Clients</MobileNavLink>
                        {isAdminOrManager && <MobileNavLink href={route('services.index')}>Services</MobileNavLink>}
                        {isAdmin && <MobileNavLink href={route('users.index')}>Users</MobileNavLink>}
                    </div>
                )}
            </nav>

            {/* ── Page header ─────────────────────────────────────────────── */}
            {header && (
                <header className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* ── Flash notification ───────────────────────────────────────── */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-sm font-medium transition-all
                    ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    <span>{notification.type === 'success' ? '✓' : '✕'}</span>
                    <span>{notification.message}</span>
                    <button onClick={() => setNotification(null)} className="ml-2 opacity-70 hover:opacity-100">×</button>
                </div>
            )}

            {/* ── Main content ─────────────────────────────────────────────── */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}

function NavLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, children }) {
    return (
        <Link
            href={href}
            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
            {children}
        </Link>
    );
}
