import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import AuthModal from '@/components/AuthModal'
import FirstVisitPopup from '@/components/FirstVisitPopup'
import CookieConsent from '@/components/CookieConsent'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <AuthModal />
        <main className="flex-1">{children}</main>
        <Footer />
        <FirstVisitPopup />
        <CookieConsent />
      </CartProvider>
    </AuthProvider>
  )
}
