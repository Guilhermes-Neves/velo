import { test, expect } from '@playwright/test';
import { generateOrderCode } from '../support/helpers';

test.describe('Consulta de Pedidos', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
        await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

        await page.getByRole('link', { name: 'Consultar Pedido' }).click();
        await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
    })

    test('deve consultar um pedido aprovado', async ({ page }) => {
        const order = {
            number: 'VLO-7KCPL7',
            status: 'APROVADO',
            wheels: 'sport Wheels',
            color: 'Midnight Black',
            customer: {
                name: 'Guilherme Neves',
                email: 'guilhermes_neves@hotmail.com'
            },
            payment: 'À Vista'
        };

        await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
        await page.getByRole('button', { name: 'Buscar Pedido' }).click();

        await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
            - img
            - paragraph: Pedido
            - paragraph: ${order.number}
            - img
            - text: ${order.status}
            - img "Velô Sprint"
            - paragraph: Modelo
            - paragraph: Velô Sprint
            - paragraph: Cor
            - paragraph: ${order.color}
            - paragraph: Interior
            - paragraph: cream
            - paragraph: Rodas
            - paragraph: ${order.wheels}
            - heading "Dados do Cliente" [level=4]
            - paragraph: Nome
            - paragraph: ${order.customer.name}
            - paragraph: Email
            - paragraph: ${order.customer.email}
            - paragraph: Loja de Retirada
            - paragraph
            - paragraph: Data do Pedido
            - paragraph: /\\d+\\/\\d+\\/\\d+/
            - heading "Pagamento" [level=4]
            - paragraph: ${order.payment}
            - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
            `, { timeout: 10000 });
    });

    test('deve consultar um pedido reprovado', async ({ page }) => {
        const order = {
            number: 'VLO-05KWBP',
            status: 'REPROVADO',
            wheels: 'aero Wheels',
            color: 'Glacier Blue',
            customer: {
                name: 'Steve Rogers',
                email: 'steve.rogers@teste.com'
            }, 
            payment: 'À Vista'
        };

        await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
        await page.getByRole('button', { name: 'Buscar Pedido' }).click();

        await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
            - img
            - paragraph: Pedido
            - paragraph: ${order.number}
            - img
            - text: ${order.status}
            - img "Velô Sprint"
            - paragraph: Modelo
            - paragraph: Velô Sprint
            - paragraph: Cor
            - paragraph: ${order.color}
            - paragraph: Interior
            - paragraph: cream
            - paragraph: Rodas
            - paragraph: ${order.wheels}
            - heading "Dados do Cliente" [level=4]
            - paragraph: Nome
            - paragraph: ${order.customer.name}
            - paragraph: Email
            - paragraph: ${order.customer.email}
            - paragraph: Loja de Retirada
            - paragraph
            - paragraph: Data do Pedido
            - paragraph: /\\d+\\/\\d+\\/\\d+/
            - heading "Pagamento" [level=4]
            - paragraph: ${order.payment}
            - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
            `, { timeout: 10000 });
    });

    test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {
        const orderNumber = generateOrderCode();

        await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderNumber);
        await page.getByRole('button', { name: 'Buscar Pedido' }).click();

        await expect(page.locator('#root')).toMatchAriaSnapshot(`
            - img
            - heading "Pedido não encontrado" [level=3]
            - paragraph: Verifique o número do pedido e tente novamente
            `, { timeout: 10000 });
    });
});