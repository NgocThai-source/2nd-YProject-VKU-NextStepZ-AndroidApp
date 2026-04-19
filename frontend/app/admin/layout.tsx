'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Building2,
    Briefcase,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    Shield,
    ChevronRight,
    MessageSquare,
    AlertTriangle,
} from 'lucide-react';

interface AdminUser {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    role: string;
}

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Sinh viên', icon: Users },
    { href: '/admin/employers', label: 'Nhà tuyển dụng', icon: Building2 },
    { href: '/admin/jobs', label: 'Công ty', icon: Briefcase },
    { href: '/admin/posts', label: 'Cộng đồng', icon: MessageSquare },
    { href: '/admin/reports', label: 'Báo cáo', icon: AlertTriangle },
    { href: '/admin/logs', label: 'Nhật ký hoạt động', icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const isLoginPage = pathname === '/admin/login';

    // Verify token with backend
    const verifyAdminToken = async (token: string) => {
        try {
            const response = await fetch(`${API_BASE}/api/auth/admin/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Invalid token');
            }

            const data = await response.json();
            return data;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        // Skip auth check for login page
        if (isLoginPage) {
            setIsLoading(false);
            return;
        }

        const checkAuth = async () => {
            // Check admin authentication
            const token = localStorage.getItem('adminToken');
            const user = localStorage.getItem('adminUser');

            if (!token || !user) {
                router.push('/admin/login');
                return;
            }

            try {
                const parsedUser = JSON.parse(user);
                if (parsedUser.role !== 'admin') {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                    router.push('/admin/login');
                    return;
                }

                // Verify token with backend for extra security
                const verifiedUser = await verifyAdminToken(token);
                if (!verifiedUser || verifiedUser.role !== 'admin') {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                    router.push('/admin/login');
                    return;
                }

                setAdminUser(verifiedUser);
                setIsLoading(false);
            } catch {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                router.push('/admin/login');
                return;
            }
        };

        checkAuth();
    }, [router, isLoginPage]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin/login');
    };

    // Return just children for login page (no sidebar/header)
    if (isLoginPage) {
        return <>{children}</>;
    }


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Sidebar - Desktop */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 256 : 80 }}
                className="hidden lg:flex flex-col bg-gray-800 border-r border-gray-700 fixed h-full z-20"
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-center border-b border-gray-700 px-4">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-white font-bold text-lg"
                            >
                                Admin
                            </motion.span>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all ${isActive
                                    ? 'bg-purple-500/20 text-purple-400'
                                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {isSidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Toggle and Logout */}
                <div className="border-t border-gray-700 p-4 space-y-2">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
                    >
                        <ChevronRight className={`w-5 h-5 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
                        {isSidebarOpen && <span>Thu gọn</span>}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors rounded-lg"
                    >
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span>Đăng xuất</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                            onClick={() => setIsMobileSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            className="fixed inset-y-0 left-0 w-64 bg-gray-800 z-40 lg:hidden"
                        >
                            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
                                <Link href="/admin" className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-white font-bold">Admin</span>
                                </Link>
                                <button
                                    onClick={() => setIsMobileSidebarOpen(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <nav className="py-4">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all ${isActive
                                                ? 'bg-purple-500/20 text-purple-400'
                                                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors rounded-lg"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all`}>
                {/* Header */}
                <header className="h-16 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-white">
                                {adminUser?.firstName && adminUser?.lastName
                                    ? `${adminUser.firstName} ${adminUser.lastName}`
                                    : adminUser?.username}
                            </p>
                            <p className="text-xs text-gray-400">{adminUser?.email}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
