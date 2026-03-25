import Link from 'next/link'
import NewsletterForm from '@/components/NewsletterForm'

const QUICK_LINKS = [
  { label: 'Home',     href: '/'         },
  { label: 'Products', href: '/products' },
  { label: 'Blog',     href: '/blog'     },
  { label: 'About',    href: '/about'    },
]

const RESOURCES = [
  { label: 'Science & Research', href: '#' },
  { label: 'FAQ',                href: '#' },
  { label: 'Certifications',     href: '#' },
  { label: 'Sustainability',     href: '#' },
]

const LEGAL = ['Privacy Policy', 'Terms of Service', 'Cookie Policy']

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <Link href="/" className="text-white font-semibold text-lg tracking-tight mb-4 inline-block hover:opacity-75 transition-opacity">
              MycoZenith
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mt-3 mb-6 max-w-[220px]">
              Premium cordyceps supplements engineered for peak human performance.
            </p>
            <ul className="space-y-2">
              <li><a href="mailto:hello@mycozenith.com"
                className="text-white/45 hover:text-white/80 text-sm transition-colors duration-200">
                hello@mycozenith.com</a></li>
              <li className="text-white/45 text-sm">+1 (800) 000-0000</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-white/50 text-[11px] font-semibold tracking-[0.18em] uppercase mb-5">Quick Links</p>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-white/45 hover:text-white text-sm transition-colors duration-200">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-white/50 text-[11px] font-semibold tracking-[0.18em] uppercase mb-5">Resources</p>
            <ul className="space-y-3">
              {RESOURCES.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-white/45 hover:text-white text-sm transition-colors duration-200">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-white/50 text-[11px] font-semibold tracking-[0.18em] uppercase mb-5">Stay Updated</p>
            <p className="text-white/45 text-sm leading-relaxed mb-5">
              Performance insights and new product launches — no spam.
            </p>
            <NewsletterForm />
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">© {year} MycoZenith. All rights reserved.</p>
          <div className="flex flex-wrap gap-6 justify-center">
            {LEGAL.map((item) => (
              <Link key={item} href="#" className="text-white/30 hover:text-white/60 text-xs transition-colors duration-200">{item}</Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
