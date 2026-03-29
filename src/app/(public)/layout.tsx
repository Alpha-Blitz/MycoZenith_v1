import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/context/AuthContext'
import AuthModal from '@/components/AuthModal'
import FirstVisitPopup from '@/components/FirstVisitPopup'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <AuthModal />
      <main className="flex-1">{children}</main>
      <Footer />
      <FirstVisitPopup />
    </AuthProvider>
  )
}
