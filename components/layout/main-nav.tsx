'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard/comercial', label: 'Geral Comercial' },
  { href: '/dashboard/pre-venda', label: 'Pré-venda' },
  { href: '/dashboard/vendas', label: 'Vendas' }
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-4 text-sm">
      {links.map((link) => {
        const isActive = pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              isActive
                ? 'font-semibold text-white underline underline-offset-4'
                : 'text-slate-400 transition hover:text-slate-200'
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
