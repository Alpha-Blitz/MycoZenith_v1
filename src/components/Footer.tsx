import Link from 'next/link'
import NewsletterForm from '@/components/NewsletterForm'

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  )
}

const QUICK_LINKS = [
  { label: 'Home',     href: '/'         },
  { label: 'Products', href: '/products' },
  { label: 'Blog',     href: '/blog'     },
  { label: 'About',    href: '/about'    },
]

const RESOURCES = [
  { label: 'Science & Research', href: '/blog'    },
  { label: 'FAQ',                href: '/about'   },
  { label: 'Certifications',     href: '/about'   },
  { label: 'Sustainability',     href: '/about'   },
]

const LEGAL = [
  { label: 'Privacy Policy',   href: '/privacy' },
  { label: 'Terms of Service', href: '/terms'   },
  { label: 'Cookie Policy',    href: '/cookies' },
]

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
            <ul className="space-y-2 mb-6">
              <li><a href="mailto:mycozenith@gmail.com"
                className="text-white/45 hover:text-white/80 text-sm transition-colors duration-200">
                mycozenith@gmail.com</a></li>
              <li className="text-white/45 text-sm">+91 80952 55685</li>
            </ul>
            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a href="https://instagram.com/mycozenith" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="text-white/35 hover:text-[#8B5CF6] transition-colors duration-200">
                <InstagramIcon />
              </a>
              <a href="https://linkedin.com/company/mycozenith" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="text-white/35 hover:text-[#8B5CF6] transition-colors duration-200">
                <LinkedInIcon />
              </a>
              <a href="https://youtube.com/@mycozenith" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="text-white/35 hover:text-[#8B5CF6] transition-colors duration-200">
                <YoutubeIcon />
              </a>
            </div>
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
          <div className="flex items-center gap-4 whitespace-nowrap">
            <p className="text-white/30 text-[11px]">© {year} MycoZenith. All rights reserved.</p>
            <span className="text-white/15 text-xs">·</span>
            <p className="text-white/30 text-[11px]">GSTIN: 29BHJPH3246Q1ZU</p>
          </div>
          <div className="flex flex-wrap gap-6 justify-center">
            {LEGAL.map(({ label, href }) => (
              <Link key={label} href={href} className="text-white/30 hover:text-white/60 text-xs transition-colors duration-200">{label}</Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
