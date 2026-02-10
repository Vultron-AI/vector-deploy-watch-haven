/**
 * Main App Component
 *
 * Sets up routing and global providers for the watch store application.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DialogProvider } from '@/components/ui'
import { CartProvider } from '@/hooks/useCart'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/pages/HomePage'
import { ProductPage } from '@/pages/ProductPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { ConfirmationPage } from '@/pages/ConfirmationPage'

function App() {
  return (
    <BrowserRouter>
      <DialogProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="product/:id" element={<ProductPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="confirmation/:orderId" element={<ConfirmationPage />} />
            </Route>
          </Routes>
        </CartProvider>
      </DialogProvider>
    </BrowserRouter>
  )
}

export default App
