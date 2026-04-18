'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/layout/header";
import { HeaderSpacer } from "@/components/layout/header-spacer";
import Footer from "@/components/layout/footer";

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Check if current path is an admin route
    const isAdminRoute = pathname?.startsWith('/admin');

    // For admin routes, render without main header/footer
    if (isAdminRoute) {
        return <>{children}</>;
    }

    // For regular routes, render with header and footer
    return (
        <>
            <Header />
            <HeaderSpacer />
            <main>
                {children}
            </main>
            <Footer />
        </>
    );
}
