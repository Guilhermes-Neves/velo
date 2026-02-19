import { test } from '@playwright/test'

import { generateOrderCode } from '../support/helpers'
import { Navbar } from '../support/components/Navbar'
import { LandingPage } from '../support/pages/LandingPage'
import { OrderLockupPage, OrderDetails } from '../support/pages/OrderLockupPage'

test.describe('Consulta de Pedido', () => {
  let orderLockupPage

  test.beforeEach(async ({ page }) => {
    await new LandingPage(page).goto()
    await new Navbar(page).orderLockupLink()
    await new OrderLockupPage(page).validatePageLoaded()
    orderLockupPage = new OrderLockupPage(page)
    orderLockupPage.validatePageLoaded()
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {
    const order = {
      number: 'VLO-FPWLMY',
      status: 'APROVADO' as const,
      color: 'Lunar White',
      wheels: 'sport Wheels',
      customer: {
        name: 'Guilherme Neves',
        email: 'teste@teste.com'
      },
      payment: 'À Vista'
    } satisfies OrderDetails

    await orderLockupPage.searchOrder(order.number)
    await orderLockupPage.validateOrderDetails(order)
  })

  test('deve consultar um pedido reprovado', async ({ page }) => {

    // Test Data
    const order = {
      number: 'VLO-RMIO07',
      status: 'REPROVADO',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Guilhermes-Neves Labs teste',
        email: 'guilherme.nevesone@gmail.com'
      },
      payment: 'À Vista'
    } satisfies OrderDetails

    await orderLockupPage.searchOrder(order.number)
    await orderLockupPage.validateOrderDetails(order)
  })

  test('deve consultar um pedido em analise', async ({ page }) => {

    // Test Data
    const order = {
      number: 'VLO-LGQ54L',
      status: 'EM_ANALISE',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Guilherme Neves',
        email: 'guilherme.neves@globant.com'
      },
      payment: 'À Vista'
    } satisfies OrderDetails

    await orderLockupPage.searchOrder(order.number)
    await orderLockupPage.validateOrderDetails(order)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {
    const order = generateOrderCode()

    await orderLockupPage.searchOrder(order)
    await orderLockupPage.validateOrderNotFound()
  })

  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({ page }) => {
    const orderCode = 'INVALID-123'
    
    await orderLockupPage.searchOrder(orderCode)
    await orderLockupPage.validateOrderNotFound()
  })
})