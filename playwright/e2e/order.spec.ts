import { test } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import type { OrderDetails } from '../support/actions/orderLookupActions'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {
    test.beforeEach(async ({ app }) => {
        await app.orderLookup.open()
    })

    test('deve consultar um pedido aprovado', async ({ app }) => {
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

        await app.orderLookup.searchOrder(order.number)

        await app.orderLookup.validateOrderDetails(order)
        await app.orderLookup.validateStatusBadge(order.status)

    })

    test('deve consultar um pedido reprovado', async ({ app }) => {
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

        await app.orderLookup.searchOrder(order.number)

        await app.orderLookup.validateOrderDetails(order)
        await app.orderLookup.validateStatusBadge(order.status)
    })

    test('deve consultar um pedido em analise', async ({ app }) => {
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

        await app.orderLookup.searchOrder(order.number)

        await app.orderLookup.validateOrderDetails(order)
        await app.orderLookup.validateStatusBadge(order.status)
    })

    test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {
        const order = generateOrderCode()
        await app.orderLookup.searchOrder(order)

        await app.orderLookup.validateOrderNotFound()
    })

    test('deve exibir mensagem quando o número do pedido está fora do padrão', async ({ app }) => {
        await app.orderLookup.searchOrder('ABC-12345')
        await app.orderLookup.validateOrderNotFound()
    })
})
