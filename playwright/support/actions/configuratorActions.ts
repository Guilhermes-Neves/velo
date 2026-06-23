import { Page, expect } from '@playwright/test'

export type ExteriorColorLabel = 'Glacier Blue' | 'Midnight Black' | 'Lunar White'
export type WheelLabel = 'Aero Wheels' | 'Sport Wheels'

const PRICES = {
  BASE: 'R$ 40.000,00',
  WITH_SPORT_WHEELS: 'R$ 42.000,00',
} as const

const DEFAULT_CAR_IMAGE = /glacier-blue-aero-wheels/

export function createConfiguratorActions(page: Page) {
  const priceElement = page.getByTestId('total-price')
  const carImage = page.getByTestId('car-exterior-image')

  return {
    async open() {
      await page.goto('/configure')
      await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()
    },

    async selectExteriorColor(color: ExteriorColorLabel) {
      await page.getByRole('button', { name: color }).click()
    },

    async selectWheels(wheels: WheelLabel) {
      await page.getByRole('button', { name: wheels }).click()
    },

    async validatePriceElement(price: string) {
      await expect(priceElement).toHaveText(price)
    },

    async validateCarImageSrc(car: string | RegExp) {
      await expect(carImage).toHaveAttribute('src', car)
    },

    async validateDefaultConfiguration() {
      await expect(priceElement).toBeVisible()
      await expect(priceElement).toHaveText(PRICES.BASE)
      await expect(carImage).toHaveAttribute('src', DEFAULT_CAR_IMAGE)
    },
  }
}
