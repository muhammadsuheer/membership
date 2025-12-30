'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, Settings, LogOut } from 'lucide-react';

const sidebarLinks = [
    {
        href: '/admin',
        label: 'Dashboard',
        icon: LayoutDashboard,
    },
    {
        href: '/admin/cms',
        label: 'Content Management',
        icon: FileText,
    },
    {
        href: '/admin/members',
        label: 'Members',
        icon: Users,
    },
    {
        href: '/admin/settings',
        label: 'Settings',
        icon: Settings,
    },
];

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-primary-900 text-white flex flex-col fixed h-full z-30">
                <div className="p-6 border-b border-primary-800">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logo.png"
                            alt="SOOOP Logo"
                            width={32}
                            height={32}
                            className="object-contain" // White logo preferred
                        />
                        <span className="text-xl font-bold tracking-wider">SOOOP Admin</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${pathname === link.href || pathname.startsWith(`${link.href}/`) && link.href !== '/admin'
                                    ? 'bg-primary-700 text-white shadow-sm'
                                    : 'text-primary-100 hover:bg-primary-800 hover:text-white'
                                }`}
                        >
                            <link.icon className="w-5 h-5" />
                            <span className="font-medium">{link.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-primary-800">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-200 hover:bg-primary-800 hover:text-white transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Exit Admin</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 sticky top-0 z-20">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {sidebarLinks.find(l => pathname === l.href)?.label || 'Admin Portal'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                                A
                            </div>
                            <span className="text-sm font-medium text-gray-700">Administrator</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="p-8 flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
