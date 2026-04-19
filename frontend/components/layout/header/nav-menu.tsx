'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Sáng tạo hồ sơ', href: '/portfolio' },
  { label: 'Tìm kiếm', href: '/find' },
  { label: 'Cộng đồng', href: '/community' },
  { label: 'Công ty', href: '/companies' },
  { label: 'Job Map', href: '/job-map' },
  { label: 'Về chúng tôi', href: '/about' },
];

interface NavMenuProps {
  scrolled: boolean;
}

export function NavMenu({ scrolled }: NavMenuProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Exact match for home page
    if (href === '/') {
      return pathname === '/';
    }
    // For other pages, check if pathname starts with href
    return pathname.startsWith(href);
  };

  return (
    <nav className={`flex items-center ${scrolled ? 'gap-7' : 'gap-1'}`}>
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 text-sm font-semibold relative group whitespace-nowrap transition-colors duration-200 ${active
              ? scrolled
                ? 'text-cyan-400'
                : 'text-cyan-300'
              : scrolled
                ? 'text-gray-200 hover:text-white'
                : 'text-gray-300 hover:text-cyan-300'
              }`}
            style={{ fontFamily: "'Exo 2 SemiBold', sans-serif" }}
          >
            {item.label}

            {/* Underline effect - always visible for active, hover for inactive */}
            <span
              className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out ${active
                ? 'w-full'
                : 'w-0 group-hover:w-full'
                } ${scrolled ? 'bg-cyan-400' : 'bg-cyan-400/80'
                }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
