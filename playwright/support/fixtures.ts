import { test as base } from '@playwright/test'

import { createConfiguratorActions } from './actions/configuratorActions'
import { createOrderLookupActions } from './actions/orderLookupActions'
import { createCheckoutActions } from './actions/checkoutActions'

type App = {
  configurator: ReturnType<typeof createConfiguratorActions>
  orderLookup: ReturnType<typeof createOrderLookupActions>
  checkout: ReturnType<typeof createCheckoutActions>
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      configurator: createConfiguratorActions(page),
      orderLookup: createOrderLookupActions(page),
      checkout: createCheckoutActions(page),
    }
    await use(app)
  },
})

export { expect } from '@playwright/test'
