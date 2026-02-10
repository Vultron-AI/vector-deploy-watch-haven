/**
 * E2E Tests - Checkout functionality
 */

import { test, expect } from '@playwright/test'

test.describe('Checkout', () => {
  test('checkout page redirects when cart is empty', async ({ page }) => {
    await page.goto('/checkout')
    await page.waitForLoadState('networkidle')

    // Should show empty cart message or redirect
    const emptyMessage = page.getByText(/your cart is empty/i)
    const continueButton = page.getByRole('button', { name: /continue shopping/i })

    // Either should be visible
    const isEmptyVisible = await emptyMessage.isVisible().catch(() => false)
    const isButtonVisible = await continueButton.isVisible().catch(() => false)

    expect(isEmptyVisible || isButtonVisible).toBeTruthy()
  })
})
