import { test } from '@playwright/test'

import { generateOrderCode } from '../support/helpers'

import { Navbar } from '../support/components/Navbar'
import { LandingPage } from '../support/pages/LandingPage'
import { OrderLookupPage, type OrderDetails } from '../support/pages/OrderLookupPage'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {
    let orderLookupPage: OrderLookupPage

    test.beforeEach(async ({ page }) => {
        await new LandingPage(page).goto()
        await new Navbar(page).orderLookupLink()
        orderLookupPage = new OrderLookupPage(page)
        await orderLookupPage.expectLoaded()
    })

    test('deve consultar um pedido aprovado', async ({ page }) => {
        const order: OrderDetails = {
            number: 'VLO-7KCPL7',
            status: 'APROVADO',
            color: 'Midnight Black',
            wheels: 'sport Wheels',
            customer: {
                name: 'Guilherme Neves',
                email: 'guilhermes_neves@hotmail.com'
            },
            payment: 'À Vista'
        }

        await orderLookupPage.searchOrder(order.number)
        
        await orderLookupPage.validateOrderDetails(order)
        await orderLookupPage.validateStatusBadge(order.status)

    })

    test('deve consultar um pedido reprovado', async ({ page }) => {
        const order: OrderDetails = {
            number: 'VLO-05KWBP',
            status: 'REPROVADO',
            color: 'Glacier Blue',
            wheels: 'aero Wheels',
            customer: {
                name: 'Steve Rogers',
                email: 'steve.rogers@teste.com'
            },
            payment: 'À Vista'
        }

        await orderLookupPage.searchOrder(order.number)

        await orderLookupPage.validateOrderDetails(order)
        await orderLookupPage.validateStatusBadge(order.status)
    })

    test('deve consultar um pedido em analise', async ({ page }) => {
        const order: OrderDetails = {
            number: 'VLO-7IJ69S',
            status: 'EM_ANALISE',
            color: 'Lunar White',
            wheels: 'aero Wheels',
            customer: {
                name: 'Tony Stark',
                email: 'tony.stark@marvel.com'
            },
            payment: 'À Vista'
        }

        await orderLookupPage.searchOrder(order.number)

        await orderLookupPage.validateOrderDetails(order)
        await orderLookupPage.validateStatusBadge(order.status)
    })

    test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {
        const order = generateOrderCode()
        await orderLookupPage.searchOrder(order)

        await orderLookupPage.validateOrderNotFound()
    })

    test('deve exibir mensagem quando o número do pedido está fora do padrão', async ({ page }) => {
        await orderLookupPage.searchOrder('ABC-12345')
        await orderLookupPage.validateOrderNotFound()
    })
})
