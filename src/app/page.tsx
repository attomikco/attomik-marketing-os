'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AttomikLogo from '@/components/ui/AttomikLogo'

export default function HomePage() {
  const router = useRouter()
  const [website, setWebsite] = useState('')
  const [website2, setWebsite2] = useState('')

  function go(url: string) {
    if (!url.trim()) return
    router.push(`/onboarding?url=${encodeURIComponent(url.trim())}`)
  }

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .hp-fade { animation: fadeInUp 0.6s ease forwards; }
        .hp-fade-d1 { animation-delay: 0.1s; opacity: 0; }
        .hp-fade-d2 { animation-delay: 0.2s; opacity: 0; }
        .hp-fade-d3 { animation-delay: 0.3s; opacity: 0; }
        .hp-fade-d4 { animation-delay: 0.4s; opacity: 0; }
        .hp-fade-d5 { animation-delay: 0.5s; opacity: 0; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px' }}>
        <AttomikLogo height={28} color="#ffffff" />
        <a href="/login" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 600 }}>Sign in →</a>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', textAlign: 'center' }}>
        {/* Social proof line */}
        <div className="hp-fade hp-fade-d1" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 32, letterSpacing: '0.02em' }}>
          Used by founders at <span style={{ color: '#00ff97' }}>Khloud</span>, <span style={{ color: '#00ff97' }}>Jolene Coffee</span>, <span style={{ color: '#00ff97' }}>Afterdream</span> and more →
        </div>

        {/* Badge */}
        <div className="hp-fade hp-fade-d1" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,255,151,0.1)', border: '1px solid rgba(0,255,151,0.25)', borderRadius: 999, padding: '5px 16px', fontSize: 11, fontWeight: 700, color: '#00ff97', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 28 }}>
          ✦ Free funnel preview
        </div>

        {/* Headline */}
        <h1 className="hp-fade hp-fade-d2" style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24, textTransform: 'uppercase', maxWidth: 800 }}>
          Your brand deserves<br/>
          <span style={{ color: '#00ff97' }}>a funnel that converts.</span>
        </h1>

        {/* Subtext */}
        <p className="hp-fade hp-fade-d3" style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, maxWidth: 480, marginBottom: 40 }}>
          Paste your website. Get 9 ad creatives, 3 copy variations, and a full landing page in 30 seconds. Free.
        </p>

        {/* Input + button */}
        <div className="hp-fade hp-fade-d4" style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            value={website}
            onChange={e => setWebsite(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && go(website)}
            placeholder="https://yourbrand.com"
            autoFocus
            style={{ width: '100%', padding: '16px 20px', fontSize: 16, fontWeight: 500, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 14, color: '#fff', outline: 'none', textAlign: 'center' }}
            onFocus={e => { e.target.style.borderColor = '#00ff97'; e.target.style.background = 'rgba(255,255,255,0.1)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
          />
          <button
            onClick={() => go(website)}
            disabled={!website.trim()}
            style={{ width: '100%', padding: 17, background: !website.trim() ? 'rgba(0,255,151,0.3)' : '#00ff97', color: '#000', fontFamily: 'Barlow, sans-serif', fontWeight: 900, fontSize: 17, border: 'none', borderRadius: 14, cursor: !website.trim() ? 'not-allowed' : 'pointer', letterSpacing: '-0.01em', transition: 'background 0.2s ease' }}>
            Build my funnel →
          </button>
        </div>

        {/* Example link */}
        <a className="hp-fade hp-fade-d5" href="#example" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 20, textDecoration: 'none', display: 'block' }}>
          or see an example →
        </a>

        {/* Trust pills */}
        <div className="hp-fade hp-fade-d5" style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['✦ No credit card', '✦ 30 seconds', '✦ Powered by AI'].map(t => (
            <span key={t} style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{t}</span>
          ))}
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section id="example" style={{ padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>What you get</div>
          <div style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 900, fontSize: 36, textTransform: 'uppercase', lineHeight: 1.1 }}>
            A complete funnel.<br/><span style={{ color: '#00ff97' }}>In 30 seconds.</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { num: '9', label: 'Ad Creatives', desc: 'Multi-format visuals in your brand colors, font and images. Ready for Meta.', color: '#a78bfa' },
            { num: '3', label: 'Copy Variations', desc: 'Three distinct angles with different hooks. Find the message that resonates.', color: '#34d399' },
            { num: '1', label: 'Landing Page', desc: 'A full conversion page matched to your ad. Same brand, same promise.', color: '#fbbf24' },
          ].map(({ num, label, desc, color }) => (
            <div key={label} style={{ background: `${color}08`, border: `1px solid ${color}25`, borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${color}15`, border: `1.5px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: 'Barlow, sans-serif', fontWeight: 900, fontSize: 28, color }}>{num}</div>
              <div style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 800, fontSize: 18, textTransform: 'uppercase', marginBottom: 10, color: 'rgba(255,255,255,0.9)' }}>{label}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>How it works</div>
          <div style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 900, fontSize: 36, textTransform: 'uppercase', lineHeight: 1.1 }}>
            Three steps.<br/><span style={{ color: '#00ff97' }}>Zero design skills.</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {[
            { num: '1', title: 'Paste your URL', desc: 'We scan your website and extract brand colors, fonts, products and images automatically.' },
            { num: '2', title: 'AI builds it', desc: 'In 30 seconds, you get 9 ad creatives, 3 copy variations and a full landing page — all on-brand.' },
            { num: '3', title: 'Test & scale', desc: 'Download everything. Upload to Meta. Find what converts and scale the winners.' },
          ].map(({ num, title, desc }) => (
            <div key={num} style={{ textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: 'Barlow, sans-serif', fontWeight: 900, fontSize: 20, color: '#00ff97' }}>{num}</div>
              <div style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 800, fontSize: 16, textTransform: 'uppercase', marginBottom: 10, color: 'rgba(255,255,255,0.9)' }}>{title}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ padding: '60px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>Trusted by CPG brands growing on Meta</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {['Khloud', 'Jolene Coffee', 'Afterdream', 'Gameplan Skincare'].map(name => (
            <span key={name} style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{name}</span>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 48px)', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 16 }}>
          Stop guessing.<br/><span style={{ color: '#00ff97' }}>Start testing.</span>
        </div>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', marginBottom: 36, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
          Your competitors are already testing. Build your first funnel in 30 seconds — completely free.
        </p>
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            value={website2}
            onChange={e => setWebsite2(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && go(website2)}
            placeholder="https://yourbrand.com"
            style={{ width: '100%', padding: '16px 20px', fontSize: 16, fontWeight: 500, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 14, color: '#fff', outline: 'none', textAlign: 'center' }}
            onFocus={e => { e.target.style.borderColor = '#00ff97'; e.target.style.background = 'rgba(255,255,255,0.1)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
          />
          <button
            onClick={() => go(website2)}
            disabled={!website2.trim()}
            style={{ width: '100%', padding: 17, background: !website2.trim() ? 'rgba(0,255,151,0.3)' : '#00ff97', color: '#000', fontFamily: 'Barlow, sans-serif', fontWeight: 900, fontSize: 17, border: 'none', borderRadius: 14, cursor: !website2.trim() ? 'not-allowed' : 'pointer', letterSpacing: '-0.01em', transition: 'background 0.2s ease' }}>
            Build my funnel free →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '32px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
          <AttomikLogo height={18} color="rgba(255,255,255,0.3)" />
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
          © {new Date().getFullYear()} Attomik. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
