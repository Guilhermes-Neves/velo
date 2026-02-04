import { test, expect } from '@playwright/test';
import { generateOrderCode } from '../support/helpers';

/// AAA - Arrange, Act, Assert

test.describe('Consulta de pedido', () => {

  test.beforeEach(async ({ page }) => {
    // Arrange
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  })


  test('deve consultar um pedido aprovado', async ({ page }) => {
    // Test Data
    const order = {
      number: 'VLO-FPWLMY',
      status: 'APROVADO',
      color: 'Lunar White',
      wheels: 'sport Wheels',
      model: 'Velô Sprint',
      interior: 'cream',
      customer: {
        name: 'Guilherme Neves',
        email: 'teste@teste.com'
      },
      payment: 'À Vista'
    }

    // Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    // Assert

    // const containerPedido = page.getByRole('paragraph')
    //   .filter({ hasText: /^Pedido$/ })
    //   .locator('..'); // sobe para o elemento pai (mesma função do /.. do xpath)
    // await expect(containerPedido).toContainText(order, { timeout: 10000 });
    // await expect(page.getByText('APROVADO')).toBeVisible();

    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - img
      - text: ${order.status}
      - img "${order.model}"
      - paragraph: Modelo
      - paragraph: ${order.model}
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: ${order.interior}
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
      `);
  });

  test('deve consultar um pedido reprovado', async ({ page }) => {
    // Test Data
    //    const order = 'VLO-RMIO07';
    const order = {
      number: 'VLO-RMIO07',
      status: 'REPROVADO',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      model: 'Velô Sprint',
      interior: 'cream',
      customer: {
        name: 'Guilhermes-Neves Labs teste',
        email: 'guilherme.nevesone@gmail.com'
      },
      payment: 'À Vista'
    }

    // Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    // Assert

    const containerPedido = page.getByRole('paragraph')
    //   .filter({ hasText: /^Pedido$/ })
    //   .locator('..'); // sobe para o elemento pai (mesma função do /.. do xpath)
    // await expect(containerPedido).toContainText(order, { timeout: 10000 });
    // await expect(page.getByText('APROVADO')).toBeVisible();

    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - img
      - text: REPROVADO
      - img "${order.model}"
      - paragraph: Modelo
      - paragraph: ${order.model}
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: ${order.interior}
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
      `);
  });

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {
    // Test Data
    const order = generateOrderCode();

    // Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    // Assert
    // const title = page.getByRole('heading', {name: 'Pedido não encontrado' });
    // await expect(title).toBeVisible();

    // const message = page.locator('p', {hasText: 'Verifique o número do pedido e tente novamente'});
    // await expect(message).toBeVisible();
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `);
  });
})


