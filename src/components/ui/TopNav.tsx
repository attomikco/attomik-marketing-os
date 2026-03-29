'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AttomikLogo from './AttomikLogo'

export default function TopNav() {
  const pathname = usePathname()

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/brand', label: 'Brand Hub' },
    { href: '/creatives', label: 'Creative Studio' },
    { href: '/campaigns', label: 'Campaigns' },
  ]

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 32px', height: 56, gap: 4,
    }}>
      <Link href="/dashboard" style={{ marginRight: 20, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <AttomikLogo height={20} color="#000" />
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        {links.map(({ href, label }) => {
          const active = href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(href)
          return (
            <Link key={href} href={href} style={{
              fontSize: 13, fontWeight: active ? 700 : 500,
              color: active ? '#000' : '#888',
              textDecoration: 'none',
              padding: '6px 14px', borderRadius: 8,
              background: active ? '#f0f0f0' : 'transparent',
              transition: 'all 0.15s',
            }}>
              {label}
            </Link>
          )
        })}
      </div>

      <Link href="/onboarding" style={{
        background: '#000', color: '#00ff97',
        fontFamily: 'Barlow, sans-serif',
        fontWeight: 800, fontSize: 12,
        padding: '8px 18px', borderRadius: 999,
        textDecoration: 'none',
      }}>
        + New funnel
      </Link>
    </nav>
  )
}
