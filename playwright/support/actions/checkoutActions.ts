import { Page, expect } from '@playwright/test'

export function createCheckoutActions(page: Page) {
  const summaryTotalPrice = page.getByTestId('summary-total-price')

  return {
    async validateLoaded() {
      await expect(page).toHaveURL(/\/order$/)
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
    },

    async validateSummaryTotalPrice(price: string) {
      await expect(summaryTotalPrice).toHaveText(price)
    },
  }
}
