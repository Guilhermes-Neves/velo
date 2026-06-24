import { Page, expect } from '@playwright/test'

export function createCheckoutActions(page: Page) {
  const termsCheckbox = page.getByTestId('checkout-terms')

  const alerts = {
    name: page.getByTestId('name-error'),
    lastname: page.getByTestId('lastname-error'),
    email: page.getByTestId('email-error'),
    phone: page.getByTestId('phone-error'),
    document: page.getByTestId('document-error'),
    store: page.getByTestId('store-error'),
    terms: page.getByTestId('terms-error'),
  }

  return {
    elements: {
      termsCheckbox,
      alerts
    },

    async validateLoaded() {
      await expect(page).toHaveURL(/\/order$/)
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
    },

    async validateSummaryTotalPrice(price: string) {
      await expect(page.getByTestId('summary-total-price')).toHaveText(price)
    },

    async fillCustomerData(data: {
      name: string,
      lastname: string,
      email: string,
      phone: string,
      document: string
    }) {
      await page.getByTestId('checkout-name').fill(data.name)
      await page.getByTestId('checkout-lastname').fill(data.lastname)
      await page.getByTestId('checkout-email').fill(data.email)
      await page.getByTestId('checkout-phone').fill(data.phone)
      await page.getByTestId('checkout-document').fill(data.document)
    },

    async selectStore(storeName: string) {
      await page.getByTestId('checkout-store').click()
      await page.getByRole('option', { name: storeName }).click()
    },

    async acceptTerms() {
      await termsCheckbox.check()
    },

    async submit() {
      await page.getByRole('button', { name: 'Confirmar Pedido' }).click()
    },
  }
}