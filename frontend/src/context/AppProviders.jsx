import { ThemeProvider } from './ThemeContext'
import { AuthProvider } from './AuthContext'
import { NotificationProvider } from './NotificationContext'
import { BookingProvider } from './BookingContext'
import { WishlistProvider } from './WishlistContext'
import { AppProvider } from './AppContext'
import { CatalogProvider } from './CatalogContext'

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CatalogProvider>
          <AppProvider>
            <NotificationProvider>
              <BookingProvider>
                <WishlistProvider>{children}</WishlistProvider>
              </BookingProvider>
            </NotificationProvider>
          </AppProvider>
        </CatalogProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
