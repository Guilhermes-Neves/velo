import { test, expect } from '@playwright/test';

test('deve consultar um pedido aprovado', async ({ page }) => {
    const orderNumber = 'VLO-7KCPL7';
    await page.goto('http://localhost:5173');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

    await page.getByTestId('search-order-id').fill('VLO-7KCPL7');
    await page.getByTestId('search-order-button').click();

    await page.waitForTimeout(5000);

    await expect(page.getByTestId(`order-result-${orderNumber}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${orderNumber}
    - img
    - text: APROVADO
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: Midnight Black
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: sport Wheels
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: Guilherme Neves
    - paragraph: Email
    - paragraph: guilhermes_neves@hotmail.com
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: À Vista
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

});
